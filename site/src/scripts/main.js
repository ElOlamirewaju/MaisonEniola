/* Single entry point. With the client router, pages swap without a reload, so every behaviour
   is set up on `astro:page-load` and torn down on `astro:before-swap`. */
import { initChrome, teardownChrome } from './chrome.js';
import { initMotion, teardownMotion } from './motion.js';
import { initMagnetic } from './nav.js';
import { mountCalculator } from './calculator.js';
import { mountEnquiry } from './enquiry.js';
import { mountVoices } from './voices.js';
import { mountReviewForm } from './review-form.js';

function setup() {
  initChrome();
  initMagnetic();
  initMotion();
  const calc = document.getElementById('calc-main');
  if (calc && !calc.dataset.mounted) { calc.dataset.mounted = '1'; mountCalculator(calc, { sentText: calc.dataset.sent }); }
  const enq = document.getElementById('enq');
  if (enq && !enq.dataset.mounted) { enq.dataset.mounted = '1'; mountEnquiry(enq); }
  collapseInclusions();
  document.querySelectorAll('[data-voices]').forEach(v => { if (!v.dataset.mounted) { v.dataset.mounted = '1'; mountVoices(v); } });
  const rf = document.getElementById('review-form');
  if (rf && !rf.dataset.mounted) { rf.dataset.mounted = '1'; mountReviewForm(rf); }
  countView();
  applySettings();
  currencyOrder();
}

/* One anonymous page count per view for the weekly digest: path only, no cookie, honours Do Not Track. */
function countView() {
  if (navigator.doNotTrack === '1' || location.hostname === 'localhost') return;
  try { navigator.sendBeacon('/api/hit', new Blob([JSON.stringify({ p: location.pathname })], { type: 'application/json' })); } catch (e) { /* ignore */ }
}

/* Settings Maryann edits in /admin: next available start, and her hours for the WhatsApp note. */
let settingsCache = null;
async function applySettings() {
  const lang = document.documentElement.lang === 'es' ? 'es' : 'en';
  try { if (!settingsCache) { const r = await fetch('/api/settings'); settingsCache = r.ok ? await r.json() : {}; } } catch (e) { settingsCache = {}; }
  const s = settingsCache || {};
  document.querySelectorAll('[data-next-start]').forEach(el => { if (s.nextStart) { el.textContent = el.dataset.nextStart.replace('{d}', s.nextStart); el.hidden = false; } });
  if (s.hours) {
    const p = new Intl.DateTimeFormat('en-GB', { timeZone: s.tz || 'Europe/Madrid', hourCycle: 'h23', hour: '2-digit', minute: '2-digit', weekday: 'short' }).formatToParts(new Date());
    const o = {}; p.forEach(x => { o[x.type] = x.value; });
    const wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday), hm = `${o.hour}:${o.minute}`;
    const open = s.hours.days.includes(wd) && hm >= s.hours.from && hm < s.hours.to;
    const note = (lang === 'es' ? 'respondo desde las {t} CET' : 'replies from {t} CET').replace('{t}', s.hours.from);
    document.querySelectorAll('a.btn[href^="https://wa.me"]').forEach(a => { if (open) { a.removeAttribute('data-note'); a.removeAttribute('title'); } else { a.setAttribute('data-note', note); a.title = note; } });
  }
}

/* UK and North American visitors see their own currency first in the small price line. */
async function currencyOrder() {
  let c = '';
  try { c = sessionStorage.getItem('me-country') || ''; if (!c) { const r = await fetch('/api/geo'); c = r.ok ? ((await r.json()).country || '') : ''; sessionStorage.setItem('me-country', c || '-'); } } catch (e) { return; }
  const first = c === 'GB' ? 'GBP' : (c === 'US' || c === 'CA') ? 'USD' : '';
  if (!first) return;
  document.querySelectorAll('.tier-price > span').forEach(el => {
    const parts = el.textContent.split(' · ').map(x => x.trim()); if (parts.length !== 2) return;
    const gbp = parts.find(x => x.startsWith('£')), usd = parts.find(x => x.startsWith('$') || x.startsWith('US$'));
    if (!gbp || !usd) return;
    el.innerHTML = first === 'GBP' ? `<b>${gbp}</b> · ${usd}` : `<b>${usd}</b> · ${gbp}`;
  });
}

/* Pricing cards on phones: show three inclusions, the rest behind a button. */
function collapseInclusions() {
  const narrow = window.matchMedia('(max-width: 767px)').matches;
  document.querySelectorAll('[data-inc]').forEach(ul => {
    const btn = ul.nextElementSibling;
    if (!narrow || ul.children.length <= 4) return;
    ul.classList.add('is-collapsed');
    if (btn?.matches('[data-inc-toggle]')) btn.hidden = false;
  });
  if (!window.__meIncBound) {
    window.__meIncBound = true;
    document.addEventListener('click', e => {
      const b = e.target.closest('[data-inc-toggle]'); if (!b) return;
      const ul = b.previousElementSibling, open = ul.classList.toggle('is-collapsed') === false;
      b.setAttribute('aria-expanded', String(open)); b.textContent = open ? b.dataset.less : b.dataset.more;
      if (!open) ul.scrollIntoView({ block: 'nearest' });
    });
  }
}

function teardown() {
  teardownMotion();
  teardownChrome();
}

export function start() {
  if (window.__meStarted) return;
  window.__meStarted = true;
  document.addEventListener('astro:page-load', setup);
  document.addEventListener('astro:before-swap', teardown);
  // The client router fires page-load for the first page too; this is a fallback if it never does.
  if (document.readyState === 'complete') setTimeout(() => { if (!window.__meMotion) setup(); }, 0);
}
