/* Pre-publish check, run after `astro build` (see package.json). Fails the build, and so the deploy, when:
   - an internal link or asset points at a file that does not exist in dist/
   - a page still contains a bracketed placeholder like [NIF] or [Maryann's story] */
import { readdirSync, readFileSync, statSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

const dist = resolve(process.argv[2] || 'dist');
const pages = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? walk(p) : f.endsWith('.html') && pages.push(p); } })(dist);

const problems = [];
const exists = u => {
  const clean = u.replace(/[?#].*$/, '');
  if (!clean.startsWith('/')) return true;
  const p = join(dist, clean);
  if (existsSync(p) && (statSync(p).isFile() || existsSync(join(p, 'index.html')))) return true;
  return existsSync(p.replace(/\/$/, '') + '.html'); // e.g. /404/ is served from 404.html
};
for (const page of pages) {
  const html = readFileSync(page, 'utf8'), rel = page.slice(dist.length);
  for (const m of html.matchAll(/\s(?:href|src|poster|data-webm|data-mp4)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|#|data:|javascript:)/.test(u)) continue;
    if (!exists(u)) problems.push(`${rel}: missing ${u}`);
  }
  for (const m of html.matchAll(/srcset="([^"]+)"/g)) for (const part of m[1].split(',')) { const u = part.trim().split(/\s+/)[0]; if (u && !exists(u)) problems.push(`${rel}: missing ${u}`); }
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
  for (const m of text.matchAll(/\[[A-Z][^\]\n]{1,80}\]/g)) problems.push(`${rel}: placeholder ${m[0]}`);
}
if (problems.length) { console.error(`\nPre-publish check failed (${problems.length}):\n  ${[...new Set(problems)].join('\n  ')}\n`); process.exit(1); }
console.log(`Pre-publish check passed: ${pages.length} pages, no missing links, no placeholders.`);
