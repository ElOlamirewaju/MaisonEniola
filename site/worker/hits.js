/* First-party page counts for the weekly digest: path and country per day, aggregated in KV.
   No cookies, no IP, no user id. Ignored when the browser sends Do Not Track. */
import { json, str, getJSON, putJSON } from './lib.js';

export async function hit(request, env) {
  if (request.headers.get('DNT') === '1') return json({ ok: true });
  let d; try { d = await request.json(); } catch (e) { return json({ ok: false }, 400); }
  const path = str(d.p, 120).replace(/[?#].*$/, '') || '/';
  if (!path.startsWith('/')) return json({ ok: false }, 400);
  const country = request.cf?.country || 'XX';
  const key = `hits:${new Date().toISOString().slice(0, 10)}`;
  const h = (await getJSON(env, key)) || { paths: {}, countries: {}, total: 0 };
  h.paths[path] = (h.paths[path] || 0) + 1; h.countries[country] = (h.countries[country] || 0) + 1; h.total++;
  await putJSON(env, key, h, { expirationTtl: 60 * 60 * 24 * 40 });
  return json({ ok: true });
}
export const geo = request => json({ ok: true, country: request.cf?.country || '', tz: request.cf?.timezone || '' }, 200, { 'cache-control': 'private, max-age=3600' });
