import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { brands, ingredients } from '../../lib/catalog';

/** Static OG images in the brand style, generated at build time. */
const PAGES: Record<string, { title: string; label: string }> = {
  home: { title: 'Shop skincare that earns its place.', label: 'Formula first · Malé, Maldives' },
  shop: { title: 'All skincare, formula-checked.', label: 'Shop · Korean and Western brands' },
  quiz: { title: 'Find your routine in 30 seconds.', label: 'Skin quiz · 3 questions · no email' },
  routine: { title: 'Build your AM and PM routine.', label: 'Routine builder · save up to 15%' },
  ingredients: { title: 'What each ingredient actually does.', label: 'Ingredient explorer' },
  brands: { title: 'Brands we stock, bought directly.', label: 'Brands · never grey market' },
  compare: { title: 'Compare up to three products.', label: 'Compare · side by side' },
  philosophy: { title: 'We read the formula first.', label: 'Philosophy · how we choose' },
  contact: { title: 'Free same-day delivery in Malé.', label: 'Delivery, pickup and contact' },
  cart: { title: 'Your cart.', label: 'Bundle discounts apply automatically' },
  checkout: { title: 'One page. No account.', label: 'Checkout · card or BML transfer' },
  credits: { title: 'Photo credits.', label: 'Credits' },
  privacy: { title: 'Nothing is stored or sent.', label: 'Privacy' },
  'not-found': { title: 'This page is not on the shelf.', label: '404' },
  'my-routine': { title: 'Your AM and PM routine.', label: 'Printable routine' },
};

export const getStaticPaths = (() => {
  const keys = [
    ...Object.keys(PAGES),
    ...ingredients.map((i) => `ingredient-${i.slug}`),
    ...brands.map((b) => `brand-${b.slug}`),
  ];
  return keys.map((slug) => ({ params: { slug } }));
}) satisfies GetStaticPaths;

let fonts: { name: string; data: Buffer; weight: 400 | 500 | 600; style: 'normal' }[] | null = null;
async function loadFonts() {
  if (fonts) return fonts;
  const dir = path.resolve('node_modules/@fontsource');
  const read = (p: string) => fs.readFile(path.join(dir, p));
  fonts = [
    { name: 'Geist', data: await read('geist/files/geist-latin-600-normal.woff'), weight: 600, style: 'normal' },
    { name: 'Geist', data: await read('geist/files/geist-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Geist Mono', data: await read('geist-mono/files/geist-mono-latin-400-normal.woff'), weight: 400, style: 'normal' },
  ];
  return fonts;
}

const LOGO =
  'data:image/svg+xml;base64,' +
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 32 32"><rect x="0.75" y="0.75" width="30.5" height="30.5" fill="none" stroke="#141414" stroke-width="1.5"/><path d="M8.5 8.5 16 24l7.5-15.5" fill="none" stroke="#141414" stroke-width="1.6"/><rect x="23.5" y="23.5" width="5" height="5" fill="#8A9A86"/></svg>',
  ).toString('base64');

type Node = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
  type,
  props: { style, children, ...extra },
});

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug!;
  let meta = PAGES[slug];
  if (!meta && slug.startsWith('ingredient-')) {
    const ing = ingredients.find((i) => `ingredient-${i.slug}` === slug)!;
    meta = { title: `${ing.name}: what it does.`, label: `Ingredient · ${ing.kind} · ${ing.time}` };
  }
  if (!meta && slug.startsWith('brand-')) {
    const b = brands.find((x) => `brand-${x.slug}` === slug)!;
    meta = { title: `${b.name} at VERUM.`, label: `Brand · ${b.country} · bought directly` };
  }
  const tree = h(
    'div',
    {
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      background: '#FAFAF8',
      padding: '56px 64px',
      fontFamily: 'Geist',
      color: '#141414',
      position: 'relative',
    },
    [
      // hairline grid
      ...[1, 2, 3].map((i) =>
        h('div', { position: 'absolute', top: 0, bottom: 0, left: `${i * 300}px`, width: '1px', background: '#E2E2DC' }),
      ),
      h('div', { position: 'absolute', left: 0, right: 0, top: '150px', height: '1px', background: '#E2E2DC' }),
      h('div', { position: 'absolute', left: 0, right: 0, bottom: '110px', height: '1px', background: '#E2E2DC' }),
      h('div', { display: 'flex', alignItems: 'center', gap: '20px' }, [
        h('img', { width: '56px', height: '56px' }, undefined, { src: LOGO, width: 56, height: 56 }),
        h('div', { fontSize: '30px', fontWeight: 600, letterSpacing: '8px' }, 'VERUM'),
        h('div', { marginLeft: 'auto', fontFamily: 'Geist Mono', fontSize: '22px', color: '#5E6F5B' }, meta.label),
      ]),
      h('div', { display: 'flex', fontSize: meta.title.length > 34 ? '76px' : '88px', fontWeight: 600, letterSpacing: '-3px', lineHeight: 1.02, maxWidth: '1000px' }, meta.title),
      h('div', { display: 'flex', justifyContent: 'space-between', fontFamily: 'Geist Mono', fontSize: '20px', color: '#6B6B66' }, [
        h('div', {}, 'Formula first. · Malé, Maldives'),
        h('div', { color: '#141414' }, 'A Nuit Works concept. VERUM is a fictional business.'),
      ]),
    ],
  );
  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts: await loadFonts() });
  const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9, palette: true }).toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
