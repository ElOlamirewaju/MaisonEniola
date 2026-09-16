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

export const topbar = (links = [['/admin', 'Admin'], ['/reviews/', 'Site']]) => `<header class="top"><div><b>Maison Eniola</b><small>Admin</small></div><nav>${links.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}</nav></header>`;
export const TOPBAR = topbar();
const STARS = n => '★★★★★'.slice(0, n) + '☆☆☆☆☆'.slice(0, 5 - n);
export function shell(title, inner, opts = {}) {
  return html(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)} · Maison Eniola</title>
<link rel="icon" href="/icons/favicon.svg" type="image/svg+xml">
<style>
@font-face{font-family:"DM Serif Display";src:url("/fonts/DMSerifDisplay-Regular.ttf") format("truetype");font-display:swap}
@font-face{font-family:"Poppins";src:url("/fonts/Poppins-Regular.ttf") format("truetype");font-weight:400;font-display:swap}
@font-face{font-family:"Poppins";src:url("/fonts/Poppins-Medium.ttf") format("truetype");font-weight:500;font-display:swap}
@font-face{font-family:"Cormorant Garamond";src:url("/fonts/CormorantGaramond-Brand.woff2") format("woff2");font-weight:300 700;font-display:swap}
:root{--night:#03131F;--night-2:#062437;--night-3:#0B3350;--moon:#F6F1E4;--soft:rgba(246,241,228,.78);--faint:rgba(246,241,228,.5);--line:rgba(246,241,228,.14);--coral:#E75B24;--coral-soft:#F08A5D;--gold:#F2B84B;--teal:#3BB8BE;--serif:"DM Serif Display",Georgia,serif;--sans:"Poppins",system-ui,sans-serif}
*{box-sizing:border-box}html{color-scheme:dark}body{margin:0;background:var(--night);color:var(--moon);font:15px/1.6 var(--sans);-webkit-font-smoothing:antialiased}
body::before{content:"";position:fixed;inset:0;z-index:-1;background:radial-gradient(60% 40% at 80% 0%,rgba(11,51,80,.75),transparent 70%),radial-gradient(40% 30% at 0% 100%,rgba(231,91,36,.12),transparent 70%)}
.wrap{max-width:1040px;margin:0 auto;padding:clamp(1.2rem,4vw,2.5rem) clamp(1rem,4vw,2rem) 5rem}
.top{display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.9rem 1.4rem;border-radius:40px;background:rgba(255,253,244,.7);color:#063A5C;-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);box-shadow:0 10px 40px -20px rgba(3,19,31,.6);position:sticky;top:12px;z-index:5}
.top b{font-family:"Cormorant Garamond",serif;font-weight:400;letter-spacing:.22em;font-size:1.15rem;text-transform:uppercase;white-space:nowrap}@media(max-width:480px){.top b{font-size:.95rem;letter-spacing:.14em}.top{padding:.7rem 1rem}}
.top small{display:block;font-size:.6rem;letter-spacing:.2em;text-transform:uppercase;color:#C84A16;font-weight:500;margin-top:.1rem}
.top nav{display:flex;gap:1rem;font-size:.82rem;font-weight:500}.top nav a{color:#063A5C;text-decoration:none;opacity:.8}.top nav a:hover{opacity:1;text-decoration:underline;text-underline-offset:4px}
h1{font-family:var(--serif);font-weight:400;font-size:clamp(2rem,4.5vw,2.8rem);line-height:1.05;margin:2.4rem 0 .4rem}
.sub{color:var(--soft);margin:0 0 1.8rem;max-width:56ch}
.stats{display:grid;gap:.8rem;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin:0 0 2.4rem}
.stat{padding:1rem 1.1rem;border-radius:14px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(11,51,80,.45),rgba(6,36,55,.35))}
.stat b{display:block;font-family:var(--serif);font-size:2rem;line-height:1;color:var(--moon)}.stat span{font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--faint)}
.stat.hot b{color:var(--coral-soft)}
.jump{display:flex;flex-wrap:wrap;gap:.5rem;margin:0 0 2rem}.jump a{font-size:.78rem;letter-spacing:.06em;text-decoration:none;color:var(--soft);padding:.45rem .9rem;border-radius:999px;border:1px solid var(--line)}.jump a:hover{color:var(--moon);border-color:var(--soft)}
section{margin:0 0 2.6rem;scroll-margin-top:110px}
h2{font-family:var(--sans);font-weight:500;font-size:.74rem;letter-spacing:.22em;text-transform:uppercase;color:var(--coral-soft);margin:0 0 .9rem;display:flex;align-items:center;gap:.7rem}h2::before{content:"";width:2.2rem;height:1px;background:linear-gradient(90deg,#E75B24,#E6A123)}
h2 .n{font-family:var(--sans);font-size:.72rem;letter-spacing:.04em;color:var(--moon);padding:.1rem .55rem;border-radius:999px;border:1px solid var(--line);background:rgba(246,241,228,.06)}
.card{position:relative;border-radius:16px;border:1px solid var(--line);background:linear-gradient(180deg,rgba(11,51,80,.5),rgba(6,36,55,.3));padding:1.2rem 1.3rem;margin:0 0 .9rem}
.card.form{padding:1.5rem}
.empty{color:var(--faint);font-style:italic;padding:.6rem 0 0}
.meta{color:var(--faint);font-size:.82rem;line-height:1.5}.meta b{color:var(--moon);font-weight:500}
.review .stars{color:var(--gold);letter-spacing:.12em;font-size:.95rem}
blockquote{margin:.5rem 0 .8rem;font-family:var(--serif);font-size:1.2rem;line-height:1.4;color:var(--moon)}
.who{font-weight:500;color:var(--moon)}
a{color:var(--coral-soft)}
label{display:block;font-size:.8rem;letter-spacing:.02em;color:var(--soft);margin:.9rem 0 .3rem}
input,select,textarea{font:inherit;width:100%;padding:.65rem .8rem;border-radius:10px;border:1px solid rgba(246,241,228,.18);background:rgba(3,19,31,.7);color:var(--moon);transition:border-color .3s}
input:focus,select:focus,textarea:focus{outline:none;border-color:var(--teal);box-shadow:0 0 0 3px rgba(59,184,190,.2)}
input::placeholder{color:rgba(246,241,228,.3)}
.grid{display:grid;gap:0 1rem;grid-template-columns:1fr}@media(min-width:640px){.grid{grid-template-columns:1fr 1fr}.grid.three{grid-template-columns:1fr 1fr 1fr}}
.days{display:flex;flex-wrap:wrap;gap:.4rem;margin-top:.4rem}.days label{margin:0;display:inline-flex;align-items:center;gap:.4rem;padding:.45rem .8rem;border-radius:999px;border:1px solid var(--line);cursor:pointer;font-size:.85rem;color:var(--soft)}.days label:has(input:checked){border-color:var(--coral-soft);color:var(--moon);background:rgba(231,91,36,.12)}.days input{width:auto;margin:0;accent-color:var(--coral)}
.actions{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem;align-items:center}.actions form{margin:0}form{margin:0}
button{font:inherit;font-weight:500;font-size:.9rem;padding:.7rem 1.3rem;border-radius:999px;border:1px solid transparent;cursor:pointer;transition:transform .4s cubic-bezier(.16,1,.3,1),background .3s}button:hover{transform:translateY(-1px)}
.ok{background:var(--coral);color:#FFFDF4}.ok:hover{background:#AE3F12}.no{background:transparent;color:var(--moon);border-color:rgba(246,241,228,.3)}.no:hover{border-color:var(--moon)}
.flash{padding:.9rem 1.2rem;border-radius:12px;background:rgba(59,184,190,.12);border:1px solid rgba(59,184,190,.35);color:var(--moon);margin:0 0 1.6rem}
.hint{color:var(--faint);font-size:.8rem;margin:.8rem 0 0}
.foot{color:var(--faint);font-size:.78rem;border-top:1px solid var(--line);padding-top:1.2rem;margin-top:3rem}
.pill{display:inline-block;font-size:.68rem;letter-spacing:.12em;text-transform:uppercase;padding:.2rem .6rem;border-radius:999px;border:1px solid var(--line);color:var(--faint);margin-left:.5rem;vertical-align:middle}
.pill.live{color:var(--teal);border-color:rgba(59,184,190,.4)}
.signin{max-width:520px;margin:12vh auto 0;text-align:center}.signin h1{margin-top:1rem}.signin .card{padding:2rem}
</style></head><body><div class="wrap">${inner}</div></body></html>`);
}
export const reviewCard = r => `<div class="card review"><div class="stars" aria-label="${r.rating} out of 5">${STARS(r.rating)}</div><blockquote>${esc(r.text)}</blockquote><p class="meta"><span class="who">${esc(r.name)}</span>${r.email ? ` · <a href="mailto:${esc(r.email)}">${esc(r.email)}</a>` : ''}<br>Shown as <b>${esc(r.publicName || 'Anonymous')}</b> · ${esc(r.service)} · ${esc(r.trip)} · ${r.lang.toUpperCase()} · sent ${esc(r.createdAt.slice(0, 10))}${r.approvedAt ? ` · <span class="pill live">live</span>` : ''}</p></div>`;

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
  return shell(pending ? 'Review waiting' : 'Published review', `${TOPBAR}<h1>${pending ? 'A review is waiting for you' : 'Published review'}</h1><p class="sub">${pending ? 'Only you can see this. Nothing is published until you approve it.' : 'This review is live on the site.'}</p>${reviewCard(r)}<div class="actions">${actions}</div>`);
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
