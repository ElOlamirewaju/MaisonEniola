/* Review form (browser): validates, posts JSON to /api/reviews, shows a thank-you. */
import { esc } from '../lib/i18n.js';

export function mountReviewForm(form) {
  const d = form.dataset, status = form.querySelector('.status');
  const mark = (el, msg) => { el.setAttribute('aria-invalid', 'true'); const f = el.closest('.field, .check, .rating') || el; let e = f.querySelector('.err'); if (!e) { e = document.createElement('span'); e.className = 'err'; f.appendChild(e); } e.textContent = msg; };
  const clear = () => form.querySelectorAll('.err').forEach(e => e.remove()) || form.querySelectorAll('[aria-invalid]').forEach(e => e.removeAttribute('aria-invalid'));

  form.addEventListener('submit', async e => {
    e.preventDefault(); clear();
    const v = n => (form.elements[n]?.value || '').trim();
    let first = null;
    const need = (n, ok, msg) => { if (!ok && !first) { first = form.elements[n]; } if (!ok) mark(form.elements[n].length ? form.elements[n][0] : form.elements[n], msg); };
    need('name', v('name'), d.required); need('service', v('service'), d.required); need('trip', v('trip'), d.required);
    need('rating', !!form.querySelector('input[name="rating"]:checked'), d.required);
    need('text', v('text').length >= 40, v('text') ? d.short : d.required);
    need('consent', form.elements.consent.checked, d.required);
    if (first) { (first.length ? first[0] : first).focus(); return; }

    form.querySelectorAll('button').forEach(b => { b.disabled = true; }); status.textContent = d.sending;
    let ok = false;
    try {
      const r = await fetch('/api/reviews', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
        name: v('name'), email: v('email'), display: v('display'), service: v('service'), trip: v('trip'),
        rating: form.querySelector('input[name="rating"]:checked').value, text: v('text'), lang: d.lang, consent: true, website: v('website'),
      }) });
      ok = r.ok && (await r.json()).ok === true;
    } catch (err) { ok = false; }
    if (ok) { form.innerHTML = `<div class="sent" role="status" tabindex="-1"><h2>${esc(d.sentTitle)}</h2><p>${esc(d.sentBody)}</p></div>`; form.querySelector('.sent').focus({ preventScroll: true }); }
    else { form.querySelectorAll('button').forEach(b => { b.disabled = false; }); status.textContent = d.fail; }
  });
}
