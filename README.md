# VERUM

A Nuit Works concept. VERUM is a fictional business: a Malé skincare shop reselling 50 real products from 21 Korean and Western brands. Nothing is sold, stored or sent.

Case study: [CASE-STUDY.md](CASE-STUDY.md) · Build plan: [docs/build-plan.md](docs/build-plan.md)

## Run it

Requires Node 22.12 or newer.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static site in dist/
npm run serve      # serve dist/ on http://localhost:4377 (gzip, clean URLs)
```

## Deploy (Vercel)

Import the repo. `vercel.json` sets the Astro framework, `dist/` output, clean URLs and long-lived caching for `/_astro/*`. Set `SITE_URL` to the production origin (default `https://verum.nuit.works`) so canonicals, Open Graph URLs, the sitemap and `robots.txt` point at the right domain.

## Structure

| Path | What |
| --- | --- |
| `src/data/` | All site data, typed: products, brands, ingredients, reviews (samples), FAQ, delivery zones, discount tiers, GST, contact, photo credits |
| `src/lib/` | Bundle maths, quiz scoring, routine conflicts, search, delivery timing, JSON-LD builders |
| `src/stores/` | nanostores (cart, compare, quiz, routine), persisted through a try/catch localStorage engine |
| `src/islands/` | Preact islands: cart drawer, quiz, routine builder, compare, explorer, checkout, shop filters; search and quick view load on demand |
| `src/pages/` | Pages, plus build-time `catalog.json`, `search-index.json`, OG images, `robots.txt`, `llms.txt` |
| `scripts/` | Image pipeline (official packshots normalised onto the bone tile), photo grading, favicons, Lighthouse runner |
| `tests/` | End-to-end and data checks (below) |

Edit discount tiers, the GST rate, delivery zones and contact details in `src/data/site.ts`.

## Tests

Build first, then serve `dist/` on port 4377 (`npm run serve`) for the browser tests. They use the installed Chrome (`CHROME_PATH` to override).

```bash
npm run check              # astro check: types and diagnostics
npm run test:data          # every product: image, price, ingredients, step; every shown strength is published by the brand
npm run test:seo           # JSON-LD against the schema.org vocabulary, meta, H1, alt text, footer line, root files
npm run test:paths         # Buy now, routine builder, compare, search, concern links, persistence, bundle maths, keyboard, above the fold, overflow
npm run test:flow          # timed quiz-to-order runs at 375px and 1440px
npm run test:lighthouse    # Lighthouse mobile + desktop for Home, Shop, a product, Quiz, Checkout
npm run test:aov           # average order value with and without the quiz, on the demo data
```

## Data and images

Product names, sizes, ingredient lists and published strengths come from each brand's own website (the `source` field on every product). A concentration appears only where the brand publishes it; elsewhere the formula breakdown reads "Not published". Prices, stock, flags and notes are VERUM's own. Reviews are samples written for the concept, labelled as such and kept out of structured data.

Fonts are Geist and Geist Mono (variable, self-hosted), subset to the characters the site uses with `python scripts/subset-fonts.py`.

Product images were downloaded from the official brand sites and normalised with `scripts/process-products.mjs`. The raw downloads and research notes live in `_source/` (not committed). Editorial photos are from Unsplash and Pexels, credited on `/credits`.

Brand names and product images belong to their respective owners.
