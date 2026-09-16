/* Scheduled jobs (UTC): daily reminders and review follow-ups, Monday digest, monthly export. */
import { notify, listJSON, getJSON, send, fmtZoned, TZ, signedLink } from './lib.js';
import { reviewFollowUps } from './reviews.js';

const WORKING_DAYS_AGO = (iso, days) => { // true when `days` working days have passed since iso
  let d = new Date(iso), n = 0;
  while (n < days) { d = new Date(d.getTime() + 86400e3); if (d.getUTCDay() !== 0 && d.getUTCDay() !== 6) n++; }
  return d <= new Date();
};

export async function daily(env) {
  const out = [];
  for (const e of await listJSON(env, 'enq:')) {
    if (e.repliedAt || e.reminders >= 3 || !WORKING_DAYS_AGO(e.receivedAt, 2 + (e.reminders || 0) * 2)) continue;
    const link = await signedLink(env, '/api/enquiry/replied', { id: e.id });
    try { await notify(env, `[Reminder] ${e.name} is still waiting: ${e.subject}`, `An enquiry from ${e.name} <${e.email}> arrived on ${e.receivedAt.slice(0, 10)} and has not been marked as replied.\n\nSubject: ${e.subject}\n\nWhen you have replied, tap this and I will stop: ${link}\n\n(Reminder ${(e.reminders || 0) + 1} of 3.)`); } catch (err) { continue; }
    e.reminders = (e.reminders || 0) + 1; await env.REVIEWS.put(`enq:${e.id}`, JSON.stringify(e), { expirationTtl: 60 * 60 * 24 * 60 });
    out.push(e.name);
  }
  const f = await reviewFollowUps(env);
  return { reminders: out.length, followUps: f };
}

export async function weekly(env) {
  const now = Date.now(), week = iso => now - Date.parse(iso) < 7 * 86400e3;
  const enq = await listJSON(env, 'enq:'), enqWeek = enq.filter(e => week(e.receivedAt));
  const pending = await listJSON(env, 'pending:'), approved = await listJSON(env, 'approved:');
  const bookings = (await listJSON(env, 'bk:')).filter(b => !b.cancelledAt && Date.parse(b.start) > now && Date.parse(b.start) < now + 7 * 86400e3).sort((a, b) => a.start < b.start ? -1 : 1);
  const paths = {}, countries = {}; let total = 0;
  for (let i = 0; i < 7; i++) {
    const h = await getJSON(env, `hits:${new Date(now - i * 86400e3).toISOString().slice(0, 10)}`); if (!h) continue;
    total += h.total; for (const [k, v] of Object.entries(h.paths)) paths[k] = (paths[k] || 0) + v; for (const [k, v] of Object.entries(h.countries)) countries[k] = (countries[k] || 0) + v;
  }
  const top = o => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([k, v]) => `${k} (${v})`).join(', ') || 'none';
  const mon = await getJSON(env, 'mon:state');
  const text = `Maison Eniola · week to ${new Date().toISOString().slice(0, 10)}

Enquiries: ${enqWeek.length} this week · ${enq.filter(e => !e.repliedAt).length} still not marked replied
Reviews: ${pending.length} waiting for approval · ${approved.length} published
Calls this week: ${bookings.length}${bookings.map(b => `\n  · ${fmtZoned(new Date(b.start), TZ)} ${b.name}`).join('')}
Page views: ${total} · top pages: ${top(paths)}
Countries: ${top(countries)}
Site check: ${mon ? (mon.ok ? 'all good' : 'PROBLEM: ' + mon.detail) + ' (since ' + mon.since.slice(0, 16).replace('T', ' ') + ')' : 'monitor not reporting'}

Admin: ${env.SITE_URL}/admin`;
  await notify(env, '[Weekly] Maison Eniola digest', text);
  return { sent: true };
}

export async function monthly(env) {
  const data = { exportedAt: new Date().toISOString(), approved: await listJSON(env, 'approved:'), pending: await listJSON(env, 'pending:') };
  await send(env, { to: env.ENQUIRY_TO, subject: `[Backup] reviews ${new Date().toISOString().slice(0, 7)}`, text: `Monthly backup of all reviews attached (${data.approved.length} published, ${data.pending.length} pending).`, attachments: [{ content: JSON.stringify(data, null, 2), filename: `reviews-${new Date().toISOString().slice(0, 7)}.json`, type: 'application/json', disposition: 'attachment' }] });
  return { approved: data.approved.length };
}
