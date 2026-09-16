/* Dialogs: the destination lightbox and the legal/privacy notices.
   Opening sequence (motion allowed): glass backdrop fades in, media rises 15px and fades in,
   the location tag follows 150ms later and the detail line 300ms later (see css/motion.css).
   Closing plays a short fade before the dialog is hidden, so the overlay never blocks clicks while invisible. */
(function () {
  const ME = window.ME;
  let lastFocus = null, open = null, closeTimer = null;

  function shell() {
    return `<div class="dlg lightbox" id="lb" role="dialog" aria-modal="true" aria-labelledby="lb-title" hidden><div class="dlg-box" id="lb-box"></div></div>
      <div class="dlg doc" id="doc" role="dialog" aria-modal="true" aria-labelledby="doc-title" hidden><div class="dlg-box" id="doc-box"></div></div>`;
  }

  function lightboxHTML(i) {
    const { t, esc, ICON, wideMedia, thumbMedia } = ME.utils, UI = ME.UI, p = ME.PLACES[i];
    const illus = ME.ASSETS.mode === 'files' ? '' : `<p class="lb-ill">${t(UI.illustration)}</p>`;
    return `<button type="button" class="dlg-close" data-close aria-label="${t(UI.close)}">${ICON.close}</button>
      <div class="lb-media stagger s0">${wideMedia(p)}</div>
      <div class="lb-meta">
        <p class="lb-tag stagger s1">${ICON.pin}<span>${esc(t(p.name))}</span></p>
        <h2 id="lb-title" class="stagger s1">${esc(t(p.caption))}</h2>
        <p class="lb-detail stagger s2"><strong>${esc(t(p.step))}.</strong> ${esc(t(p.detail))}</p>${illus}
      </div>
      <div class="lb-thumbs stagger s3">${ME.PLACES.map((q, n) => `<button type="button" data-lbgo="${n}" aria-label="${esc(t(q.name))}" ${n === i ? 'aria-current="true"' : ''}>${thumbMedia(q)}</button>`).join('')}
        <button type="button" class="btn btn-primary" data-planlike="${i}">${t(UI.planThis)}</button></div>`;
  }

  function show(el) {
    clearTimeout(closeTimer);
    lastFocus = document.activeElement;
    el.classList.remove('is-closing');
    el.hidden = false;
    open = el;
    document.documentElement.classList.add('dlg-open');
    const f = el.querySelector('[data-close]'); if (f) f.focus({ preventScroll: true });
  }

  function hide() {
    if (!open) return;
    const el = open; open = null;
    const done = () => {
      el.hidden = true; el.classList.remove('is-closing');
      el.querySelectorAll('video').forEach(v => v.pause());
      document.documentElement.classList.remove('dlg-open');
      if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
    };
    if (ME.utils.reducedMotion()) return done();
    el.classList.add('is-closing');
    closeTimer = setTimeout(done, 360);
  }

  const Dialogs = {
    index: 0,
    mount(container) { container.insertAdjacentHTML('beforeend', shell()); },
    openLightbox(i) {
      this.index = i;
      document.getElementById('lb-box').innerHTML = lightboxHTML(i);
      show(document.getElementById('lb'));
    },
    goTo(i) {
      this.index = (i + ME.PLACES.length) % ME.PLACES.length;
      document.getElementById('lb-box').innerHTML = lightboxHTML(this.index);
      const b = document.querySelector(`[data-lbgo="${this.index}"]`); if (b) b.focus({ preventScroll: true });
    },
    openDoc(key) {
      const { t, ICON } = ME.utils;
      document.getElementById('doc-box').innerHTML = `<button type="button" class="dlg-close" data-close aria-label="${t(ME.UI.close)}">${ICON.close}</button><h2 id="doc-title">${t(ME.LEGAL[key].title)}</h2>${t(ME.LEGAL[key].body)}`;
      show(document.getElementById('doc'));
    },
    close: hide,
    isOpen: () => !!open,
    current: () => open,
  };

  document.addEventListener('keydown', e => {
    if (!open) return;
    if (e.key === 'Escape') { hide(); return; }
    if (e.key === 'Tab') {
      const f = [...open.querySelectorAll('button, a[href], input, select, textarea')].filter(x => !x.disabled);
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
    if (open.id === 'lb' && (e.key === 'ArrowRight' || e.key === 'ArrowLeft')) Dialogs.goTo(Dialogs.index + (e.key === 'ArrowRight' ? 1 : -1));
  });
  document.addEventListener('mousedown', e => { if (open && e.target === open) hide(); });

  ME.Dialogs = Dialogs;
})();
