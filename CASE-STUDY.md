# VERUM — a Nuit Works concept

**Quiz to routine, in your cart, in under a minute: a 30-second skin quiz builds a full AM and PM routine, adds it to the cart in one tap with a bundle discount, then a one-page checkout.**

VERUM is a fictional skincare shop in Malé, Maldives, reselling 50 real products from 21 Korean and Western brands. It was built to show that a Nuit Works site sells: every decision shortens the path from landing to a placed order and raises the order value on the way.

## The problem it solves

A real skincare shop in Malé has three problems:

- **Customers don't know what to buy.** Faced with 50 serums and toners, they message for advice or leave.
- **Orders are small.** People buy one product at a time, so a routine never forms.
- **Ordering is slow.** WhatsApp ordering means typing, waiting, sending bank details and chasing a slip, all by hand.

## What we built

- **The quiz and routine results.** Three tap-only questions: skin type, priority and tolerance. No email.
  - A transparent scoring function ranks every product and shows why: "Ranked high because: suits oily skin, contains niacinamide for pores, fragrance free."
  - Results are a complete AM and PM routine with one pick per step and two one-tap swaps.
  - The live total, bundle discount and saving are shown, with one "Add full routine to cart" button.
  - Browser back and forward move between questions. Results are saved and the quiz can be retaken.
- **The routine builder.** AM and PM slots in the correct order.
  - Each slot opens a picker of suitable products, filterable by skin type and concern and pre-ranked from the quiz.
  - Plain-language conflict warnings, for example "Retinol and an AHA in the same PM routine can irritate. Try alternate nights."
  - A sticky summary with tier progress, a shareable link and a printable routine.
- **The ingredient explorer.** 20 ingredients, filtered by what you want them to do.
  - Each opens a panel: what it does, who it suits, AM or PM, what not to layer it with, and every product that contains it, with add to cart.
  - A pair checker answers "can I use these together?"
  - Every ingredient also has its own SEO page whose first sentence answers the question.
- **Compare.** Up to three products side by side: price per 10 ml, step, skin types, published strengths and fragrance. Differences are marked and the comparison lives in the URL.
- **Search.** Instant and typo-tolerant ("niacinmide" still finds niacinamide).
  - Results are grouped by product, brand and ingredient, with prices and add to cart.
  - Opens with `/` or Cmd/Ctrl+K, and is fully keyboard navigable.
  - The index loads only when search is first opened.
- **Bundle discounts.** Each different product is one routine step. 3 steps take 10% off and 5 or more take 15%. The discount applies automatically and shows live in the cart, the builder and the quiz.
- **One-page checkout.** Contact, delivery, payment and summary in four numbered sections, with no account.
  - **Typed fields:** name, phone and the address fields the chosen method needs, each with the correct input type and autocomplete. Email is optional.
  - **Delivery:** Malé, Hulhumalé/Villimalé, islands and resorts (quoted on WhatsApp), or pickup. Timing is computed from the real 4pm cut-off in Malé time.
  - **Payment:** a demo card gateway with one "Approve demo payment" button, or BML transfer with the slip previewed in the browser and never uploaded.
- **Conversion patterns:**
  - One-tap add on every card, and quick view on desktop.
  - A cart drawer that opens on add, shows tier progress and a "Complete your routine" upsell for the missing steps, and keeps a large Checkout button pinned.
  - On product pages: a sticky add-to-cart bar on mobile, Buy now, and "Add the set" with the bundle maths shown.
  - A trust strip on Home, product pages and checkout.
  - Honest stock signals from data, and no popups.
- **Honest formulas.** Every product page shows a lab-style formula breakdown on a log scale. A concentration appears only where the brand publishes it: 32 published strengths across the range, and 116 rows that say "Not published". We do not estimate.

## Measured results

### Quiz to order, timed

Automated runs in Chrome at 375px (touch, mobile emulation) and 1440px, from landing on Home to the confirmation page. The pacing model is deliberately unhurried:

- 3 s reading the home page
- 2.5 s per question
- 6 s looking over the results
- 2 s in the drawer
- typing at about 4 characters a second on a phone

The times below are the site's own speed showcase ("Quiz to order in … seconds").

| Answers | Delivery and payment | Order | 375px | 1440px |
| --- | --- | --- | --- | --- |
| Oily · Breakouts · Handles most things | Malé, card | 7 products, 15% off, MVR 2,563 | 30 s | 26 s |
| Dry · Dryness and barrier · Gets irritated sometimes | Hulhumalé, BML transfer | 8 products, 15% off, MVR 2,490 | 30 s | 27 s |
| Sensitive · Sun protection · Reacts easily | Pickup, card | 6 products, 15% off, MVR 2,176 | 25 s | 23 s |
| Combination · Dark spots · Handles most things | Malé, card | 7 products, 15% off, MVR 2,988 | 30 s | 26 s |

- **Every run finished under 60 seconds.** The slowest was 30 s.
- **The flow takes 11 to 14 taps and 19 to 33 keystrokes.** With no pauses at all, the interactions alone take about 1.5 s.
- **Totals matched in every run.** The quiz results, cart drawer, checkout and saved order agreed, and no console errors were logged.

### Average order value (demo data)

These figures cover all 90 quiz answer combinations (5 × 6 × 3), using the site's own ranking and bundle code.

| | Average order |
| --- | --- |
| Full quiz routine | **MVR 2,389** (MVR 1,521 to 3,425), 7 products on average, every combination reaching 15% off |
| Quiz, AM only | MVR 1,560 |
| Quiz, PM only | MVR 1,211 |
| Without the quiz: single product | MVR 401 |
| Without the quiz: two-product basket | MVR 803 |

A full quiz routine is about **6x** a single-product order and **3x** a two-product basket.

### Lighthouse 13.5

These scores come from the production build, served locally with compression. Two or three runs per page gave identical scores.

| Page | Mobile: Perf / A11y / BP / SEO | Mobile LCP | Desktop: Perf / A11y / BP / SEO | Desktop LCP |
| --- | --- | --- | --- | --- |
| Home | 99 / 100 / 100 / 100 | 1.88 s | 100 / 100 / 100 / 100 | 0.41 s |
| Shop | 99 / 100 / 100 / 100 | 1.88 s | 100 / 100 / 100 / 100 | 0.45 s |
| Product | 99 / 100 / 100 / 100 | 1.82 s | 100 / 100 / 100 / 100 | 0.41 s |
| Quiz | 99 / 100 / 100 / 100 | 1.81 s | 100 / 100 / 100 / 100 | 0.45 s |
| Checkout | 99 / 100 / 100 / 100 | 1.80 s | 100 / 100 / 100 / 100 | 0.41 s |

CLS was 0.000 and total blocking time 0 ms on every page.

### Other checks

- **66 end-to-end path checks pass:** Buy now, routine builder to cart, compare to cart, search to cart, the concern deep links, persistence across a refresh, bundle maths, a keyboard-only pass, the mobile menu focus trap, view transitions, reduced motion, above-the-fold actions and no horizontal scroll on all 107 pages.
- **JSON-LD validates against the schema.org vocabulary.** That is 201 blocks and 1,282 typed nodes, with Google's required fields present and no review markup.

## Tech stack

- Astro 7, static output, ready for Vercel
- TypeScript
- Preact islands, hydrated late; search and quick view load on demand
- nanostores, persisted to localStorage behind try/catch
- Astro View Transitions (ClientRouter), with a shared product-image transition
- Astro Fonts API: self-hosted Geist and Geist Mono, Latin subset
- `astro:assets` with AVIF and WebP, and responsive `srcset`
- Typed data files in `src/data/`
- No third-party scripts
