/* Magnetic gravity for the navigation links and the consultation pill.
   Within 30px of a link, the text drifts a little towards the cursor and eases back on leave.
   Only with a real pointer and when motion is allowed. Safe to call repeatedly: the island persists. */
const RADIUS = 30, PULL = 0.28, MAX = 7;

export function initMagnetic() {
  const header = document.querySelector('[data-header]');
  if (!header || header.dataset.magnetic) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  header.dataset.magnetic = '1';

  const items = () => [...header.querySelectorAll('.nav-item, [data-magnetic-item]')];
  const reset = el => { el.style.transform = ''; };

  header.addEventListener('pointermove', e => {
    items().forEach(el => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      // distance from the cursor to the nearest edge of the link
      const dx = Math.max(r.left - e.clientX, 0, e.clientX - r.right);
      const dy = Math.max(r.top - e.clientY, 0, e.clientY - r.bottom);
      if (Math.hypot(dx, dy) > RADIUS) return reset(el);
      const x = Math.max(-MAX, Math.min(MAX, (e.clientX - cx) * PULL));
      const y = Math.max(-MAX, Math.min(MAX, (e.clientY - cy) * PULL));
      el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
    });
  });
  header.addEventListener('pointerleave', () => items().forEach(reset));
}
