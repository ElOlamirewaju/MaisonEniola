/* The map opening (components/MapHero.astro). Tapping a place selects it: the plane flies there along a dashed arc
   and its card opens. Tapping the same place again, or "Go", zooms the map into that place and opens the page.
   On load the plane arrives from the Atlantic into Lisbon. On desktop the map tilts gently with the pointer.
   While the map fills the screen on a phone, the fixed Enquire/WhatsApp bar steps aside (the panel has Enquire).
   Everything respects reduced motion; without scripts every pin and chip is a plain link. */
import { navigate } from 'astro:transitions/client';

let abort = null, io = null;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function teardownMapHero() {
  if (abort) { abort.abort(); abort = null; }
  if (io) { io.disconnect(); io = null; }
  document.documentElement.classList.remove('mhero-in-view');
}

export function mountMapHero() {
  teardownMapHero();
  const root = document.querySelector('[data-mhero]');
  if (!root) return;
  abort = new AbortController();
  const signal = abort.signal;
  const canvas = root.querySelector('[data-canvas]'), tilt = root.querySelector('[data-tilt]');
  const trail = root.querySelector('[data-trail]'), plane = root.querySelector('[data-plane]');
  const intro = root.querySelector('[data-intro]');
  root.classList.add('is-live');
  let current = null, flight = 0;

  // Pin centres in the map's own (untransformed) pixels: offsetLeft/Top ignore the tilt and the entrance zoom.
  const centre = el => [el.offsetLeft, el.offsetTop];
  const pin = id => root.querySelector(`[data-wp="${id}"]`);
  const size = () => [tilt.offsetWidth, tilt.offsetHeight];
  const arc = (a, b) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, d = Math.hypot(b[0] - a[0], b[1] - a[1]); return [mx, my - Math.min(120, d * .3)]; };
  const pct = p => { const [w, h] = size(); return [p[0] / w * 100, p[1] / h * 100]; };
  const place = (x, y, deg) => { plane.style.transform = `translate(${x + 14}px, ${y - 16}px) rotate(${deg}deg)`; };

  function fly(a, b, done) {
    const c = arc(a, b), [pa, pc, pb] = [a, c, b].map(pct);
    trail.setAttribute('d', `M${pa[0].toFixed(2)} ${pa[1].toFixed(2)}Q${pc[0].toFixed(2)} ${pc[1].toFixed(2)} ${pb[0].toFixed(2)} ${pb[1].toFixed(2)}`);
    trail.classList.remove('is-drawn'); void trail.getBoundingClientRect(); trail.classList.add('is-drawn');
    plane.classList.add('is-on');
    if (reduced()) { place(b[0], b[1], 0); done?.(); return; }
    const id = ++flight, start = performance.now(), dur = Math.min(1700, 750 + Math.hypot(b[0] - a[0], b[1] - a[1]) * 1.6);
    const step = now => {
      if (id !== flight) return;
      const k = Math.min(1, (now - start) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, u = 1 - e;
      const x = u * u * a[0] + 2 * u * e * c[0] + e * e * b[0], y = u * u * a[1] + 2 * u * e * c[1] + e * e * b[1];
      const dx = 2 * u * (c[0] - a[0]) + 2 * e * (b[0] - c[0]), dy = 2 * u * (c[1] - a[1]) + 2 * e * (b[1] - c[1]);
      place(x, y, Math.atan2(dy, dx) * 180 / Math.PI);
      if (k < 1) requestAnimationFrame(step); else done?.();
    };
    requestAnimationFrame(step);
  }

  let planeAt = null;
  function select(id) {
    const el = pin(id); if (!el) return;
    const from = planeAt || centre(pin('travel'));
    current = id; planeAt = centre(el);
    root.querySelectorAll('[data-wp], [data-chip]').forEach(b => b.classList.toggle('is-on', (b.dataset.wp || b.dataset.chip) === id));
    root.querySelectorAll('[data-wp]').forEach(b => b.setAttribute('aria-current', b.dataset.wp === id ? 'true' : 'false'));
    intro.hidden = true;
    root.querySelectorAll('[data-wcard]').forEach(c => { c.hidden = c.dataset.wcard !== id; });
    root.classList.add('has-card');
    fly(from, planeAt);
    root.querySelector(`[data-wcard="${id}"] [data-go]`)?.focus({ preventScroll: true });
  }

  function back() {
    current = null;
    root.querySelectorAll('[data-wcard]').forEach(c => { c.hidden = true; });
    root.querySelectorAll('[data-wp], [data-chip]').forEach(b => b.classList.remove('is-on'));
    intro.hidden = false; root.classList.remove('has-card');
    trail.setAttribute('d', '');
  }

  // Zoom into the chosen place, then open its page through the site's page transition.
  function go(id, url) {
    const el = pin(id);
    if (el && !reduced()) {
      tilt.style.transformOrigin = `${el.offsetLeft}px ${el.offsetTop}px`;
      root.classList.add('is-zooming');
      setTimeout(() => navigate(url).catch(() => { window.location.href = url; }), 520);
    } else navigate(url).catch(() => { window.location.href = url; });
  }

  root.addEventListener('click', e => {
    const a = e.target.closest('[data-wp], [data-chip]');
    if (a) {
      const id = a.dataset.wp || a.dataset.chip;
      e.preventDefault();
      if (current === id) go(id, a.getAttribute('href')); else select(id);
      return;
    }
    const g = e.target.closest('[data-go]');
    if (g) { e.preventDefault(); go(current, g.getAttribute('href')); return; }
    if (e.target.closest('[data-back]')) { back(); root.querySelector('[data-chip]')?.focus({ preventScroll: true }); }
  }, { signal });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && current) back(); }, { signal });

  // Arrival: the plane comes in from the Atlantic and lands at Lisbon.
  const arrive = () => {
    const lis = centre(pin('travel')); planeAt = lis;
    if (reduced()) { place(lis[0], lis[1], 0); plane.classList.add('is-on'); return; }
    // From the south-west, so the route never crosses the headline on wide screens.
    setTimeout(() => { if (!current) fly([lis[0] - Math.min(90, size()[0] * .1), lis[1] + Math.min(170, size()[1] * .2)], lis); }, 1300);
  };
  const img = canvas.querySelector('img');
  if (img && !img.complete) img.addEventListener('load', arrive, { once: true, signal }); else arrive();
  window.addEventListener('resize', () => { trail.setAttribute('d', ''); if (planeAt) { const el = current ? pin(current) : pin('travel'); planeAt = centre(el); place(planeAt[0], planeAt[1], 0); } }, { signal });

  // Gentle tilt toward the pointer on desktop.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduced()) {
    let raf = 0;
    root.addEventListener('pointermove', e => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = root.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - .5, ny = (e.clientY - r.top) / r.height - .5;
        tilt.style.setProperty('--rx', `${(-ny * 4).toFixed(2)}deg`); tilt.style.setProperty('--ry', `${(nx * 5).toFixed(2)}deg`);
      });
    }, { signal });
    root.addEventListener('pointerleave', () => { tilt.style.setProperty('--rx', '0deg'); tilt.style.setProperty('--ry', '0deg'); }, { signal });
  }

  // The phone action bar steps aside while the map fills the screen.
  io = new IntersectionObserver(([en]) => document.documentElement.classList.toggle('mhero-in-view', en.intersectionRatio > .45), { threshold: [0, .45, 1] });
  io.observe(root);

  // Reviews: show the live count and average on the reviews card.
  fetch('/api/reviews', { headers: { accept: 'application/json' }, signal }).then(r => (r.ok ? r.json() : null)).then(j => {
    const list = j?.reviews || []; if (!list.length) return;
    const avg = list.reduce((s, r) => s + (r.rating || 0), 0) / list.length;
    const box = root.querySelector('[data-reviews-stat]'); if (!box) return;
    const lang = root.dataset.lang, n = list.length, a = avg.toFixed(1).replace('.', lang === 'es' ? ',' : '.');
    box.innerHTML = `<span>★★★★★</span><b>${n}</b><small>${lang === 'es' ? `opiniones · ${a} de 5` : `reviews · ${a} out of 5`}</small>`;
  }).catch(() => {});
}
