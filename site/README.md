# Maison Eniola · Website (multi-page)

Bilingual (English/Spanish) site for Maison Eniola (Maryann Eniola) and its three services: weddings, events and proposals; venue sourcing; and travel planning. Built with [Astro](https://astro.build): plain HTML and CSS with small scripts for the calculator, the enquiry form and motion.

## Run it

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run preview    # serve dist/ locally
```

Needs Node 22.12 or newer.

## Pages

| English | Spanish | What's on it |
|---|---|---|
| `/` | `/es/` | Film hero, the portal, three doors, the atlas, how I work, voices, where to next |
| `/weddings/`, `/venues/`, `/travel/` | `/es/…` | One service each: film opening, then the three levels, steps, payment and terms |
| `/destinations/` and `/destinations/{place}/` | `/es/…` | The four places, each with local time, how it gets checked and the service behind it |
| `/reviews/` | `/es/reviews/` | Client reviews, how they're checked, and how to share one |
| `/about/` | `/es/about/` | Maryann's story (placeholder), what she does and doesn't do, principles |
| `/estimate/` | `/es/estimate/` | The estimate calculator. "Add to my enquiry" carries the estimate to the form |
| `/enquire/` | `/es/enquire/` | Three-step enquiry form. Sends via WhatsApp or email; nothing is stored |
| `/legal/`, `/privacy/` | `/es/…` | Legal and privacy notices |

## Where things live

```
src/data/content.js   ALL prices, services, terms, form questions, legal text (EN + ES). Same content as the PDFs.
src/data/site.js      Navigation, page copy, destination details (coordinates, time zones, alt text), profile links
src/data/reviews.js   Client reviews (empty until real ones arrive)
src/views/            One file per page type; src/pages/ holds thin wrappers for /en and /es
src/components/       Media (photo + film), Tier (pricing card), PageHero, Voices, FinalCall, ServiceBody
src/scripts/          motion.js (scroll, reveals, films, portal, atlas), chrome.js (header, menu, clocks),
                      calculator.js, enquiry.js
src/styles/           tokens (colours, type, motion curve), base, immersive (night scenes), components (paper)
public/               Fonts, icons, OG image, destination photos and videos, _headers, robots.txt
CREDITS.txt           Adobe Stock licence record for the photos and videos
```

## Editing

- **Prices, inclusions, terms:** `src/data/content.js`. The calculator, pricing cards and terms update together.
- **Page copy and navigation:** `src/data/site.js`.
- **Reviews:** add entries to `src/data/reviews.js`. Only real clients, with their permission. The file explains each field. Until there is at least one, the reviews page shows an honest "first stories on their way" scene.
- **Review and social links:** fill in `PROFILES` in `src/data/site.js`. Each button appears only when its link is set. `googleReview` is the "Ask for reviews" link from Google Business Profile.
- **Maryann's story and portrait:** replace the placeholders in `COPY.about` (`src/data/site.js`) and the `.portrait` block in `src/views/About.astro`.
- **Photos and videos:** keep the file names in `public/images/places/` and `public/video/`. Sizes: cards 640×440 and 1280×880, wide 1280×720, videos 1280×720 muted loops of about 6 seconds.

## Navigation

`src/components/LuxuryNav.astro` is the floating cream-glass island: the MAISON ENIOLA lockup, two explorer links ("The Sourcing Matrix" → `/venues/`, "The Chronicles" → `/travel/`, the travel hub with the three levels, the journeys and client stories) with coral underlines that grow from the centre, the language switch, the "Request consultation" pill and the menu button. Every page is reachable from the full-screen menu and the footer (`MENU` in `src/data/site.js`); the two header links are `NAV`.

Links and the pill drift a few pixels towards the cursor within 30px (`src/scripts/nav.js`), on devices with a mouse only.

The hero postcards (`src/components/PostcardGallery.astro`) sit on a 3D canvas (`perspective: 1200px`) with baseline offsets: Amalfi −4°, Iceland +3° and 12px forward (on top), Mallorca −1° and 5px back. Each card tilts towards the cursor, pitch and yaw capped at ±8°, and eases back over 0.8s on leave. The script is embedded in the component and rebinds on `astro:page-load`.

Pages change through Astro's client router (`<ClientRouter />`), so the island is persisted (`transition:persist`) and stays anchored while the page beneath dissolves through light. `src/scripts/main.js` sets everything up on `astro:page-load` and tears it down on `astro:before-swap`: smooth scrolling, pinned scenes, films, the calculator and the form. After each navigation `chrome.js` refreshes the current-page mark and the language-switch targets inside the persisted island.

## Motion

One curve everywhere, `cubic-bezier(0.16, 1, 0.3, 1)`. Smooth scrolling (Lenis) drives GSAP ScrollTrigger for the portal that opens as you scroll, the atlas that travels sideways on wide screens, and parallax inside every film. Reveals rise out of a blur. Page changes cross-fade through light (cross-document view transitions, in browsers that support them).

If a visitor's device asks for reduced motion, none of this runs: the page is fully visible and still, and films are never downloaded (only the still photo shows). Films also stay off on 2G or Save-Data connections.

## Deploying to Cloudflare Pages

1. Push this folder to a Git repository (GitHub or GitLab).
2. In Cloudflare, **Workers & Pages → Create → Pages → Connect to Git**.
3. Build settings: framework preset **Astro**, build command `npm run build`, output directory `dist`, root directory `site` if the repository holds the whole project folder.
4. Add the domain under **Custom domains**.
5. Then set `site` in `astro.config.mjs` and the `Sitemap:` line in `public/robots.txt` to the live address, and redeploy.

`public/_headers` sets long caching for fonts, media and build files, plus basic security headers. It also works on Netlify. On Vercel, the same rules go in `vercel.json`.

## Before going live

- Fill in `[NIF]`, `[Business address]` and `[12 months]` in `LEGAL` in `src/data/content.js`.
- Domain is set to `maisoneniola.com` in `astro.config.mjs` and `robots.txt`. Point `info@maisoneniola.com` at the Gmail inbox (Cloudflare Email Routing) and then swap `CONTACT.email` in `content.js`.
- Brand: wordmark "MAISON ENIOLA" with the tagline "Independent Sourcing & Travel Design" (`COPY.meta` in `site.js`); the person named in the legal and privacy notices stays Maryann Eniola.
- Add Maryann's story and portrait.
- Fill in `PROFILES` (Google Business Profile at least).
- Confirm the rush fee rule (+30% of the fee including add-ons).
- Confirm The Proposal payment wording and update the Weddings PDF (see the main README).
- Have the cancellation terms checked by someone qualified.
