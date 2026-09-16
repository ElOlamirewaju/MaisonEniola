# Maryann Eniola · Website

> **The current site is the multi-page version in [`site/`](site/README.md).** Everything below describes the original one-page version, kept here as a reference and for the single-file build. Content edits should go in `site/src/data/content.js`; `js/data.js` is no longer the live copy.

Bilingual (English/Spanish) website for Maryann Eniola's three services: weddings, events and proposals; venue sourcing; and independent travel planning. Plain HTML, CSS and JavaScript with no framework and no build step to run it.

## Run it in VS Code

1. Open this folder in VS Code (**File → Open Folder…**).
2. Install the recommended **Live Server** extension when VS Code asks.
3. In the VS Code terminal, run once:
   ```bash
   npm install
   npm run assets
   ```
   The files are already in `assets/`, so this step is only needed to rebuild them. It downloads the fonts and makes the social image and app icon. It keeps any destination photos and videos already in `assets/`. It only draws illustrations for ones that are missing, which takes one to three minutes. Use `npm run assets:images` to skip the videos. `npm run assets -- --force` replaces the photos with illustrations, so avoid it.
4. Right-click `index.html` → **Open with Live Server**, or run `npm start` and open http://localhost:5173.

The calculator on its own: `components/estimate-calculator/index.html`.

## Project map

```
index.html                         Page shell: loads CSS and scripts
css/
  fonts.css                        Self-hosted DM Serif Display + Poppins
  tokens.css                       Colours, type, shadows, luxury motion curve
  base.css                         Reset, buttons, header, sections, footer
  components.css                   Postcards, pricing cards, calculator, form, dialogs
  motion.css                       Floating postcards, card lift, lightbox sequence
js/
  data.js                          ALL copy, prices, add-ons, terms (EN + ES). Edit content here.
  scenes.js                        Destination illustrations (also used to render the videos)
  utils.js                         Translation, currency formatting, icons, media helpers
  components/estimate-calculator.js  Reusable estimate calculator
  components/dialogs.js            Lightbox and legal/privacy dialogs
  components/motion.js             Pointer-aware postcard tilt
  app.js                           Page sections, enquiry form, events
components/estimate-calculator/    Standalone calculator demo page
scripts/
  generate-assets.mjs              Fonts, WebP images, MP4/WebM loops, OG image, icons
  build-single-file.mjs            One self-contained HTML file in dist/
assets/                            Fonts, icons, OG image; licensed destination photos and videos
CREDITS.txt                        Adobe Stock licence record for the destination photos and videos
```

## Editing content

Everything a visitor reads lives in `js/data.js`, with `en` and `es` side by side. Prices are numbers (`price: 950`); add-on types are `toggle`, `qty` (with `max` and `unit`), `pct` (rush) and `ref` (text only). The calculator and pricing cards update automatically.

The PDF price guides in `Masion Eniola/` are generated from the site's content (`site/src/data/content.js`), in English and Spanish, by `python3 scripts/build-pdfs.py` (needs `pip3 install reportlab`). Change prices or terms in `content.js`, rebuild the site, and run the script: the site and the PDFs can't drift apart. PDF-only copy (titles, intros, the "at a glance" table) lives in `PDF_COPY` at the bottom of `content.js`.

## Design and motion rules in this build

- **Palette:** Deep Ocean `#063A5C`, Coral `#E75B24`, Teal `#047E84`, Marigold `#E6A123`, Cream `#FFFDF4`. White text sits only on the deeper coral `#C84A16` (4.7:1) and teal (4.9:1). Gold text uses `#8A5E0A`.
- **One motion curve:** `cubic-bezier(0.16, 1, 0.3, 1)` over 0.7s (`--luxury-ease`, `--luxury-duration` in `tokens.css`). Components list the properties they animate instead of `all`, which keeps scrolling smooth.
- **Hero postcards:** float 4px over 6 seconds; on hover they scale to 1.04, lean a further 2deg and deepen their shadow; with a mouse they turn slightly towards the cursor.
- **Pricing cards (wide screens with a mouse):** the hovered card lifts 8px with a soft coral edge, the others settle to 0.55 opacity, and its heading details drift up 4px one after another.
- **Lightbox:** glass backdrop `rgba(6,58,92,.35)` with `blur(20px) saturate(140%)` (solid fallback where blur isn't supported). Media rises 15px and fades in, the location follows at 150ms and the detail line at 300ms.
- **Reduced motion:** if a visitor's device asks for less motion, every animation and transition is switched off and the lightbox shows a still image instead of video.

## Destination photos and videos

The site uses licensed Adobe Stock photos and videos (standard licence, 16 September 2026). `CREDITS.txt` lists each asset ID; keep it with the site records. Attribution isn't needed on the website. The originals are in `~/destination-assets-adobe-stock`.

To swap one, keep the file names and sizes and the site picks it up with no code changes:

- `assets/images/places/{id}-card-640.webp` and `-card-1280.webp` (16:11)
- `assets/images/places/{id}-wide-1280.webp` (16:9, also the video poster)
- `assets/video/{id}.mp4` and `.webm` (optional; 16:9, muted, about 6 seconds, ideally under 1.3 MB)

`{id}` is `amalfi`, `iceland`, `mallorca` or `lisbon`. Only use photos Maryann owns or has a licence for. To add or rename places, edit `PLACES` in `js/data.js`.

## Before going live

- Fill in `[NIF]`, `[Business address]` and the enquiry retention period `[12 months]` in `LEGAL` in `js/data.js`.
- Confirm the rush fee rule (currently +30% of the fee including add-ons).
- Have the cancellation terms checked by someone qualified. All three services now include the 14-day cancellation right and a statutory-rights line, following the visa terms. Add the same wording to the PDFs.
- Confirm whether 3 booking disruptions per package suits a 40-guest Whole Event.
- Confirm The Proposal payment wording (now "50% when your plan and proposal-day timeline are delivered", because clients book their own flights and stays in that tier).
- The PDFs are regenerated from the site, so they already carry the new wording; rerun `python3 scripts/build-pdfs.py` after any content change.
- Update `og:image` in `index.html` to the full URL once the domain is known.

## Deploying

It's a static site: upload the whole folder (after `npm run assets`) to Vercel, Netlify, Cloudflare Pages or any web host. `node_modules`, `scripts` and `.vscode` don't need to be uploaded.

For a host that takes a single file, run `npm run build:single` and use `dist/maryann-eniola-website.html`. That file shows the drawn illustrations, not the Adobe Stock photos and videos, so deploy the full folder to show the real photos.
