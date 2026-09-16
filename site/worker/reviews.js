/* Reviews: submission → pending in KV → Maryann approves by signed link → public list. Plus review requests. */
import { json, html, esc, str, EMAIL_RE, send, notify, sign, verify, getJSON, putJSON, listJSON, settings, signedLink, checkSigned } from './lib.js';

const SERVICES = ['weddings', 'venues', 'travel'];
const DISPLAYS = ['first', 'full', 'anon'];
const displayName = r => {
  if (r.display === 'anon') return '';
  if (r.display === 'full') return r.name;
  const parts = r.name.split(/\s+/);
  return parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0].toUpperCase()}.` : parts[0];
};
const publicView = r => ({ id: r.id, name: r.publicName, service: r.service, trip: r.trip, rating: r.rating, text: r.text, lang: r.lang, date: (r.approvedAt || r.createdAt).slice(0, 7) });
export const moderateLink = async (env, id) => `${env.SITE_URL}/api/reviews/moderate?id=${id}&t=${await sign(env, id)}`;

export async function submitReview(request, env) {
  let d;
  try { d = await request.json(); } catch (e) { return json({ ok: false, error: 'body' }, 400); }
  if (str(d.website, 50)) return json({ ok: true });
  const ip = request.headers.get('CF-Connecting-IP') || 'local', rlKey = `rl:${ip}`;
  const count = parseInt((await env.REVIEWS.get(rlKey)) || '0', 10);
  if (count >= 3) return json({ ok: false, error: 'rate' }, 429);

  const r = {
    id: crypto.randomUUID(), name: str(d.name, 80), email: str(d.email, 200),
    display: DISPLAYS.includes(d.display) ? d.display : 'first', service: SERVICES.includes(d.service) ? d.service : '',
    trip: str(d.trip, 90), rating: Math.min(5, Math.max(1, parseInt(d.rating, 10) || 0)), text: str(d.text, 1500),
    lang: d.lang === 'es' ? 'es' : 'en', consent: d.consent === true, createdAt: new Date().toISOString(),
  };
  if (!r.name || !r.service || !r.trip || !parseInt(d.rating, 10) || r.text.length < 40 || !r.consent) return json({ ok: false, error: 'fields' }, 400);
  if (r.email && !EMAIL_RE.test(r.email)) return json({ ok: false, error: 'fields' }, 400);
  if (!env.REVIEW_SECRET) return json({ ok: false, error: 'config' }, 500);
  r.publicName = displayName(r);

  await putJSON(env, `pending:${r.id}`, r, { expirationTtl: 60 * 60 * 24 * 90 });
  await env.REVIEWS.put(rlKey, String(count + 1), { expirationTtl: 3600 });
  // A review request for this email is now fulfilled: no follow-up.
  if (r.email) for (const rr of await listJSON(env, 'rr:')) if (rr.email.toLowerCase() === r.email.toLowerCase() && !rr.done) { rr.done = r.createdAt; await putJSON(env, `rr:${rr.id}`, rr, { expirationTtl: 60 * 60 * 24 * 90 }); }

  const link = await moderateLink(env, r.id);
  const body = `New review waiting for your approval.\n\nFrom: ${r.name}${r.email ? ` <${r.email}>` : ''}\nShown as: ${r.publicName || 'Anonymous'}\nService: ${r.service} · ${r.trip}\nRating: ${r.rating}/5 · Language: ${r.lang}\n\n${r.text}\n\nApprove or decline here (the link is private to you):\n${link}\n\nNothing is published until you approve it. Unapproved reviews are deleted after 90 days.`;
  try { await send(env, { to: env.ENQUIRY_TO, replyTo: r.email || undefined, subject: `[Review] ${r.publicName || 'Anonymous'} · ${r.rating}/5`, text: body }); }
  catch (e) { console.error('review email failed', e && e.message); await env.REVIEWS.delete(`pending:${r.id}`); return json({ ok: false, error: 'send' }, 502); }
  if (r.email) {
    const copy = r.lang === 'es'
      ? `Hola ${r.name},\n\nGracias por tu opinión. Me llega a mí primero; cuando la haya comprobado, aparecerá en maisoneniola.bid/es/reviews/. Si quieres retirarla o cambiarla, responde a este correo.\n\nMaryann\nMaison Eniola\n\n——————————\n\n${r.text}`
      : `Hi ${r.name},\n\nThank you for your review. It comes to me first; once I have checked it, it will appear on maisoneniola.bid/reviews/. If you ever want it removed or changed, reply to this email.\n\nMaryann\nMaison Eniola\n\n——————————\n\n${r.text}`;
    try { await send(env, { to: r.email, replyTo: env.ENQUIRY_TO, subject: r.lang === 'es' ? 'Tu opinión para Maison Eniola' : 'Your review for Maison Eniola', text: copy }); } catch (e) { /* best effort */ }
  }
  return json({ ok: true });
}

export async function listReviews(env) {
  const out = (await listJSON(env, 'approved:')).map(publicView);
  out.sort((a, b) => (a.date < b.date ? 1 : -1));
  return json({ ok: true, reviews: out.slice(0, 50) }, 200, { 'cache-control': 'public, max-age=300' });
}

const STARS = n => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
export function shell(title, inner) {
  return html(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · Maison Eniola</title>
<style>body{margin:0;background:#03131F;color:#F6F1E4;font:16px/1.55 -apple-system,"Segoe UI",Roboto,sans-serif}main{max-width:720px;margin:0 auto;padding:2.5rem 1.2rem}h1{font-weight:500;font-size:1.5rem;margin:0 0 1rem}h2{font-weight:500;font-size:1.1rem;margin:2rem 0 .6rem;color:#F08A5D;text-transform:uppercase;letter-spacing:.12em;font-size:.8rem}.card{background:#062437;border:1px solid rgba(246,241,228,.16);border-radius:14px;padding:1.2rem;margin:.8rem 0}blockquote{margin:0 0 .8rem;font-size:1.05rem}small{color:rgba(246,241,228,.6)}form{display:inline-block;margin:.4rem .6rem 0 0}form.block{display:block}label{display:block;font-size:.85rem;color:rgba(246,241,228,.75);margin:.6rem 0 .2rem}input,select,textarea{font:inherit;width:100%;box-sizing:border-box;padding:.55rem .7rem;border-radius:8px;border:1px solid rgba(246,241,228,.25);background:#03131F;color:#F6F1E4}button{font:inherit;font-weight:600;padding:.7rem 1.2rem;border-radius:999px;border:0;cursor:pointer;margin-top:.6rem}.ok{background:#E75B24;color:#FFFDF4}.no{background:transparent;color:#F6F1E4;border:1px solid rgba(246,241,228,.35)}.stars{color:#F2B84B;letter-spacing:.1em}a{color:#F08A5D}.row{display:flex;flex-wrap:wrap;gap:.6rem;align-items:center}.muted{color:rgba(246,241,228,.55)}.top{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1.5rem}.top b{letter-spacing:.2em;font-weight:300;font-size:1.1rem}</style></head><body><main>${inner}</main></body></html>`);
}
export const reviewCard = r => `<div class="card"><div class="stars" aria-label="${r.rating} out of 5">${STARS(r.rating)}</div><blockquote>${esc(r.text)}</blockquote><small><b>${esc(r.name)}</b>${r.email ? ` · ${esc(r.email)}` : ''}<br>Shown as: ${esc(r.publicName || 'Anonymous')} · ${esc(r.service)} · ${esc(r.trip)} · ${r.lang}<br>Sent ${esc(r.createdAt.slice(0, 16).replace('T', ' '))}</small></div>`;

/* Approve / decline / remove. Used by the emailed link and by /admin. */
export async function applyModeration(env, id, action) {
  const pendingKey = `pending:${id}`, approvedKey = `approved:${id}`;
  const pending = await getJSON(env, pendingKey), approved = await getJSON(env, approvedKey);
  if (action === 'approve' && pending) {
    const a = { ...pending, approvedAt: new Date().toISOString() };
    await putJSON(env, approvedKey, a); await env.REVIEWS.delete(pendingKey);
    if (a.email) { // thank the client and ask for the same words on Google, if a link is set
      const s = await settings(env), g = s.googleReviewUrl;
      const text = a.lang === 'es'
        ? `Hola ${a.name},\n\nTu opinión ya está publicada en maisoneniola.bid/es/reviews/. Gracias de corazón.${g ? `\n\nSi tienes un minuto más, las opiniones en Google son las que ven quienes buscan: puedes pegar las mismas palabras aquí:\n${g}` : ''}\n\nMaryann\nMaison Eniola\n\n——————————\n\n${a.text}`
        : `Hi ${a.name},\n\nYour review is now live on maisoneniola.bid/reviews/. Thank you, truly.${g ? `\n\nIf you have one more minute, Google reviews are what people see when they search: you can paste the same words here:\n${g}` : ''}\n\nMaryann\nMaison Eniola\n\n——————————\n\n${a.text}`;
      try { await send(env, { to: a.email, replyTo: env.ENQUIRY_TO, subject: a.lang === 'es' ? 'Tu opinión ya está publicada' : 'Your review is live', text }); } catch (e) { /* best effort */ }
    }
    return { done: 'approved', r: a };
  }
  if (action === 'decline' && pending) { await env.REVIEWS.delete(pendingKey); return { done: 'declined', r: pending }; }
  if (action === 'remove' && approved) { await env.REVIEWS.delete(approvedKey); return { done: 'removed', r: approved }; }
  return { done: 'nothing', r: pending || approved };
}

export async function moderate(request, env, url) {
  let id = url.searchParams.get('id') || '', t = url.searchParams.get('t') || '', action = '';
  if (request.method === 'POST') { const f = await request.formData(); action = String(f.get('action') || ''); id = String(f.get('id') || id); t = String(f.get('t') || t); }
  if (!/^[0-9a-f-]{36}$/.test(id) || !(await verify(env, id, t))) return shell('Not allowed', '<h1>This link is not valid.</h1><p><small>Only the link from the notification email works, and only for Maryann.</small></p>');
  if (request.method === 'POST') {
    const { done, r } = await applyModeration(env, id, action);
    if (done === 'approved') return shell('Published', `<h1>Published.</h1><p>The review by <b>${esc(r.publicName || 'Anonymous')}</b> is now live. It can take up to five minutes to appear.</p><p><small>To remove it later, open this same link and choose Remove.</small></p>`);
    if (done === 'declined') return shell('Declined', '<h1>Declined and deleted.</h1>');
    if (done === 'removed') return shell('Removed', '<h1>Removed from the site.</h1><p><small>It can take up to five minutes to disappear.</small></p>');
    return shell('Nothing to do', '<h1>Nothing to do.</h1><p>This review has already been handled.</p>');
  }
  const pending = await getJSON(env, `pending:${id}`), approved = await getJSON(env, `approved:${id}`), r = pending || approved;
  if (!r) return shell('Not found', '<h1>This review is no longer here.</h1><p>It was declined, removed, or expired unapproved after 90 days.</p>');
  const hidden = `<input type="hidden" name="id" value="${esc(id)}"><input type="hidden" name="t" value="${esc(t)}">`;
  const actions = pending
    ? `<form method="post">${hidden}<input type="hidden" name="action" value="approve"><button class="ok">Approve and publish</button></form><form method="post">${hidden}<input type="hidden" name="action" value="decline"><button class="no">Decline</button></form>`
    : `<p>This review is live.</p><form method="post">${hidden}<input type="hidden" name="action" value="remove"><button class="no">Remove from the site</button></form>`;
  return shell(pending ? 'Review waiting' : 'Published review', `<h1>${pending ? 'Review waiting for your decision' : 'Published review'}</h1>${reviewCard(r)}${actions}`);
}

/* ---- review requests (sent from /admin; follow-up by cron after 14 days) ---- */
export async function requestReview(env, { name, email, service, trip, lang }) {
  const id = crypto.randomUUID();
  const params = new URLSearchParams({ service, trip, name, lang });
  const formUrl = `${env.SITE_URL}${lang === 'es' ? '/es' : ''}/reviews/?${params.toString()}#review-form`;
  const text = lang === 'es'
    ? `Hola ${name},\n\nEspero que ${trip} haya salido tal y como lo imaginabas. Si tienes cinco minutos, unas líneas sobre cómo fue la planificación ayudan mucho a la siguiente pareja o viajero que esté decidiendo.\n\nPuedes escribirla aquí (ya lleva tus datos):\n${formUrl}\n\nGracias por confiar en mí.\n\nMaryann\nMaison Eniola`
    : `Hi ${name},\n\nI hope ${trip} went the way you imagined. If you have five minutes, a few lines about what the planning was like help the next couple or traveller decide.\n\nYou can write it here (your details are already filled in):\n${formUrl}\n\nThank you for trusting me with it.\n\nMaryann\nMaison Eniola`;
  await send(env, { to: email, replyTo: env.ENQUIRY_TO, subject: lang === 'es' ? '¿Cómo fue? Unas líneas para Maison Eniola' : 'How did it go? A few lines for Maison Eniola', text });
  await putJSON(env, `rr:${id}`, { id, name, email, service, trip, lang, sentAt: new Date().toISOString(), followUpAt: new Date(Date.now() + 14 * 86400e3).toISOString(), followedUp: false, done: false, formUrl }, { expirationTtl: 60 * 60 * 24 * 90 });
  return id;
}
export async function reviewFollowUps(env) {
  let n = 0;
  for (const rr of await listJSON(env, 'rr:')) {
    if (rr.done || rr.followedUp || rr.followUpAt > new Date().toISOString()) continue;
    const text = rr.lang === 'es'
      ? `Hola ${rr.name},\n\nSolo un recordatorio amable: si te apetece dejar unas líneas sobre ${rr.trip}, sigue siendo aquí:\n${rr.formUrl}\n\nY si no, ningún problema. Gracias de nuevo.\n\nMaryann`
      : `Hi ${rr.name},\n\nJust a gentle reminder: if you would like to leave a few lines about ${rr.trip}, it is still here:\n${rr.formUrl}\n\nAnd if not, no problem at all. Thank you again.\n\nMaryann`;
    try { await send(env, { to: rr.email, replyTo: env.ENQUIRY_TO, subject: rr.lang === 'es' ? 'Un recordatorio amable' : 'A gentle reminder', text }); n++; } catch (e) { continue; }
    rr.followedUp = true; await putJSON(env, `rr:${rr.id}`, rr, { expirationTtl: 60 * 60 * 24 * 90 });
  }
  return n;
}
