/* Page assembly and interactions. Depends on data.js, scenes.js, utils.js and /components. */
(function () {
  const ME = window.ME;
  const { UI, SERVICES, PLACES, PLAN_CHOICES, QUESTIONS, CONTACT, TIER_COLORS } = ME;
  const U = ME.utils, t = U.t, esc = U.esc;

  const S = ME.state;
  S.svc = 0;
  S.expanded = {};
  S.form = { step: 1, choice: null, ans: {}, name: '', email: '', phone: '', pref: '', notes: '', bound: false, privacy: false, estimate: null, errors: {} };
  const F = S.form;
  try {
    const saved = localStorage.getItem('me-lang');
    if (saved === 'en' || saved === 'es') S.lang = saved;
    else if ((navigator.language || '').toLowerCase().startsWith('es')) S.lang = 'es';
  } catch (e) { /* storage unavailable: keep default */ }

  const $ = (s, r = document) => r.querySelector(s);
  let calc = null;

  /* ---------- header and hero ---------- */
  function headerHTML() {
    const n = UI.nav;
    return `<header class="site-header"><div class="wrap head-in">
      <a class="wordmark" href="#top">Maryann Eniola</a>
      <nav class="main-nav" id="mainnav" aria-label="${S.lang === 'es' ? 'Principal' : 'Main'}"><ul>
        <li><a href="#services">${t(n.services)}</a></li><li><a href="#places">${t(n.places)}</a></li>
        <li><a href="#estimate">${t(n.estimate)}</a></li><li><a href="#enquire">${t(n.enquire)}</a></li></ul></nav>
      <div class="lang" role="group" aria-label="Language / Idioma">
        <button type="button" data-lang="en" aria-pressed="${S.lang === 'en'}" lang="en">EN</button>
        <button type="button" data-lang="es" aria-pressed="${S.lang === 'es'}" lang="es">ES</button></div>
      <a class="btn btn-wa head-wa" href="https://wa.me/${CONTACT.wa}" target="_blank" rel="noopener">${U.ICON.wa}${t(UI.whatsappShort)}</a>
      <button class="menu-btn" type="button" aria-expanded="false" aria-controls="mainnav">${U.ICON.menu}<span class="sr-only">${t(UI.menu)}</span></button>
    </div></header>`;
  }

  function postcardHTML(i, opts) {
    const p = PLACES[i], o = opts || {};
    const card = `<button type="button" class="postcard${o.destination ? ' destination-card' : ''}" data-place="${i}" aria-haspopup="dialog">
      <span class="pc-img">${U.cardMedia(p, o.eager)}</span>
      <span class="pc-text"><span class="pc-cap">${esc(t(p.name))}</span>${o.destination ? `<span class="pc-step">${esc(t(p.step))}</span>` : ''}</span></button>`;
    return o.float ? `<div class="pc-float">${card}</div>` : card;
  }

  function heroHTML() {
    return `<section class="hero" id="top"><div class="wrap hero-grid">
      <div class="hero-copy"><h1>${esc(t(UI.heroTitle))}</h1><p class="hero-lead">${esc(t(UI.heroLead))}</p>
      <div class="hero-actions"><a class="btn btn-primary" href="#services">${t(UI.heroCta1)}</a><a class="btn btn-ghost" href="#estimate">${t(UI.heroCta2)}</a></div></div>
      <div><div class="stack" data-stack>${[1, 0, 2].map((i, n) => postcardHTML(i, { float: true, eager: n < 2 })).join('')}</div><p class="stack-hint">${t(UI.heroPostcardHint)}</p></div>
    </div></section>`;
  }

  /* ---------- services ---------- */
  function addonPrice(a) {
    if (a.type === 'pct') return `+${a.pct}%`;
    if (a.type === 'ref') return t(a.refText);
    let s = U.money(a.price);
    if (a.unit) s += ' ' + t(a.unit);
    if (a.travel) s += S.lang === 'es' ? ' + viaje a coste' : ' + travel at cost';
    return s;
  }

  function tierHTML(svc, ti) {
    const tr = SERVICES[svc].tiers[ti], key = `${svc}-${ti}`, exp = !!S.expanded[key], n = tr.rows.length;
    return `<article class="tier${exp ? ' expanded' : ''}" data-c="${TIER_COLORS[ti]}" aria-labelledby="tn-${key}">
      <div class="tier-head">
        <div><div class="tier-num drift d1" aria-hidden="true">0${ti + 1}</div><h4 id="tn-${key}" class="drift d2">${esc(tr.name)}</h4><p class="tier-sub drift d3">${esc(t(tr.sub))}</p></div>
        <div class="tier-price drift d2"><small>${t(UI.from)}</small><strong>${U.money(tr.price)}${tr.plus ? '+' : ''}</strong><span>${U.fx(tr.price)}</span></div>
      </div>
      <p class="tier-best drift d4"><b>${t(UI.bestFor)}:</b> ${esc(t(tr.best))}</p>
      <div class="tier-body">
        <p class="tier-label" id="inc-${key}">${t(UI.included)}</p>
        <ul class="inc" aria-labelledby="inc-${key}" id="incl-${key}">${tr.rows.map((r, i) => `<li class="${i > 2 ? 'extra' : ''}">${U.ICON.check}<div><b>${esc(t(r[0]))}</b><span>${esc(t(r[1]))}</span></div></li>`).join('')}</ul>
        ${n > 3 ? `<button type="button" class="more" data-expand="${key}" aria-expanded="${exp}" aria-controls="incl-${key}">${exp ? t(UI.showFewer) : t(UI.showAll, { n })}</button>` : ''}
        <dl class="facts"><div><dt>${t(UI.scope)}</dt><dd>${esc(t(tr.scope))}</dd></div><div><dt>${t(UI.turnaround)}</dt><dd>${esc(t(tr.turn))}</dd></div><div><dt>${t(UI.work)}</dt><dd>${esc(t(tr.work))}</dd></div></dl>
        <div class="addons"><p class="tier-label">${t(UI.addons)}</p><ul>${tr.addons.map(a => `<li class="${a.type === 'ref' ? 'addon-ref' : ''}"><span>${esc(t(a.label))}</span><b>${esc(addonPrice(a))}</b></li>`).join('')}</ul></div>
      </div>
      <div class="tier-foot">
        <p class="tier-foot-text">${tr.note ? esc(t(tr.note)) : ''}</p>
        <div class="tier-actions"><button type="button" class="btn btn-ghost" data-est="${key}">${t(UI.estimateThis)}</button><button type="button" class="btn btn-primary" data-enq="${key}">${t(UI.enquireThis)}</button></div>
      </div>
    </article>`;
  }

  function servicePanelHTML() {
    const s = SERVICES[S.svc];
    return `<div class="svc-intro"><h3>${esc(t(s.title))}</h3><p>${esc(t(s.lead))}</p></div>
      <div class="tiers">${s.tiers.map((_, i) => tierHTML(S.svc, i)).join('')}</div>
      <h3 class="subhead">${t(UI.howTitle)}</h3>
      <ol class="steps">${s.steps.map(st => `<li><div><b>${esc(t(st[0]))}</b><span>${esc(t(st[1]))}</span></div></li>`).join('')}</ol>
      <h3 class="subhead">${t(UI.termsTitle)}</h3>
      <div class="terms">${s.terms.map(g => `<details><summary>${esc(t(g[0]))}</summary><ul>${g[1].map(i => `<li>${esc(t(i))}</li>`).join('')}</ul></details>`).join('')}</div>`;
  }

  function servicesHTML() {
    return `<section class="section" id="services"><div class="wrap">
      <div class="section-head"><h2>${t(UI.servicesTitle)}</h2><p>${esc(t(UI.servicesLead))}</p><p class="price-validity">${esc(t(UI.priceValidity))}</p></div>
      <div class="tabs" role="tablist" aria-label="${t(UI.servicesTitle)}">${SERVICES.map((s, i) => `<button type="button" class="tab" role="tab" id="tab-${s.key}" aria-controls="panel-svc" aria-selected="${i === S.svc}" tabindex="${i === S.svc ? 0 : -1}" data-tab="${i}">${esc(t(s.tab))}</button>`).join('')}</div>
      <div id="panel-svc" role="tabpanel" aria-labelledby="tab-${SERVICES[S.svc].key}">${servicePanelHTML()}</div>
    </div></section>`;
  }

  function placesHTML() {
    return `<section class="section" id="places"><div class="wrap">
      <div class="section-head"><h2>${t(UI.placesTitle)}</h2><p>${esc(t(UI.placesLead))}</p></div>
      <div class="places-grid">${PLACES.map((_, i) => postcardHTML(i, { destination: true })).join('')}</div></div></section>`;
  }

  function estimateHTML() {
    return `<section class="section" id="estimate"><div class="wrap">
      <div class="section-head"><h2>${t(UI.estTitle)}</h2><p>${esc(t(UI.estLead))}</p></div>
      <div class="est-grid" id="calc-main"></div></div></section>`;
  }

  /* ---------- enquiry form ---------- */
  const errHTML = k => (F.errors[k] ? `<span class="err" id="err-${k}">${esc(F.errors[k])}</span>` : '');

  function fieldHTML(q) {
    const id = 'q-' + q.id, v = F.ans[q.id] || '', inv = F.errors[q.id] ? ` aria-invalid="true" aria-describedby="err-${q.id}"` : '';
    const label = `<label for="${id}">${esc(t(q.label))}${q.req ? '' : ` <small>(${t(UI.optional)})</small>`}</label>`;
    let ctl;
    if (q.type === 'select') ctl = `<select id="${id}" data-ans="${q.id}" ${q.req ? 'required' : ''}${inv}><option value="">${S.lang === 'es' ? 'Elige una opción' : 'Choose an option'}</option>${q.opts.map((o, i) => `<option value="${i}" ${String(v) === String(i) ? 'selected' : ''}>${esc(t(o))}</option>`).join('')}</select>`;
    else if (q.type === 'number') ctl = `<input type="number" inputmode="numeric" id="${id}" data-ans="${q.id}" min="${q.min}" max="${q.max}" value="${esc(v)}" ${q.req ? 'required' : ''}${inv}>`;
    else ctl = `<input type="text" id="${id}" data-ans="${q.id}" value="${esc(v)}" placeholder="${esc(t(q.ph))}" ${q.req ? 'required' : ''}${inv}>`;
    return `<div class="field">${label}${ctl}${errHTML(q.id)}</div>`;
  }

  function formStepHTML() {
    let body = '';
    if (F.step === 1) {
      body = `<fieldset><legend>${t(UI.q1)}</legend><div class="choices">${PLAN_CHOICES.map(c => `<div class="opt"><input type="radio" name="plan" id="pc-${c.id}" value="${c.id}" ${F.choice === c.id ? 'checked' : ''} ${F.errors.choice ? 'aria-describedby="err-choice"' : ''}><label for="pc-${c.id}">${esc(t(c.label))}<small>${esc(t(c.hint))}</small></label></div>`).join('')}</div>${F.errors.choice ? `<p class="choice-err" id="err-choice">${esc(F.errors.choice)}</p>` : ''}</fieldset>`;
    } else if (F.step === 2) {
      const c = PLAN_CHOICES.find(x => x.id === F.choice);
      body = `<fieldset><legend>${esc(t(c.label))}</legend>${QUESTIONS[F.choice].map(fieldHTML).join('')}</fieldset>`;
    } else {
      const inv = k => (F.errors[k] ? ` aria-invalid="true" aria-describedby="err-${k}"` : '');
      body = `<fieldset><legend>${t(UI.yourDetails)}</legend>
        ${F.estimate ? `<div class="attached"><div><b>${t(UI.estimateAttached)}</b><pre>${esc(F.estimate)}</pre></div><button type="button" data-detach>${t(UI.removeEstimate)}</button></div>` : ''}
        <div class="grid-2">
          <div class="field"><label for="f-name">${t(UI.name)}</label><input id="f-name" data-f="name" autocomplete="name" value="${esc(F.name)}" required${inv('name')}>${errHTML('name')}</div>
          <div class="field"><label for="f-email">${t(UI.email)}</label><input id="f-email" type="email" data-f="email" autocomplete="email" value="${esc(F.email)}" required${inv('email')}>${errHTML('email')}</div>
          <div class="field"><label for="f-phone">${t(UI.phone)} <small>(${t(UI.optional)})</small></label><input id="f-phone" type="tel" data-f="phone" autocomplete="tel" value="${esc(F.phone)}"></div>
          <div class="field"><label for="f-pref">${t(UI.lang)}</label><select id="f-pref" data-f="pref"><option value="en" ${(F.pref || S.lang) === 'en' ? 'selected' : ''}>English</option><option value="es" ${(F.pref || S.lang) === 'es' ? 'selected' : ''}>Español</option></select></div>
        </div>
        <div class="field"><label for="f-notes">${t(UI.notes)} <small>(${t(UI.optional)})</small></label><textarea id="f-notes" data-f="notes">${esc(F.notes)}</textarea></div>
        <div class="bound"><h3>${t(UI.boundTitle)}</h3><p>${esc(t(UI.boundText))}</p></div>
        <div class="check"><input type="checkbox" id="f-bound" data-c="bound" ${F.bound ? 'checked' : ''}${inv('bound')}><div><label for="f-bound">${t(UI.tickBound)}</label>${errHTML('bound')}</div></div>
        <div class="check"><input type="checkbox" id="f-privacy" data-c="privacy" ${F.privacy ? 'checked' : ''}${inv('privacy')}><div><label for="f-privacy">${t(UI.tickPrivacy)}</label> <button type="button" class="linkbtn" data-doc="privacy">${t(UI.privacyLink)}</button>.${errHTML('privacy')}</div></div>
      </fieldset><p class="status" id="send-status" role="status"></p>`;
    }
    const nav = F.step === 3
      ? `<div class="form-nav"><button type="button" class="btn btn-ghost" data-back>${t(UI.back)}</button><div class="right"><button type="button" class="btn btn-ghost" data-send="copy">${t(UI.copyMsg)}</button><button type="button" class="btn btn-ghost" data-send="email">${t(UI.sendEmail)}</button><button type="button" class="btn btn-wa" data-send="wa">${U.ICON.wa}${t(UI.sendWa)}</button></div></div>`
      : `<div class="form-nav">${F.step > 1 ? `<button type="button" class="btn btn-ghost" data-back>${t(UI.back)}</button>` : ''}<div class="right"><button type="button" class="btn btn-primary" data-next>${t(UI.continue)}</button></div></div>`;
    return `<div class="progress"><span>${t(UI.step, { n: F.step })}</span><span class="progress-bar" aria-hidden="true"><i style="width:${F.step * 33.4}%"></i></span></div>${body}${nav}`;
  }

  function enquiryHTML() {
    return `<section class="section" id="enquire"><div class="wrap">
      <div class="section-head"><h2>${t(UI.enqTitle)}</h2><p>${esc(t(UI.enqLead))}</p></div>
      <form class="enq" id="enq" novalidate>${formStepHTML()}</form></div></section>`;
  }

  function validate() {
    F.errors = {};
    if (F.step === 1 && !F.choice) F.errors.choice = t(UI.choosePlan);
    if (F.step === 2) QUESTIONS[F.choice].forEach(q => { if (q.req && (F.ans[q.id] === undefined || String(F.ans[q.id]).trim() === '')) F.errors[q.id] = t(UI.required); });
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

  function composeMessage() {
    const c = PLAN_CHOICES.find(x => x.id === F.choice), L = [];
    L.push(S.lang === 'es' ? 'Hola Maryann, te escribo desde tu web.' : 'Hi Maryann, I’m getting in touch from your website.', '');
    L.push((S.lang === 'es' ? 'Planeo: ' : 'Planning: ') + t(c.label));
    QUESTIONS[F.choice].forEach(q => {
      const v = F.ans[q.id]; if (v === undefined || String(v).trim() === '') return;
      L.push(`${t(q.label)}: ${q.type === 'select' ? t(q.opts[+v]) : String(v).trim()}`);
    });
    if (F.estimate) L.push('', t(UI.estimateAttached) + ':', F.estimate);
    L.push('', `${t(UI.name)}: ${F.name.trim()}`, `${t(UI.email)}: ${F.email.trim()}`);
    if (F.phone.trim()) L.push(`${t(UI.phone)}: ${F.phone.trim()}`);
    L.push(`${t(UI.lang)}: ${(F.pref || S.lang) === 'es' ? 'Español' : 'English'}`);
    if (F.notes.trim()) L.push('', F.notes.trim());
    return L.join('\n');
  }

  function openExternal(url) {
    const a = document.createElement('a');
    a.href = url; a.target = '_blank'; a.rel = 'noopener';
    document.body.appendChild(a); a.click(); a.remove();
  }

  async function copyText(txt) {
    try { await navigator.clipboard.writeText(txt); return true; } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      let ok = false; try { ok = document.execCommand('copy'); } catch (_) { /* ignore */ }
      ta.remove(); return ok;
    }
  }

  /* ---------- footer ---------- */
  function footerHTML() {
    const pl = t(UI.privacyLink);
    return `<footer class="site-footer"><div class="wrap"><div class="foot-grid">
      <div><a class="wordmark" href="#top">Maryann Eniola</a><p class="foot-langs">${t(UI.footLangs)}</p></div>
      <ul><li><a href="https://wa.me/${CONTACT.wa}" target="_blank" rel="noopener">WhatsApp ${CONTACT.waLabel}</a></li><li><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></li></ul>
      <ul><li><button type="button" class="linkbtn" data-doc="legal">${t(UI.legalLink)}</button></li><li><button type="button" class="linkbtn" data-doc="privacy">${pl.charAt(0).toUpperCase() + pl.slice(1)}</button></li></ul>
      </div>
      <div class="foot-fine"><p class="price-validity">${esc(t(UI.priceValidity))}</p><p>${esc(t(UI.fxNote))}</p></div></div></footer>
      <div class="mobile-bar"><a class="btn btn-wa" href="https://wa.me/${CONTACT.wa}" target="_blank" rel="noopener">${U.ICON.wa}${t(UI.whatsapp)}</a></div>`;
  }

  /* ---------- rendering ---------- */
  const app = document.getElementById('app');

  function renderAll() {
    document.documentElement.lang = S.lang;
    document.title = S.lang === 'es' ? 'Maryann Eniola · Viajes, bodas y búsqueda de espacios' : 'Maryann Eniola · Travel, weddings and venue sourcing';
    app.innerHTML = headerHTML() + '<main>' + heroHTML() + servicesHTML() + placesHTML() + estimateHTML() + enquiryHTML() + '</main>' + footerHTML();
    ME.Dialogs.mount(app);
    const prev = calc && calc.state;
    calc = new ME.EstimateCalculator($('#calc-main'), { onAttach: attachEstimate });
    if (prev) { calc.state = prev; calc.render(); }
    ME.Motion.bind($('[data-stack]'));
  }

  const rerender = {
    services() { $('#services').outerHTML = servicesHTML(); },
    form() { $('#enq').innerHTML = formStepHTML(); },
  };

  function preselectChoice(svc, tier) {
    const key = SERVICES[svc].key;
    if (key === 'events') F.choice = tier === 0 ? 'proposal' : 'event';
    else if (key === 'venues') { F.choice = 'venue'; F.ans.stage = String(tier); }
    else { F.choice = 'trip'; F.ans.help = String(tier); }
  }

  function goTo(id, focusSel) {
    const el = document.getElementById(id); if (!el) return;
    el.scrollIntoView({ behavior: U.reducedMotion() ? 'auto' : 'smooth', block: 'start' });
    setTimeout(() => { const f = focusSel ? $(focusSel) : null; if (f) f.focus({ preventScroll: true }); }, 500);
  }

  function attachEstimate(summary, est) {
    F.estimate = summary;
    preselectChoice(est.svc, est.tier);
    if (F.step === 1) F.step = 2;
    F.errors = {};
    rerender.form();
    setTimeout(() => goTo('enquire', '#enq select, #enq input'), 500);
  }

  /* ---------- events ---------- */
  app.addEventListener('click', async e => {
    const b = e.target.closest('button, a'); if (!b) return;
    const d = b.dataset;

    if (d.lang) {
      S.lang = d.lang;
      try { localStorage.setItem('me-lang', S.lang); } catch (err) { /* ignore */ }
      const y = window.scrollY; renderAll(); window.scrollTo(0, y);
      $(`[data-lang="${S.lang}"]`).focus(); return;
    }
    if (b.classList.contains('menu-btn')) {
      const nav = $('#mainnav'), isOpen = !nav.classList.contains('open');
      nav.classList.toggle('open', isOpen); b.setAttribute('aria-expanded', isOpen); return;
    }
    if (b.closest('#mainnav') && b.tagName === 'A') {
      $('#mainnav').classList.remove('open');
      const m = $('.menu-btn'); if (m) m.setAttribute('aria-expanded', 'false');
    }
    if (d.tab !== undefined) { S.svc = +d.tab; rerender.services(); $(`[data-tab="${S.svc}"]`).focus(); return; }
    if (d.expand) {
      S.expanded[d.expand] = !S.expanded[d.expand];
      const exp = S.expanded[d.expand], [sv, ti] = d.expand.split('-').map(Number);
      b.closest('.tier').classList.toggle('expanded', exp);
      b.setAttribute('aria-expanded', exp);
      b.textContent = exp ? t(UI.showFewer) : t(UI.showAll, { n: SERVICES[sv].tiers[ti].rows.length });
      return;
    }
    if (d.est) { const [sv, ti] = d.est.split('-').map(Number); calc.select(sv, ti); goTo('estimate', `#calc-main [data-tier][value="${ti}"]`); return; }
    if (d.enq) { const [sv, ti] = d.enq.split('-').map(Number); preselectChoice(sv, ti); F.step = 2; F.errors = {}; rerender.form(); goTo('enquire', '#enq input, #enq select'); return; }
    if (d.place !== undefined) { ME.Dialogs.openLightbox(+d.place); return; }
    if (d.lbgo !== undefined) { ME.Dialogs.goTo(+d.lbgo); return; }
    if (d.planlike !== undefined) {
      const p = PLACES[+d.planlike];
      ME.Dialogs.close();
      F.choice = p.choice; F.ans.dest = t(p.name); F.step = 2; F.errors = {};
      rerender.form(); goTo('enquire', '#enq select, #enq input'); return;
    }
    if (d.close !== undefined) { ME.Dialogs.close(); return; }
    if (d.doc) { ME.Dialogs.openDoc(d.doc); return; }
    if (d.detach !== undefined) { F.estimate = null; rerender.form(); return; }
    if (d.next !== undefined) {
      if (!validate()) { rerender.form(); focusFirstError(); return; }
      F.step++; rerender.form();
      const lg = $('#enq legend'); if (lg) { lg.tabIndex = -1; lg.focus({ preventScroll: true }); }
      goTo('enquire'); return;
    }
    if (d.back !== undefined) {
      F.errors = {}; F.step--; rerender.form();
      const lg = $('#enq legend'); if (lg) { lg.tabIndex = -1; lg.focus(); } return;
    }
    if (d.send) {
      if (!validate()) { rerender.form(); focusFirstError(); return; }
      const msg = composeMessage(), st = $('#send-status');
      if (d.send === 'copy') { const ok = await copyText(msg); st.textContent = ok ? t(UI.copied) : msg; return; }
      if (d.send === 'wa') openExternal(`https://wa.me/${CONTACT.wa}?text=${encodeURIComponent(msg)}`);
      if (d.send === 'email') openExternal(`mailto:${CONTACT.email}?subject=${encodeURIComponent((S.lang === 'es' ? 'Consulta: ' : 'Enquiry: ') + t(PLAN_CHOICES.find(x => x.id === F.choice).label))}&body=${encodeURIComponent(msg)}`);
      st.textContent = t(UI.opened, { wa: CONTACT.waLabel, email: CONTACT.email });
    }
  });

  app.addEventListener('change', e => {
    const el = e.target;
    if (!el.closest('#enq')) return;
    if (el.name === 'plan') { if (F.choice !== el.value) F.ans = {}; F.choice = el.value; delete F.errors.choice; return; }
    if (el.dataset.c) { F[el.dataset.c] = el.checked; return; }
    if (el.dataset.ans) { F.ans[el.dataset.ans] = el.value; return; }
    if (el.dataset.f) F[el.dataset.f] = el.value;
  });
  app.addEventListener('input', e => {
    const el = e.target;
    if (el.dataset.ans) F.ans[el.dataset.ans] = el.value;
    else if (el.dataset.f) F[el.dataset.f] = el.value;
  });
  app.addEventListener('submit', e => e.preventDefault());

  document.addEventListener('keydown', e => {
    if (ME.Dialogs.isOpen()) return;
    const tab = e.target.closest && e.target.closest('[role="tab"]');
    if (tab && ['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) {
      e.preventDefault();
      const n = SERVICES.length;
      S.svc = e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : (S.svc + (e.key === 'ArrowRight' ? 1 : n - 1)) % n;
      rerender.services(); $(`[data-tab="${S.svc}"]`).focus();
    }
  });

  renderAll();
})();
