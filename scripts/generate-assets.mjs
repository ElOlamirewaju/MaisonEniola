#!/usr/bin/env node
/* Generates every binary asset the site uses:
     assets/fonts/            DM Serif Display + Poppins (downloaded from the Google Fonts repository, OFL)
     assets/images/places/    postcard (16:11) and wide (16:9) WebP illustrations for each destination
     assets/video/            6-second seamless loops (MP4/H.264 + WebM/VP9) used in the lightbox
     assets/images/og-image.png, assets/icons/apple-touch-icon.png
   Requirements: Node 18+, `npm install` (for @resvg/resvg-js) and ffmpeg on your PATH.
   Run: npm run assets            (add --skip-video to only make images and fonts)
   Existing destination images and videos are kept; add --force to replace them with illustrations. */
import { mkdir, writeFile, readFile, rm, access } from 'node:fs/promises';
import { execFileSync, spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const A = p => path.join(ROOT, 'assets', p);
const SKIP_VIDEO = process.argv.includes('--skip-video');
/* Destination photos and videos that already exist (e.g. licensed stock) are kept unless --force is passed. */
const FORCE = process.argv.includes('--force');

let Resvg;
try { ({ Resvg } = require('@resvg/resvg-js')); }
catch { console.error('\nMissing dependency. Run `npm install` first.\n'); process.exit(1); }
const { scene } = require(path.join(ROOT, 'js', 'scenes.js'));

const has = cmd => spawnSync(process.platform === 'win32' ? 'where' : 'which', [cmd]).status === 0;
const HAS_FFMPEG = has('ffmpeg');
const HAS_CWEBP = has('cwebp');
const exists = async p => { try { await access(p); return true; } catch { return false; } };

const PLACES = [
  { id: 'amalfi', scene: 'cliffs' },
  { id: 'iceland', scene: 'north' },
  { id: 'mallorca', scene: 'finca' },
  { id: 'lisbon', scene: 'city' },
];

const FONTS = [
  ['DMSerifDisplay-Regular.ttf', 'https://github.com/google/fonts/raw/main/ofl/dmserifdisplay/DMSerifDisplay-Regular.ttf'],
  ['DMSerifDisplay-Italic.ttf', 'https://github.com/google/fonts/raw/main/ofl/dmserifdisplay/DMSerifDisplay-Italic.ttf'],
  ['Poppins-Regular.ttf', 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf'],
  ['Poppins-Medium.ttf', 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Medium.ttf'],
  ['Poppins-Bold.ttf', 'https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf'],
];

/* Give the 400×260 illustration an output size; "slice" crops it to fill any aspect ratio. */
function sized(svg, w, h) {
  return svg.replace('<svg ', `<svg width="${w}" height="${h}" `);
}

function renderPng(svg, width, fontFiles) {
  const r = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: fontFiles ? { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Poppins' } : { loadSystemFonts: true },
    shapeRendering: 2,
  });
  return r.render().asPng();
}

async function toWebp(pngPath, outPath, quality = 82) {
  if (HAS_CWEBP) execFileSync('cwebp', ['-quiet', '-q', String(quality), pngPath, '-o', outPath]);
  else if (HAS_FFMPEG) execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', pngPath, '-c:v', 'libwebp', '-quality', String(quality), outPath]);
  else throw new Error('Install cwebp or ffmpeg to create WebP files.');
}

async function fonts() {
  await mkdir(A('fonts'), { recursive: true });
  for (const [name, url] of FONTS) {
    const out = A(`fonts/${name}`);
    if (await exists(out)) { console.log(`  font ok      ${name}`); continue; }
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Could not download ${name} (${res.status})`);
    await writeFile(out, Buffer.from(await res.arrayBuffer()));
    console.log(`  font saved   ${name}`);
  }
}

async function images(tmp) {
  await mkdir(A('images/places'), { recursive: true });
  for (const p of PLACES) {
    const jobs = [
      [`${p.id}-card-1280`, 1280, 880],
      [`${p.id}-card-640`, 640, 440],
      [`${p.id}-wide-1280`, 1280, 720],
    ];
    for (const [name, w, h] of jobs) {
      if (!FORCE && await exists(A(`images/places/${name}.webp`))) { console.log(`  image kept   images/places/${name}.webp`); continue; }
      const png = path.join(tmp, `${name}.png`);
      await writeFile(png, renderPng(sized(scene(p.scene, { t: 0, uid: name }), w, h), w));
      await toWebp(png, A(`images/places/${name}.webp`));
      console.log(`  image        images/places/${name}.webp`);
    }
  }
}

async function videos(tmp) {
  if (SKIP_VIDEO) { console.log('  video        skipped (--skip-video)'); return; }
  if (!HAS_FFMPEG) { console.warn('  video        skipped: ffmpeg not found (brew install ffmpeg)'); return; }
  await mkdir(A('video'), { recursive: true });
  const FPS = 24, SECONDS = 6, FRAMES = FPS * SECONDS, W = 1280, H = 720;
  for (const p of PLACES) {
    if (!FORCE && await exists(A(`video/${p.id}.mp4`))) { console.log(`  video kept   video/${p.id}.mp4 + .webm`); continue; }
    const dir = path.join(tmp, `frames-${p.id}`);
    await mkdir(dir, { recursive: true });
    for (let f = 0; f < FRAMES; f++) {
      const svg = sized(scene(p.scene, { t: f / FRAMES, uid: `${p.id}f` }), W, H);
      await writeFile(path.join(dir, `f${String(f).padStart(4, '0')}.png`), renderPng(svg, W));
    }
    const input = ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.png')];
    execFileSync('ffmpeg', [...input, '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '24', '-preset', 'slow', '-movflags', '+faststart', '-an', A(`video/${p.id}.mp4`)]);
    const webm = A(`video/${p.id}.webm`);
    try {
      /* The PNG frames carry alpha (gbrap), which libvpx-vp9 rejects; force the standard 4:2:0 format. */
      execFileSync('ffmpeg', [...input, '-c:v', 'libvpx-vp9', '-pix_fmt', 'yuv420p', '-b:v', '0', '-crf', '38', '-row-mt', '1', '-an', webm], { stdio: ['ignore', 'ignore', 'pipe'] });
      console.log(`  video        video/${p.id}.mp4 + .webm (${FRAMES} frames)`);
    } catch (err) {
      /* An empty .webm would be picked before the MP4 and play blank, so remove it. */
      await rm(webm, { force: true });
      const reason = String(err.stderr || err.message).trim().split('\n')[0];
      console.warn(`  video        video/${p.id}.mp4 only; WebM failed (${reason}). The MP4 plays everywhere.`);
    }
  }
}

async function brandImages(tmp) {
  const fontFiles = FONTS.map(([n]) => A(`fonts/${n}`));
  // Open Graph image for link previews (1200×630)
  const art = scene('finca', { t: 0, uid: 'og' }).replace('<svg ', '<svg x="700" y="90" width="440" height="450" ');
  const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <rect width="1200" height="630" fill="#FFFDF4"/>
    <rect x="682" y="72" width="476" height="486" fill="#FFFEF9" transform="rotate(3 920 315)"/>
    <g transform="rotate(3 920 315)">${art}</g>
    <rect x="0" y="0" width="1200" height="10" fill="#E75B24"/>
    <text x="70" y="140" font-family="Poppins" font-weight="500" font-size="28" fill="#047E84">Maryann Eniola</text>
    <text x="70" y="250" font-family="DM Serif Display" font-size="68" fill="#063A5C">Where to go,</text>
    <text x="70" y="330" font-family="DM Serif Display" font-size="68" fill="#063A5C">where to say yes,</text>
    <text x="70" y="410" font-family="DM Serif Display" font-size="68" fill="#063A5C">and how everyone</text>
    <text x="70" y="490" font-family="DM Serif Display" font-size="68" fill="#063A5C">gets there.</text>
    <text x="70" y="560" font-family="Poppins" font-size="24" fill="#5E5A52">Travel, weddings and venue sourcing</text>
  </svg>`;
  await mkdir(A('images'), { recursive: true });
  await writeFile(A('images/og-image.png'), renderPng(og, 1200, fontFiles));
  console.log('  image        images/og-image.png');
  const fav = await readFile(A('icons/favicon.svg'), 'utf8');
  await writeFile(A('icons/apple-touch-icon.png'), renderPng(fav.replace('<svg ', '<svg width="180" height="180" '), 180));
  console.log('  icon         icons/apple-touch-icon.png');
}

(async () => {
  console.log('\nGenerating assets for Maryann Eniola’s website\n');
  const tmp = path.join(ROOT, '.frames');
  await rm(tmp, { recursive: true, force: true });
  await mkdir(tmp, { recursive: true });
  try {
    await fonts();
    await images(tmp);
    await brandImages(tmp);
    await videos(tmp);
  } finally {
    await rm(tmp, { recursive: true, force: true });
  }
  console.log('\nDone. Start the site with `npm start` or VS Code Live Server.\n');
})().catch(err => { console.error('\n' + err.message + '\n'); process.exit(1); });
