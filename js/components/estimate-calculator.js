/* Estimate calculator component.
   Usage:
     const calc = new ME.EstimateCalculator(document.querySelector('#calc'), { onAttach: summary => {} });
     calc.select(serviceIndex, tierIndex);   // preselect from a pricing card
     calc.render();                          // call again after a language change
   Pricing rules (from the Q4 2026 price guides):
     - base fee + add-ons; quantity add-ons multiply by their unit price
     - rush adds 30% to the fee above it (confirm with Maryann if this should apply to the base fee only)
     - the Destination Match fee (€350) is credited against a Venue Shortlist booked within 30 days
     - in-person days show "plus travel at cost"; the €75/hour mass disruption rate is never bookable here */
(function () {
  const ME = window.ME;

  class EstimateCalculator {
    constructor(root, options) {
      this.root = root;
      this.opts = options || {};
      this.state = { svc: 0, tier: 0, add: {}, credit: false };
      root.classList.add('calc');
      root.addEventListener('click', e => this.onClick(e));
      root.addEventListener('change', e => this.onChange(e));
      this.render();
    }

    select(svc, tier) {
      this.state = { svc, tier, add: {}, credit: false };
      this.render();
    }

    tierData() { return ME.SERVICES[this.state.svc].tiers[this.state.tier]; }

    /* Returns line items and totals. Exposed so other parts of the site (or tests) can reuse it. */
    calculate() {
      const { t, money } = ME.utils;
      const st = this.state, tr = this.tierData(), lines = [];
      let sub = tr.price, rush = 0, travel = false;
      lines.push({ label: `${t(ME.UI.estBase)}: ${tr.name}`, amount: tr.price });
      tr.addons.forEach(a => {
        const v = st.add[a.id];
        if (!v || a.type === 'ref') return;
        if (a.type === 'toggle') { sub += a.price; lines.push({ label: t(a.label), amount: a.price }); }
        if (a.type === 'qty') { sub += a.price * v; lines.push({ label: `${t(a.label)} × ${v}`, amount: a.price * v }); if (a.travel) travel = true; }
        if (a.type === 'pct') rush = a.pct;
      });
      let total = sub;
      if (rush) { const r = Math.round(sub * rush / 100); total += r; lines.push({ label: t(ME.UI.estRush), amount: r }); }
      if (tr.credit && st.credit) { total -= tr.credit; lines.push({ label: t(ME.UI.estCredit), amount: -tr.credit, credit: true }); }
      return { tier: tr, lines, total, travel, plus: tr.plus, format: n => (n < 0 ? '−' + money(-n) : money(n)) };
    }

    summary() {
      const { t } = ME.utils, c = this.calculate();
      return [`${t(ME.SERVICES[this.state.svc].short)} · ${c.tier.name}`]
        .concat(c.lines.map(l => `${l.label}: ${c.format(l.amount)}`))
        .concat([`${t(ME.UI.estTotal)}: ${c.plus ? t(ME.UI.from) + ' ' : ''}${c.format(c.total)}${c.travel ? ' (' + t(ME.UI.estPlusTravel) + ')' : ''}`])
        .join('\n');
    }

    addonPrice(a) {
      const { t, money } = ME.utils;
      if (a.type === 'pct') return t(ME.UI.rushNote);
      let s = money(a.price);
      if (a.unit) s += ' ' + t(a.unit);
      if (a.travel) s += ME.state.lang === 'es' ? ' + viaje a coste' : ' + travel at cost';
      return s;
    }

    controlsHTML() {
      const { t, esc, money } = ME.utils, UI = ME.UI, st = this.state;
      const svc = ME.SERVICES[st.svc], tr = svc.tiers[st.tier];
      const addons = tr.addons.filter(a => a.type !== 'ref');
      const uid = this.root.id || 'calc';
      const services = ME.SERVICES.map((s, i) => `<div class="opt"><input type="radio" name="${uid}-svc" id="${uid}-s${i}" value="${i}" data-svc ${i === st.svc ? 'checked' : ''}><label for="${uid}-s${i}">${esc(t(s.short))}</label></div>`).join('');
      const tiers = svc.tiers.map((x, i) => `<div class="opt"><input type="radio" name="${uid}-tier" id="${uid}-t${i}" value="${i}" data-tier ${i === st.tier ? 'checked' : ''}><label for="${uid}-t${i}">${esc(x.name)}<small>${t(UI.from)} ${money(x.price)}${x.plus ? '+' : ''}</small></label></div>`).join('');
      const rows = addons.map(a => {
        const id = `${uid}-a-${a.id}`, v = st.add[a.id] || 0;
        const ctl = a.type === 'qty'
          ? `<div class="stepper" role="group" aria-labelledby="${id}-l"><button type="button" data-qty="${a.id}" data-d="-1" ${v <= 0 ? 'disabled' : ''} aria-label="${t(UI.decrease)}: ${esc(t(a.label))}">−</button><output aria-live="polite">${v}</output><button type="button" data-qty="${a.id}" data-d="1" ${v >= a.max ? 'disabled' : ''} aria-label="${t(UI.increase)}: ${esc(t(a.label))}">+</button></div>`
          : `<span class="switch"><input type="checkbox" id="${id}" data-tog="${a.id}" ${v ? 'checked' : ''} aria-labelledby="${id}-l"><span></span></span>`;
        return `<div class="addon-row"><div class="al" id="${id}-l">${esc(t(a.label))}<small>${esc(this.addonPrice(a))}</small></div>${ctl}</div>`;
      }).join('');
      const credit = tr.credit ? `<div class="addon-row"><div class="al" id="${uid}-credit-l">${esc(t(UI.estCredit))}<small>${esc(t(ME.SERVICES[1].tiers[0].note))}</small></div><span class="switch"><input type="checkbox" id="${uid}-credit" data-credit ${st.credit ? 'checked' : ''} aria-labelledby="${uid}-credit-l"><span></span></span></div>` : '';
      return `<fieldset><legend>${t(UI.estService)}</legend><div class="seg">${services}</div></fieldset>
        <fieldset><legend>${t(UI.estLevel)}</legend><div class="seg">${tiers}</div></fieldset>
        <fieldset><legend>${t(UI.addons)}</legend>${rows || credit ? `<div class="addon-rows">${rows}${credit}</div>` : `<p class="est-muted">${t(UI.estNoAddons)}</p>`}</fieldset>`;
    }

    ticketHTML() {
      const { t, esc, money, round5 } = ME.utils, UI = ME.UI, c = this.calculate();
      return `<div class="ticket-head"><p>${t(UI.estTicket)}</p><h3>${esc(t(ME.SERVICES[this.state.svc].short))}</h3></div>
        <div class="ticket-body"><ul class="lines">${c.lines.map(l => `<li class="${l.credit ? 'minus' : ''}"><span>${esc(l.label)}</span><span>${c.format(l.amount)}</span></li>`).join('')}</ul>
        <div class="total" aria-live="polite"><p>${t(UI.estTotal)}</p><strong>${c.plus ? t(UI.from) + ' ' : ''}${money(c.total)}</strong><p>${t(UI.estApprox, { gbp: money(round5(c.total * .86), 'GBP'), usd: money(round5(c.total * 1.09), 'USD') })}</p></div>
        ${c.travel ? `<p class="fine">${t(UI.estPlusTravel)}</p>` : ''}<p class="fine">${t(UI.estSmall)}</p>
        ${this.opts.onAttach ? `<button type="button" class="btn btn-primary" data-attach>${t(UI.estSend)}</button>` : ''}<p class="status" role="status" data-status></p></div>`;
    }

    render() {
      const { t } = ME.utils;
      this.root.innerHTML = `<div class="calc-controls" data-controls>${this.controlsHTML()}</div><aside class="ticket" data-ticket aria-label="${t(ME.UI.estTicket)}">${this.ticketHTML()}</aside>`;
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
      if (b.dataset.attach !== undefined && this.opts.onAttach) {
        this.opts.onAttach(this.summary(), { ...this.state });
        const s = this.root.querySelector('[data-status]');
        if (s) s.textContent = ME.utils.t(ME.UI.estAdded);
      }
    }
  }

  ME.EstimateCalculator = EstimateCalculator;
})();
