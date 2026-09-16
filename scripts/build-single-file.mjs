#!/usr/bin/env node
/* Builds dist/maryann-eniola-website.html: one self-contained file with CSS, JS and fonts inlined.
   Destination media switch to the inline SVG illustrations, because a single file can't carry the videos.
   Useful for hosts that only accept one HTML file, or for sharing a preview.
   Run: npm run build:single */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFile(path.join(ROOT, p), 'utf8');

async function inlineFonts(css) {
  const urls = [...css.matchAll(/url\("\.\.\/(assets\/fonts\/[^"]+)"\)/g)];
  for (const [match, rel] of urls) {
    try {
      const buf = await readFile(path.join(ROOT, rel));
      const type = rel.endsWith('.woff2') ? 'font/woff2' : 'font/ttf';
      css = css.replace(match, `url("data:${type};base64,${buf.toString('base64')}")`);
    } catch {
      console.warn(`Font not found: ${rel} (run npm run assets). The page will fall back to system fonts.`);
    }
  }
  return css;
}

(async () => {
  const html = await read('index.html');
  const cssFiles = [...html.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map(m => m[1]);
  const jsFiles = [...html.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);

  let css = '';
  for (const f of cssFiles) css += `/* ${f} */\n` + (f.endsWith('fonts.css') ? await inlineFonts(await read(f)) : await read(f)) + '\n';
  let js = 'window.ME_ASSETS = { mode: "inline" };\n';
  for (const f of jsFiles) js += `/* ${f} */\n` + (await read(f)) + '\n';

  const favicon = Buffer.from(await read('assets/icons/favicon.svg')).toString('base64');
  let out = html
    .replace(/\s*<link rel="preload"[^>]+>/g, '')
    .replace(/\s*<meta property="og:image"[^>]+>/, '')
    .replace(/\s*<link rel="apple-touch-icon"[^>]+>/, '')
    .replace(/<link rel="icon"[^>]+>/, `<link rel="icon" href="data:image/svg+xml;base64,${favicon}" type="image/svg+xml">`)
    .replace(/(\s*<link rel="stylesheet" href="[^"]+">)+/, `\n  <style>\n${css}</style>`)
    .replace(/(\s*<script src="[^"]+"><\/script>)+/, () => `\n  <script>\n${js.replace(/<\/script/gi, '<\\/script')}</script>`);

  await mkdir(path.join(ROOT, 'dist'), { recursive: true });
  const target = path.join(ROOT, 'dist', 'maryann-eniola-website.html');
  await writeFile(target, out);
  console.log(`Built ${path.relative(ROOT, target)} (${Math.round(out.length / 1024)} KB)`);
})();
