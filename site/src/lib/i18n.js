/* Translation and formatting helpers shared by pages (build time) and scripts (browser). */

export const t = (o, lang, vars) => {
  let s = (o && (o[lang] ?? o.en)) ?? '';
  if (vars && typeof s === 'string') for (const k in vars) s = s.split('{' + k + '}').join(vars[k]);
  return s;
};

export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export const round5 = n => Math.round(n / 5) * 5;

export const money = (n, lang, cur = 'EUR') =>
  new Intl.NumberFormat(lang === 'es' ? 'es-ES' : 'en-GB', { style: 'currency', currency: cur, currencyDisplay: 'narrowSymbol', maximumFractionDigits: 0 }).format(n);

export const fx = (n, lang) => `${money(round5(n * 0.86), lang, 'GBP')} · ${money(round5(n * 1.09), lang, 'USD')}`;

/* English lives at the root, Spanish under /es/. */
export const href = (lang, slug = '') => {
  const clean = slug.replace(/^\/+|\/+$/g, '');
  const base = lang === 'es' ? '/es/' : '/';
  return clean ? `${base}${clean}/` : base;
};

/* Static paths for every page that exists in both languages. */
export const langPaths = () => [{ params: { lang: undefined }, props: { lang: 'en' } }, { params: { lang: 'es' }, props: { lang: 'es' } }];

export const pageLang = () => (typeof document !== 'undefined' && document.documentElement.lang === 'es' ? 'es' : 'en');
