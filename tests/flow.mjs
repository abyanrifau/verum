// Timed core flow: landing -> quiz -> full routine in cart -> one-page checkout -> confirmation.
// Runs with a human pacing model so the times mean something for a first-time visitor,
// and once flat-out to show the interaction floor.
// Usage: node tests/flow.mjs [baseUrl]
import { chromium } from 'playwright-core';

const BASE = (process.argv[2] ?? 'http://localhost:4377').replace(/\/$/, '');
const CHROME = process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe';

// Pacing model (ms). Deliberately unhurried: reading the hero, reading each question,
// looking over the results, and typing at ~4 characters a second on a phone.
const HUMAN = {
  landing: 3000,
  question: 2500,
  results: 6000,
  drawer: 2000,
  fieldSwitch: 900,
  perChar: { mobile: 250, desktop: 150 },
  decide: 1500,
  gateway: 2000,
};
const FAST = { landing: 0, question: 0, results: 0, drawer: 0, fieldSwitch: 0, perChar: { mobile: 0, desktop: 0 }, decide: 0, gateway: 0 };

const RUNS = [
  { skin: 'Oily', priority: 'Breakouts', tolerance: 'Handles most things', method: 'male', pay: 'card', name: 'Aishath Test', phone: '7771234', building: 'H. Sea Breeze', floor: '3', area: 'Henveiru' },
  { skin: 'Dry', priority: 'Dryness and barrier', tolerance: 'Gets irritated sometimes', method: 'hulhumale', pay: 'bml', name: 'Ibrahim Test', phone: '9601234', building: 'Lot 10512', floor: '5', area: 'Hulhumalé Phase 1' },
  { skin: 'Sensitive', priority: 'Sun protection and daily basics', tolerance: 'Reacts easily', method: 'pickup', pay: 'card', name: 'Mariyam Test', phone: '7654321' },
  { skin: 'Combination', priority: 'Dark spots and uneven tone', tolerance: 'Handles most things', method: 'male', pay: 'card', name: 'Hassan Test', phone: '7009988', building: 'M. Coral View', floor: '2', area: 'Maafannu' },
];

const wait = (ms) => (ms ? new Promise((r) => setTimeout(r, ms)) : Promise.resolve());

async function typeHuman(page, selector, text, perChar) {
  await page.click(selector);
  if (perChar) await page.type(selector, text, { delay: perChar });
  else await page.fill(selector, text);
}

async function runFlow(browser, run, form, pace) {
  const mobile = form === 'mobile';
  const ctx = await browser.newContext({
    viewport: mobile ? { width: 375, height: 812 } : { width: 1440, height: 900 },
    deviceScaleFactor: mobile ? 3 : 1,
    isMobile: mobile,
    hasTouch: mobile,
  });
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
  let taps = 0;
  let keys = 0;
  const tap = async (locator) => {
    taps++;
    if (mobile) await locator.tap();
    else await locator.click();
  };

  const t0 = Date.now();
  await page.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
  await wait(pace.landing);
  await tap(page.locator('main a[href="/quiz"]').first());
  await page.waitForSelector('.qz-opt');
  for (const label of [run.skin, run.priority, run.tolerance]) {
    await wait(pace.question);
    await tap(page.locator('.qz-opt', { hasText: label }).first());
  }
  await page.waitForSelector('.qz-total .btn--xl');
  const quizTotal = (await page.locator('.qz-total-row dd').textContent())?.trim();
  const quizSteps = await page.locator('.qz-res-title').textContent();
  await wait(pace.results);
  await tap(page.locator('.qz-total .btn--xl'));
  await page.waitForSelector('dialog.drawer[open] .checkout-btn');
  await page.waitForFunction(() => !document.querySelector('dialog.drawer .cart-loading'));
  const drawerTotal = (await page.locator('dialog.drawer .totals-total dd').textContent())?.trim();
  await wait(pace.drawer);
  await tap(page.locator('dialog.drawer .checkout-btn'));
  await page.waitForSelector('#co-name');
  const per = pace.perChar[form];
  const type = async (sel, text) => {
    keys += text.length;
    taps++;
    await wait(pace.fieldSwitch);
    await typeHuman(page, sel, text, per);
  };
  await type('#co-name', run.name);
  await type('#co-phone', run.phone);
  if (run.method !== 'male') {
    await wait(pace.decide);
    await tap(page.locator(`input[name="method"][value="${run.method}"]`));
  }
  if (run.method === 'male' || run.method === 'hulhumale') {
    await type('#co-building', run.building);
    await type('#co-floor', run.floor);
    await wait(pace.fieldSwitch);
    taps++;
    await page.selectOption('#co-area', run.area);
  }
  if (run.pay === 'bml') {
    await wait(pace.decide);
    await tap(page.locator('input[name="pay"][value="bml"]'));
  }
  const checkoutTotal = (await page.locator('.co-sec--summary .totals-total dd').textContent())?.trim();
  await wait(pace.decide);
  await tap(page.locator('button.co-place'));
  if (run.pay === 'card') {
    await page.waitForSelector('.gw');
    await wait(pace.gateway);
    await tap(page.locator('.gw button.btn--xl'));
  }
  await page.waitForURL('**/checkout/confirmed');
  await page.waitForSelector('.cf-title');
  const wall = (Date.now() - t0) / 1000;
  const order = await page.evaluate(() => JSON.parse(localStorage.getItem('verum:order') || 'null'));
  const speedLine = (await page.locator('.cf-speed').textContent().catch(() => null))?.trim();
  const cartAfter = await page.evaluate(() => localStorage.getItem('verum:cart'));
  await ctx.close();
  return {
    form,
    answers: `${run.skin} / ${run.priority} / ${run.tolerance}`,
    method: run.method,
    pay: run.pay,
    products: order?.items.length,
    steps: order?.steps,
    percent: order?.percent,
    total: order?.total,
    totalsMatch: [quizTotal, drawerTotal, checkoutTotal].every((t) => t === `MVR ${order?.total.toLocaleString('en-US')}`),
    quizSteps: quizSteps?.trim(),
    taps,
    keys,
    wallSeconds: Math.round(wall * 10) / 10,
    siteSeconds: order?.flowSeconds,
    speedLine,
    cartCleared: cartAfter === '[]',
    errors,
  };
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const out = [];
for (const form of ['mobile', 'desktop']) {
  for (const run of RUNS) {
    const r = await runFlow(browser, run, form, HUMAN);
    out.push({ pace: 'human', ...r });
    console.log(JSON.stringify({ pace: 'human', ...r }));
  }
  const fast = await runFlow(browser, RUNS[0], form, FAST);
  out.push({ pace: 'fast', ...fast });
  console.log(JSON.stringify({ pace: 'fast', ...fast }));
}
await browser.close();
const human = out.filter((r) => r.pace === 'human');
console.log('\nSUMMARY');
for (const r of out) {
  console.log(
    `${r.pace.padEnd(5)} ${r.form.padEnd(7)} ${r.answers.padEnd(62)} ${r.method.padEnd(9)} ${r.pay.padEnd(4)} products ${r.products} (${r.percent}% off) total MVR ${r.total} | site timer ${r.siteSeconds}s wall ${r.wallSeconds}s | taps ${r.taps} keys ${r.keys} | totals match ${r.totalsMatch} | errors ${r.errors.length}`,
  );
}
const max = Math.max(...human.map((r) => r.siteSeconds ?? Infinity));
const fsm = await import('node:fs/promises');
await fsm.mkdir(new URL('../.lighthouse/', import.meta.url), { recursive: true });
await fsm.writeFile(new URL('../.lighthouse/flow-results.json', import.meta.url), JSON.stringify(out, null, 2));
console.log(`\nSlowest human-paced run: ${max}s. Under 60 seconds: ${max < 60}`);
