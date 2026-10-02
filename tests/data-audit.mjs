// Data audit: every product has a real image, a price, ingredients and a routine step, and no
// concentration is shown that the brand does not publish (cross-checked against the research evidence).
// Usage: node tests/data-audit.mjs   (run after `astro build`)
import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import { products } from '../src/data/products.ts';
import { brands } from '../src/data/brands.ts';
import { ingredients } from '../src/data/ingredients.ts';

const root = path.resolve(import.meta.dirname, '..');
const problems = [];
const warn = (p, msg) => problems.push(`${p}: ${msg}`);
const STEPS = new Set(['cleanse', 'exfoliate', 'treat', 'hydrate', 'protect']);
const slugs = new Set(products.map((p) => p.slug));
const ingSlugs = new Set(ingredients.map((i) => i.slug));
const brandSlugs = new Set(brands.map((b) => b.slug));

// research evidence (kept locally in _source/, not shipped)
const research = new Map();
for (const g of 'abcd') {
  try {
    for (const r of JSON.parse(await fs.readFile(path.join(root, `_source/research/group-${g}.json`), 'utf8'))) research.set(r.slug, r);
  } catch {
    /* evidence files are optional */
  }
}
const norm = (c) => String(c).toLowerCase().replace(/\(.*?\)/g, '').replace(/[\s,]/g, '');

let imgCount = 0;
let published = 0;
let notPublished = 0;
const codes = new Set();
for (const p of products) {
  const id = `${p.code} ${p.slug}`;
  if (codes.has(p.code)) warn(id, 'duplicate code');
  codes.add(p.code);
  if (!/^VRM-\d{2}$/.test(p.code)) warn(id, 'bad code');
  if (!brandSlugs.has(p.brand)) warn(id, `unknown brand ${p.brand}`);
  if (!Number.isInteger(p.price) || p.price <= 0) warn(id, `bad price ${p.price}`);
  if (!Number.isInteger(p.stock) || p.stock < 0) warn(id, `bad stock ${p.stock}`);
  if (!STEPS.has(p.step)) warn(id, `bad step ${p.step}`);
  if (!['AM', 'PM', 'AM+PM'].includes(p.time)) warn(id, `bad time ${p.time}`);
  if (!p.keyIngredients.length) warn(id, 'no key ingredients');
  if (!p.skinTypes.length || !p.concerns.length) warn(id, 'missing skin types or concerns');
  if (!p.note || !p.howToUse || !p.texture) warn(id, 'missing note, how to use or texture');
  if (p.pairsWith.length < 2 || p.pairsWith.length > 3) warn(id, `pairsWith has ${p.pairsWith.length}`);
  for (const s of p.pairsWith) if (!slugs.has(s)) warn(id, `pairsWith unknown ${s}`);
  if (!/^https:\/\//.test(p.source)) warn(id, 'source is not an https URL');

  // images: present, square, large enough, and not an empty tile
  if (!p.images.length) warn(id, 'no images');
  for (const f of p.images) {
    const file = path.join(root, 'src/assets/products', f);
    try {
      const meta = await sharp(file).metadata();
      const stats = await sharp(file).stats();
      const spread = Math.max(...stats.channels.slice(0, 3).map((c) => c.stdev));
      if (meta.width !== meta.height || meta.width < 1000) warn(id, `${f} is ${meta.width}x${meta.height}`);
      if (spread < 6) warn(id, `${f} looks empty (stdev ${spread.toFixed(1)})`);
      imgCount++;
    } catch {
      warn(id, `missing image ${f}`);
    }
  }

  // concentrations: only where the brand publishes them
  const r = research.get(p.images[0].replace(/-\d+\.webp$/, ''));
  for (const k of p.keyIngredients) {
    if (k.ingredient && !ingSlugs.has(k.ingredient)) warn(id, `unknown ingredient ${k.ingredient}`);
    if (k.concentration === null) {
      notPublished++;
      continue;
    }
    published++;
    if (!r) {
      warn(id, `no research evidence to back ${k.name} ${k.concentration}`);
      continue;
    }
    const match = r.keyIngredients.find((x) => x.concentration && norm(x.concentration).startsWith(norm(k.concentration)) && x.evidence);
    const inName = r.name && r.name.replace(/\s/g, '').includes(k.concentration.replace(/\s/g, ''));
    if (!match && !inName) warn(id, `${k.name} ${k.concentration} is not in the brand evidence`);
  }

  // the built page shows "Not published" for every null row and the figure for every published row
  const html = await fs.readFile(path.join(root, 'dist/products', `${p.slug}.html`), 'utf8').catch(() => null);
  if (!html) warn(id, 'product page not built');
  else {
    const start = html.indexOf('<section class="fb');
    const fb = html.slice(start, html.indexOf('class="fb-foot', start));
    const np = (fb.match(/fb-val--np/g) ?? []).length;
    const nulls = p.keyIngredients.filter((k) => !k.concentration).length;
    if (np !== nulls) warn(id, `breakdown shows ${np} "Not published" rows, data has ${nulls}`);
    for (const k of p.keyIngredients.filter((k) => k.concentration)) if (!fb.includes(k.concentration)) warn(id, `breakdown missing ${k.concentration}`);
    if (!html.includes(`MVR ${p.price.toLocaleString('en-US')}`)) warn(id, 'price not shown on page');
  }
}
for (const i of ingredients) if (!products.some((p) => p.keyIngredients.some((k) => k.ingredient === i.slug))) warn(i.slug, 'ingredient has no products');
for (const b of brands) if (!products.some((p) => p.brand === b.slug)) warn(b.slug, 'brand has no products');

console.log(`Products: ${products.length} · brands: ${brands.length} · ingredients: ${ingredients.length}`);
console.log(`Images checked: ${imgCount} · published strengths: ${published} · "Not published" rows: ${notPublished}`);
console.log(`Evidence files loaded: ${research.size}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log('  - ' + p);
  process.exit(1);
}
console.log('\nPASS: every product has a real image, price, key ingredients and a routine step; every shown strength is published by the brand.');
