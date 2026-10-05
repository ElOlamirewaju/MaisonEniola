/* Draws the travel map once, at authoring time; the outputs are committed, so the site build needs no map libraries.
   Run from site/:  node scripts/build-map.mjs
   Writes:
     public/maps/europe-desk.svg   1000×620, Iceland to the eastern Mediterranean (desktop and tablet)
     public/maps/europe-phone.svg  400×330, a tighter frame for phones
     public/maps/contours.svg      a faint topographic texture for night sections
     src/data/map.json             where each destination and each known place falls on both maps, in percent
   Geography: Natural Earth via world-atlas (public domain), simplified with topojson-simplify. */
import { geoConicConformal, geoPath, geoGraticule } from 'd3-geo';
import { feature, mesh } from 'topojson-client';
import { presimplify, quantile, simplify } from 'topojson-simplify';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { PLACE_META } from '../src/data/site.js';

const raw = JSON.parse(readFileSync(new URL('../node_modules/world-atlas/countries-50m.json', import.meta.url), 'utf8'));
const pre = presimplify(raw);
const topo = simplify(pre, quantile(pre, 0.2));
const countries = feature(topo, topo.objects.countries).features;
const borders = mesh(topo, topo.objects.countries, (a, b) => a !== b);

const FRAMES = {
  desk: { w: 1000, h: 620, extent: [[-25, 66.8], [32, 66.8], [-12, 34.5], [30, 34.5]] },
  phone: { w: 400, h: 330, extent: [[-24.5, 66.6], [27, 66.6], [-10.5, 35.2], [27, 35.2]] },
};

/* Places a review might mention, most specific first, so "Rome" wins over "Italy". [label, lat, lon, ...aliases] */
const GAZETTEER = [
  ['Positano', 40.63, 14.48], ['Amalfi Coast', 40.63, 14.6, 'amalfi'], ['Capri', 40.55, 14.24], ['Naples', 40.85, 14.27, 'napoli'],
  ['Rome', 41.9, 12.5, 'roma'], ['Florence', 43.77, 11.25, 'firenze'], ['Venice', 45.44, 12.32, 'venezia'], ['Milan', 45.46, 9.19, 'milano'],
  ['Lake Como', 46.0, 9.26, 'como'], ['Tuscany', 43.4, 11.0, 'toscana'], ['Sicily', 37.6, 14.0, 'sicilia'], ['Sardinia', 40.1, 9.0, 'sardegna'],
  ['Paris', 48.86, 2.35], ['Nice', 43.7, 7.27], ['Provence', 43.9, 5.2], ['Corsica', 42.0, 9.0], ['London', 51.51, -0.13], ['Edinburgh', 55.95, -3.19],
  ['Scotland', 56.5, -4.2], ['Dublin', 53.35, -6.26], ['Amsterdam', 52.37, 4.9], ['Brussels', 50.85, 4.35], ['Berlin', 52.52, 13.4], ['Munich', 48.14, 11.58],
  ['Prague', 50.08, 14.44, 'praha'], ['Vienna', 48.21, 16.37, 'wien'], ['Budapest', 47.5, 19.04], ['Krakow', 50.06, 19.94, 'kraków'],
  ['Copenhagen', 55.68, 12.57], ['Stockholm', 59.33, 18.07], ['Oslo', 59.91, 10.75], ['Reykjavik', 64.15, -21.94, 'reykjavík'],
  ['Lisbon', 38.72, -9.14, 'lisboa'], ['Porto', 41.15, -8.61], ['Algarve', 37.1, -8.2], ['Madeira', 32.75, -16.95], ['Madrid', 40.42, -3.7],
  ['Barcelona', 41.39, 2.17], ['Seville', 37.39, -5.98, 'sevilla'], ['Malaga', 36.72, -4.42, 'málaga'], ['Marbella', 36.51, -4.88],
  ['Ibiza', 38.98, 1.43], ['Mallorca', 39.62, 2.9, 'majorca', 'palma'], ['Menorca', 39.95, 4.1], ['Canary Islands', 28.3, -16.5, 'tenerife', 'gran canaria', 'lanzarote'],
  ['Santorini', 36.39, 25.46], ['Mykonos', 37.45, 25.33], ['Crete', 35.24, 24.8], ['Athens', 37.98, 23.73], ['Corfu', 39.62, 19.92],
  ['Dubrovnik', 42.65, 18.09], ['Split', 43.51, 16.44], ['Hvar', 43.17, 16.44], ['Kotor', 42.42, 18.77], ['Budva', 42.29, 18.84],
  ['Tirana', 41.33, 19.82], ['Saranda', 39.88, 20.0, 'sarandë'], ['Ksamil', 39.77, 20.0], ['Istanbul', 41.01, 28.98], ['Valletta', 35.9, 14.51],
  ['Zurich', 47.37, 8.54, 'zürich'], ['Geneva', 46.2, 6.14], ['Interlaken', 46.69, 7.86], ['Salzburg', 47.8, 13.04], ['Lake Bled', 46.36, 14.09, 'bled'],
  // countries last
  ['Albania', 41.1, 20.0], ['Montenegro', 42.75, 19.3], ['Croatia', 45.1, 15.2], ['Greece', 39.1, 22.0], ['Italy', 42.8, 12.5, 'italia'],
  ['Spain', 40.2, -3.7, 'españa'], ['Portugal', 39.6, -8.0], ['France', 46.6, 2.4], ['Czech Republic', 49.8, 15.5, 'czechia', 'czech'],
  ['Austria', 47.6, 14.1], ['Germany', 51.1, 10.4], ['Netherlands', 52.2, 5.3, 'holland'], ['Belgium', 50.6, 4.6], ['Switzerland', 46.8, 8.2],
  ['Hungary', 47.1, 19.5], ['Poland', 52.1, 19.4], ['Slovenia', 46.1, 14.8], ['Bosnia', 44.2, 17.9], ['Serbia', 44.0, 20.9], ['Bulgaria', 42.7, 25.5],
  ['Romania', 45.9, 25.0], ['Iceland', 64.9, -18.6], ['Norway', 61.0, 9.0], ['Sweden', 62.0, 15.0], ['Finland', 64.0, 26.0], ['Denmark', 56.0, 10.0],
  ['Ireland', 53.4, -8.0], ['United Kingdom', 54.0, -2.0, 'uk', 'england'], ['Malta', 35.9, 14.4], ['Cyprus', 35.0, 33.0], ['Turkey', 39.0, 32.0, 'türkiye'],
];

const pct = (n, total) => Math.round(n / total * 10000) / 100;
const out = { frames: {}, places: {}, gazetteer: [] };
mkdirSync(new URL('../public/maps/', import.meta.url), { recursive: true });

const projections = {};
for (const [key, F] of Object.entries(FRAMES)) {
  const proj = geoConicConformal().rotate([-5, 0]).parallels([38, 60])
    .fitExtent([[12, 12], [F.w - 12, F.h - 12]], { type: 'MultiPoint', coordinates: F.extent })
    .clipExtent([[0, 0], [F.w, F.h]]);
  projections[key] = proj;
  const path = geoPath(proj).digits(1);
  let land = '';
  for (const f of countries) { const d = path(f); if (d) land += d; }
  const grid = path(geoGraticule().step([10, 10])());
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${F.w} ${F.h}" width="${F.w}" height="${F.h}">`
    + `<path d="${grid}" fill="none" stroke="#F6F1E4" stroke-opacity=".07" stroke-width=".6" stroke-dasharray="2 5"/>`
    + `<path d="${land}" fill="#0B3350" fill-opacity=".92" stroke="#F6F1E4" stroke-opacity=".34" stroke-width=".7" stroke-linejoin="round"/>`
    + `<path d="${path(borders)}" fill="none" stroke="#F6F1E4" stroke-opacity=".11" stroke-width=".5"/>`
    + `</svg>`;
  writeFileSync(new URL(`../public/maps/europe-${key}.svg`, import.meta.url), svg);
  out.frames[key] = { w: F.w, h: F.h };
  console.log(`europe-${key}.svg`, svg.length, 'bytes');
}

const at = (lat, lon) => {
  const r = {};
  for (const [key, proj] of Object.entries(projections)) {
    const [x, y] = proj([lon, lat]); const F = FRAMES[key];
    r[key] = x >= 6 && y >= 6 && x <= F.w - 6 && y <= F.h - 6 ? [pct(x, F.w), pct(y, F.h)] : null;
  }
  return r;
};
const parse = s => { const m = s.match(/([\d.]+)° ([NS]), ([\d.]+)° ([EW])/); return [(+m[1]) * (m[2] === 'S' ? -1 : 1), (+m[3]) * (m[4] === 'W' ? -1 : 1)]; };
for (const [id, m] of Object.entries(PLACE_META)) { const [lat, lon] = parse(m.coords); out.places[id] = { lat, lon, ...at(lat, lon) }; }
for (const [label, lat, lon, ...aliases] of GAZETTEER) {
  const p = at(lat, lon); if (!p.desk && !p.phone) continue;
  out.gazetteer.push({ label, names: [label.toLowerCase(), ...aliases], ...p });
}
writeFileSync(new URL('../src/data/map.json', import.meta.url), JSON.stringify(out));
console.log('map.json:', Object.keys(out.places).length, 'destinations,', out.gazetteer.length, 'known places');

/* Contour texture: rings around a few irregular "hills", a 1600×1000 sheet used at very low opacity. */
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const hills = [[260, 240], [980, 180], [1380, 620], [620, 760], [1180, 880], [120, 860]];
let rings = '';
for (const [cx, cy] of hills) {
  const ph = Array.from({ length: 4 }, () => rnd() * Math.PI * 2), amp = Array.from({ length: 4 }, () => .06 + rnd() * .1);
  for (let k = 1; k <= 9; k++) {
    const r = k * (26 + rnd() * 6); let d = '';
    for (let a = 0; a <= 72; a++) {
      const t = a / 72 * Math.PI * 2;
      const wob = 1 + amp[0] * Math.sin(2 * t + ph[0]) + amp[1] * Math.sin(3 * t + ph[1]) + amp[2] * Math.sin(5 * t + ph[2]) * (k / 9) + amp[3] * Math.cos(t + ph[3]);
      d += `${a ? 'L' : 'M'}${(cx + Math.cos(t) * r * wob * 1.35).toFixed(1)} ${(cy + Math.sin(t) * r * wob).toFixed(1)}`;
    }
    rings += `<path d="${d}Z"/>`;
  }
}
writeFileSync(new URL('../public/maps/contours.svg', import.meta.url),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="#F6F1E4" stroke-opacity=".045" stroke-width="1">${rings}</g></svg>`);
console.log('contours.svg written');
