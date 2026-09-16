/* /admin: Maryann's private page. Sign-in by emailed link (no password), then a cookie for 30 days.
   Sections: reviews waiting, enquiries not yet replied, request a review, upcoming calls, availability and settings. */
import { html, esc, str, EMAIL_RE, send, sign, verify, getJSON, putJSON, listJSON, settings, DEFAULT_SETTINGS, fmtZoned, TZ, signedLink } from './lib.js';
import { shell, reviewCard, applyModeration, requestReview } from './reviews.js';

const COOKIE = 'me_admin';
async function cookieOk(request, env) {
  const m = (request.headers.get('Cookie') || '').match(new RegExp(`${COOKIE}=(\\d+)\\.([0-9a-f]{64})`));
  if (!m || +m[1] < Date.now() / 1000) return false;
  return verify(env, `admin:${m[1]}`, m[2]);
}
async function setCookie(env) {
  const exp = Math.floor(Date.now() / 1000) + 30 * 86400;
  return `${COOKIE}=${exp}.${await sign(env, `admin:${exp}`)}; Path=/; Max-Age=${30 * 86400}; HttpOnly; Secure; SameSite=Lax`;
}

export async function admin(request, env, url) {
  const path = url.pathname.replace(/\/$/, '');
  // 1. sign-in link requested
  if (path === '/admin/login' && request.method === 'POST') {
    const ip = request.headers.get('CF-Connecting-IP') || 'local', k = `rl:login:${ip}`;
    if (parseInt((await env.REVIEWS.get(k)) || '0', 10) >= 3) return shell('Slow down', '<h1>Too many requests. Try again in an hour.</h1>');
    await env.REVIEWS.put(k, String(parseInt((await env.REVIEWS.get(k)) || '0', 10) + 1), { expirationTtl: 3600 });
    const link = await signedLink(env, '/admin', { login: '1' }, 30 * 60);
    try { await send(env, { to: env.ENQUIRY_TO, subject: '[Admin] Your sign-in link', text: `Sign in to the Maison Eniola admin page (valid 30 minutes):\n${link}\n\nIf you did not ask for this, ignore it.` }); } catch (e) { return shell('Email failed', '<h1>Could not send the link.</h1><p>Email Sending is not enabled yet for the domain.</p>'); }
    return shell('Check your email', `<h1>Link sent.</h1><p>Check ${esc(env.ENQUIRY_TO)} and open the link within 30 minutes.</p>`);
  }
  // 2. arriving with a signed login link
  if (url.searchParams.get('login') === '1') {
    const { checkSigned } = await import('./lib.js');
    if (await checkSigned(env, url)) return new Response(null, { status: 302, headers: { Location: '/admin', 'Set-Cookie': await setCookie(env) } });
    return shell('Expired', '<h1>This sign-in link has expired.</h1><p><a href="/admin">Request a new one</a>.</p>');
  }
  if (!(await cookieOk(request, env))) {
    return shell('Sign in', `<div class="top"><b>MAISON ENIOLA</b></div><h1>Admin</h1><p>A sign-in link goes to ${esc(env.ENQUIRY_TO)}. No password.</p><form method="post" action="/admin/login" class="block"><button class="ok">Email me a sign-in link</button></form>`);
  }
  if (path === '/admin/logout') return new Response(null, { status: 302, headers: { Location: '/admin', 'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` } });

  // 3. actions
  let flash = '';
  if (request.method === 'POST') {
    const f = await request.formData(), action = String(f.get('action') || '');
    try {
      if (action === 'moderate') { const { done } = await applyModeration(env, String(f.get('id')), String(f.get('what'))); flash = `Review ${done}.`; }
      if (action === 'replied') { const k = `enq:${f.get('id')}`, e = await getJSON(env, k); if (e) { e.repliedAt = new Date().toISOString(); await putJSON(env, k, e, { expirationTtl: 60 * 60 * 24 * 60 }); flash = 'Marked as replied.'; } }
      if (action === 'request') {
        const name = str(f.get('name'), 120), email = str(f.get('email'), 200), service = String(f.get('service')), trip = str(f.get('trip'), 90), lang = f.get('lang') === 'es' ? 'es' : 'en';
        if (!name || !EMAIL_RE.test(email) || !trip) flash = 'Name, email and a few words are needed.';
        else { await requestReview(env, { name, email, service, trip, lang }); flash = `Review request sent to ${name}. A gentle reminder follows in 14 days if they have not replied.`; }
      }
      if (action === 'cancelcall') { const k = `bk:${f.get('id')}`, b = await getJSON(env, k); if (b && !b.cancelledAt) { b.cancelledAt = new Date().toISOString(); await putJSON(env, k, b, { expirationTtl: 60 * 60 * 24 * 180 }); try { await send(env, { to: b.email, replyTo: env.ENQUIRY_TO, subject: b.lang === 'es' ? 'Llamada cancelada' : 'Call cancelled', text: b.lang === 'es' ? `Hola ${b.name},\n\nHe tenido que cancelar nuestra llamada del ${fmtZoned(new Date(b.start), TZ, 'es')}. Te escribo para buscar otra hora.\n\nMaryann` : `Hi ${b.name},\n\nI have had to cancel our call on ${fmtZoned(new Date(b.start), TZ)}. I will write to find another time.\n\nMaryann` }); } catch (e) { /* */ } flash = 'Call cancelled and the client told.'; } }
      if (action === 'settings') {
        const s = await settings(env);
        s.nextStart = str(f.get('nextStart'), 60);
        s.googleReviewUrl = str(f.get('googleReviewUrl'), 300);
        s.hours = { days: [1, 2, 3, 4, 5, 6, 0].filter(d => f.get(`d${d}`)), from: /^\d\d:\d\d$/.test(f.get('from')) ? String(f.get('from')) : DEFAULT_SETTINGS.hours.from, to: /^\d\d:\d\d$/.test(f.get('to')) ? String(f.get('to')) : DEFAULT_SETTINGS.hours.to };
        s.blocked = String(f.get('blocked') || '').split(/[\s,]+/).filter(x => /^\d{4}-\d\d-\d\d$/.test(x)).sort();
        s.slotMinutes = [30, 45, 60].includes(+f.get('slotMinutes')) ? +f.get('slotMinutes') : 60;
        await putJSON(env, 'settings', s); flash = 'Settings saved.';
      }
    } catch (e) { flash = `Something failed: ${e.message}`; }
  }

  // 4. page
  const s = await settings(env);
  const pending = await listJSON(env, 'pending:'), approved = await listJSON(env, 'approved:');
  const enq = (await listJSON(env, 'enq:')).filter(e => !e.repliedAt).sort((a, b) => a.receivedAt < b.receivedAt ? -1 : 1);
  const calls = (await listJSON(env, 'bk:')).filter(b => !b.cancelledAt && Date.parse(b.start) > Date.now() - 3600e3).sort((a, b) => a.start < b.start ? -1 : 1);
  const rr = (await listJSON(env, 'rr:')).sort((a, b) => a.sentAt < b.sentAt ? 1 : -1).slice(0, 10);
  const hid = (id, what) => `<form method="post"><input type="hidden" name="action" value="moderate"><input type="hidden" name="id" value="${esc(id)}"><input type="hidden" name="what" value="${what}"><button class="${what === 'approve' ? 'ok' : 'no'}">${what[0].toUpperCase() + what.slice(1)}</button></form>`;
  const body = `
<div class="top"><b>MAISON ENIOLA</b><span class="muted"><a href="/reviews/">site</a> · <a href="/admin/logout">sign out</a></span></div>
<h1>Admin</h1>${flash ? `<p class="card">${esc(flash)}</p>` : ''}

<h2>Reviews waiting (${pending.length})</h2>
${pending.length ? pending.map(r => reviewCard(r) + hid(r.id, 'approve') + hid(r.id, 'decline')).join('') : '<p class="muted">None.</p>'}

<h2>Enquiries not yet marked replied (${enq.length})</h2>
${enq.length ? enq.map(e => `<div class="card"><b>${esc(e.name)}</b> · <a href="mailto:${esc(e.email)}">${esc(e.email)}</a>${e.phone ? ` · ${esc(e.phone)}` : ''}<br><small>${esc(e.subject)} · ${esc(e.receivedAt.slice(0, 10))}</small><form method="post"><input type="hidden" name="action" value="replied"><input type="hidden" name="id" value="${esc(e.id)}"><button class="no">Mark as replied</button></form></div>`).join('') : '<p class="muted">All replied.</p>'}

<h2>Upcoming calls (${calls.length})</h2>
${calls.length ? calls.map(b => `<div class="card"><b>${esc(fmtZoned(new Date(b.start), TZ))}</b> (Madrid) · ${esc(b.name)} · <a href="mailto:${esc(b.email)}">${esc(b.email)}</a>${b.phone ? ` · ${esc(b.phone)}` : ''}${b.topic ? `<br><small>${esc(b.topic)}</small>` : ''}<form method="post"><input type="hidden" name="action" value="cancelcall"><input type="hidden" name="id" value="${esc(b.id)}"><button class="no">Cancel this call</button></form></div>`).join('') : '<p class="muted">No calls booked.</p>'}

<h2>Ask a client for a review</h2>
<form method="post" class="block card"><input type="hidden" name="action" value="request">
<label>Client name</label><input name="name" required>
<label>Email</label><input name="email" type="email" required>
<label>What you planned, in a few words (goes into the email and the form)</label><input name="trip" placeholder="your proposal in Positano" required>
<div class="row"><div style="flex:1"><label>Service</label><select name="service"><option value="weddings">Wedding, event or proposal</option><option value="venues">Venue sourcing</option><option value="travel">Trip</option></select></div><div style="flex:1"><label>Language</label><select name="lang"><option value="en">English</option><option value="es">Español</option></select></div></div>
<button class="ok">Send the request</button>
<p class="muted"><small>One email now, one gentle reminder after 14 days unless they have sent a review.</small></p></form>
${rr.length ? `<p class="muted"><small>Recent: ${rr.map(x => `${esc(x.name)} (${x.sentAt.slice(0, 10)}${x.done ? ', reviewed' : x.followedUp ? ', reminded' : ''})`).join(' · ')}</small></p>` : ''}

<h2>Availability and settings</h2>
<form method="post" class="block card"><input type="hidden" name="action" value="settings">
<label>Next available start (shown on service pages; leave empty to hide)</label><input name="nextStart" value="${esc(s.nextStart)}" placeholder="3 November">
<label>Call days</label><div class="row">${[['1', 'Mon'], ['2', 'Tue'], ['3', 'Wed'], ['4', 'Thu'], ['5', 'Fri'], ['6', 'Sat'], ['0', 'Sun']].map(([d, n]) => `<label style="display:inline-flex;gap:.3rem;align-items:center;margin:0"><input type="checkbox" name="d${d}" style="width:auto" ${s.hours.days.includes(+d) ? 'checked' : ''}>${n}</label>`).join('')}</div>
<div class="row"><div style="flex:1"><label>From (Madrid time)</label><input name="from" value="${esc(s.hours.from)}"></div><div style="flex:1"><label>To</label><input name="to" value="${esc(s.hours.to)}"></div><div style="flex:1"><label>Call length</label><select name="slotMinutes">${[30, 45, 60].map(m => `<option ${s.slotMinutes === m ? 'selected' : ''}>${m}</option>`).join('')}</select></div></div>
<label>Days with no calls (one date per line, YYYY-MM-DD)</label><textarea name="blocked" rows="3">${esc(s.blocked.join('\n'))}</textarea>
<label>Google review link (sent to clients after their review is approved; empty = not mentioned)</label><input name="googleReviewUrl" value="${esc(s.googleReviewUrl)}" placeholder="https://g.page/r/.../review">
<button class="ok">Save</button></form>

<h2>Published reviews (${approved.length})</h2>
${approved.length ? approved.map(r => reviewCard(r) + hid(r.id, 'remove')).join('') : '<p class="muted">None yet.</p>'}
<p class="muted"><small>Weekly digest every Monday morning · reminders for unanswered enquiries after two working days · monthly review backup on the 1st.</small></p>`;
  return shell('Admin', body);
}
