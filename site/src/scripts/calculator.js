/* Estimate calculator (browser).
   Pricing rules (from the Q4 2026 price guides):
     - base fee + add-ons; quantity add-ons multiply by their unit price
     - rush adds 30% of the base fee only; other add-ons are never increased (confirmed by Maryann, 16 Sept 2026)
     - the Destination Match fee (€350) is credited against a Venue Shortlist booked within 30 days
     - in-person days show "plus travel at cost"; the €75/hour mass disruption rate is never bookable here
   "Add this estimate to my enquiry" stores the summary in sessionStorage and opens the enquiry page. */
import { SERVICES, UI } from '../data/content.js';
import { t as tr, esc, money, round5, pageLang, href } from '../lib/i18n.js';

export const ESTIMATE_KEY = 'me-estimate';

export class EstimateCalculator {
  constructor(root, options = {}) {
    this.root = root;
    this.lang = pageLang();
    this.opts = options;
    this.state = { svc: 0, tier: 0, add: {}, credit: false };
    root.classList.add('calc');
    root.addEventListener('click', e => this.onClick(e));
    root.addEventListener('change', e => this.onChange(e));
    this.render();
  }

  t(o, vars) { return tr(o, this.lang, vars); }
  money(n, cur) { return money(n, this.lang, cur); }

  select(svc, tier) {
    this.state = { svc, tier, add: {}, credit: false };
    this.render();
  }

  tierData() { return SERVICES[this.state.svc].tiers[this.state.tier]; }

  calculate() {
    const st = this.state, tier = this.tierData(), lines = [];
    let sub = tier.price, rush = 0, travel = false;
    lines.push({ label: `${this.t(UI.estBase)}: ${tier.name}`, amount: tier.price });
    tier.addons.forEach(a => {
      const v = st.add[a.id];
      if (!v || a.type === 'ref') return;
      if (a.type === 'toggle') { sub += a.price; lines.push({ label: this.t(a.label), amount: a.price }); }
      if (a.type === 'qty') { sub += a.price * v; lines.push({ label: `${this.t(a.label)} × ${v}`, amount: a.price * v }); if (a.travel) travel = true; }
      if (a.type === 'pct') rush = a.pct;
    });
    let total = sub;
    if (rush) { const r = Math.round(tier.price * rush / 100); total += r; lines.push({ label: this.t(UI.estRush), amount: r }); }
    if (tier.credit && st.credit) { total -= tier.credit; lines.push({ label: this.t(UI.estCredit), amount: -tier.credit, credit: true }); }
    return { tier, lines, total, travel, plus: tier.plus, format: n => (n < 0 ? '−' + this.money(-n) : this.money(n)) };
  }

  summary() {
    const c = this.calculate();
    return [`${this.t(SERVICES[this.state.svc].short)} · ${c.tier.name}`]
      .concat(c.lines.map(l => `${l.label}: ${c.format(l.amount)}`))
      .concat([`${this.t(UI.estTotal)}: ${c.plus ? this.t(UI.from) + ' ' : ''}${c.format(c.total)}${c.travel ? ' (' + this.t(UI.estPlusTravel) + ')' : ''}`])
      .join('\n');
  }

  addonPrice(a) {
    if (a.type === 'pct') return this.t(UI.rushNote);
    let s = this.money(a.price);
    if (a.unit) s += ' ' + this.t(a.unit);
    if (a.travel) s += this.lang === 'es' ? ' + viaje a coste' : ' + travel at cost';
    return s;
  }

  controlsHTML() {
    const st = this.state, t = o => this.t(o);
    const svc = SERVICES[st.svc], tier = svc.tiers[st.tier];
    const addons = tier.addons.filter(a => a.type !== 'ref');
    const uid = this.root.id || 'calc';
    const services = SERVICES.map((s, i) => `<div class="opt"><input type="radio" name="${uid}-svc" id="${uid}-s${i}" value="${i}" data-svc ${i === st.svc ? 'checked' : ''}><label for="${uid}-s${i}">${esc(t(s.short))}</label></div>`).join('');
    const tiers = svc.tiers.map((x, i) => `<div class="opt"><input type="radio" name="${uid}-tier" id="${uid}-t${i}" value="${i}" data-tier ${i === st.tier ? 'checked' : ''}><label for="${uid}-t${i}">${esc(x.name)}<small>${t(UI.from)} ${this.money(x.price)}${x.plus ? '+' : ''}</small></label></div>`).join('');
    const rows = addons.map(a => {
      const id = `${uid}-a-${a.id}`, v = st.add[a.id] || 0;
      const ctl = a.type === 'qty'
        ? `<div class="stepper" role="group" aria-labelledby="${id}-l"><button type="button" data-qty="${a.id}" data-d="-1" ${v <= 0 ? 'disabled' : ''} aria-label="${t(UI.decrease)}: ${esc(t(a.label))}">−</button><output aria-live="polite">${v}</output><button type="button" data-qty="${a.id}" data-d="1" ${v >= a.max ? 'disabled' : ''} aria-label="${t(UI.increase)}: ${esc(t(a.label))}">+</button></div>`
        : `<span class="switch"><input type="checkbox" id="${id}" data-tog="${a.id}" ${v ? 'checked' : ''} aria-labelledby="${id}-l"><span></span></span>`;
      return `<div class="addon-row"><div class="al" id="${id}-l">${esc(t(a.label))}<small>${esc(this.addonPrice(a))}</small></div>${ctl}</div>`;
    }).join('');
    const credit = tier.credit ? `<div class="addon-row"><div class="al" id="${uid}-credit-l">${esc(t(UI.estCredit))}<small>${esc(t(SERVICES[1].tiers[0].note))}</small></div><span class="switch"><input type="checkbox" id="${uid}-credit" data-credit ${st.credit ? 'checked' : ''} aria-labelledby="${uid}-credit-l"><span></span></span></div>` : '';
    return `<fieldset><legend>${t(UI.estService)}</legend><div class="seg">${services}</div></fieldset>
      <fieldset><legend>${t(UI.estLevel)}</legend><div class="seg">${tiers}</div></fieldset>
      <fieldset><legend>${t(UI.addons)}</legend>${rows || credit ? `<div class="addon-rows">${rows}${credit}</div>` : `<p class="est-muted">${t(UI.estNoAddons)}</p>`}</fieldset>`;
  }

  ticketHTML() {
    const t = o => this.t(o), c = this.calculate();
    return `<div class="ticket-head"><p>${t(UI.estTicket)}</p><h3>${esc(t(SERVICES[this.state.svc].short))}</h3></div>
      <div class="ticket-body"><ul class="lines">${c.lines.map(l => `<li class="${l.credit ? 'minus' : ''}"><span>${esc(l.label)}</span><span>${c.format(l.amount)}</span></li>`).join('')}</ul>
      <div class="total" aria-live="polite"><p>${t(UI.estTotal)}</p><strong>${c.plus ? t(UI.from) + ' ' : ''}${this.money(c.total)}</strong><p>${this.t(UI.estApprox, { gbp: this.money(round5(c.total * .86), 'GBP'), usd: this.money(round5(c.total * 1.09), 'USD') })}</p></div>
      ${c.travel ? `<p class="fine">${t(UI.estPlusTravel)}</p>` : ''}<p class="fine">${t(UI.estSmall)}</p>
      <button type="button" class="btn btn-primary" data-attach>${t(UI.estSend)}</button><p class="status" role="status" data-status></p></div>`;
  }

  render() {
    this.root.innerHTML = `<div class="calc-controls" data-controls>${this.controlsHTML()}</div><aside class="ticket" data-ticket aria-label="${this.t(UI.estTicket)}">${this.ticketHTML()}</aside>`;
  }
  renderTicket() { this.root.querySelector('[data-ticket]').innerHTML = this.ticketHTML(); }
  renderControls(focusSel) {
    this.root.querySelector('[data-controls]').innerHTML = this.controlsHTML();
    this.renderTicket();
    if (focusSel) { const el = this.root.querySelector(focusSel); if (el) el.focus(); }
  }

  onChange(e) {
    const el = e.target, st = this.state;
    if (el.dataset.svc !== undefined) { this.state = { svc: +el.value, tier: 0, add: {}, credit: false }; this.renderControls(`[data-svc][value="${el.value}"]`); return; }
    if (el.dataset.tier !== undefined) { this.state = { svc: st.svc, tier: +el.value, add: {}, credit: false }; this.renderControls(`[data-tier][value="${el.value}"]`); return; }
    if (el.dataset.tog) { st.add[el.dataset.tog] = el.checked ? 1 : 0; this.renderTicket(); return; }
    if (el.dataset.credit !== undefined) { st.credit = el.checked; this.renderTicket(); }
  }

  onClick(e) {
    const b = e.target.closest('button'); if (!b) return;
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
      const payload = { summary: this.summary(), svc: this.state.svc, tier: this.state.tier };
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
