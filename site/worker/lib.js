/* Shared helpers for the Worker: responses, escaping, signing, email, KV, time zones. */
export const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra } });
export const html = (body, status = 200, extra = {}) => new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex', ...extra } });
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
export const pre = text => `<pre style="font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;white-space:pre-wrap;color:#03131F">${esc(text)}</pre>`;
export const str = (v, max) => String(v ?? '').replace(/\r/g, '').trim().slice(0, max);
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const TZ = 'Europe/Madrid';

/* HMAC-SHA256 hex over a string, keyed with REVIEW_SECRET (the one secret on the Worker). */
export async function sign(env, data) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.REVIEW_SECRET || ''), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}
export async function verify(env, data, t) {
  if (!env.REVIEW_SECRET || !/^[0-9a-f]{64}$/.test(t || '')) return false;
  const want = await sign(env, data);
  let diff = 0; for (let i = 0; i < 64; i++) diff |= want.charCodeAt(i) ^ t.charCodeAt(i);
  return diff === 0;
}
/* A link that carries an action, an id and an expiry, signed. */
export async function signedLink(env, path, params, ttlSeconds = 60 * 60 * 24 * 30) {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const p = new URLSearchParams({ ...params, exp: String(exp) });
  p.set('t', await sign(env, [...p.entries()].filter(([k]) => k !== 't').map(([k, v]) => `${k}=${v}`).sort().join('&')));
  return `${env.SITE_URL}${path}?${p.toString()}`;
}
export async function checkSigned(env, url) {
  const p = url.searchParams, t = p.get('t') || '';
  const data = [...p.entries()].filter(([k]) => k !== 't').map(([k, v]) => `${k}=${v}`).sort().join('&');
  if (!(await verify(env, data, t))) return false;
  const exp = parseInt(p.get('exp') || '0', 10);
  return exp > Math.floor(Date.now() / 1000);
}

/* Email goes out through Resend (https://resend.com). RESEND_API_KEY is a Worker secret; "dev" in .dev.vars only logs. */
const b64 = s => { const bytes = new TextEncoder().encode(s); let bin = ''; bytes.forEach(b => { bin += String.fromCharCode(b); }); return btoa(bin); };
export async function send(env, { to, subject, text, replyTo, attachments }) {
  if (!env.RESEND_API_KEY) throw new Error('RESEND_API_KEY is not set');
  const body = {
    from: `Maison Eniola <${env.ENQUIRY_FROM}>`, to: Array.isArray(to) ? to : [to], subject, text, html: pre(text),
    ...(replyTo ? { reply_to: replyTo } : {}),
    ...(attachments?.length ? { attachments: attachments.map(a => ({ filename: a.filename, content: b64(a.content), content_type: a.type })) } : {}),
  };
  if (env.RESEND_API_KEY === 'dev') { console.log('EMAIL (dev, not sent):', JSON.stringify({ to: body.to, subject })); return { id: 'dev' }; }
  const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error(`Resend ${r.status}: ${(await r.text()).slice(0, 200)}`);
  return r.json();
}
export const notify = (env, subject, text) => send(env, { to: env.ENQUIRY_TO, subject, text });

export const getJSON = (env, key) => env.REVIEWS.get(key, 'json');
export const putJSON = (env, key, value, opts) => env.REVIEWS.put(key, JSON.stringify(value), opts);
export async function listJSON(env, prefix) {
  const out = []; let cursor;
  do {
    const l = await env.REVIEWS.list({ prefix, cursor });
    for (const k of l.keys) { const v = await env.REVIEWS.get(k.name, 'json'); if (v) out.push(v); }
    cursor = l.list_complete ? undefined : l.cursor;
  } while (cursor && out.length < 500);
  return out;
}

/* ---- settings (editable in /admin) ---- */
export const DEFAULT_SETTINGS = {
  nextStart: '',                                   // free text shown on service pages, e.g. "3 November"
  hours: { days: [1, 2, 3, 4, 5], from: '09:00', to: '18:00' },  // Europe/Madrid, for WhatsApp note and call slots
  blocked: [],                                     // dates YYYY-MM-DD with no calls
  slotMinutes: 60,
  leadHours: 24,                                   // earliest bookable call is this far ahead
  horizonDays: 14,
  googleReviewUrl: '',
};
export async function settings(env) { return { ...DEFAULT_SETTINGS, ...((await getJSON(env, 'settings')) || {}) }; }

/* ---- time zones (no libraries): Europe/Madrid wall time ↔ UTC ---- */
function tzParts(date, tz) {
  const f = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', weekday: 'short' });
  const o = {}; f.formatToParts(date).forEach(p => { o[p.type] = p.value; });
  return { y: +o.year, m: +o.month, d: +o.day, h: +o.hour, min: +o.minute, wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday) };
}
export function zonedToUtc(ymd, hm, tz = TZ) {
  const [y, m, d] = ymd.split('-').map(Number), [h, min] = hm.split(':').map(Number);
  const target = Date.UTC(y, m - 1, d, h, min); // the wall-clock time, read as if it were UTC
  let guess = target;
  for (let i = 0; i < 3; i++) {
    const p = tzParts(new Date(guess), tz);
    const diff = Date.UTC(p.y, p.m - 1, p.d, p.h, p.min) - target; // how far the wall clock at `guess` is from the wanted wall clock
    if (!diff) break; guess -= diff;
  }
  return new Date(guess);
}
export function fmtZoned(date, tz = TZ, lang = 'en') {
  return new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-GB', { timeZone: tz, weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date);
}
export const ymdIn = (date, tz = TZ) => { const p = tzParts(date, tz); return `${p.y}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`; };
export const weekdayIn = (date, tz = TZ) => tzParts(date, tz).wd;
export const icsDate = d => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
