/* Review carousel (browser). Adds the reviews approved through the on-site form to the curated ones,
   then wires the arrows and dots. Scroll-snap does the sliding; swiping works without any script. */
import { esc } from '../lib/i18n.js';

const fmt = (ym, lang) => { const [y, m] = ym.split('-'); return new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-GB', { month: 'long', year: 'numeric' }).format(new Date(+y, +m - 1, 1)); };

function slide(r, root) {
  const lang = root.dataset.lang, services = JSON.parse(root.dataset.services || '{}');
  const name = r.name || root.dataset.anon;
  const stars = [1, 2, 3, 4, 5].map(n => `<i class="${n <= r.rating ? 'on' : ''}"></i>`).join('');
  return `<article class="review is-in" data-reveal>
    <span class="stars" aria-label="${esc(root.dataset.rating.replace('{n}', r.rating))}">${stars}</span>
    <span class="quote-mark" aria-hidden="true">“</span>
    <blockquote lang="${esc(r.lang)}">${esc(r.text)}</blockquote>
    <footer><b>${esc(name)}</b><span>${esc(r.trip)} · ${esc(fmt(r.date, lang))}</span><span class="orig">${esc(services[r.service] || '')}</span></footer>
  </article>`;
}

function wire(root) {
  const track = root.querySelector('[data-track]'), nav = root.querySelector('[data-nav]'), dots = root.querySelector('[data-dots]');
  const slides = [...track.children];
  if (slides.length < 2) { nav.hidden = true; return; }
  nav.hidden = false;
  dots.innerHTML = slides.map((_, i) => `<button type="button" role="tab" aria-label="${esc(root.dataset.goto.replace('{n}', i + 1))}" data-go="${i}"></button>`).join('');
  const current = () => { const x = track.scrollLeft, w = slides[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || getComputedStyle(track).gap || 0); return Math.round(x / w); };
  const paint = () => { const c = current(); [...dots.children].forEach((d, i) => d.setAttribute('aria-selected', String(i === c))); };
  const go = i => { const n = Math.max(0, Math.min(slides.length - 1, i)); slides[n].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' }); };
  root.querySelector('[data-prev]').onclick = () => go(current() - 1);
  root.querySelector('[data-next]').onclick = () => go(current() + 1);
  dots.onclick = e => { const b = e.target.closest('[data-go]'); if (b) go(+b.dataset.go); };
  track.addEventListener('scroll', paint, { passive: true });
  track.addEventListener('keydown', e => { if (e.key === 'ArrowRight') go(current() + 1); if (e.key === 'ArrowLeft') go(current() - 1); });
  paint();
}

export async function mountVoices(root) {
  const track = root.querySelector('[data-track]'), empty = root.querySelector('[data-voices-empty]'), car = root.querySelector('[data-carousel]');
  try {
    const r = await fetch('/api/reviews', { headers: { accept: 'application/json' } });
    if (r.ok) {
      const { reviews = [] } = await r.json();
      const limit = parseInt(root.dataset.limit, 10) || Infinity;
      const room = Math.max(0, limit - track.children.length);
      reviews.slice(0, room).forEach(x => track.insertAdjacentHTML('beforeend', slide(x, root)));
    }
  } catch (e) { /* offline or blocked: the curated reviews still show */ }
  if (track.children.length > 0) { car.hidden = false; if (empty) empty.hidden = true; wire(root); }
}
