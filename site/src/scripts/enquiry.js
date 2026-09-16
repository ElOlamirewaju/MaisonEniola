/* Enquiry form (browser). Three steps; "Send enquiry" posts to /api/enquiry (worker/index.js), which emails
   Maryann and sends the visitor a copy. WhatsApp, copy and email remain as fallbacks. Nothing is stored on the site. An estimate added on /estimate arrives through sessionStorage
   and is cleared once the form is submitted or the estimate removed. */
import { PLAN_CHOICES, QUESTIONS, SERVICES, UI, CONTACT } from '../data/content.js';
import { t as tr, esc, pageLang, href } from '../lib/i18n.js';
import { ICON } from '../lib/icons.js';
import { ESTIMATE_KEY } from './calculator.js';

export function mountEnquiry(form) {
  const lang = pageLang();
  const t = (o, v) => tr(o, lang, v);
  const $ = (s, r = form) => r.querySelector(s);
  const F = { step: 1, choice: null, ans: {}, name: '', email: '', phone: '', pref: '', notes: '', bound: false, privacy: false, estimate: null, errors: {}, website: '' };

  function preselect(svc, tier) {
    const key = SERVICES[svc]?.key; if (!key) return;
    if (key === 'events') F.choice = tier === 0 ? 'proposal' : 'event';
    else if (key === 'venues') { F.choice = 'venue'; F.ans.stage = String(tier); }
    else { F.choice = 'trip'; F.ans.help = String(tier); }
    F.step = 2;
  }

  // Arrivals: from a pricing card (?s=&t=), a destination page (?plan=&dest=) or the calculator (sessionStorage).
  const q = new URLSearchParams(window.location.search);
  if (q.has('s')) preselect(+q.get('s'), q.has('t') ? +q.get('t') : 0);
  if (q.get('plan') && QUESTIONS[q.get('plan')]) { F.choice = q.get('plan'); F.step = 2; if (q.get('dest')) F.ans.dest = q.get('dest'); }
  try {
    const raw = sessionStorage.getItem(ESTIMATE_KEY);
    if (raw) { const e = JSON.parse(raw); F.estimate = e.summary; preselect(e.svc, e.tier); }
  } catch (err) { /* ignore */ }

  const errHTML = k => (F.errors[k] ? `<span class="err" id="err-${k}">${esc(F.errors[k])}</span>` : '');
  const inv = k => (F.errors[k] ? ` aria-invalid="true" aria-describedby="err-${k}"` : '');

  function fieldHTML(qd) {
    const id = 'q-' + qd.id, v = F.ans[qd.id] || '';
    const label = `<label for="${id}">${esc(t(qd.label))}${qd.req ? '' : ` <small>(${t(UI.optional)})</small>`}</label>`;
    let ctl;
    if (qd.type === 'select') ctl = `<select id="${id}" data-ans="${qd.id}" ${qd.req ? 'required' : ''}${inv(qd.id)}><option value="">${lang === 'es' ? 'Elige una opción' : 'Choose an option'}</option>${qd.opts.map((o, i) => `<option value="${i}" ${String(v) === String(i) ? 'selected' : ''}>${esc(t(o))}</option>`).join('')}</select>`;
    else if (qd.type === 'number') ctl = `<input type="number" inputmode="numeric" id="${id}" data-ans="${qd.id}" min="${qd.min}" max="${qd.max}" value="${esc(v)}" ${qd.req ? 'required' : ''}${inv(qd.id)}>`;
    else ctl = `<input type="text" id="${id}" data-ans="${qd.id}" value="${esc(v)}" placeholder="${esc(t(qd.ph))}" ${qd.req ? 'required' : ''}${inv(qd.id)}>`;
    return `<div class="field">${label}${ctl}${errHTML(qd.id)}</div>`;
  }

  function stepHTML() {
    let body = '';
    if (F.step === 1) {
      body = `<fieldset><legend>${t(UI.q1)}</legend><div class="choices">${PLAN_CHOICES.map(c => `<div class="opt"><input type="radio" name="plan" id="pc-${c.id}" value="${c.id}" ${F.choice === c.id ? 'checked' : ''} ${F.errors.choice ? 'aria-describedby="err-choice"' : ''}><label for="pc-${c.id}">${esc(t(c.label))}<small>${esc(t(c.hint))}</small></label></div>`).join('')}</div>${F.errors.choice ? `<p class="choice-err" id="err-choice">${esc(F.errors.choice)}</p>` : ''}</fieldset>`;
    } else if (F.step === 2) {
      const c = PLAN_CHOICES.find(x => x.id === F.choice);
      body = `<fieldset><legend>${esc(t(c.label))}</legend>${QUESTIONS[F.choice].map(fieldHTML).join('')}</fieldset>`;
    } else {
      body = `<fieldset><legend>${t(UI.yourDetails)}</legend>
        ${F.estimate ? `<div class="attached"><div><b>${t(UI.estimateAttached)}</b><pre>${esc(F.estimate)}</pre></div><button type="button" data-detach>${t(UI.removeEstimate)}</button></div>` : ''}
        <div class="grid-2">
          <div class="field"><label for="f-name">${t(UI.name)}</label><input id="f-name" data-f="name" autocomplete="name" value="${esc(F.name)}" required${inv('name')}>${errHTML('name')}</div>
          <div class="field"><label for="f-email">${t(UI.email)}</label><input id="f-email" type="email" data-f="email" autocomplete="email" value="${esc(F.email)}" required${inv('email')}>${errHTML('email')}</div>
          <div class="field"><label for="f-phone">${t(UI.phone)} <small>(${t(UI.optional)})</small></label><input id="f-phone" type="tel" data-f="phone" autocomplete="tel" value="${esc(F.phone)}"></div>
          <div class="field"><label for="f-pref">${t(UI.lang)}</label><select id="f-pref" data-f="pref"><option value="en" ${(F.pref || lang) === 'en' ? 'selected' : ''}>English</option><option value="es" ${(F.pref || lang) === 'es' ? 'selected' : ''}>Español</option></select></div>
        </div>
        <div class="field"><label for="f-notes">${t(UI.notes)} <small>(${t(UI.optional)})</small></label><textarea id="f-notes" data-f="notes">${esc(F.notes)}</textarea></div>
        <div class="bound"><h3>${t(UI.boundTitle)}</h3><p>${esc(t(UI.boundText))}</p></div>
        <div class="check"><input type="checkbox" id="f-bound" data-c="bound" ${F.bound ? 'checked' : ''}${inv('bound')}><div><label for="f-bound">${t(UI.tickBound)}</label>${errHTML('bound')}</div></div>
        <div class="check"><input type="checkbox" id="f-privacy" data-c="privacy" ${F.privacy ? 'checked' : ''}${inv('privacy')}><div><label for="f-privacy">${t(UI.tickPrivacy)}</label> <a href="${href(lang, 'privacy')}" target="_blank" rel="noopener">${t(UI.privacyLink)}</a>.${errHTML('privacy')}</div></div>
        <div class="hp" aria-hidden="true"><label for="f-website">Website</label><input id="f-website" data-f="website" tabindex="-1" autocomplete="off" value=""></div>
      </fieldset><p class="status" id="send-status" role="status" aria-live="polite"></p>`;
    }
    const nav = F.step === 3
      ? `<div class="form-nav"><button type="button" class="btn btn-ghost" data-back>${t(UI.back)}</button><div class="right"><button type="button" class="btn btn-wa" data-send="wa">${ICON.wa}${t(UI.sendWa)}</button><button type="button" class="btn btn-primary" data-send="site">${t(UI.sendSite)}</button></div></div><p class="alt-send">${t(UI.altSend)} <button type="button" class="linklike" data-send="copy">${t(UI.copyMsg)}</button> · <button type="button" class="linklike" data-send="email">${t(UI.sendEmail)}</button></p>`
      : `<div class="form-nav">${F.step > 1 ? `<button type="button" class="btn btn-ghost" data-back>${t(UI.back)}</button>` : ''}<div class="right"><button type="button" class="btn btn-primary" data-next>${t(UI.continue)}</button></div></div>`;
    return `<div class="progress"><span>${t(UI.step, { n: F.step })}</span><span class="progress-bar" aria-hidden="true"><i style="width:${F.step * 33.4}%"></i></span></div>${body}${nav}`;
  }

  function render() { form.innerHTML = stepHTML(); }

  function validate() {
    F.errors = {};
    if (F.step === 1 && !F.choice) F.errors.choice = t(UI.choosePlan);
    if (F.step === 2) QUESTIONS[F.choice].forEach(qd => { if (qd.req && (F.ans[qd.id] === undefined || String(F.ans[qd.id]).trim() === '')) F.errors[qd.id] = t(UI.required); });
    if (F.step === 3) {
      if (!F.name.trim()) F.errors.name = t(UI.required);
      if (!F.email.trim()) F.errors.email = t(UI.required);
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(F.email.trim())) F.errors.email = t(UI.emailInvalid);
      if (!F.bound) F.errors.bound = t(UI.mustTick);
      if (!F.privacy) F.errors.privacy = t(UI.mustTick);
    }
    return Object.keys(F.errors).length === 0;
  }

  function focusFirstError() {
    const k = Object.keys(F.errors)[0]; if (!k) return;
    const map = { choice: 'input[name="plan"]', name: '#f-name', email: '#f-email', bound: '#f-bound', privacy: '#f-privacy' };
    const el = $(map[k] || '#q-' + k); if (el) el.focus();
  }

  function focusLegend() { const lg = $('legend'); if (lg) { lg.tabIndex = -1; lg.focus({ preventScroll: true }); } form.scrollIntoView({ behavior: 'smooth', block: 'start' }); }

  function composeMessage() {
    const c = PLAN_CHOICES.find(x => x.id === F.choice), L = [];
    L.push(lang === 'es' ? 'Hola Maryann, te escribo desde tu web.' : 'Hi Maryann, I’m getting in touch from your website.', '');
    L.push((lang === 'es' ? 'Planeo: ' : 'Planning: ') + t(c.label));
    QUESTIONS[F.choice].forEach(qd => {
      const v = F.ans[qd.id]; if (v === undefined || String(v).trim() === '') return;
      L.push(`${t(qd.label)}: ${qd.type === 'select' ? t(qd.opts[+v]) : String(v).trim()}`);
    });
    if (F.estimate) L.push('', t(UI.estimateAttached) + ':', F.estimate);
    L.push('', `${t(UI.name)}: ${F.name.trim()}`, `${t(UI.email)}: ${F.email.trim()}`);
    if (F.phone.trim()) L.push(`${t(UI.phone)}: ${F.phone.trim()}`);
    L.push(`${t(UI.lang)}: ${(F.pref || lang) === 'es' ? 'Español' : 'English'}`);
    if (F.notes.trim()) L.push('', F.notes.trim());
    return L.join('\n');
  }

  function openExternal(url) {
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  }

  async function copyText(txt) {
    try { await navigator.clipboard.writeText(txt); return true; } catch (e) { return false; }
  }

  const clearEstimate = () => { try { sessionStorage.removeItem(ESTIMATE_KEY); } catch (e) { /* ignore */ } };

  form.addEventListener('click', async e => {
    const b = e.target.closest('button'); if (!b) return;
    const d = b.dataset;
    if (d.detach !== undefined) { F.estimate = null; clearEstimate(); render(); return; }
    if (d.next !== undefined) {
      if (!validate()) { render(); focusFirstError(); return; }
      F.step++; render(); focusLegend(); return;
    }
    if (d.back !== undefined) { F.errors = {}; F.step--; render(); focusLegend(); return; }
    if (d.send) {
      if (!validate()) { render(); focusFirstError(); return; }
      const msg = composeMessage(), st = $('#send-status');
      if (d.send === 'copy') { const ok = await copyText(msg); st.textContent = ok ? t(UI.copied) : msg; return; }
      if (d.send === 'site') {
        const c = PLAN_CHOICES.find(x => x.id === F.choice);
        form.querySelectorAll('button').forEach(x => { x.disabled = true; });
        st.textContent = t(UI.sending);
        let ok = false;
        try {
          const r = await fetch('/api/enquiry', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({
            name: F.name.trim(), email: F.email.trim(), phone: F.phone.trim(), lang: F.pref || lang, website: F.website,
            subject: `${t(c.label)} — ${F.name.trim()}`, message: msg,
          }) });
          ok = r.ok && (await r.json()).ok === true;
        } catch (err) { ok = false; }
        if (ok) {
          clearEstimate();
          form.innerHTML = `<div class="sent" role="status" tabindex="-1"><h2>${t(UI.sentTitle)}</h2><p>${esc(t(UI.sentBody, { email: F.email.trim() }))}</p></div><div class="book" data-book hidden><h3>${t(UI.bookTitle)}</h3><p>${t(UI.bookLead)}</p><div class="slots" data-slots></div><p class="status" data-book-status role="status" aria-live="polite"></p></div>`;
          $('.sent')?.focus({ preventScroll: true });
          offerBooking({ name: F.name.trim(), email: F.email.trim(), phone: F.phone.trim(), lang: F.pref || lang, topic: t(c.label) });
        } else {
          form.querySelectorAll('button').forEach(x => { x.disabled = false; });
          st.textContent = t(UI.sentFail, { email: CONTACT.email });
        }
        return;
      }
      if (d.send === 'wa') openExternal(`https://wa.me/${CONTACT.wa}?text=${encodeURIComponent(msg)}`);
      if (d.send === 'email') openExternal(`mailto:${CONTACT.email}?subject=${encodeURIComponent((lang === 'es' ? 'Consulta: ' : 'Enquiry: ') + t(PLAN_CHOICES.find(x => x.id === F.choice).label))}&body=${encodeURIComponent(msg)}`);
      st.textContent = t(UI.opened, { wa: CONTACT.waLabel, email: CONTACT.email });
      clearEstimate();
    }
  });
  async function offerBooking(who) {
    const box = $('[data-book]'), list = $('[data-slots]'), st = $('[data-book-status]'); if (!box) return;
    let data; try { const r = await fetch('/api/slots'); data = r.ok ? await r.json() : null; } catch (e) { data = null; }
    if (!data || !data.ok) return;
    box.hidden = false;
    if (!data.slots.length) { list.innerHTML = `<p>${t(UI.bookNone)}</p>`; return; }
    const loc = lang === 'es' ? 'es-ES' : 'en-GB', tzLocal = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const fmt = (iso, tz) => new Intl.DateTimeFormat(loc, { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(iso));
    const byDay = {}; data.slots.forEach(s => { const d = s.local.slice(0, 10); (byDay[d] = byDay[d] || []).push(s); });
    list.innerHTML = Object.entries(byDay).slice(0, 7).map(([d, ss]) => `<div class="slot-day"><b>${esc(new Intl.DateTimeFormat(loc, { timeZone: data.tz, weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(ss[0].start)))}</b><div class="slot-row">${ss.map(s => `<button type="button" class="slot" data-slot="${s.start}">${s.local.slice(11)}${tzLocal !== data.tz ? ` <small>(${esc(new Intl.DateTimeFormat(loc, { timeZone: tzLocal, hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(new Date(s.start)))})</small>` : ''}</button>`).join('')}</div></div>`).join('') + `<p class="fine">${t(UI.bookSkip)}</p>`;
    list.addEventListener('click', async e => {
      const b = e.target.closest('[data-slot]'); if (!b) return;
      list.querySelectorAll('.slot').forEach(x => { x.disabled = true; }); st.textContent = t(UI.sending);
      let res = null; try { const r = await fetch('/api/book', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ ...who, start: b.dataset.slot }) }); res = r.ok ? await r.json() : null; } catch (err) { res = null; }
      if (res && res.ok) { list.innerHTML = ''; st.textContent = t(UI.bookDone, { when: fmt(res.start, data.tz) + (tzLocal !== data.tz ? ` (${fmt(res.start, tzLocal)} ${tzLocal})` : ''), email: who.email }); }
      else { st.textContent = t(UI.bookFail); list.querySelectorAll('.slot').forEach(x => { x.disabled = false; }); b.remove(); }
    });
  }

  form.addEventListener('change', e => {
    const el = e.target;
    if (el.name === 'plan') { if (F.choice !== el.value) F.ans = {}; F.choice = el.value; delete F.errors.choice; return; }
    if (el.dataset.c) { F[el.dataset.c] = el.checked; return; }
    if (el.dataset.ans) { F.ans[el.dataset.ans] = el.value; return; }
    if (el.dataset.f) F[el.dataset.f] = el.value;
  });
  form.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.ans) F.ans[el.dataset.ans] = el.value;
    else if (el.dataset.f) F[el.dataset.f] = el.value;
  });
  form.addEventListener('submit', e => e.preventDefault());

  render();
}
