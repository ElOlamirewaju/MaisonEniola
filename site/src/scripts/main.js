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
