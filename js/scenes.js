/* Destination illustrations.
   scene(type, { t, uid }) returns an SVG string.
   t is the loop position from 0 to 1. The asset script renders frames at many t values
   to make the looping videos; the browser uses t = 0 as a still fallback. */
(function (root) {
  const TAU = Math.PI * 2;
  let counter = 0;

  function scene(type, opts) {
    const o = opts || {};
    const t = o.t || 0;
    const p = o.uid || 'sc' + (++counter);
    const s = Math.sin(TAU * t);
    const c = Math.cos(TAU * t);
    const open = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">`;
    const sky = (a, b, d) => `<defs><linearGradient id="${p}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".6" stop-color="${b}"/><stop offset="1" stop-color="${d}"/></linearGradient></defs><rect width="400" height="260" fill="url(#${p}s)"/>`;
    // Moving dashed lines give water a seamless shimmer: the offset travels two dash periods per loop.
    const shimmer = (ys, color, op) => ys.map((y, i) => `<path d="M-40 ${y}H440" stroke="${color}" stroke-width="2" stroke-dasharray="26 14" stroke-dashoffset="${(-t * 80 - i * 13).toFixed(2)}" opacity="${op}"/>`).join('');

    if (type === 'cliffs') {
      const houses = [[262, 118, '#F6D9B8'], [286, 108, '#F2C3A6'], [310, 124, '#FBE8C8'], [244, 140, '#EFB99A'], [274, 146, '#F8E1C0'], [300, 152, '#E9A987'], [330, 140, '#F6D3A8'], [258, 170, '#FBEAD2'], [292, 178, '#F1BF95'], [322, 170, '#F8DDBB']];
      const boatX = 60 + s * 8;
      return open + sky('#8EC5D6', '#F7D7B5', '#F4B78F') +
        `<circle cx="120" cy="${(92 + s * 2).toFixed(2)}" r="26" fill="#FBE3A3"/>` +
        `<ellipse cx="${(180 + c * 14).toFixed(2)}" cy="54" rx="34" ry="8" fill="#FFFDF4" opacity=".55"/>` +
        `<rect y="160" width="400" height="100" fill="#1F7F97"/>` + shimmer([176, 196, 220, 240], '#8BC6D3', .55) +
        `<path d="M200 260 C220 150 230 120 262 96 C300 70 340 72 400 60 V260Z" fill="#5E6B4A"/><path d="M230 260 C245 190 260 160 300 140 C340 124 370 120 400 118 V260Z" fill="#4A5A3C"/>` +
        houses.map(h => `<rect x="${h[0]}" y="${h[1]}" width="20" height="16" fill="${h[2]}"/><rect x="${h[0] + 6}" y="${h[1] + 6}" width="5" height="6" fill="#3E5A6B" opacity=".6"/>`).join('') +
        `<circle cx="352" cy="200" r="5" fill="#F2C94C"/><circle cx="366" cy="210" r="5" fill="#F2C94C"/><circle cx="342" cy="216" r="5" fill="#F2C94C"/>` +
        `<g transform="translate(${boatX.toFixed(2)} ${(s * 1.2).toFixed(2)})"><path d="M0 190 l18 -4 l18 4 z" fill="#FFFDF4"/><path d="M18 186 v-20 l14 18z" fill="#FFFDF4"/></g></svg>`;
    }

    if (type === 'north') {
      return open + sky('#6D7FA6', '#D9A7A0', '#F5C37A') +
        `<circle cx="210" cy="168" r="${(30 + s * 1.5).toFixed(2)}" fill="#FCE3A6" opacity="${(.86 + s * .06).toFixed(3)}"/>` +
        `<ellipse cx="${(90 + c * 18).toFixed(2)}" cy="70" rx="48" ry="9" fill="#F4D3C4" opacity=".45"/><ellipse cx="${(300 - c * 14).toFixed(2)}" cy="96" rx="40" ry="7" fill="#F4D3C4" opacity=".35"/>` +
        `<path d="M0 150 L60 120 L120 140 L190 104 L260 136 L330 112 L400 138 V180 H0Z" fill="#4E5D78" opacity=".55"/>` +
        `<rect y="170" width="400" height="44" fill="#5B7A94"/>` + shimmer([182, 196, 206], '#F5C37A', .4) +
        `<path d="M40 214 V120 L58 110 L72 124 V214Z M300 214 V132 L312 122 L326 136 V214Z M334 214 V150 L344 144 L354 156 V214Z" fill="#1E2430"/>` +
        `<path d="M0 214 C80 204 160 222 240 212 C300 206 360 216 400 210 V260 H0Z" fill="#23272E"/>` +
        `<path d="M-20 ${(232 + s * 2).toFixed(2)} C90 224 190 240 420 228" stroke="#FFFDF4" stroke-width="2" opacity=".35" fill="none"/></svg>`;
    }

    if (type === 'finca') {
      const olive = (x, y, k, ph) => {
        const sway = Math.sin(TAU * t + ph) * 1.2;
        return `<g transform="rotate(${sway.toFixed(3)} ${x} ${y + 22 * k})"><rect x="${x - 2}" y="${y}" width="4" height="${22 * k}" fill="#6B5A43"/><ellipse cx="${x}" cy="${y}" rx="${22 * k}" ry="${14 * k}" fill="#7C8A5B"/><ellipse cx="${x + 8 * k}" cy="${y - 6 * k}" rx="${14 * k}" ry="${10 * k}" fill="#909E6B"/></g>`;
      };
      const lights = [150, 170, 190, 210, 230, 250, 270].map((x, i) => {
        const y = 116 + [2, 5, 7, 8, 7, 5, 2][i];
        const glow = .55 + .45 * Math.max(0, Math.sin(TAU * t * 2 + i * 1.3));
        return `<circle cx="${x}" cy="${y}" r="6" fill="#FFE49A" opacity="${(glow * .25).toFixed(3)}"/><circle cx="${x}" cy="${y}" r="2.6" fill="#FFE49A" opacity="${glow.toFixed(3)}"/>`;
      }).join('');
      return open + sky('#9DC7D8', '#F4DDB8', '#F2C08F') +
        `<ellipse cx="${(120 + c * 20).toFixed(2)}" cy="60" rx="42" ry="8" fill="#FFFDF4" opacity=".5"/>` +
        `<path d="M0 150 L50 118 L110 136 L170 96 L240 128 L300 108 L400 130 V170 H0Z" fill="#9AA2A8" opacity=".6"/>` +
        `<rect y="160" width="400" height="100" fill="#D9BE8C"/><path d="M0 200 C100 190 300 212 400 198 V260H0Z" fill="#C9A874"/>` +
        `<rect x="140" y="112" width="140" height="70" fill="#E9CFA0"/><path d="M130 114 L210 86 L290 114Z" fill="#B8664A"/>` +
        `<path d="M196 182 v-30 a14 14 0 0 1 28 0 v30z" fill="#6E4E3A"/><rect x="156" y="130" width="18" height="18" fill="#6E4E3A" opacity=".8"/><rect x="246" y="130" width="18" height="18" fill="#6E4E3A" opacity=".8"/>` +
        `<path d="M140 110 C180 124 240 124 280 110" stroke="#3A3A3A" stroke-width="1" fill="none"/>` + lights +
        olive(70, 170, 1.2, 0) + olive(340, 176, 1.3, 1.7) + olive(30, 206, .9, 3.1) + `</svg>`;
    }

    // city (Lisbon)
    const cols = ['#F2D8B5', '#F7E7C7', '#EAC39D', '#F3CFA8', '#FFF1D6', '#E8B48E'];
    let x = -10;
    const roofs = [];
    for (let i = 0; i < 12; i++) {
      const w = 34 + (i * 7) % 16, h = 60 + (i * 23) % 50;
      roofs.push(`<rect x="${x}" y="${250 - h}" width="${w}" height="${h}" fill="${cols[i % cols.length]}"/><path d="M${x - 2} ${250 - h} L${x + w / 2} ${238 - h} L${x + w + 2} ${250 - h}Z" fill="#C0643F"/><rect x="${x + 8}" y="${262 - h}" width="6" height="9" fill="#5A7C8C" opacity=".55"/><rect x="${x + w - 14}" y="${262 - h}" width="6" height="9" fill="#5A7C8C" opacity=".55"/>`);
      x += w + 2;
    }
    // The tram crosses once per loop and starts and ends off-screen, so the loop is seamless.
    const tramX = -100 + t * 500;
    return open + sky('#86BFD9', '#F6E1BF', '#F4C799') +
      `<circle cx="318" cy="${(70 + s * 2).toFixed(2)}" r="22" fill="#FCE7AE"/>` +
      `<ellipse cx="${(110 + c * 16).toFixed(2)}" cy="52" rx="38" ry="7" fill="#FFFDF4" opacity=".55"/>` +
      `<rect y="118" width="400" height="26" fill="#6FA7BE"/>` + shimmer([126, 136], '#CFE6EE', .5) +
      `<path d="M0 122 L80 112 L160 118 L240 108 L320 116 L400 110 V120 H0Z" fill="#9FB3A4" opacity=".7"/>` + roofs.join('') +
      `<g transform="translate(${tramX.toFixed(2)} 0)"><rect x="0" y="206" width="84" height="38" rx="6" fill="#F2B632"/><rect x="8" y="214" width="16" height="12" fill="#FFFDF4" opacity=".85"/><rect x="32" y="214" width="16" height="12" fill="#FFFDF4" opacity=".85"/><rect x="56" y="214" width="16" height="12" fill="#FFFDF4" opacity=".85"/><path d="M42 206 L52 186" stroke="#2B2B2B" stroke-width="2"/><circle cx="18" cy="246" r="5" fill="#2B2B2B"/><circle cx="66" cy="246" r="5" fill="#2B2B2B"/></g>` +
      `<path d="M0 187 H400" stroke="#2B2B2B" stroke-width="1" opacity=".5"/><rect y="250" width="400" height="10" fill="#8A7B68"/></svg>`;
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = { scene };
  else { root.ME = root.ME || {}; root.ME.scene = scene; }
})(typeof window !== 'undefined' ? window : globalThis);
