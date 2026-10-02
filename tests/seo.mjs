// SEO and GEO checks on the built site:
// - JSON-LD: valid JSON, every type and property exists in the schema.org vocabulary and is allowed
//   on its type, Google's required fields are present, and there is no Review / AggregateRating markup.
// - Every page: unique title (< 60) and description (< 155), one H1, canonical, OG + Twitter tags,
//   OG image file present, alt on every image, footer concept line linking to nuit.works.
// - Root files: sitemap, robots.txt, llms.txt, favicons, manifest.
// Usage: node tests/seo.mjs   (after `astro build`; downloads the schema.org vocabulary once)
import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const DIST = path.join(root, 'dist');
const VOCAB = path.join(root, '.lighthouse/schemaorg.jsonld');
const problems = [];
const bad = (where, msg) => problems.push(`${where}: ${msg}`);

// ---------- vocabulary
let vocabRaw;
try {
  vocabRaw = await fs.readFile(VOCAB, 'utf8');
} catch {
  const r = await fetch('https://schema.org/version/latest/schemaorg-current-https.jsonld');
  vocabRaw = await r.text();
  await fs.mkdir(path.dirname(VOCAB), { recursive: true });
  await fs.writeFile(VOCAB, vocabRaw);
}
const graph = JSON.parse(vocabRaw)['@graph'];
const arr = (x) => (x === undefined ? [] : Array.isArray(x) ? x : [x]);
const short = (id) => id.replace(/^schema:/, '');
const classes = new Map();
const props = new Map();
for (const n of graph) {
  const types = arr(n['@type']);
  if (types.includes('rdfs:Class') || arr(n['rdfs:subClassOf']).length || types.includes('schema:DataType'))
    classes.set(short(n['@id']), arr(n['rdfs:subClassOf']).map((s) => short(s['@id'])));
  if (types.includes('rdf:Property'))
    props.set(short(n['@id']), { domain: arr(n['schema:domainIncludes']).map((d) => short(d['@id'])), range: arr(n['schema:rangeIncludes']).map((d) => short(d['@id'])) });
  // enumeration members (e.g. InStock) are typed with their enumeration
  if (!classes.has(short(n['@id'])) && types.some((t) => t.startsWith('schema:'))) classes.set(short(n['@id']), types.map(short));
}
const ancestors = (t, seen = new Set()) => {
  if (seen.has(t)) return seen;
  seen.add(t);
  for (const p of classes.get(t) ?? []) ancestors(p, seen);
  return seen;
};

const REQUIRED = {
  Product: ['name', 'image', 'offers', 'sku', 'brand'],
  Offer: ['price', 'priceCurrency', 'availability'],
  BreadcrumbList: ['itemListElement'],
  ListItem: ['position'],
  ItemList: ['itemListElement'],
  FAQPage: ['mainEntity'],
  Question: ['name', 'acceptedAnswer'],
  Answer: ['text'],
  HealthAndBeautyBusiness: ['name', 'address', 'disambiguatingDescription', 'openingHoursSpecification', 'contactPoint', 'currenciesAccepted'],
  PostalAddress: ['addressLocality', 'addressCountry'],
};
const found = new Map(); // route -> Set of top-level types
let jsonldBlocks = 0;
let nodes = 0;

function validate(node, where, pathStr) {
  if (Array.isArray(node)) return node.forEach((n, i) => validate(n, where, `${pathStr}[${i}]`));
  if (!node || typeof node !== 'object') return;
  const type = node['@type'];
  if (type) {
    nodes++;
    for (const t of arr(type)) {
      if (!classes.has(t)) bad(where, `${pathStr}: unknown type ${t}`);
      if (t === 'Review' || t === 'AggregateRating') bad(where, `${pathStr}: ${t} markup is not allowed (sample reviews)`);
      for (const req of REQUIRED[t] ?? []) if (node[req] === undefined) bad(where, `${pathStr}: ${t} missing ${req}`);
    }
    const anc = new Set(arr(type).flatMap((t) => [...ancestors(t)]));
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('@')) continue;
      if (k === 'review' || k === 'aggregateRating') bad(where, `${pathStr}: ${k} is not allowed`);
      const def = props.get(k);
      if (!def) {
        bad(where, `${pathStr}: unknown property ${k}`);
        continue;
      }
      if (def.domain.length && !def.domain.some((d) => anc.has(d))) bad(where, `${pathStr}: ${k} is not a property of ${arr(type).join('/')}`);
      validate(v, where, `${pathStr}.${k}`);
    }
  } else {
    for (const [k, v] of Object.entries(node)) if (!k.startsWith('@')) validate(v, where, `${pathStr}.${k}`);
  }
}

// ---------- pages
const files = [];
async function walk(dir) {
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory() && e.name !== '_astro' && e.name !== 'og') await walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
}
await walk(DIST);
const titles = new Map();
const descs = new Map();
const attr = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
const meta = (html, key, val) => {
  const tag = html.match(new RegExp(`<meta[^>]*${key}="${val}"[^>]*>`))?.[0];
  return tag ? attr(tag, 'content') : undefined;
};
for (const f of files) {
  const route = '/' + path.relative(DIST, f).replace(/\\/g, '/').replace(/\.html$/, '').replace(/^index$/, '');
  const html = await fs.readFile(f, 'utf8');
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(/&amp;/g, '&');
  const desc = meta(html, 'name', 'description');
  const noindex = /<meta name="robots" content="noindex/.test(html);
  if (!title) bad(route, 'no title');
  else {
    if (title.length >= 60) bad(route, `title is ${title.length} chars`);
    if (titles.has(title)) bad(route, `title duplicates ${titles.get(title)}`);
    titles.set(title, route);
  }
  if (!desc) bad(route, 'no description');
  else {
    if (desc.length >= 155) bad(route, `description is ${desc.length} chars`);
    if (descs.has(desc) && !noindex) bad(route, `description duplicates ${descs.get(desc)}`);
    descs.set(desc, route);
  }
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) bad(route, `${h1} h1 elements`);
  if (!/<link rel="canonical" href="https:\/\//.test(html)) bad(route, 'no absolute canonical');
  for (const [k, v] of [
    ['property', 'og:title'],
    ['property', 'og:description'],
    ['property', 'og:image'],
    ['property', 'og:url'],
    ['name', 'twitter:card'],
    ['name', 'twitter:image'],
  ])
    if (!meta(html, k, v)) bad(route, `missing ${v}`);
  const og = meta(html, 'property', 'og:image');
  if (og) {
    const local = path.join(DIST, new URL(og).pathname);
    try {
      await fs.access(local);
    } catch {
      bad(route, `og:image file missing ${new URL(og).pathname}`);
    }
  }
  if (!/<meta name="theme-color" content="#FAFAF8"/i.test(html)) bad(route, 'theme-color missing');
  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\salt(="|[\s>])/.test(img)) bad(route, `img without alt: ${img.slice(0, 80)}`);
    if (!/\swidth="/.test(img) || !/\sheight="/.test(img)) bad(route, `img without width/height: ${img.slice(0, 80)}`);
  }
  // footer concept line
  const footer = html.slice(html.indexOf('<footer class="site-footer"'));
  if (!/A <a href="https:\/\/nuit\.works"[^>]*>Nuit Works<\/a> concept\. VERUM is a fictional business\./.test(footer) || !html.includes('<footer class="site-footer"')) bad(route, 'footer concept line missing');
  if (!footer.includes('Brand names and product images belong to their respective owners.')) bad(route, 'footer ownership line missing');

  // JSON-LD
  const types = new Set();
  for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    jsonldBlocks++;
    let data;
    try {
      data = JSON.parse(m[1]);
    } catch (e) {
      bad(route, `JSON-LD does not parse: ${e.message}`);
      continue;
    }
    if (data['@context'] !== 'https://schema.org') bad(route, 'JSON-LD @context is not https://schema.org');
    arr(data['@type']).forEach((t) => types.add(t));
    validate(data, route, data['@type']);
  }
  found.set(route, types);
}
// required JSON-LD by page type
const need = (route, type) => {
  if (!found.get(route)?.has(type)) bad(route, `missing ${type} JSON-LD`);
};
for (const r of ['/', '/philosophy', '/contact']) need(r, 'HealthAndBeautyBusiness');
need('/contact', 'FAQPage');
need('/shop', 'ItemList');
for (const r of found.keys()) {
  if (r.startsWith('/products/')) {
    need(r, 'Product');
    need(r, 'BreadcrumbList');
  }
  if (r.startsWith('/brands/') || r.startsWith('/ingredients/')) {
    need(r, 'ItemList');
    need(r, 'BreadcrumbList');
  }
}

// ---------- root files
for (const f of ['sitemap-index.xml', 'sitemap-0.xml', 'robots.txt', 'llms.txt', 'favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'site.webmanifest', 'icon-192.png', 'icon-512.png', 'catalog.json', 'search-index.json', 'og/home.png']) {
  try {
    const st = await fs.stat(path.join(DIST, f));
    if (!st.size) bad(f, 'empty file');
  } catch {
    bad(f, 'missing');
  }
}
const robots = await fs.readFile(path.join(DIST, 'robots.txt'), 'utf8');
if (!/Sitemap: https:\/\/.*sitemap-index\.xml/.test(robots)) bad('robots.txt', 'no sitemap line');
const llms = await fs.readFile(path.join(DIST, 'llms.txt'), 'utf8');
if (!/fictional/.test(llms) || !/Nuit Works/.test(llms)) bad('llms.txt', 'does not state it is a fictional Nuit Works concept');
const sitemap = await fs.readFile(path.join(DIST, 'sitemap-0.xml'), 'utf8');
const locs = (sitemap.match(/<loc>/g) ?? []).length;
if (/checkout\/confirmed|my-routine/.test(sitemap)) bad('sitemap', 'contains noindex pages');
const ogCount = (await fs.readdir(path.join(DIST, 'og'))).length;

console.log(`Pages: ${files.length} · JSON-LD blocks: ${jsonldBlocks} · typed nodes validated: ${nodes} · sitemap URLs: ${locs} · OG images: ${ogCount}`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems.slice(0, 80)) console.log('  - ' + p);
  process.exit(1);
}
console.log('PASS: JSON-LD valid against schema.org with required fields, no review markup; every page has unique meta, one H1, canonical, OG/Twitter tags, alt text and the footer concept line; root files present.');
