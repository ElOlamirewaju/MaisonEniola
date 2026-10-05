/* Estimate calculator.
   The same pure functions render the markup at build time (views/Estimate.astro, so the page is never empty,
   even before or without scripts) and in the browser, where EstimateCalculator makes it interactive.
   Pricing rules (from the Q4 2026 price guides):
     - base fee + add-ons; quantity add-ons multiply by their unit price
     - rush adds 30% of the base fee only; other add-ons are never increased (confirmed by Maryann, 16 Sept 2026)
     - the Destination Match fee (€350) is credited against a Venue Shortlist booked within 30 days
     - a discount code takes its percentage off the planning fee, after any credit; supplier costs are never discounted
     - in-person days show "plus travel at cost"; the €75/hour mass disruption rate is never bookable here
   "Add this estimate to my enquiry" stores the summary (and any code) in sessionStorage and opens the enquiry page. */
import { SERVICES, UI } from '../data/content.js';
import { t as tr, esc, money, round5, pageLang, href } from '../lib/i18n.js';

export const ESTIMATE_KEY = 'me-estimate';
export const DEFAULT_SVC = 2; // travel planning: the lowest entry price and the most common request

export const initialState = (svc = DEFAULT_SVC, tier = 0, discount = null) => ({ svc, tier, add: {}, credit: false, discount });

export function calculate(state, lang) {
  const t = o => tr(o, lang), tier = SERVICES[state.svc].tiers[state.tier], lines = [];
  let sub = tier.price, rush = 0, travel = false;
  lines.push({ label: `${t(UI.estBase)}: ${tier.name}`, amount: tier.price });
  tier.addons.forEach(a => {
    const v = state.add[a.id];
    if (!v || a.type === 'ref') return;
    if (a.type === 'toggle') { sub += a.price; lines.push({ label: t(a.label), amount: a.price }); }
    if (a.type === 'qty') { sub += a.price * v; lines.push({ label: `${t(a.label)} × ${v}`, amount: a.price * v }); if (a.travel) travel = true; }
    if (a.type === 'pct') rush = a.pct;
  });
  let total = sub;
  if (rush) { const r = Math.round(tier.price * rush / 100); total += r; lines.push({ label: t(UI.estRush), amount: r }); }
  if (tier.credit && state.credit) { total -= tier.credit; lines.push({ label: t(UI.estCredit), amount: -tier.credit, credit: true }); }
  if (state.discount) {
    const off = Math.round(Math.max(0, total) * state.discount.percent / 100);
    if (off) { total -= off; lines.push({ label: tr(UI.estDiscount, lang, { code: state.discount.code, p: state.discount.percent }), amount: -off, credit: true }); }
  }
  total = Math.max(0, total);
  return { tier, lines, total, travel, plus: tier.plus, format: n => (n < 0 ? '−' + money(-n, lang) : money(n, lang)) };
}

export function summaryText(state, lang) {
  const t = o => tr(o, lang), c = calculate(state, lang);
  return [`${t(SERVICES[state.svc].short)} · ${c.tier.name}`]
    .concat(c.lines.map(l => `${l.label}: ${c.format(l.amount)}`))
    .concat([`${t(UI.estTotal)}: ${c.plus ? t(UI.from) + ' ' : ''}${c.format(c.total)}${c.travel ? ' (' + t(UI.estPlusTravel) + ')' : ''}`])
    .join('\n');
}

function addonPrice(a, lang) {
  if (a.type === 'pct') return tr(UI.rushNote, lang);
  let s = money(a.price, lang);
  if (a.unit) s += ' ' + tr(a.unit, lang);
  if (a.travel) s += lang === 'es' ? ' + viaje a coste' : ' + travel at cost';
  return s;
}

export function controlsHTML(state, lang, uid) {
  const t = o => tr(o, lang), svc = SERVICES[state.svc], tier = svc.tiers[state.tier];
  const addons = tier.addons.filter(a => a.type !== 'ref');
  const services = SERVICES.map((s, i) => `<div class="opt"><input type="radio" name="${uid}-svc" id="${uid}-s${i}" value="${i}" data-svc ${i === state.svc ? 'checked' : ''}><label for="${uid}-s${i}">${esc(t(s.short))}</label></div>`).join('');
  const tiers = svc.tiers.map((x, i) => `<div class="opt"><input type="radio" name="${uid}-tier" id="${uid}-t${i}" value="${i}" data-tier ${i === state.tier ? 'checked' : ''}><label for="${uid}-t${i}">${esc(x.name)}<small>${esc(t(x.pick))} · ${t(UI.from).toLowerCase()} ${money(x.price, lang)}${x.plus ? '+' : ''}</small></label></div>`).join('');
  const rows = addons.map(a => {
    const id = `${uid}-a-${a.id}`, v = state.add[a.id] || 0;
    const ctl = a.type === 'qty'
      ? `<div class="stepper" role="group" aria-labelledby="${id}-l"><button type="button" data-qty="${a.id}" data-d="-1" ${v <= 0 ? 'disabled' : ''} aria-label="${t(UI.decrease)}: ${esc(t(a.label))}">−</button><output aria-live="polite">${v}</output><button type="button" data-qty="${a.id}" data-d="1" ${v >= a.max ? 'disabled' : ''} aria-label="${t(UI.increase)}: ${esc(t(a.label))}">+</button></div>`
      : `<span class="switch"><input type="checkbox" id="${id}" data-tog="${a.id}" ${v ? 'checked' : ''} aria-labelledby="${id}-l"><span></span></span>`;
    return `<div class="addon-row"><div class="al" id="${id}-l">${esc(t(a.label))}<small>${esc(addonPrice(a, lang))}</small></div>${ctl}</div>`;
  }).join('');
  const credit = tier.credit ? `<div class="addon-row"><div class="al" id="${uid}-credit-l">${esc(t(UI.estCredit))}<small>${esc(t(SERVICES[1].tiers[0].note))}</small></div><span class="switch"><input type="checkbox" id="${uid}-credit" data-credit ${state.credit ? 'checked' : ''} aria-labelledby="${uid}-credit-l"><span></span></span></div>` : '';
  return `<fieldset><legend>${t(UI.estService)}</legend><div class="seg">${services}</div></fieldset>
    <fieldset><legend>${t(UI.estLevel)}</legend><div class="seg">${tiers}</div></fieldset>
    <fieldset><legend>${t(UI.addons)}</legend>${rows || credit ? `<div class="addon-rows">${rows}${credit}</div>` : `<p class="est-muted">${t(UI.estNoAddons)}</p>`}</fieldset>`;
}

/* The running total pinned above the phone action bar while the options scroll past (CSS shows it on phones only). */
export function stripHTML(state, lang, uid) {
  const c = calculate(state, lang);
  return `<span>${tr(UI.estTotalShort, lang)}</span><b>${c.plus ? tr(UI.from, lang) + ' ' : ''}${money(c.total, lang)}</b>`;
}

function promoHTML(state, lang, uid, msg) {
  const t = o => tr(o, lang), d = state.discount;
  const field = d
    ? `<p class="promo-on"><b>${esc(d.code)}</b> · ${esc(tr(UI.promoOk, lang, { p: d.percent }))} <button type="button" class="linklike" data-unapply>${t(UI.promoRemove)}</button></p>`
    : `<label for="${uid}-code">${t(UI.promoLabel)} <small>(${t(UI.optional)})</small></label><div class="promo-row"><input id="${uid}-code" data-code autocomplete="off" autocapitalize="characters" spellcheck="false" enterkeyhint="done" maxlength="24"><button type="button" class="btn btn-ghost" data-apply>${t(UI.promoApply)}</button></div>`;
  return `<div class="promo">${field}<p class="promo-msg" role="status" data-promo-msg>${esc(msg || '')}</p></div>`;
}

export function ticketHTML(state, lang, uid, msg = '') {
  const t = o => tr(o, lang), c = calculate(state, lang);
  return `<div class="ticket-head"><p>${t(UI.estTicket)}</p><h3>${esc(t(SERVICES[state.svc].short))}</h3></div>
    <div class="ticket-body"><ul class="lines">${c.lines.map(l => `<li class="${l.credit ? 'minus' : ''}"><span>${esc(l.label)}</span><span>${c.format(l.amount)}</span></li>`).join('')}</ul>
    ${promoHTML(state, lang, uid, msg)}
    <div class="total" aria-live="polite"><p>${t(UI.estTotal)}</p><strong>${c.plus ? t(UI.from) + ' ' : ''}${money(c.total, lang)}</strong><p>${tr(UI.estApprox, lang, { gbp: money(round5(c.total * .86), lang, 'GBP'), usd: money(round5(c.total * 1.09), lang, 'USD') })}</p></div>
    ${c.travel ? `<p class="fine">${t(UI.estPlusTravel)}</p>` : ''}<p class="fine">${t(UI.estSmall)}</p><p class="fine">${t(UI.promoNote)}</p>
    <button type="button" class="btn btn-primary" data-attach>${t(UI.estSend)}</button><p class="status" role="status" data-status></p></div>`;
}

export function calcHTML(state, lang, uid) {
  return `<div class="calc-controls"><div data-controls>${controlsHTML(state, lang, uid)}</div><a class="calc-strip" href="#${uid}-ticket" data-strip>${stripHTML(state, lang, uid)}</a></div>`
    + `<aside class="ticket" id="${uid}-ticket" data-ticket aria-label="${tr(UI.estTicket, lang)}">${ticketHTML(state, lang, uid)}</aside>`;
}

/* Ask the Worker whether a code is valid. Resolves to { ok, code, percent } or { ok: false, error }. */
export async function checkDiscount(code) {
  try {
    const r = await fetch('/api/discount', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code }) });
    const j = await r.json().catch(() => ({}));
    if (j.ok) return j;
    return { ok: false, error: j.error && UI.promoErr[j.error] ? j.error : (r.ok ? 'invalid' : 'network') };
  } catch (e) { return { ok: false, error: 'network' }; }
}

export class EstimateCalculator {
  constructor(root, options = {}) {
    this.root = root;
    this.lang = pageLang();
    this.opts = options;
    this.uid = root.id || 'calc';
    this.state = initialState();
    this.msg = '';
    root.classList.add('calc');
    root.addEventListener('click', e => this.onClick(e));
    root.addEventListener('change', e => this.onChange(e));
    root.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.matches('[data-code]')) { e.preventDefault(); this.applyCode(); } });
    this.render();
  }

  select(svc, tier) { this.state = initialState(svc, tier, this.state.discount); this.render(); }
  tierData() { return SERVICES[this.state.svc].tiers[this.state.tier]; }
  summary() { return summaryText(this.state, this.lang); }

  render() { this.root.innerHTML = calcHTML(this.state, this.lang, this.uid); }
  renderTicket(focusSel) {
    this.root.querySelector('[data-ticket]').innerHTML = ticketHTML(this.state, this.lang, this.uid, this.msg);
    this.root.querySelector('[data-strip]').innerHTML = stripHTML(this.state, this.lang, this.uid);
    if (focusSel) this.root.querySelector(focusSel)?.focus();
  }
  renderControls(focusSel) {
    this.root.querySelector('[data-controls]').innerHTML = controlsHTML(this.state, this.lang, this.uid);
    this.renderTicket();
    if (focusSel) this.root.querySelector(focusSel)?.focus();
  }

  async applyCode() {
    const input = this.root.querySelector('[data-code]'), code = (input?.value || '').trim().toUpperCase();
    const msgEl = this.root.querySelector('[data-promo-msg]');
    if (!code) { input?.focus(); return; }
    if (msgEl) msgEl.textContent = tr(UI.promoChecking, this.lang);
    const r = await checkDiscount(code);
    if (r.ok) { this.state.discount = { code: r.code, percent: r.percent }; this.msg = ''; this.renderTicket('[data-unapply]'); }
    else { this.msg = tr(UI.promoErr[r.error], this.lang); this.renderTicket('[data-code]'); const i = this.root.querySelector('[data-code]'); if (i) i.value = code; }
  }

  onChange(e) {
    const el = e.target, st = this.state;
    if (el.dataset.svc !== undefined) { this.state = initialState(+el.value, 0, st.discount); this.renderControls(`[data-svc][value="${el.value}"]`); return; }
    if (el.dataset.tier !== undefined) { this.state = initialState(st.svc, +el.value, st.discount); this.renderControls(`[data-tier][value="${el.value}"]`); return; }
    if (el.dataset.tog) { st.add[el.dataset.tog] = el.checked ? 1 : 0; this.renderTicket(); return; }
    if (el.dataset.credit !== undefined) { st.credit = el.checked; this.renderTicket(); }
  }

  onClick(e) {
    const b = e.target.closest('button'); if (!b) return;
    if (b.dataset.apply !== undefined) { this.applyCode(); return; }
    if (b.dataset.unapply !== undefined) { this.state.discount = null; this.msg = ''; this.renderTicket('[data-code]'); return; }
    if (b.dataset.qty) {
      const a = this.tierData().addons.find(x => x.id === b.dataset.qty);
      const d = +b.dataset.d, v = Math.max(0, Math.min(a.max, (this.state.add[a.id] || 0) + d));
      this.state.add[a.id] = v;
      this.renderControls();
      const same = this.root.querySelector(`[data-qty="${a.id}"][data-d="${d}"]`);
      (same && !same.disabled ? same : this.root.querySelector(`[data-qty="${a.id}"]:not([disabled])`))?.focus();
      return;
    }
    if (b.dataset.attach !== undefined) {
      const d = this.state.discount;
      const payload = { summary: this.summary(), svc: this.state.svc, tier: this.state.tier, code: d ? d.code : '', percent: d ? d.percent : 0 };
      try { sessionStorage.setItem(ESTIMATE_KEY, JSON.stringify(payload)); } catch (err) { /* storage unavailable */ }
      const s = this.root.querySelector('[data-status]');
      if (s) s.textContent = this.opts.sentText || '';
      setTimeout(() => { window.location.href = href(this.lang, 'enquire') + '#enq'; }, 350);
    }
  }
}

export function mountCalculator(root, options) {
  const calc = new EstimateCalculator(root, options);
  const q = new URLSearchParams(window.location.search);
  const s = +q.get('s'), t = +q.get('t');
  if (q.has('s') && SERVICES[s]) calc.select(s, SERVICES[s].tiers[t] ? t : 0);
  return calc;
}
