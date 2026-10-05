/* Travel map (browser). Picking a pin, a chip or a client-trip dot shows its card and flies the little plane there
   along a curved, dashed route. Client trips come from GET /api/reviews: each review's "In a few words" line is
   matched against the known places in data/map.json (most specific first), so "Group trip to Prague" lands on Prague.
   Respects reduced motion (no flight, the plane just moves). Safe to mount on every page load. */
import { esc } from '../lib/i18n.js';

let abort = null;
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const stars = n => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);

export function teardownTravelMaps() { if (abort) { abort.abort(); abort = null; } }

export function mountTravelMaps() {
  teardownTravelMaps();
  const roots = [...document.querySelectorAll('[data-tmap]')];
  if (!roots.length) return;
  abort = new AbortController();
  roots.forEach(root => mount(root, abort.signal));
}

function mount(root, signal) {
  root.classList.add('is-live');
  const stage = root.querySelector('.tmap-stage'), trail = root.querySelector('[data-trail]'), base = root.querySelector('[data-base]');
  const plane = root.querySelector('[data-plane]'), lang = root.dataset.lang;
  let current = root.dataset.first, flight = 0;

  const centre = el => { const s = stage.getBoundingClientRect(), r = (el.querySelector('i') || el).getBoundingClientRect(); return [r.left + r.width / 2 - s.left, r.top + r.height / 2 - s.top]; };
  const target = id => root.querySelector(`[data-pin="${id}"], [data-dot="${id}"]`);
  const toPct = ([x, y]) => { const s = stage.getBoundingClientRect(); return [x / s.width * 100, y / s.height * 100]; };
  // A gentle arc: the control point sits above the middle, more so for longer hops.
  const arc = (a, b) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, d = Math.hypot(b[0] - a[0], b[1] - a[1]); return [mx, my - Math.min(90, d * .32)]; };
  const pathD = (a, c, b) => { const [pa, pc, pb] = [a, c, b].map(toPct); return `M${pa[0].toFixed(2)} ${pa[1].toFixed(2)}Q${pc[0].toFixed(2)} ${pc[1].toFixed(2)} ${pb[0].toFixed(2)} ${pb[1].toFixed(2)}`; };
  // The plane flies just above and to the right of the dashed route, so it never hides a pin when it lands.
  const placePlane = (x, y, deg) => { plane.style.transform = `translate(${x + 13}px, ${y - 15}px) rotate(${deg}deg)`; };

  // Faint routes linking the destinations in order: the atlas as one long journey.
  function drawBase() {
    const pins = [...root.querySelectorAll('[data-pin]')].map(centre);
    base.innerHTML = pins.slice(1).map((b, i) => { const a = pins[i]; return `<path class="tmap-base" d="${pathD(a, arc(a, b), b)}"/>`; }).join('');
  }

  function show(id) {
    root.querySelectorAll('[data-pin], [data-chip], [data-dot]').forEach(b => b.setAttribute('aria-pressed', String((b.dataset.pin || b.dataset.chip || b.dataset.dot) === id)));
    root.querySelectorAll('[data-card]').forEach(c => c.classList.toggle('is-on', c.dataset.card === (id.startsWith('trip:') ? 'trips' : id)));
  }

  function fly(fromId, toId) {
    const fromEl = target(fromId), toEl = target(toId);
    if (!toEl) return;
    const b = centre(toEl);
    if (!fromEl || fromId === toId || reduced()) { trail.setAttribute('d', ''); placePlane(b[0], b[1], 0); plane.classList.add('is-on'); return; }
    const a = centre(fromEl), c = arc(a, b);
    trail.setAttribute('d', pathD(a, c, b));
    trail.classList.remove('is-drawn'); void trail.getBoundingClientRect(); trail.classList.add('is-drawn');
    const id = ++flight, start = performance.now(), dur = Math.min(1600, 700 + Math.hypot(b[0] - a[0], b[1] - a[1]) * 2.2);
    plane.classList.add('is-on');
    const step = now => {
      if (id !== flight) return;
      const k = Math.min(1, (now - start) / dur), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2, u = 1 - e;
      const x = u * u * a[0] + 2 * u * e * c[0] + e * e * b[0], y = u * u * a[1] + 2 * u * e * c[1] + e * e * b[1];
      const dx = 2 * u * (c[0] - a[0]) + 2 * e * (b[0] - c[0]), dy = 2 * u * (c[1] - a[1]) + 2 * e * (b[1] - c[1]);
      placePlane(x, y, Math.atan2(dy, dx) * 180 / Math.PI);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function select(id) {
    if (id === current) return;
    const from = current; current = id;
    show(id); fly(from, id);
  }

  root.addEventListener('click', e => {
    const b = e.target.closest('[data-pin], [data-chip], [data-dot]'); if (!b) return;
    const id = b.dataset.pin || b.dataset.chip || b.dataset.dot;
    if (b.dataset.dot) fillTrips(b);
    select(id);
    if (b.dataset.chip || b.dataset.dot) { const card = root.querySelector('.tmap-card.is-on'); if (card && window.matchMedia('(max-width: 959px)').matches) card.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }); }
  }, { signal });

  // Redraw on resize (the map swaps between the phone and desktop frames at 768px).
  let rz = 0;
  window.addEventListener('resize', () => { cancelAnimationFrame(rz); rz = requestAnimationFrame(() => { drawBase(); trail.setAttribute('d', ''); const el = target(current); if (el) { const p = centre(el); placePlane(p[0], p[1], 0); } }); }, { signal });

  const ready = () => { drawBase(); const el = target(current); if (el) { const p = centre(el); placePlane(p[0], p[1], 0); plane.classList.add('is-on'); } };
  const img = stage.querySelector('img');
  if (img && !img.complete) img.addEventListener('load', ready, { once: true, signal }); else ready();
  // Draw the routes when the map comes into view.
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { root.classList.add('is-seen'); io.disconnect(); } }), { threshold: .25 });
  io.observe(stage); signal.addEventListener('abort', () => io.disconnect());

  /* ---- client trips ---- */
  const gaz = root.dataset.gaz ? JSON.parse(root.dataset.gaz) : null;
  const groups = new Map();
  function fillTrips(dot) {
    const g = groups.get(dot.dataset.dot); if (!g) return;
    const card = root.querySelector('[data-card="trips"]');
    card.innerHTML = `<p class="tmap-meta"><span>${esc(root.dataset.tripsTitle.replace('{place}', g.label))}</span></p>`
      + g.reviews.map(r => `<blockquote><span class="tmap-stars" aria-label="${r.rating}/5">${stars(r.rating)}</span><p>${esc(r.text.length > 170 ? r.text.slice(0, 167).trimEnd() + '…' : r.text)}</p><footer><b>${esc(r.name || root.dataset.anon)}</b> · ${esc(r.trip)}</footer></blockquote>`).join('')
      + `<div class="tmap-actions"><a class="btn btn-glass" href="${esc(root.dataset.reviewsHref)}">${esc(root.dataset.tripsLink)}</a></div>`;
  }
  if (gaz) {
    fetch('/api/reviews', { headers: { accept: 'application/json' }, signal }).then(r => (r.ok ? r.json() : null)).then(j => {
      if (!j || !j.reviews) return;
      for (const r of j.reviews) {
        const text = ` ${String(r.trip || '').toLowerCase()} `;
        const hit = gaz.find(g => g.names.some(n => new RegExp(`[^\\p{L}]${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^\\p{L}]`, 'u').test(text)));
        if (!hit) continue;
        const key = `trip:${hit.label}`;
        if (!groups.has(key)) groups.set(key, { label: hit.label, hit, reviews: [] });
        groups.get(key).reviews.push(r);
      }
      for (const [key, g] of groups) {
        const d = g.hit.desk || g.hit.phone, m = g.hit.phone || g.hit.desk;
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'tmap-dot'; b.dataset.dot = key; b.setAttribute('aria-pressed', 'false');
        b.setAttribute('aria-label', root.dataset.tripLabel.replace('{place}', g.label) + (g.reviews.length > 1 ? ` (${g.reviews.length})` : ''));
        b.style.cssText = `--x:${d[0]}%;--y:${d[1]}%;--mx:${m[0]}%;--my:${m[1]}%`;
        b.innerHTML = `<i></i>${g.reviews.length > 1 ? `<small>${g.reviews.length}</small>` : ''}`;
        stage.insertBefore(b, plane);
      }
      if (groups.size) root.classList.add('has-trips');
    }).catch(() => { /* offline or blocked: the destinations still work */ });
  }
}
