/* Shared helpers: translation, money, icons and destination media. */
(function () {
  const ME = (window.ME = window.ME || {});
  ME.state = ME.state || { lang: 'en' };
  // 'files' uses the images and videos in /assets. 'inline' (single-file build) draws the SVG illustrations instead.
  ME.ASSETS = Object.assign({ mode: 'files', base: 'assets/' }, window.ME_ASSETS || {});

  const t = (o, vars) => {
    let s = (o && (o[ME.state.lang] || o.en)) || '';
    if (vars) for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
    return s;
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const round5 = n => Math.round(n / 5) * 5;
  const money = (n, cur = 'EUR') => new Intl.NumberFormat(ME.state.lang === 'es' ? 'es-ES' : 'en-GB', { style: 'currency', currency: cur, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 }).format(n);
  const fx = n => `${money(round5(n * 0.86), 'GBP')} · ${money(round5(n * 1.09), 'USD')}`;
  const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const ICON = {
    check: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    close: '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
    pin: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 15s5-4.6 5-8.5A5 5 0 003 6.5C3 10.4 8 15 8 15z" fill="currentColor"/><circle cx="8" cy="6.5" r="1.8" fill="#FFFEF9"/></svg>',
    wa: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1c-.2.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.3-.4.8-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.7.3s-.9.9-.9 2.2.9 2.5 1 2.7c.1.2 1.8 2.8 4.4 3.9 1.6.7 2.3.8 3.1.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2c-.1-.1-.3-.2-.5-.3z"/></svg>',
    menu: '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true"><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  };

  /* Postcard image (16:11). */
  function cardMedia(place, eager) {
    if (ME.ASSETS.mode !== 'files') return ME.scene(place.scene);
    const b = `${ME.ASSETS.base}images/places/${place.id}`;
    return `<img src="${b}-card-640.webp" srcset="${b}-card-640.webp 640w, ${b}-card-1280.webp 1280w" sizes="(min-width: 960px) 280px, 45vw" width="640" height="440" alt="" decoding="async" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
  }
  /* Lightbox media (16:9): looping video when motion is allowed, still image otherwise. */
  function wideMedia(place) {
    if (ME.ASSETS.mode !== 'files') return ME.scene(place.scene);
    const b = `${ME.ASSETS.base}`;
    const poster = `${b}images/places/${place.id}-wide-1280.webp`;
    if (reducedMotion()) return `<img src="${poster}" width="1280" height="720" alt="">`;
    return `<video autoplay muted loop playsinline preload="metadata" poster="${poster}" width="1280" height="720" aria-hidden="true"><source src="${b}video/${place.id}.webm" type="video/webm"><source src="${b}video/${place.id}.mp4" type="video/mp4"></video>`;
  }
  function thumbMedia(place) {
    if (ME.ASSETS.mode !== 'files') return ME.scene(place.scene);
    return `<img src="${ME.ASSETS.base}images/places/${place.id}-card-640.webp" width="640" height="440" alt="" loading="lazy">`;
  }

  ME.utils = { t, esc, round5, money, fx, ICON, reducedMotion, cardMedia, wideMedia, thumbMedia };
})();
