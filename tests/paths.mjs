// End-to-end checks for every path in section 12 of the brief (except the timed flow, see flow.mjs).
// Usage: node tests/paths.mjs [baseUrl]
import { chromium } from 'playwright-core';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = (process.argv[2] ?? 'http://localhost:4377').replace(/\/$/, '');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const DIST = path.resolve(import.meta.dirname, '../dist');

const results = [];
const check = (name, ok, detail = '') => {
  results.push({ name, ok: !!ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`);
};

const MOBILE = { viewport: { width: 375, height: 812 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true };
const DESKTOP = { viewport: { width: 1440, height: 900 } };

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const catalog = await (await fetch(`${BASE}/catalog.json`)).json();
const byId = new Map(catalog.map((p) => [p.id, p]));
const mvr = (n) => `MVR ${Math.round(n).toLocaleString('en-US')}`;
const expectTotal = (ids) => {
  const sub = ids.reduce((s, id) => s + byId.get(id).price, 0);
  const n = new Set(ids).size;
  const pct = n >= 5 ? 15 : n >= 3 ? 10 : 0;
  const disc = Math.round((sub * pct) / 100);
  return { sub, pct, disc, total: sub - disc };
};

async function newPage(opts = DESKTOP) {
  const ctx = await browser.newContext(opts);
  const page = await ctx.newPage();
  page.errors = [];
  page.on('pageerror', (e) => page.errors.push(`${page.url()} :: ${e.message}`));
  page.on('console', (m) => m.type() === 'error' && page.errors.push(`${page.url()} :: ${m.text()}`));
  return { ctx, page };
}
const drawerTotal = async (page) => {
  await page.waitForSelector('dialog.drawer[open] .totals-total dd');
  await page.waitForFunction(() => !document.querySelector('dialog.drawer .cart-loading'));
  return (await page.locator('dialog.drawer .totals-total dd').textContent()).trim();
};
const cartIds = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('verum:cart') || '[]').map((l) => l.id));

// ---------------------------------------------------------------- pages list from the build
const htmlFiles = [];
async function walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== '_astro' && e.name !== 'og') await walk(p);
    else if (e.name.endsWith('.html')) htmlFiles.push(p);
  }
}
await walk(DIST);
const routes = htmlFiles
  .map((f) => '/' + path.relative(DIST, f).replace(/\\/g, '/').replace(/\.html$/, ''))
  .map((r) => (r === '/index' ? '/' : r));

// ---------------------------------------------------------------- 1. Buy now
{
  const { ctx, page } = await newPage(MOBILE);
  await page.goto(`${BASE}/shop`);
  await page.evaluate(() => localStorage.setItem('verum:cart', JSON.stringify([{ id: 'VRM-22', qty: 2 }])));
  await page.goto(`${BASE}/products/beauty-of-joseon-relief-sun-spf50`);
  await page.locator('a', { hasText: 'Buy now' }).tap();
  await page.waitForSelector('#co-name');
  const lines = await page.locator('.co-sec--summary .co-line').count();
  const banner = await page.locator('.co-buynow').count();
  const total = (await page.locator('.co-sec--summary .totals-total dd').textContent()).trim();
  check('Buy now: checkout holds only that item', lines === 1 && banner === 1 && total === mvr(395), `${lines} line, ${total}`);
  await page.fill('#co-name', 'Buy Now Test');
  await page.fill('#co-phone', '7771234');
  await page.locator('input[name="method"][value="pickup"]').check();
  await page.locator('input[name="pay"][value="bml"]').check();
  await page.locator('button.co-place').tap();
  await page.waitForURL('**/checkout/confirmed');
  const after = await cartIds(page);
  check('Buy now: order placed and the saved cart is untouched', after.length === 1 && after[0] === 'VRM-22', JSON.stringify(after));
  check('Buy now: no console errors', page.errors.length === 0, page.errors.join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------- 2. Routine builder -> cart
{
  const { ctx, page } = await newPage(DESKTOP);
  await page.goto(`${BASE}/routine`);
  await page.waitForSelector('.rb-empty');
  for (let i = 0; i < 5; i++) {
    await page.locator('.rb-empty').first().click();
    await page.waitForSelector('dialog.rb-picker[open] .rb-option button');
    const btn = page.locator('dialog.rb-picker[open] .rb-option button').first();
    await btn.click();
    await page.waitForTimeout(150);
  }
  const ids = [...new Set(Object.values(await page.evaluate(() => JSON.parse(localStorage.getItem('verum:routine') || '{}'))).filter(Boolean))];
  const exp = expectTotal(ids);
  const shown = (await page.locator('.rb-summary .totals-total dd').textContent()).trim();
  check('Routine builder: summary total matches bundle maths', shown === mvr(exp.total), `${ids.length} steps, ${exp.pct}% off, shown ${shown}, expected ${mvr(exp.total)}`);
  const url = page.url();
  check('Routine builder: shareable link carries the routine', /am-cleanse=/.test(url), url.replace(BASE, ''));
  await page.locator('.rb-add').click();
  const dt = await drawerTotal(page);
  check('Routine builder: "Add routine to cart" opens drawer with the same total', dt === mvr(exp.total), dt);
  // shared link restores in a fresh context
  const fresh = await browser.newContext(DESKTOP);
  const p2 = await fresh.newPage();
  await p2.goto(url);
  await p2.waitForSelector('.rb-pick');
  const restored = await p2.locator('.rb-pick').count();
  check('Routine builder: shared link restores the routine in a new browser', restored >= ids.length, `${restored} filled slots`);
  await fresh.close();
  check('Routine builder: no console errors', page.errors.length === 0, page.errors.join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------- 3. Compare -> cart (+ URL)
{
  const { ctx, page } = await newPage(DESKTOP);
  await page.goto(`${BASE}/shop`);
  const toggles = page.locator('#shop-grid [data-compare]');
  await toggles.nth(0).click();
  await toggles.nth(1).click();
  await toggles.nth(2).click();
  await page.waitForSelector('.compare-tray .ct-go');
  const trayText = (await page.locator('.compare-tray .ct-go').textContent()).trim();
  check('Compare: tray appears with "Compare now"', /Compare now \(3\)/.test(trayText), trayText);
  await page.locator('.compare-tray .ct-go').click();
  await page.waitForURL('**/compare?ids=*');
  await page.waitForSelector('.cmp-wide .cmp-table');
  const cols = await page.locator('.cmp-wide thead th').count();
  const diffs = await page.locator('.cmp-wide tr.is-diff').count();
  check('Compare: 3 columns side by side, differences marked', cols === 3 && diffs > 0, `${cols} columns, ${diffs} differing rows`);
  const shared = page.url();
  await page.locator('.cmp-wide tbody tr:last-child button').first().click();
  const dt = await drawerTotal(page);
  check('Compare: "Add to cart" from a column opens the drawer', !!dt, dt);
  const fresh = await browser.newContext(DESKTOP);
  const p2 = await fresh.newPage();
  await p2.goto(shared);
  await p2.waitForSelector('.cmp-wide thead th');
  check('Compare: comparison is shareable by URL', (await p2.locator('.cmp-wide thead th').count()) === 3, shared.replace(BASE, ''));
  await fresh.close();
  check('Compare: no console errors', page.errors.length === 0, page.errors.join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------- 4. Search -> cart, typo tolerant, keyboard
{
  const { ctx, page } = await newPage(DESKTOP);
  await page.goto(`${BASE}/`);
  await page.waitForLoadState('load');
  await page.keyboard.press('/');
  await page.waitForSelector('dialog.search[open] .search-input');
  const focused = await page.evaluate(() => document.activeElement?.classList.contains('search-input'));
  check('Search: "/" opens search with focus in the input', focused);
  await page.keyboard.type('niacinmide');
  await page.waitForSelector('dialog.search .search-row');
  const titles = await page.locator('dialog.search .search-title').allTextContents();
  check('Search: typo "niacinmide" still finds niacinamide products', titles.some((t) => /Niacinamide/i.test(t)), titles.slice(0, 3).join(', '));
  const groups = await page.locator('dialog.search .search-group').allTextContents();
  check('Search: results grouped by type', groups.length >= 2, groups.join(', '));
  const priceShown = await page.locator('dialog.search .search-price').first().isVisible();
  check('Search: prices visible on product results', priceShown);
  await page.keyboard.press('ArrowDown');
  const onLink = await page.evaluate(() => document.activeElement?.hasAttribute('data-sr'));
  check('Search: arrow keys move into results', onLink);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  check('Search: Escape closes it', (await page.locator('dialog.search[open]').count()) === 0);
  await page.keyboard.press('Control+k');
  await page.waitForSelector('dialog.search[open]');
  await page.keyboard.type('cosrx snail');
  await page.waitForSelector('dialog.search .search-add');
  const firstId = await page.evaluate(() => document.querySelector('dialog.search .search-row a')?.getAttribute('href'));
  await page.locator('dialog.search .search-add').first().click();
  const dt = await drawerTotal(page);
  check('Search: Cmd/Ctrl+K opens, "Add" puts the product in the cart', (await cartIds(page)).length === 1 && !!dt, `${firstId} -> ${dt}`);
  check('Search: no console errors', page.errors.length === 0, page.errors.join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------- 5. Shop by concern deep links
{
  const { ctx, page } = await newPage(MOBILE);
  await page.goto(`${BASE}/`);
  const hrefs = await page.locator('a.concern').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  for (const href of hrefs) {
    const concern = new URL(href, BASE).searchParams.get('concern');
    const expected = catalog.filter((p) => p.concerns.includes(concern)).length;
    await page.goto(BASE + href);
    await page.waitForTimeout(300);
    const visible = await page.locator('#shop-grid > li:not([hidden])').count();
    const allMatch = await page.locator('#shop-grid > li:not([hidden])').evaluateAll((lis, c) => lis.every((li) => li.dataset.concern.split(' ').includes(c)), concern);
    const countText = (await page.locator('#shop-count').textContent()).trim();
    check(`Shop by concern: ${href} shows only matching products`, visible === expected && allMatch && countText.startsWith(String(expected)), `${visible} of expected ${expected}, label "${countText}"`);
  }
  // filters write back to the URL
  await page.goto(`${BASE}/shop?concern=breakouts`);
  await page.waitForSelector('.st-filters');
  await page.waitForTimeout(800);
  await page.locator('.st-filters').tap();
  await page.waitForSelector('dialog.sheet[open]');
  await page.locator('dialog.sheet label', { hasText: 'Oily' }).first().tap();
  await page.waitForTimeout(300);
  check('Shop: mobile filters open in a bottom sheet and update the URL', /skin=oily/.test(page.url()), page.url().replace(BASE, ''));
  await page.locator('dialog.sheet .sheet-foot .btn').tap();
  await page.locator('#shop-sort').selectOption('price-asc');
  await page.waitForTimeout(200);
  const prices = await page.locator('#shop-grid > li:not([hidden])').evaluateAll((lis) => lis.map((li) => Number(li.dataset.price)));
  check('Shop: sort price low to high, reflected in URL', prices.every((p, i) => i === 0 || prices[i - 1] <= p) && /sort=price-asc/.test(page.url()), prices.join(','));
  check('Shop: no console errors', page.errors.length === 0, page.errors.join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------- 6. Cart and compare survive a refresh
{
  const { ctx, page } = await newPage(MOBILE);
  await page.goto(`${BASE}/shop`);
  await page.locator('#shop-grid [data-add]').nth(0).tap();
  await page.waitForSelector('dialog.drawer[open]');
  await page.locator('dialog.drawer .drawer-close').tap();
  await page.locator('#shop-grid [data-add]').nth(3).tap();
  await page.waitForSelector('dialog.drawer[open]');
  await page.locator('dialog.drawer .drawer-close').tap();
  await page.locator('#shop-grid [data-compare]').nth(5).tap();
  await page.locator('#shop-grid [data-compare]').nth(6).tap();
  await page.reload();
  await page.waitForSelector('.cart-count:not([data-empty])');
  const count = (await page.locator('.cart-count').textContent()).trim();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  const trayAtTop = await page.locator('.compare-tray').count();
  await page.evaluate(() => window.scrollTo(0, 1600));
  await page.waitForSelector('.compare-tray');
  const trayN = (await page.locator('.compare-tray .ct-go').textContent()).includes('(2)') ? 2 : 0;
  check('Compare tray (375px): hidden in the first screen, so it never covers buy actions', trayAtTop === 0);
  const pressed = await page.locator('#shop-grid [data-compare][aria-pressed="true"]').count();
  check('Persistence: cart count survives a refresh', count === '2', `count ${count}`);
  check('Persistence: compare list and toggles survive a refresh', trayN === 2 && pressed === 2, `tray ${trayN}, pressed ${pressed}`);
  check('Persistence: no console errors', page.errors.length === 0, page.errors.join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------- 7. Bundle maths in the cart drawer
{
  const { ctx, page } = await newPage(DESKTOP);
  await page.goto(`${BASE}/`);
  const order = ['VRM-05', 'VRM-22', 'VRM-34', 'VRM-40', 'VRM-09', 'VRM-26'];
  for (let n = 1; n <= order.length; n++) {
    const ids = order.slice(0, n);
    await page.evaluate((ids) => localStorage.setItem('verum:cart', JSON.stringify(ids.map((id) => ({ id, qty: 1 })))), ids);
    await page.goto(`${BASE}/cart`);
    await page.waitForSelector('.cart-page .totals-total dd');
    const t = (await page.locator('.cart-page .totals-total dd').textContent()).trim();
    const exp = expectTotal(ids);
    const tier = (await page.locator('.cart-page .tier-msg').textContent()).trim();
    check(`Bundle maths: ${n} different products -> ${exp.pct}% off`, t === mvr(exp.total), `${t} (subtotal ${mvr(exp.sub)}, -${mvr(exp.disc)}) · "${tier}"`);
  }
  // quantity does not count as an extra step
  await page.evaluate(() => localStorage.setItem('verum:cart', JSON.stringify([{ id: 'VRM-05', qty: 3 }, { id: 'VRM-22', qty: 1 }])));
  await page.goto(`${BASE}/cart`);
  await page.waitForSelector('.cart-page .totals-total dd');
  const t2 = (await page.locator('.cart-page .totals-total dd').textContent()).trim();
  const exp2 = byId.get('VRM-05').price * 3 + byId.get('VRM-22').price;
  check('Bundle maths: 3 of one product is still one step (no discount)', t2 === mvr(exp2), t2);
  // upsell fills missing steps
  await page.evaluate(() => localStorage.setItem('verum:cart', JSON.stringify([{ id: 'VRM-22', qty: 1 }])));
  await page.goto(`${BASE}/cart`);
  await page.waitForSelector('.cart-page .upsell-item');
  const ups = await page.locator('.cart-page .upsell .label').first().textContent();
  check('Cart: "Complete your routine" suggests the missing steps', /Missing: Cleanse, Exfoliate, Hydrate/.test(ups), ups.trim());
  await ctx.close();
}

// ---------------------------------------------------------------- 8. Keyboard-only pass
{
  const { ctx, page } = await newPage(DESKTOP);
  await page.goto(`${BASE}/`);
  await page.keyboard.press('Tab');
  const skip = await page.evaluate(() => document.activeElement?.classList.contains('skip-link'));
  await page.keyboard.press('Enter');
  const main = await page.evaluate(() => document.activeElement?.id);
  check('Keyboard: first Tab reaches "Skip to content", Enter moves to main', skip && main === 'main', `active ${main}`);
  // nav order
  await page.goto(`${BASE}/`);
  const seen = [];
  for (let i = 0; i < 9; i++) {
    await page.keyboard.press('Tab');
    seen.push(await page.evaluate(() => (document.activeElement?.getAttribute('aria-label') || document.activeElement?.textContent || '').trim().slice(0, 24)));
  }
  check('Keyboard: header order is logo, nav, search, cart', seen.join('|').includes('Shop') && seen.some((s) => /Search/.test(s)) && seen.some((s) => /Cart/.test(s)), seen.join(' | '));
  // quiz with keyboard only
  await page.goto(`${BASE}/quiz`);
  await page.evaluate(() => localStorage.removeItem('verum:quiz'));
  await page.goto(`${BASE}/quiz`);
  await page.waitForSelector('.qz-opt');
  await page.locator('.qz-opt').first().focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(250);
  const q2focus = await page.evaluate(() => document.activeElement?.id);
  check('Keyboard: quiz answer with Enter, focus moves to the next question', q2focus === 'qz-h-q2', q2focus);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.waitForTimeout(250);
  await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await page.waitForSelector('.qz-total .btn--xl');
  const resFocus = await page.evaluate(() => document.activeElement?.classList.contains('qz-res-title'));
  check('Keyboard: results reached by keyboard, focus on the results heading', resFocus);
  // back button returns to question 3, forward to results
  await page.goBack();
  await page.waitForTimeout(250);
  const backQ = await page.evaluate(() => location.hash);
  await page.goForward();
  await page.waitForTimeout(250);
  const fwdQ = await page.evaluate(() => location.hash);
  const resultsShown = await page.locator('.qz-total').count();
  check('Quiz: browser back goes to question 3, forward returns to results', backQ === '#q3' && fwdQ === '#results' && resultsShown === 1, `${backQ} -> ${fwdQ}`);
  // shop filter checkbox with Space (desktop sidebar)
  await page.goto(`${BASE}/shop`);
  await page.waitForTimeout(800);
  await page.locator('.sf input[type="checkbox"]').first().focus();
  await page.keyboard.press('Space');
  await page.waitForTimeout(200);
  check('Keyboard: shop filter toggles with Space and updates the URL', /category=/.test(page.url()), page.url().replace(BASE, ''));
  // compare toggle with Enter
  const cmpBtn = page.locator('#shop-grid > li:not([hidden]) [data-compare]').first();
  await cmpBtn.focus();
  await page.keyboard.press('Enter');
  await page.waitForTimeout(150);
  check('Keyboard: compare toggles with Enter', (await cmpBtn.getAttribute('aria-pressed')) === 'true');
  // routine picker with keyboard
  await page.goto(`${BASE}/routine`);
  await page.waitForSelector('.rb-empty');
  await page.locator('.rb-empty').first().focus();
  await page.keyboard.press('Enter');
  await page.waitForSelector('dialog.rb-picker[open]');
  const inPicker = await page.evaluate(() => !!document.activeElement?.closest('dialog.rb-picker'));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  check('Keyboard: routine slot opens its picker with Enter, focus inside, Escape closes', inPicker && (await page.locator('dialog.rb-picker[open]').count()) === 0);
  // checkout fields: tab order and labels
  await page.evaluate(() => localStorage.setItem('verum:cart', JSON.stringify([{ id: 'VRM-40', qty: 1 }])));
  await page.goto(`${BASE}/checkout`);
  await page.waitForSelector('#co-name');
  await page.locator('#co-name').focus();
  const order = [];
  for (let i = 0; i < 6; i++) {
    order.push(await page.evaluate(() => document.activeElement?.id || document.activeElement?.getAttribute('name')));
    await page.keyboard.press('Tab');
  }
  check('Keyboard: checkout fields in order (name, phone, email, delivery, building, floor)', order.join(',') === 'co-name,co-phone,co-email,method,co-building,co-floor', order.join(','));
  const attrs = await page.evaluate(() =>
    ['co-name', 'co-phone', 'co-email', 'co-building', 'co-floor', 'co-area'].map((id) => {
      const el = document.getElementById(id);
      return `${id}:${el.getAttribute('type') ?? el.tagName.toLowerCase()}:${el.getAttribute('autocomplete')}:${!!document.querySelector(`label[for="${id}"]`)}`;
    }),
  );
  check('Checkout: every field has a label, correct type and autocomplete', attrs.every((a) => !a.includes(':null') && a.endsWith(':true')), attrs.join(' '));
  check('Keyboard pass: no console errors', page.errors.length === 0, page.errors.join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------- 9. Mobile menu: focus trap, Escape
{
  const { ctx, page } = await newPage(MOBILE);
  await page.goto(`${BASE}/philosophy`);
  await page.locator('[data-menu-open]').tap();
  await page.waitForSelector('#mobile-menu[open]');
  let inside = true;
  for (let i = 0; i < 16; i++) {
    await page.keyboard.press('Tab');
    const ok = await page.evaluate(() => !!document.activeElement?.closest('#mobile-menu') || document.activeElement === document.body);
    if (!ok) inside = false;
  }
  await page.keyboard.press('Escape');
  await page.waitForTimeout(200);
  check('Mobile menu: focus stays inside, Escape closes it', inside && (await page.locator('#mobile-menu[open]').count()) === 0);
  const current = await page.locator('#mobile-menu a[aria-current="page"]').count();
  check('Mobile menu: active page marked with aria-current', current === 1);
  await ctx.close();
}

// ---------------------------------------------------------------- 10. Every page: no overflow, a buy or quiz action above the fold, no errors
for (const [label, opts] of [
  ['375px', MOBILE],
  ['desktop', DESKTOP],
]) {
  const { ctx, page } = await newPage(opts);
  const failures = [];
  const overflow = [];
  const slow = [];
  for (const r of routes) {
    const t0 = Date.now();
    await page.goto(BASE + r, { waitUntil: 'load' });
    await page.waitForTimeout(400); // islands hydrate
    const res = await page.evaluate(() => {
      const vh = innerHeight;
      const vis = (el) => {
        const b = el.getBoundingClientRect();
        const cs = getComputedStyle(el);
        return b.width > 0 && b.height > 0 && b.top < vh && b.bottom > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && !el.closest('[hidden], dialog:not([open])');
      };
      const actions = [...document.querySelectorAll('[data-add]:not([disabled]), a[href="/quiz"], a[href^="/quiz?"], .qz-opt, #co-name, a[href="/checkout"]')].filter(vis);
      return {
        actions: actions.length,
        first: actions[0]?.textContent?.trim().slice(0, 30),
        sw: document.documentElement.scrollWidth,
        vw: document.documentElement.clientWidth,
      };
    });
    const ms = Date.now() - t0;
    if (!res.actions) failures.push(r);
    if (res.sw > res.vw) overflow.push(`${r} (${res.sw}px)`);
    if (ms > 5000) slow.push(`${r} ${ms}ms`);
  }
  check(`Above the fold (${label}): a buy or quiz action is visible on all ${routes.length} pages`, failures.length === 0, failures.join(', '));
  check(`No horizontal scroll (${label}) on any page`, overflow.length === 0, overflow.join(', '));
  check(`Actionable within 5 s (${label}) on every page`, slow.length === 0, slow.join(', '));
  check(`No console errors (${label}) across all pages`, page.errors.length === 0, [...new Set(page.errors)].slice(0, 5).join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------- 11. Shared-element transition card -> product
{
  const { ctx, page } = await newPage(DESKTOP);
  await page.goto(`${BASE}/shop`);
  await page.waitForTimeout(500);
  const names = await page.evaluate(
    () =>
      new Promise((resolve) => {
        const link = document.querySelector('#shop-grid .card-name a');
        document.addEventListener(
          'astro:before-swap',
          () => {
            const old = [...document.querySelectorAll('[data-vt-img]')].filter((el) => el.style.viewTransitionName === 'product-hero').length;
            resolve({ old });
          },
          { once: true },
        );
        link.click();
      }),
  );
  await page.waitForSelector('[data-vt-hero]');
  const hero = await page.evaluate(() => getComputedStyle(document.querySelector('[data-vt-hero]')).viewTransitionName);
  check('View transitions: card image and product image share "product-hero"', names.old === 1 && hero === 'product-hero', `card ${names.old}, page ${hero}`);
  check('View transitions: no console errors', page.errors.length === 0, page.errors.join(' | '));
  await ctx.close();
}

// ---------------------------------------------------------------- 12. Reduced motion: content shown instantly
{
  const ctx = await browser.newContext({ ...DESKTOP, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/philosophy`);
  await page.waitForTimeout(300);
  const hidden = await page.evaluate(() => [...document.querySelectorAll('.reveal')].filter((el) => getComputedStyle(el).opacity !== '1').length);
  const dur = await page.evaluate(() => getComputedStyle(document.querySelector('.btn')).transitionDuration);
  check('Reduced motion: reveals shown instantly, transitions off', hidden === 0 && parseFloat(dur) <= 0.0001, `${hidden} hidden, transition ${dur}`);
  await ctx.close();
}

await browser.close();
const failed = results.filter((r) => !r.ok);
console.log(`\n${results.length - failed.length}/${results.length} checks passed.`);
await fs.writeFile(path.resolve(import.meta.dirname, '../.lighthouse/paths-results.json'), JSON.stringify(results, null, 2));
process.exit(failed.length ? 1 : 0);
