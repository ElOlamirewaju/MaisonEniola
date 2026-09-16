/* Motion for the whole site. Everything here is skipped when the visitor asks for reduced motion:
   the page then reads as a still, fully visible document and films are never loaded.

   - Smooth, weighted scrolling (Lenis) driving GSAP ScrollTrigger
   - Reveals: elements with [data-reveal] rise out of a blur; .split headings rise line by line
   - Films: <video data-film> gets its sources only when near the screen, and fades in once playing
   - Parallax: [data-parallax="0.15"] drifts at a fraction of scroll speed
   - Portal: the arched window opens to fill the screen as you scroll through it
   - Atlas: on wide screens the destination panels travel sideways while the section is pinned
   (The hero postcards' 3D tilt lives in components/PostcardGallery.astro.) */
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis = null, tick = null, observers = [];

export function initMotion() {
  window.__meMotion = true;
  window.__meST = ScrollTrigger; // for debugging in the console
  teardownMotion();
  if (reduced()) { document.documentElement.classList.remove('motion'); showAll(); return; }
  document.documentElement.classList.add('motion');

  gsap.registerPlugin(ScrollTrigger);
  lenis = new Lenis({ lerp: 0.085, wheelMultiplier: 0.95, anchors: { offset: -80 } });
  window.__meLenis = lenis;
  lenis.on('scroll', ScrollTrigger.update);
  tick = t => lenis.raf(t * 1000);
  gsap.ticker.add(tick);
  gsap.ticker.lagSmoothing(0);

  reveals();
  films();
  parallax();
  portal();
  atlas();
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

/* Called before the client router swaps pages, so nothing keeps animating a document that is gone. */
export function teardownMotion() {
  ScrollTrigger.getAll().forEach(s => s.kill());
  observers.forEach(o => o.disconnect()); observers = [];
  if (tick) { gsap.ticker.remove(tick); tick = null; }
  if (lenis) { lenis.destroy(); lenis = null; window.__meLenis = null; }
  document.querySelectorAll('.atlas.is-pinned').forEach(a => a.classList.remove('is-pinned'));
}

function showAll() {
  document.querySelectorAll('[data-reveal], .split').forEach(el => el.classList.add('is-in'));
}

function reveals() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.05 });
  document.querySelectorAll('[data-reveal], .split').forEach(el => io.observe(el));
  observers.push(io);
}

function films() {
  const vids = [...document.querySelectorAll('video[data-film]')];
  if (!vids.length) return;
  const conn = navigator.connection;
  if (conn && (conn.saveData || /2g/.test(conn.effectiveType || ''))) return;
  // Phones keep the still poster: the films are about 1 MB per page on mobile data.
  if (window.matchMedia('(max-width: 767px)').matches) return;
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.dataset.loaded) {
          v.dataset.loaded = '1';
          const webm = document.createElement('source'); webm.src = v.dataset.webm; webm.type = 'video/webm';
          const mp4 = document.createElement('source'); mp4.src = v.dataset.mp4; mp4.type = 'video/mp4';
          v.append(webm, mp4);
          v.addEventListener('playing', () => v.classList.add('is-playing'), { once: true });
          // Videos inserted by the client router don't always pick up `muted` from the attribute or start
          // resource selection when sources are appended, so set both explicitly.
          v.muted = true;
          v.load();
        }
        v.play().catch(() => {});
      } else if (v.dataset.loaded) v.pause();
    });
  }, { rootMargin: '30% 0px' });
  vids.forEach(v => io.observe(v));
  observers.push(io);
}

function parallax() {
  document.querySelectorAll('[data-parallax]').forEach(el => {
    const amount = parseFloat(el.dataset.parallax) || 0.15;
    const scene = el.closest('.hero, .page-hero, .portal, .final, .next-dest, .atlas-panel, .door, .dest-frame, .voices-empty') || el.parentElement;
    gsap.fromTo(el, { yPercent: -amount * 40 }, {
      yPercent: amount * 40, ease: 'none',
      scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}

function portal() {
  const portal = document.querySelector('[data-portal]');
  if (!portal) return;
  const win = portal.querySelector('.portal-window');
  const copy = portal.querySelector('.portal-copy');
  const narrow = window.matchMedia('(max-width: 767px)').matches;
  const from = narrow ? 'inset(16% 12% 12% 12% round 50vw 50vw 14px 14px)' : 'inset(14% 30% 10% 30% round 50vw 50vw 18px 18px)';
  // The pinned stretch is shorter on phones, so the service doors arrive sooner.
  gsap.timeline({ scrollTrigger: { trigger: portal, start: 'top top', end: narrow ? '+=60%' : '+=140%', pin: true, scrub: 0.6 } })
    .fromTo(win, { clipPath: from }, { clipPath: 'inset(0% 0% 0% 0% round 0px 0px 0px 0px)', ease: 'power2.inOut', duration: 1 })
    .fromTo(copy, { opacity: 0, y: 40, filter: 'blur(12px)' }, { opacity: 1, y: 0, filter: 'blur(0px)', ease: 'power2.out', duration: 0.5 }, 0.45);
}

function atlas() {
  const atlas = document.querySelector('[data-atlas]');
  if (!atlas) return;
  const mq = window.matchMedia('(min-width: 1080px)');
  if (!mq.matches) return;
  atlas.classList.add('is-pinned');
  const track = atlas.querySelector('.atlas-track');
  const bar = atlas.querySelector('.atlas-progress i');
  const distance = () => track.scrollWidth - window.innerWidth;
  gsap.to(track, {
    x: () => -distance(), ease: 'none',
    scrollTrigger: {
      trigger: atlas, start: 'top top', end: () => '+=' + distance(), pin: true, scrub: 0.8, invalidateOnRefresh: true,
      onUpdate: self => { if (bar) bar.style.transform = `scaleX(${self.progress})`; },
    },
  });
}

