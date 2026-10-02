# VERUM build plan

Concept site for Nuit Works. Fictional Malé skincare shop. Conversion first.

## Stack
- Astro 7 (static, `build.format: 'file'`, Vercel `cleanUrls`), TypeScript, Preact islands, nanostores (+ persistent).
- Astro `<ClientRouter />` for view transitions; header, cart drawer and compare tray persist across pages.
- Astro Fonts API, local provider: Geist (UI) + Geist Mono (data), Latin subset, variable, swap, preloaded.
- `astro:assets` `<Picture>` with AVIF + WebP, responsive srcset, explicit width/height.
- No third-party scripts. Sitemap via `@astrojs/sitemap`.

## Data (`src/data/`, typed)
| file | contents |
| --- | --- |
| `types.ts` | Product, Brand, Ingredient, Review, FAQ, DeliveryZone types |
| `site.ts` | brand, contact, currency, GST rate, discount tiers, delivery zones, pickup, nav |
| `brands.ts` | ~21 real brands with country, blurb |
| `products.ts` | ~52 real products (VRM-01…), images, prices, stock, flags, key ingredients with published % or null |
| `ingredients.ts` | ~20 ingredients: what it does, suits, careful, AM/PM, don't-layer rules, goals |
| `reviews.ts` | sample reviews (marked as samples, never in structured data) |
| `faq.ts` | 10 FAQ entries |
| `concerns.ts` | concern and skin-type vocab, quiz priority mapping |
| `photos.ts` | editorial stock photos + credits |

## Logic (`src/lib/`)
- `money.ts` (MVR formatting), `bundle.ts` (tiers: distinct products = routine steps; 3 → 10%, 5+ → 15%),
  `quiz.ts` (transparent scoring with reasons), `routine.ts` (slots + conflict warnings),
  `search.ts` (typo-tolerant matcher), `catalog.ts` (derived lookups), `seo.ts` (JSON-LD builders).
- Stores (`src/stores/`): cart, compare, quiz result, routine, UI (drawer), flow timer. All storage in try/catch.

## Islands (Preact)
CartDrawer + CartButton (client:load, persisted), CompareTray (idle), ShopFilters (idle; filters static
cards in place, URL params), Quiz (load), RoutineBuilder (load), IngredientExplorer (visible),
Compare (load), Checkout (load), Confirmation (load), FormulaBreakdown (visible), PairsWell (visible),
Search + QuickView (lazy `import()` on first open). Card "Add to cart" buttons are static HTML handled
by one delegated listener, so 50 cards cost no hydration.

## Pages
`/`, `/shop`, `/products/[slug]`, `/quiz`, `/routine`, `/ingredients`, `/ingredients/[slug]`, `/brands`,
`/brands/[slug]`, `/compare`, `/philosophy`, `/contact` (incl. full FAQ), `/cart`, `/checkout`,
`/checkout/confirmed`, `/my-routine` (printable), `/credits`, `/privacy`, `404`.
Build-time endpoints: `/catalog.json` (lite catalog with thumbs), `/search-index.json`, OG images, `llms.txt`, `robots.txt`.

## Conversion checklist
Header quiz CTA + cart on every page (above the fold at 375px), one-tap add on every card, drawer opens on add
with routine upsell + tier progress, Buy now → `/checkout?buy=`, one-page checkout with minimal typed fields,
no popups. Speed timer from first quiz answer / first add to order placed.

## Tests (section 12)
`astro check` + build clean; Lighthouse (mobile + desktop) on Home, Shop, product, Quiz, Checkout via
local compressed static server; Playwright-driven timed flow runs (375px + desktop, 3+ answer sets, human
pacing); path checks; data audit script; JSON-LD validator script against the schema.org vocabulary;
keyboard pass; footer line check on every built page.
