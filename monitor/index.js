/* Uptime monitor for maisoneniola.bid: home page, reviews API and the enquiry endpoint (a honeypot post, which
   the site answers without sending anything). Two failed rounds in a row = incident email; recovery = all-clear email. */
const checks = async site => {
  const out = [];
  const t = async (name, fn) => { try { const r = await fn(); out.push({ name, ok: r === true, detail: r === true ? '' : String(r) }); } catch (e) { out.push({ name, ok: false, detail: e.message }); } };
  await t('home page', async () => { const r = await fetch(site + '/', { cf: { cacheTtl: 0 } }); if (r.status !== 200) return `status ${r.status}`; const h = await r.text(); return h.includes('Maison Eniola') || 'page content missing'; });
  await t('www redirect/serve', async () => { const r = await fetch(site.replace('://', '://www.') + '/', { redirect: 'follow' }); return r.status === 200 || `status ${r.status}`; });
  await t('reviews api', async () => { const r = await fetch(site + '/api/reviews'); if (r.status !== 200) return `status ${r.status}`; const j = await r.json(); return j.ok === true || 'bad json'; });
  await t('enquiry endpoint', async () => { const r = await fetch(site + '/api/enquiry', { method: 'POST', headers: { 'content-type': 'application/json', Origin: site }, body: JSON.stringify({ website: 'monitor-probe' }) }); return r.status === 200 || `status ${r.status}`; });
  return out;
};
export default {
  async scheduled(event, env, ctx) { ctx.waitUntil(run(env)); },
  async fetch(request, env) { const res = await checks(env.SITE_URL); return new Response(JSON.stringify(res, null, 2), { headers: { 'content-type': 'application/json' } }); },
};
async function run(env) {
  const res = await checks(env.SITE_URL), failed = res.filter(r => !r.ok), now = new Date().toISOString();
  const state = (await env.REVIEWS.get('mon:state', 'json')) || { ok: true, since: now, strikes: 0, detail: '' };
  const detail = failed.map(f => `${f.name}: ${f.detail}`).join('; ');
  if (failed.length) {
    state.strikes = (state.strikes || 0) + 1;
    if (state.ok && state.strikes >= 2) { state.ok = false; state.since = now; state.detail = detail; await mail(env, `[Site DOWN] ${failed.map(f => f.name).join(', ')}`, `Something on maisoneniola.bid has failed twice in a row (checked every 5 minutes).\n\n${detail}\n\nChecked at ${now}. You will get one more email when it recovers.`); }
    else state.detail = detail;
  } else {
    if (!state.ok) await mail(env, '[Site OK] everything is back', `All checks pass again as of ${now}.\n\nThe problem was: ${state.detail}\nIt started around ${state.since}.`);
    state.ok = true; state.strikes = 0; state.detail = ''; if (!state.since || !state.ok) state.since = now;
  }
  state.checkedAt = now;
  await env.REVIEWS.put('mon:state', JSON.stringify(state));
}
async function mail(env, subject, text) {
  try { await env.EMAIL.send({ to: env.ENQUIRY_TO, from: { email: env.ENQUIRY_FROM, name: 'Maison Eniola monitor' }, subject, text, html: `<pre>${text.replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]))}</pre>` }); } catch (e) { console.error('monitor mail failed', e && e.message); }
}
