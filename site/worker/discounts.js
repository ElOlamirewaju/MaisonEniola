/* Discount codes for Maryann's planning fee (never supplier costs: flights, stays, venues).
   KV key code:<CODE> → { code, percent, expires (YYYY-MM-DD, inclusive, Madrid), maxUses, uses, active, note, createdAt }.
   POST /api/discount { code } checks a code for the estimate and enquiry forms (rate-limited per IP).
   A code counts as used each time an enquiry is sent through the site with it. Payment happens on Maryann's
   invoice, outside the site, so the code is honoured there; the enquiry email tells her it was valid. */
import { json, str, getJSON, putJSON, listJSON, ymdIn } from './lib.js';

export const normCode = c => String(c ?? '').toUpperCase().replace(/\s+/g, '').slice(0, 24);
export const CODE_RE = /^[A-Z0-9-]{3,24}$/;

export async function lookup(env, raw) {
  const code = normCode(raw);
  if (!CODE_RE.test(code)) return { ok: false, code, error: 'invalid' };
  const d = await getJSON(env, `code:${code}`);
  if (!d || !d.active) return { ok: false, code, error: 'invalid' };
  if (d.expires && ymdIn(new Date()) > d.expires) return { ok: false, code, error: 'expired' };
  if (d.maxUses && (d.uses || 0) >= d.maxUses) return { ok: false, code, error: 'used' };
  return { ok: true, code, percent: d.percent, d };
}

export async function checkCode(request, env) {
  const ip = request.headers.get('CF-Connecting-IP') || 'local', rl = `rl:code:${ip}`;
  const tries = parseInt((await env.REVIEWS.get(rl)) || '0', 10);
  if (tries >= 15) return json({ ok: false, error: 'rate' }, 429);
  await env.REVIEWS.put(rl, String(tries + 1), { expirationTtl: 3600 });
  let d; try { d = await request.json(); } catch (e) { return json({ ok: false, error: 'body' }, 400); }
  const r = await lookup(env, d.code);
  return json(r.ok ? { ok: true, code: r.code, percent: r.percent } : { ok: false, error: r.error });
}

export async function redeem(env, code) {
  const key = `code:${code}`, d = await getJSON(env, key);
  if (!d) return;
  d.uses = (d.uses || 0) + 1; d.lastUsedAt = new Date().toISOString();
  await putJSON(env, key, d);
}

export const listCodes = async env => (await listJSON(env, 'code:')).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

export function codeStatus(d) {
  if (!d.active) return 'paused';
  if (d.expires && ymdIn(new Date()) > d.expires) return 'expired';
  if (d.maxUses && (d.uses || 0) >= d.maxUses) return 'used up';
  return 'active';
}

/* Admin actions. Returns a flash message. */
export async function adminCodeAction(env, f, action) {
  if (action === 'code-create') {
    const code = normCode(f.get('code')), percent = parseInt(f.get('percent'), 10);
    const expires = str(f.get('expires'), 10), maxUses = parseInt(f.get('maxUses'), 10) || 0, note = str(f.get('note'), 120);
    if (!CODE_RE.test(code)) return 'Codes are 3 to 24 letters, numbers or dashes, for example SUMMER50.';
    if (!(percent >= 1 && percent <= 100)) return 'The discount must be between 1% and 100%.';
    if (expires && !/^\d{4}-\d\d-\d\d$/.test(expires)) return 'The expiry date was not understood.';
    if (await getJSON(env, `code:${code}`)) return `${code} already exists.`;
    await putJSON(env, `code:${code}`, { code, percent, expires, maxUses, uses: 0, active: true, note, createdAt: new Date().toISOString() });
    return `${code} created: ${percent}% off the planning fee.`;
  }
  const key = `code:${normCode(f.get('code'))}`, d = await getJSON(env, key);
  if (!d) return 'That code no longer exists.';
  if (action === 'code-toggle') { d.active = !d.active; await putJSON(env, key, d); return `${d.code} ${d.active ? 'resumed' : 'paused'}.`; }
  if (action === 'code-delete') { await env.REVIEWS.delete(key); return `${d.code} deleted.`; }
  return '';
}
