/* Site chrome: header state on scroll, the full-screen menu, live local clocks.
   The navigation island persists between pages, so after each navigation the current-page marks
   and the language-switch targets are refreshed from the new document. Safe to call repeatedly. */

let bound = false, clockTimer = null, onScroll = null;

function refreshHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;
  const path = location.pathname;
  header.querySelectorAll('.nav-item[data-slug]').forEach(a => {
    const on = path.replace(/^\/es\//, '/').split('/')[1] === a.dataset.slug;
    if (on) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  // hreflang links in the new head tell us where the counterpart page lives.
  header.querySelectorAll('[data-lang-link]').forEach(a => {
    const alt = document.querySelector(`link[rel="alternate"][hreflang="${a.dataset.langLink}"]`);
    if (alt) a.setAttribute('href', new URL(alt.href).pathname);
  });
}

export function initChrome() {
  const header = document.querySelector('[data-header]');
  const menu = document.querySelector('[data-menu]');
  const openBtn = header?.querySelector('[data-menu-open]');
  const closeBtn = menu?.querySelector('[data-menu-close]');
  document.documentElement.style.overflow = '';
  refreshHeader();

  if (!bound && header) {
    bound = true;
    let lastY = window.scrollY;
    onScroll = () => {
      const y = window.scrollY, m = document.querySelector('[data-menu]');
      header.classList.toggle('is-scrolled', y > 40);
      if (y > 400 && y > lastY + 4 && (!m || m.hidden)) header.classList.add('is-hidden');
      else if (y < lastY - 4 || y < 400) header.classList.remove('is-hidden');
      lastY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // The header persists; the menu is re-rendered per page, so look it up at click time.
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-menu-open], [data-menu-close]');
      if (!t) return;
      const m = document.querySelector('[data-menu]'), ob = document.querySelector('[data-menu-open]');
      if (!m) return;
      const opening = t.hasAttribute('data-menu-open');
      m.hidden = !opening;
      ob?.setAttribute('aria-expanded', String(opening));
      document.documentElement.style.overflow = opening ? 'hidden' : '';
      if (opening) { window.__meLenis?.stop(); m.querySelector('[data-menu-close]')?.focus(); }
      else { window.__meLenis?.start(); ob?.focus(); }
    });
    document.addEventListener('keydown', e => {
      const m = document.querySelector('[data-menu]');
      if (!m || m.hidden) return;
      if (e.key === 'Escape') { m.querySelector('[data-menu-close]')?.click(); return; }
      if (e.key !== 'Tab') return;
      const f = [...m.querySelectorAll('a[href], button')], first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
  onScroll?.();
  if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
  if (closeBtn) closeBtn.setAttribute('aria-expanded', 'false');

  // Local time at a destination, e.g. <b data-clock="Europe/Rome"></b>
  clearInterval(clockTimer);
  const clocks = [...document.querySelectorAll('[data-clock]')];
  if (clocks.length) {
    const lang = document.documentElement.lang === 'es' ? 'es-ES' : 'en-GB';
    const tick = () => clocks.forEach(el => {
      el.textContent = new Intl.DateTimeFormat(lang, { hour: '2-digit', minute: '2-digit', timeZone: el.dataset.clock }).format(new Date());
    });
    tick();
    clockTimer = setInterval(tick, 15000);
  }
}

export function teardownChrome() {
  clearInterval(clockTimer);
  document.documentElement.style.overflow = '';
}
