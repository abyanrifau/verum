// Average order value on the demo data: every one of the 90 quiz answer combinations versus
// orders built without the quiz. Uses the site's own ranking and bundle code (bundled by esbuild).
// Usage: npx esbuild src/lib/quiz.ts --bundle --platform=node --format=esm --outfile=.lighthouse/quiz.bundle.mjs
//        npx esbuild src/lib/bundle.ts --bundle --platform=node --format=esm --outfile=.lighthouse/bundle.bundle.mjs
//        node tests/aov.mjs
import fs from 'node:fs/promises';
import path from 'node:path';
import { buildRoutine } from '../.lighthouse/quiz.bundle.mjs';
import { bundle } from '../.lighthouse/bundle.bundle.mjs';

const root = path.resolve(import.meta.dirname, '..');
const catalog = JSON.parse(await fs.readFile(path.join(root, 'dist/catalog.json'), 'utf8'));
const byId = new Map(catalog.map((p) => [p.id, p]));
const total = (ids) => bundle([...new Set(ids)].map((id) => ({ id, qty: 1, price: byId.get(id).price })));

const skins = ['oily', 'dry', 'combination', 'normal', 'sensitive'];
const priorities = ['breakouts', 'dark-spots', 'dryness', 'oil-pores', 'ageing', 'basics'];
const tolerances = ['most', 'sometimes', 'reacts'];
const full = [];
const am = [];
const pm = [];
const sizes = [];
for (const skin of skins)
  for (const priority of priorities)
    for (const tolerance of tolerances) {
      const plan = buildRoutine(catalog, { skin, priority, tolerance });
      const amIds = plan.slots.am.map((s) => plan.picks[s.key]).filter(Boolean);
      const pmIds = plan.slots.pm.map((s) => plan.picks[s.key]).filter(Boolean);
      const f = total([...amIds, ...pmIds]);
      full.push(f.total);
      sizes.push(f.steps);
      am.push(total(amIds).total);
      pm.push(total(pmIds).total);
    }
const avg = (a) => Math.round(a.reduce((s, x) => s + x, 0) / a.length);
const min = (a) => Math.min(...a);
const max = (a) => Math.max(...a);
const prices = catalog.map((p) => p.price);
// Without the quiz: one product per order (the small-order problem the shop has today), and a two-product basket.
const single = avg(prices);
let pairSum = 0;
let pairN = 0;
for (let i = 0; i < prices.length; i++) for (let j = i + 1; j < prices.length; j++) (pairSum += prices[i] + prices[j]), pairN++;
const pair = Math.round(pairSum / pairN);

console.log(`Quiz combinations: ${full.length}`);
console.log(`Full routine: average MVR ${avg(full)} (min ${min(full)}, max ${max(full)}), ${avg(sizes)} products on average, ${full.length ? Math.round((sizes.filter((n) => n >= 5).length / sizes.length) * 100) : 0}% reach the 15% tier`);
console.log(`AM only: average MVR ${avg(am)} · PM only: average MVR ${avg(pm)}`);
console.log(`Without the quiz: single product MVR ${single} · two-product basket MVR ${pair}`);
console.log(`Uplift: full routine is ${(avg(full) / single).toFixed(1)}x a single-product order and ${(avg(full) / pair).toFixed(1)}x a two-product basket`);
