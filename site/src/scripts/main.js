/* Single entry point. With the client router, pages swap without a reload, so every behaviour
   is set up on `astro:page-load` and torn down on `astro:before-swap`. */
import { initChrome, teardownChrome } from './chrome.js';
import { initMotion, teardownMotion } from './motion.js';
import { initMagnetic } from './nav.js';
import { mountCalculator } from './calculator.js';
import { mountEnquiry } from './enquiry.js';

function setup() {
  initChrome();
  initMagnetic();
  initMotion();
  const calc = document.getElementById('calc-main');
  if (calc && !calc.dataset.mounted) { calc.dataset.mounted = '1'; mountCalculator(calc, { sentText: calc.dataset.sent }); }
  const enq = document.getElementById('enq');
  if (enq && !enq.dataset.mounted) { enq.dataset.mounted = '1'; mountEnquiry(enq); }
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
