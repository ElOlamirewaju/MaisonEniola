/* Worker for maisoneniola.bid. Only /api/* reaches this script; everything else is the static build (assets binding).

   POST /api/enquiry            relays the enquiry form to Maryann by email and sends the visitor a copy (nothing stored).
   POST /api/reviews            stores a review as "pending" in KV and emails Maryann an approve/decline link.
   GET  /api/reviews            lists approved reviews (public, cached 5 minutes).
   GET  /api/reviews/moderate   the approve/decline page behind the emailed link (signed with REVIEW_SECRET).
   POST /api/reviews/moderate   approves (moves pending → approved) or declines (deletes).

   KV keys: pending:<id> and approved:<id> hold JSON; rl:<ip> is an hourly submission counter.
   `website` is a honeypot field on both forms that humans never see. */

const ALLOWED_ORIGINS = ['https://maisoneniola.bid', 'https://www.maisoneniola.bid'];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SERVICES = ['weddings', 'venues', 'travel'];
const DISPLAYS = ['first', 'full', 'anon'];

const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra } });
const page = (body, status = 200) => new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' } });
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pre = text => `<pre style="font:15px/1.5 -apple-system,Segoe UI,Roboto,sans-serif;white-space:pre-wrap;color:#03131F">${esc(text)}</pre>`;
const str = (v, max) => String(v ?? '').replace(/\r/g, '').trim().slice(0, max);

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const localDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const originOk = () => localDev || ALLOWED_ORIGINS.includes(request.headers.get('Origin') || '');

    if (url.pathname === '/api/enquiry') {
      if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
      if (!originOk()) return json({ ok: false, error: 'origin' }, 403);
      return enquiry(request, env);
    }
    if (url.pathname === '/api/reviews') {
      if (request.method === 'GET') return listReviews(env);
      if (request.method !== 'POST') return json({ ok: false, error: 'method' }, 405);
      if (!originOk()) return json({ ok: false, error: 'origin' }, 403);
      return submitReview(request, env, url);
    }
    if (url.pathname === '/api/reviews/moderate') return moderate(request, env, url);
    return env.ASSETS ? env.ASSETS.fetch(request) : json({ ok: false, error: 'not-found' }, 404);
  },
};

/* ---------- enquiry ---------- */
async function enquiry(request, env) {
  let d;
  try { d = await request.json(); } catch (e) { return json({ ok: false, error: 'body' }, 400); }
  if (str(d.website, 50)) return json({ ok: true }); // honeypot filled in: a bot; pretend it worked

  const name = str(d.name, 120), email = str(d.email, 200), phone = str(d.phone, 60);
  const lang = d.lang === 'es' ? 'es' : 'en';
  const subject = str(d.subject, 160) || (lang === 'es' ? 'Consulta desde la web' : 'Enquiry from the website');
  const message = str(d.message, 8000);
  if (!name || !EMAIL_RE.test(email) || message.length < 20) return json({ ok: false, error: 'fields' }, 400);

  const from = { email: env.ENQUIRY_FROM, name: 'Maison Eniola website' };
  const footer = lang === 'es'
    ? `\n\n—\nEnviado desde maisoneniola.bid. Responde a ${email}${phone ? ` · WhatsApp ${phone}` : ''}.`
    : `\n\n—\nSent from maisoneniola.bid. Reply to ${email}${phone ? ` · WhatsApp ${phone}` : ''}.`;
  try {
    await env.EMAIL.send({ to: env.ENQUIRY_TO, from, replyTo: email, subject: `[Enquiry] ${subject}`, text: message + footer, html: pre(message + footer) });
  } catch (e) {
    console.error('enquiry send failed', e && e.message);
    return json({ ok: false, error: 'send' }, 502);
  }
  const copyIntro = lang === 'es'
    ? `Hola ${name},\n\nGracias por tu consulta. Aquí tienes una copia de lo que me has enviado. Te respondo personalmente lo antes posible.\n\nMaryann\nMaison Eniola\n\n——————————\n\n`
    : `Hi ${name},\n\nThank you for your enquiry. Here is a copy of what you sent me. I reply personally, as soon as I can.\n\nMaryann\nMaison Eniola\n\n——————————\n\n`;
  try {
    await env.EMAIL.send({ to: email, from, replyTo: env.ENQUIRY_TO, subject: lang === 'es' ? 'Tu consulta a Maison Eniola' : 'Your enquiry to Maison Eniola', text: copyIntro + message, html: pre(copyIntro + message) });
  } catch (e) { console.error('copy send failed', e && e.message); }
  return json({ ok: true });
}

/* ---------- reviews ---------- */
async function hmac(env, id) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(env.REVIEW_SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(id));
  return [...new Uint8Array(sig)].map(b => b.toString(16).padStart(2, '0')).join('');
}
async function tokenOk(env, id, t) {
  if (!env.REVIEW_SECRET || !/^[0-9a-f-]{36}$/.test(id || '') || !/^[0-9a-f]{64}$/.test(t || '')) return false;
  const want = await hmac(env, id);
  let diff = 0; for (let i = 0; i < 64; i++) diff |= want.charCodeAt(i) ^ t.charCodeAt(i);
  return diff === 0;
}
const displayName = r => {
  if (r.display === 'anon') return '';
  if (r.display === 'full') return r.name;
  const parts = r.name.split(/\s+/);
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.` : parts[0];
};
const publicView = r => ({ id: r.id, name: r.publicName, service: r.service, trip: r.trip, rating: r.rating, text: r.text, lang: r.lang, date: (r.approvedAt || r.createdAt).slice(0, 7) });

async function submitReview(request, env, url) {
  let d;
  try { d = await request.json(); } catch (e) { return json({ ok: false, error: 'body' }, 400); }
  if (str(d.website, 50)) return json({ ok: true });

  const ip = request.headers.get('CF-Connecting-IP') || 'local';
  const rlKey = `rl:${ip}`;
  const count = parseInt((await env.REVIEWS.get(rlKey)) || '0', 10);
  if (count >= 3) return json({ ok: false, error: 'rate' }, 429);

  const r = {
    id: crypto.randomUUID(),
    name: str(d.name, 80),
    email: str(d.email, 200),
    display: DISPLAYS.includes(d.display) ? d.display : 'first',
    service: SERVICES.includes(d.service) ? d.service : '',
    trip: str(d.trip, 90),
    rating: Math.min(5, Math.max(1, parseInt(d.rating, 10) || 0)),
    text: str(d.text, 1500),
    lang: d.lang === 'es' ? 'es' : 'en',
    consent: d.consent === true,
    createdAt: new Date().toISOString(),
  };
  if (!r.name || !r.service || !r.trip || !parseInt(d.rating, 10) || r.text.length < 40 || !r.consent) return json({ ok: false, error: 'fields' }, 400);
  if (r.email && !EMAIL_RE.test(r.email)) return json({ ok: false, error: 'fields' }, 400);
  if (!env.REVIEW_SECRET) return json({ ok: false, error: 'config' }, 500);
  r.publicName = displayName(r);

  await env.REVIEWS.put(`pending:${r.id}`, JSON.stringify(r), { expirationTtl: 60 * 60 * 24 * 90 });
  await env.REVIEWS.put(rlKey, String(count + 1), { expirationTtl: 3600 });

  const site = env.SITE_URL || url.origin;
  const link = `${site}/api/reviews/moderate?id=${r.id}&t=${await hmac(env, r.id)}`;
  const body = `New review waiting for your approval.\n\nFrom: ${r.name}${r.email ? ` <${r.email}>` : ''}\nShown as: ${r.publicName || 'Anonymous'}\nService: ${r.service} · ${r.trip}\nRating: ${r.rating}/5 · Language: ${r.lang}\n\n${r.text}\n\nApprove or decline here (the link is private to you):\n${link}\n\nNothing is published until you approve it. Unapproved reviews are deleted after 90 days.`;
  const from = { email: env.ENQUIRY_FROM, name: 'Maison Eniola website' };
  try {
    await env.EMAIL.send({ to: env.ENQUIRY_TO, from, replyTo: r.email || undefined, subject: `[Review] ${r.publicName || 'Anonymous'} · ${r.rating}/5`, text: body, html: pre(body) });
  } catch (e) {
    console.error('review email failed', e && e.message);
    await env.REVIEWS.delete(`pending:${r.id}`);
    return json({ ok: false, error: 'send' }, 502);
  }
  if (r.email) {
    const copy = r.lang === 'es'
      ? `Hola ${r.name},\n\nGracias por tu opinión. Me llega a mí primero; cuando la haya comprobado, aparecerá en maisoneniola.bid/es/reviews/. Si quieres retirarla o cambiarla, responde a este correo.\n\nMaryann\nMaison Eniola\n\n——————————\n\n${r.text}`
      : `Hi ${r.name},\n\nThank you for your review. It comes to me first; once I have checked it, it will appear on maisoneniola.bid/reviews/. If you ever want it removed or changed, reply to this email.\n\nMaryann\nMaison Eniola\n\n——————————\n\n${r.text}`;
    try { await env.EMAIL.send({ to: r.email, from, replyTo: env.ENQUIRY_TO, subject: r.lang === 'es' ? 'Tu opinión para Maison Eniola' : 'Your review for Maison Eniola', text: copy, html: pre(copy) }); } catch (e) { /* best effort */ }
  }
  return json({ ok: true });
}

async function listReviews(env) {
  const out = [];
  let cursor;
  do {
    const l = await env.REVIEWS.list({ prefix: 'approved:', cursor });
    for (const k of l.keys) { const v = await env.REVIEWS.get(k.name, 'json'); if (v) out.push(publicView(v)); }
    cursor = l.list_complete ? undefined : l.cursor;
  } while (cursor && out.length < 200);
  out.sort((a, b) => (a.date < b.date ? 1 : -1));
  return json({ ok: true, reviews: out.slice(0, 50) }, 200, { 'cache-control': 'public, max-age=300' });
}

const STARS = n => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
function moderatePage(title, inner) {
  return page(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · Maison Eniola</title>
<style>body{margin:0;background:#03131F;color:#F6F1E4;font:16px/1.55 -apple-system,"Segoe UI",Roboto,sans-serif}main{max-width:640px;margin:0 auto;padding:3rem 1.2rem}h1{font-weight:500;font-size:1.5rem;margin:0 0 1rem}.card{background:#062437;border:1px solid rgba(246,241,228,.16);border-radius:14px;padding:1.4rem;margin:1.2rem 0}blockquote{margin:0 0 1rem;font-size:1.1rem}small{color:rgba(246,241,228,.6)}form{display:inline-block;margin:.4rem .6rem 0 0}button{font:inherit;font-weight:600;padding:.75rem 1.3rem;border-radius:999px;border:0;cursor:pointer}.ok{background:#E75B24;color:#FFFDF4}.no{background:transparent;color:#F6F1E4;border:1px solid rgba(246,241,228,.35)}.stars{color:#F2B84B;letter-spacing:.1em}</style></head><body><main>${inner}</main></body></html>`);
}
async function moderate(request, env, url) {
  let id = url.searchParams.get('id') || '', t = url.searchParams.get('t') || '';
  let action = '';
  if (request.method === 'POST') {
    const f = await request.formData();
    action = String(f.get('action') || '');
    id = String(f.get('id') || id); t = String(f.get('t') || t);
    if (!(await tokenOk(env, id, t))) return moderatePage('Not allowed', '<h1>This link is not valid.</h1>');
  } else if (!(await tokenOk(env, id, t))) return moderatePage('Not allowed', '<h1>This link is not valid.</h1><p><small>Only the link from the notification email works, and only for Maryann.</small></p>');

  const pendingKey = `pending:${id}`, approvedKey = `approved:${id}`;
  const pending = await env.REVIEWS.get(pendingKey, 'json');
  const approved = await env.REVIEWS.get(approvedKey, 'json');

  if (request.method === 'POST') {
    if (action === 'approve' && pending) {
      const a = { ...pending, approvedAt: new Date().toISOString() };
      await env.REVIEWS.put(approvedKey, JSON.stringify(a));
      await env.REVIEWS.delete(pendingKey);
      return moderatePage('Published', `<h1>Published.</h1><p>The review by <b>${esc(a.publicName || 'Anonymous')}</b> is now live on the reviews page. It can take up to five minutes to appear.</p><p><small>To remove it later, open this same link and choose Remove.</small></p>`);
    }
    if (action === 'decline' && pending) { await env.REVIEWS.delete(pendingKey); return moderatePage('Declined', '<h1>Declined and deleted.</h1>'); }
    if (action === 'remove' && approved) { await env.REVIEWS.delete(approvedKey); return moderatePage('Removed', '<h1>Removed from the site.</h1><p><small>It can take up to five minutes to disappear.</small></p>'); }
    return moderatePage('Nothing to do', '<h1>Nothing to do.</h1><p>This review has already been handled.</p>');
  }

  const r = pending || approved;
  if (!r) return moderatePage('Not found', '<h1>This review is no longer here.</h1><p>It was declined, removed, or expired unapproved after 90 days.</p>');
  const card = `<div class="card"><div class="stars" aria-label="${r.rating} out of 5">${STARS(r.rating)}</div><blockquote>${esc(r.text)}</blockquote><small><b>${esc(r.name)}</b>${r.email ? ` · ${esc(r.email)}` : ''}<br>Shown as: ${esc(r.publicName || 'Anonymous')} · ${esc(r.service)} · ${esc(r.trip)} · ${r.lang}<br>Sent ${esc(r.createdAt.slice(0, 16).replace('T', ' '))}</small></div>`;
  const hidden = `<input type="hidden" name="id" value="${esc(id)}"><input type="hidden" name="t" value="${esc(t)}">`;
  const actions = pending
    ? `<form method="post">${hidden}<input type="hidden" name="action" value="approve"><button class="ok">Approve and publish</button></form><form method="post">${hidden}<input type="hidden" name="action" value="decline"><button class="no">Decline</button></form>`
    : `<p>This review is live.</p><form method="post">${hidden}<input type="hidden" name="action" value="remove"><button class="no">Remove from the site</button></form>`;
  return moderatePage(pending ? 'Review waiting' : 'Published review', `<h1>${pending ? 'Review waiting for your decision' : 'Published review'}</h1>${card}${actions}`);
}
