/* Worker for maisoneniola.bid. Only /api/* and /admin* reach this script; everything else is the static build.
   See the modules for each area: enquiry.js, reviews.js, booking.js, hits.js, admin.js, cron.js. */
import { json } from './lib.js';
import { postEnquiry, markReplied } from './enquiry.js';
import { submitReview, listReviews, moderate } from './reviews.js';
import { getSlots, book, cancel } from './booking.js';
import { hit, geo } from './hits.js';
import { admin } from './admin.js';
import { daily, weekly, monthly } from './cron.js';
import { settings } from './lib.js';

const ALLOWED_ORIGINS = ['https://maisoneniola.bid', 'https://www.maisoneniola.bid'];

export default {
  async fetch(request, env) {
    const url = new URL(request.url), p = url.pathname, m = request.method;
    const localDev = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    const originOk = () => localDev || ALLOWED_ORIGINS.includes(request.headers.get('Origin') || '');
    const post = handler => (m !== 'POST' ? json({ ok: false, error: 'method' }, 405) : !originOk() ? json({ ok: false, error: 'origin' }, 403) : handler());

    if (p === '/api/enquiry') return post(() => postEnquiry(request, env));
    if (p === '/api/enquiry/replied') return markReplied(request, env, url);
    if (p === '/api/reviews') return m === 'GET' ? listReviews(env) : post(() => submitReview(request, env));
    if (p === '/api/reviews/moderate') return moderate(request, env, url);
    if (p === '/api/slots') return getSlots(env);
    if (p === '/api/book') return post(() => book(request, env));
    if (p === '/api/book/cancel') return cancel(request, env, url);
    if (p === '/api/hit') return post(() => hit(request, env));
    if (p === '/api/geo') return geo(request);
    if (p === '/api/settings') { const s = await settings(env); return json({ ok: true, nextStart: s.nextStart, hours: s.hours, tz: 'Europe/Madrid' }, 200, { 'cache-control': 'public, max-age=300' }); }
    if (p === '/admin' || p.startsWith('/admin/')) return admin(request, env, url);
    return env.ASSETS ? env.ASSETS.fetch(request) : json({ ok: false, error: 'not-found' }, 404);
  },
  async scheduled(event, env, ctx) {
    const job = event.cron === '0 7 * * 1' ? weekly : event.cron === '0 7 1 * *' ? monthly : daily;
    ctx.waitUntil(job(env).then(r => console.log('cron', event.cron, JSON.stringify(r))).catch(e => console.error('cron failed', event.cron, e && e.message)));
  },
};
