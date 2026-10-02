# Build: VERUM, a Nuit Works concept site (fresh repo)

You are building a brand-new concept website from scratch in this empty repo. It is a portfolio piece for Nuit Works (https://nuit.works), a web design studio.

The business is fictional: VERUM, a Malé-based online skincare shop that resells real Korean and Western skincare brands. It should look and feel like a real, live shop.

Plan the whole build first (structure, components, data files, page list), then build it end to end, then test and optimise until every success criterion below is met. Do not stop at a skeleton.

---

## 1. The one rule above everything: conversion

This concept exists to prove that a Nuit Works site sells. If a visitor takes a long time to act, the site has failed. Every design decision must shorten the path from landing to a placed order, and should raise order value along the way.

Success criteria:
- From any page, a visitor can add something to the cart or start the quiz within 5 seconds of landing. A buy or quiz action must be visible without scrolling on both mobile (375px) and desktop.
- **The headline proof:** a first-time visitor can go from landing, through the quiz, to a full routine in the cart and a placed order in under 60 seconds.
- Checkout is a single page with no account or sign-up. It has the fewest possible fields, and each field has the correct input type and autocomplete attribute.
- No popups, no newsletter modals, no cookie walls, no spin-to-win, nothing that blocks the path to buying.

Conversion patterns to implement:
- **Product cards:** every card has a one-tap "Add to cart" button, plus a quick view on desktop.
- **Product pages:** a sticky "Add to cart" bar on mobile, and a "Buy now" button that skips straight to checkout with only that item.
- **Cart drawer:**
  - opens on add, so the shopper never leaves the page
  - shows the running total
  - shows a "Complete your routine" upsell, built from what is already in the cart and filling the missing routine steps
  - shows progress towards the next bundle discount tier
  - has a large "Checkout" button
- **Bundle discounts** (editable in config): 3 or more routine steps get 10 percent off, 5 or more get 15 percent off. They apply automatically, are shown live in the cart, routine builder and quiz results, and can never be missed.
- **Trust strip** near the top of Home, product pages and checkout:
  - 100 percent authentic, bought directly, never grey market
  - free same-day delivery in Malé
  - pickup in Malé
  - formula-checked before stocking
- Prices are always visible on cards, product pages, quiz results and search results.
- Honest signals only: stock levels from data ("Only 3 left"), and a "Restocked" label where true in data. No fake countdown timers or fake "X people are viewing" messages.
- A WhatsApp quick-contact link for questions, shown as a secondary action. It never competes visually with "Add to cart".
- CTA wording must be specific. Never use "Learn more" or "Submit".

---

## 2. Tech stack

- **Framework:** Astro (latest stable), TypeScript, static output, ready to deploy on Vercel.
- **Islands:** the cart, quiz, routine builder, compare, ingredient explorer, search, filters and checkout are interactive islands. Use Preact for islands to keep JS small. Hydrate with `client:visible` or `client:idle` unless a component is needed immediately (the cart button and drawer need to load early).
- **Shared state:** handle cart, compare list and quiz result with nanostores, persisted to localStorage, and wrap every storage call in try/catch.
- **Styling:** scoped Astro styles plus a small global stylesheet built on CSS custom properties (design tokens). No heavy CSS framework.
- **Motion:** CSS transitions plus IntersectionObserver, and Astro View Transitions for page changes. No GSAP or other large animation libraries.
- **Images:** `astro:assets` with AVIF and WebP output, responsive `srcset`, and explicit width and height on every image.
- **Fonts:** self-hosted, subset to Latin, `font-display: swap`. Preload only the fonts used above the fold, with a maximum of two families.
- **Data:** all site data (products, brands, ingredients, prices, discounts, delivery zones, reviews, FAQ, contact details) lives in typed data files in `src/data/`. Product, brand and ingredient pages are generated from those files.
- **No third parties:** no third-party scripts, trackers, chat widgets or embeds.

---

## 3. Brand and visual direction

Keep the existing VERUM look and push it further: clinical, minimal, precise and ingredient-led. It should feel like a well-designed lab label crossed with a modern shop. Push it mainly through interactivity: the site should feel like a tool you can explore, not just a catalogue. Keep motion light, clean and functional.

**Design tokens** (refine as needed, keep the spirit):
- `--paper: #FAFAF8`: page background, also the meta theme colour
- `--bone: #F1F1EC`: alternate sections and product image tiles
- `--ink: #141414`: main text
- `--graphite: #6B6B66`: secondary text
- `--hairline: #E2E2DC`: 1px rules and borders, used a lot, lab-sheet style
- `--sage: #8A9A86` and `--sage-deep: #5E6F5B`: brand accent, ingredient bars, active states
- `--cta`: a deep ink or deep sage for primary buttons. Check WCAG AA contrast.

**Typography:**
- Headings and UI: a crisp neo-grotesk (for example Geist or Inter Tight), set large with tight tracking.
- Data, labels, percentages and product codes: a monospace (for example Geist Mono or JetBrains Mono). Use it in lab-label style, for example "VRM-04 · Glow Serum · Niacinamide 2%".

**Layout language:**
- A visible grid with hairline rules.
- Product codes on every product (VRM-01, VRM-02, and so on).
- Numbered steps.
- Generous but not empty spacing. Avoid big blank gaps.

**Imagery:**
- Use the real official product images for every product, downloaded into the repo (never hotlinked) and optimised.
- Present every product image consistently: contained on a uniform `--bone` tile with equal padding and the same aspect ratio, so the mixed brand photography looks like one clean shop.
- Use free stock photos (Unsplash or Pexels) only for supporting editorial images such as textures, skin close-ups, a bathroom shelf or Malé street delivery. Give them a consistent cool, neutral grade, and list them on a `/credits` page.

**Motion** (light, clean, never in the way of buying):
- Soft fade-and-rise reveals on scroll.
- Ingredient bars that animate to their value when they enter view.
- A cart count that bumps and a drawer that slides when an item is added.
- Smooth page transitions with View Transitions, including a shared-element transition from the product card image to the product page image.
- Respect `prefers-reduced-motion` everywhere: all motion off, with content shown instantly.

**Copy voice:**
- Precise, calm, honest, slightly dry. Short sentences, no hype words ("miracle", "glow up", "holy grail").
- Keep the spirit of the current site:
  - "Formula first."
  - "Shop skincare that earns its place."
  - "We read the formula before we agree to stock anything."
  - "Where a brand publishes nothing, the row says so. We do not estimate."

---

## 4. Content (put all of this in `src/data/`)

**Brand:**
- Name: VERUM. Tagline: "Formula first."
- What it is: a skincare shop in Malé, Maldives, reselling Korean and Western brands. Every product is bought directly and formula-checked before stocking. No sponsored placements.
- Contact (placeholders): hello@verum.mv, trade@verum.mv for brands, WhatsApp +960 700 0000, Instagram link.
- Currency: MVR only, formatted as "MVR 385". Prices include GST, shown as a note at checkout, with the rate kept in config.

**Products: about 50 real products from about 20 to 25 real brands.**
- Mix well-known Korean brands (for example Beauty of Joseon, COSRX, Round Lab, Anua, Torriden, Isntree, Skin1004, Some By Mi, Laneige, Innisfree) and Western brands (for example The Ordinary, CeraVe, La Roche-Posay, Paula's Choice, Bioderma, Avène, Eucerin, Neutrogena, The Inkey List).
- Cover these categories:
  - Cleanse (oil cleansers and gel or foam cleansers)
  - Exfoliate
  - Treat (serums and essences)
  - Hydrate (toners and moisturisers)
  - Protect (sunscreens, which matter a lot in the Maldives climate)
  - Masks and extras
- Each product needs:
  - a VERUM code (VRM-01 onwards)
  - brand, product name, size and category
  - routine step (cleanse, exfoliate, treat, hydrate or protect) and AM, PM or both
  - skin types it suits, the concerns it targets, and a texture note
  - key ingredients
  - a realistic MVR price, set at typical Maldives retail pricing
  - stock count, flags (bestseller, new, restocked) and the official product images
  - a short VERUM note in the brand voice explaining why it was stocked
  - how to use, and "pairs well with" (2 or 3 products)
- **Ingredient accuracy matters:**
  - Use the ingredient information each brand actually publishes.
  - Show a concentration only where the brand publishes it. Where it does not, show "Not published" in that row.
  - Never invent percentages.
  - Do not make medical or treatment claims.

**Ingredients: 15 to 20 key actives and supporting ingredients.**
- For example: niacinamide, retinol or retinal, vitamin C (ascorbic acid and derivatives), hyaluronic acid, ceramides, centella asiatica, salicylic acid (BHA), glycolic and lactic acid (AHA), azelaic acid, panthenol, peptides, rice extract, propolis, snail mucin, zinc, and UV filters.
- Each ingredient gets:
  - a plain-English "what it does"
  - who it suits and who should be careful
  - what not to layer it with
  - AM or PM use
  - the products that contain it, which are generated automatically from the product data

**Delivery and pickup** (all values in config):
- Malé: free, usually same day for orders before 4pm.
- Hulhumalé and Villimalé: free, next day.
- Other islands and resorts: on request. The checkout shows "We will message you a quote on WhatsApp".
- Pickup: from the VERUM shop in Malé (placeholder address), weekdays until 6pm.

**Sample reviews:**
- 3 to 6 short reviews on most products.
- Each review has a first name, star rating, skin type and month.
- Mark them as sample reviews for this concept with a small visible note.
- Do not add them to structured data.

**FAQ:** 8 to 10 real questions, for example:
- Are products authentic?
- How fast is delivery in Malé?
- Can you deliver to resorts?
- How does a BML transfer work here?
- Returns on opened products?
- Patch testing
- Choosing a sunscreen for the Maldives climate
- How the bundle discount works

**Footer:** keep a line reading "Brand names and product images belong to their respective owners."

---

## 5. Pages

Every page has a unique title and meta description, a single H1, a header with search and the cart, and the footer.

1. **Home** (`/`), in this order, kept tight:
   - Hero: H1 ("Shop skincare that earns its place."), a short line, and two actions: "Find your routine in 30 seconds" (quiz, primary) and "Shop all".
   - Trust strip.
   - Quiz promo: the 3 numbered questions, a "Start the quiz" button and a "No email required" note.
   - Bestsellers: a product row with add to cart.
   - Shop by concern: acne and breakouts, dark spots, dryness, oil control, sensitive skin, sun protection. Each tile links to the filtered shop.
   - Ingredient explorer teaser: a row of ingredient chips, each opening its ingredient view.
   - Routine builder teaser: "Build your AM and PM routine, save up to 15 percent."
   - New arrivals.
   - "Every product, formula-checked": an interactive formula breakdown example with "Not published" rows shown honestly.
   - Brands strip linking to brand pages.
   - Sample reviews.
   - Short FAQ (4 or 5 questions), linking to the full FAQ.
2. **Shop** (`/shop`):
   - Filters: category, routine step, skin type, concern, brand, ingredient and price range.
   - Sort: featured, bestsellers, newest, and price low to high or high to low.
   - Filters and sort are reflected in URL params, so links like "shop by concern" deep-link into a filtered view.
   - Results count, a clear "Reset" control, and add to cart and compare on every card.
   - On mobile, filters open in a bottom sheet.
3. **Product pages** (`/products/[slug]`):
   - a gallery
   - code, brand, name, size and price
   - stock signal
   - add to cart, Buy now, and add to compare
   - the trust strip
   - key ingredients as tappable chips linking to the ingredient explorer
   - an interactive formula breakdown
   - who it suits, how to use, and AM or PM
   - "Pairs well with", with a one-tap "Add the set" and the bundle discount shown
   - the VERUM note
   - sample reviews and related products
4. **Quiz** (`/quiz`): see section 6.
5. **Routine builder** (`/routine`): see section 7.
6. **Ingredients** (`/ingredients`) and ingredient pages (`/ingredients/[slug]`): the ingredient explorer (see section 7), plus one SEO page per ingredient.
7. **Brands** (`/brands`) and brand pages (`/brands/[slug]`): a short intro, the products from that brand and add to cart.
8. **Compare** (`/compare`): see section 7.
9. **Philosophy** (`/philosophy`): how VERUM chooses what to stock, why they publish the breakdowns, and no sponsored placements. End with a CTA to the quiz and the shop.
10. **Contact and delivery** (`/contact`): WhatsApp and email first, then delivery zones and timings, pickup details and the FAQ.
11. **Cart** (`/cart`): the full-page version of the drawer, for direct links.
12. **Checkout** (`/checkout`) and **confirmation**: see section 6.
13. **Supporting pages:** 404 (on-brand, with search, bestsellers and a quiz link), `/credits` (stock photo credits), and a short `/privacy` page stating that no data is stored or sent because this is a concept.

---

## 6. The core flow: quiz to routine to checkout (the case study USP)

**USP:** "Quiz to routine, in your cart, in under a minute."

### Quiz (`/quiz`)

- **Format:** three questions, one per screen, answered by tapping large option cards. There is no typing and no email. A progress indicator runs across the top.
  1. **Your skin type:** oily, dry, combination, normal or sensitive.
  2. **Your priority:** breakouts, dark spots and uneven tone, dryness and barrier, oil and pores, signs of ageing, or sun protection and daily basics.
  3. **Your tolerance:** "Handles most things", "Gets irritated sometimes", or "Reacts easily".
- **Ranking:** a transparent scoring function ranks all products by fit and shows the reasoning in plain language. For example: "Ranked high because: suits oily skin, contains niacinamide for pores, fragrance free."
- **Results screen:**
  - A complete routine: AM (cleanse, treat, hydrate, protect) and PM (cleanse, treat, hydrate, plus exfoliate 2 to 3 times a week if tolerance allows).
  - One top pick per step, with 2 alternatives you can swap in one tap.
  - Live total, the bundle discount applied, and the amount saved.
  - A large "Add full routine to cart" button that adds everything in one tap and opens the cart drawer.
  - Secondary options: "Add AM only", "Add PM only", and "Open in routine builder" to customise.
- **Persistence:** results are saved so the shopper can return to them. The quiz can be retaken.

### Checkout (`/checkout`)

A single page in clear numbered sections, with an order summary that is sticky on desktop and collapsible on mobile.

1. **Contact:** name, phone (+960 format, used for WhatsApp updates) and email (optional).
2. **Delivery:**
   - Choose Malé delivery, Hulhumalé or Villimalé delivery, another island or resort, or pickup in Malé.
   - Show only the fields that method needs. For delivery, that is the address with house or building name, floor and area. Pickup needs no address.
   - Show the expected timing for the chosen method.
3. **Payment:**
   - **Card:** do not collect card numbers. Show a "Pay by card" option that, on confirm, shows a clearly labelled demo bank payment gateway screen with a single "Approve demo payment" button, then returns to confirmation.
   - **BML bank transfer:** show placeholder account details clearly labelled as demo, plus an optional slip upload. The file stays in the browser and is never uploaded anywhere. Include a note that the order is confirmed once the transfer is checked.
4. **Order summary:**
   - items, quantities (editable) and remove
   - bundle discount line and delivery line
   - a "Prices include GST" note and the total
   - a large "Place order" button

Validation and behaviour:
- Validate inline as the shopper goes.
- Show the demo note on checkout and on confirmation: "This is a Nuit Works concept. No order is placed and no payment is taken."
- Nothing is sent anywhere.

### Confirmation

- Show an order number, a summary, and the delivery or pickup details with timing.
- Add a "Message us on WhatsApp" link with a prefilled message containing the order number.
- Add a "Save my routine" view showing the AM and PM routine with how to use each step, and offer it as a printable page.

### Speed showcase (the case study proof)

- Measure the time from the first quiz answer, or the first add to cart if the quiz was not used, to the order being placed.
- Show it on the confirmation screen in a small, calm mono line, for example "Quiz to order in 52 seconds."

### Quality

- Everything is keyboard and screen-reader accessible: focus moves to each quiz question, and an ARIA live region announces cart and price updates.
- Everything works with one thumb at 375px.
- Back and forward in the browser behave sensibly in the quiz.

---

## 7. Interactive pieces

**Ingredient explorer** (`/ingredients`, the Home teaser, and chips on product pages):
- Show a grid or list of ingredients, filterable by what you want them to do: calm, hydrate, brighten, exfoliate, clear breakouts, repair the barrier, protect.
- Selecting an ingredient opens a detail panel. It shows:
  - what it does, in plain English
  - who it suits and who should be careful
  - AM or PM use
  - "don't layer with" warnings
  - every product that contains it, with prices and add to cart
- Optional advanced view: select two ingredients to see whether they are fine together, best split AM and PM, or not recommended together.
- Each ingredient also has its own static, SEO-friendly page at `/ingredients/[slug]`.

**Compare products** (`/compare`, triggered from cards and product pages):
- Add up to 3 products with a "Compare" toggle. A small compare tray appears at the bottom with a "Compare now" button.
- The compare view shows these side by side, with differences highlighted:
  - image, brand, price and price per ml
  - size, routine step and AM or PM
  - skin types, concerns and texture
  - key ingredients with their published concentrations (or "Not published")
  - fragrance free (yes or no)
  - average sample rating
- Every column has "Add to cart".
- The compare list is kept in the URL, so a comparison can be shared.

**Routine builder** (`/routine`):
- Two columns, AM and PM, with step slots in the correct order.
- Each slot opens a picker of suitable products for that step. The picker is filterable by skin type and concern, and is prefilled from the quiz result if there is one.
- Gentle, plain-language conflict warnings, for example "Retinol and an AHA in the same PM routine can irritate. Try alternate nights."
- A sticky summary showing:
  - number of steps
  - subtotal
  - bundle discount tier progress ("Add 1 more step to save 15 percent")
  - savings
  - total
  - an "Add routine to cart" button
- A shareable routine link.

**Search** (opened from the header icon and `/` or Cmd+K):
- Instant results across products, brands and ingredients, grouped by type, with thumbnails and prices.
- Tolerant of typos.
- Add to cart directly from product results.
- Build a small JSON search index at build time and load it only when search is first opened.
- Fully keyboard navigable.

---

## 8. SEO and GEO

**Meta:**
- Each page gets a unique title (under 60 characters) and meta description (under 155 characters).
- Add canonical URLs, Open Graph and Twitter tags.
- Product pages use their product image as the OG image. Other pages get a static OG image generated at build time in the brand style.

**Semantic HTML:**
- One H1 per page and a logical heading order.
- Descriptive alt text on every image.
- Breadcrumbs on product, brand and ingredient pages.

**JSON-LD structured data:**
- `Store` (or `HealthAndBeautyBusiness`) on Home, Philosophy and Contact: name, description, address in Malé, contact point, opening hours for pickup, currency MVR. Include a `disambiguatingDescription` stating it is a fictional concept by Nuit Works.
- `Product` with `Offer` (price in MVR, availability from stock) on every product page, including brand and SKU (the VERUM code).
- `ItemList` on shop, brand and ingredient pages.
- `FAQPage` on the FAQ.
- `BreadcrumbList` on inner pages.
- Never add `Review` or `AggregateRating` markup, because the reviews are samples.

**Files at the root:**
- `sitemap.xml` (@astrojs/sitemap)
- `robots.txt`
- `llms.txt`, summarising the shop, categories, brands, delivery and the quiz, and stating clearly that VERUM is a fictional concept by Nuit Works.

**GEO:**
- Write key facts as clear, quotable sentences: what VERUM is, where it delivers and how fast, how the bundle discount works, what each ingredient does.
- Ingredient pages and the FAQ should answer real questions directly in their first sentence.

---

## 9. Performance (PageSpeed is part of the pitch)

**Targets** (mobile and desktop, every page type, including `/shop`, a product page and `/checkout`):
- Lighthouse Performance 95 or higher, aiming for 100.
- Accessibility, Best Practices and SEO all at 100.
- LCP under 2.0s, CLS under 0.05, INP under 200ms.

**How:**
- **LCP image:** preload it and set `fetchpriority="high"`. Lazy-load everything below the fold.
- **Islands:** keep them small and hydrate them late. The search index and the compare and routine logic load only when needed.
- **JS budget:** Home stays under about 60 KB gzipped of JS.
- **Fonts:** self-hosted and subset, with only the weights you use.
- **Layout shift:** reserve space for every image and island. The cart count and drawer must not cause layout shift.
- **Product images:** resize and compress all of them to consistent tiles. Product grids must stay fast with 50 products.

---

## 10. Must-haves on every concept

- **Favicon set:** SVG favicon, `favicon.ico`, `apple-touch-icon` and `site.webmanifest`, using a minimal VERUM mark (for example a "V" in a thin hairline square, ink on paper with a sage detail).
- **Navigation:**
  - desktop nav with active states: Shop, Find your routine, Routine builder, Ingredients, Philosophy
  - search and cart icons with a count
  - an accessible mobile menu (focus trap, Escape to close)
  - a skip-to-content link
- **Accessibility:** WCAG 2.2 AA (contrast, visible focus states, labelled form fields, alt text, reduced motion).
- **Meta theme colour:** `#FAFAF8`.
- **Pages:** 404, credits and privacy.
- **Footer on every page**, containing:
  - shop categories, brands and pages
  - delivery and contact details
  - "Brand names and product images belong to their respective owners."
  - copyright
  - this line, clearly visible and legible:

  **"A Nuit Works concept. VERUM is a fictional business."**

  "Nuit Works" links to https://nuit.works. Do not make it tiny or low-contrast; it must be easy to read.

---

## 11. Case study file

Create `CASE-STUDY.md` in the repo root, for use on the Nuit Works website.

It must cover:
- **The USP in one line:** "Quiz to routine, in your cart, in under a minute: a 30-second skin quiz builds a full AM and PM routine, adds it to the cart in one tap with a bundle discount, then a one-page checkout."
- **The problem it solves for a real skincare shop:** customers don't know what to buy, so they message for advice or leave. Small order sizes. Slow, manual WhatsApp ordering.
- **Key features:**
  - the quiz and routine results
  - the routine builder
  - the ingredient explorer
  - compare
  - search
  - bundle discounts
  - one-page checkout with BML transfer and pickup
  - the conversion patterns
- **Measured results:**
  - timed test runs of quiz to order
  - average order value with and without the quiz routine, on the demo data
  - final Lighthouse scores for Home, Shop, a product page and Checkout, on mobile and desktop
- **Tech stack:** a short list.

---

## 12. Testing before you finish

1. **Build:** run `astro check` and a production build, with zero errors or warnings.
2. **Lighthouse:**
   - Serve the production build and run Lighthouse on mobile and desktop for Home, Shop, a product page, Quiz and Checkout.
   - Fix anything below the targets and rerun until all pages pass.
3. **Core flow:** walk the full flow end to end at 375px and at desktop width: quiz, then add full routine, then checkout, then confirmation.
   - Run it at least 3 times, with different answers.
   - Record the times.
   - Confirm the flow fits under 60 seconds.
4. **Other paths:** test that each of these works:
   - Buy now from a product page
   - the routine builder into the cart
   - compare into the cart
   - search into the cart
   - the "shop by concern" deep links into filtered Shop
   - the cart and compare surviving a page refresh
   - bundle discount maths (check the arithmetic in the cart, routine builder and quiz results)
5. **Data:** check that every product has a real image, a price, ingredients and a routine step, and that no concentration is shown that the brand does not publish.
6. **Keyboard:** do a keyboard-only pass through the nav, search, quiz, filters, compare, the routine builder and checkout.
7. **Conversion criteria:** confirm the section 1 criteria are met on every page.
8. **SEO files:** validate the JSON-LD (no errors), and confirm the sitemap, robots.txt, llms.txt, favicons and OG images are present.
9. **Footer line:** confirm the Nuit Works concept line is in the footer on every page.
10. **Deploy:** make sure the project is ready to deploy on Vercel as a static site.

**Final report:** finish with a short report covering:
- the final Lighthouse scores
- the quiz to order test times
- anything you could not complete and why
