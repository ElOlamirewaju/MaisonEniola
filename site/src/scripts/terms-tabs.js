/* Tabs for payment and cancellation terms (components/TermsTabs.astro): click, arrow keys, and deep links
   (#<id>-cancellations) all select a tab. Without this script every panel is simply shown. */
let abort = null;

export function mountTermsTabs() {
  if (abort) abort.abort();
  const all = [...document.querySelectorAll('[data-ttabs]')];
  if (!all.length) return;
  abort = new AbortController();
  const { signal } = abort;
  const select = (root, tab, focus) => {
    root.querySelectorAll('[role="tab"]').forEach(b => { const on = b === tab; b.setAttribute('aria-selected', String(on)); b.tabIndex = on ? 0 : -1; });
    root.querySelectorAll('[role="tabpanel"]').forEach(p => { p.hidden = p.id !== tab.getAttribute('aria-controls'); });
    if (focus) tab.focus();
  };
  const fromHash = () => {
    const id = decodeURIComponent(location.hash.slice(1)); if (!id) return;
    const panel = document.getElementById(id); const root = panel?.closest('[data-ttabs]');
    if (!root || panel.getAttribute('role') !== 'tabpanel') return;
    select(root, root.querySelector(`[aria-controls="${id}"]`));
    requestAnimationFrame(() => root.scrollIntoView({ block: 'start' }));
  };
  all.forEach(root => {
    root.classList.add('is-live');
    const tabs = [...root.querySelectorAll('[role="tab"]')];
    select(root, tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0]);
    root.addEventListener('click', e => { const t = e.target.closest('[role="tab"]'); if (t) select(root, t); }, { signal });
    root.addEventListener('keydown', e => {
      const i = tabs.indexOf(document.activeElement); if (i < 0) return;
      const n = { ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: tabs.length - 1 }[e.key];
      if (n === undefined) return;
      e.preventDefault(); select(root, tabs[(n + tabs.length) % tabs.length], true);
    }, { signal });
  });
  fromHash();
  window.addEventListener('hashchange', fromHash, { signal });
}
