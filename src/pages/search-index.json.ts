import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { products, brands, ingredients, brandName, productImage, productUrl, productsByBrand, productsWithIngredient } from '../lib/catalog';
import { categoryLabel, stepLabel, concernLabel, goals } from '../data/taxonomy';
import { ingredientBySlug } from '../data/ingredients';
import type { SearchDoc } from '../lib/search';

/** Small search index, built once and loaded only when search is first opened. */
export const GET: APIRoute = async () => {
  const docs: SearchDoc[] = [];
  for (const p of products) {
    const src = productImage(p.images[0]);
    const [t1, t2] = await Promise.all([96, 192].map((w) => getImage({ src, width: w, height: w, format: 'webp', quality: 72 })));
    const ingTerms = p.keyIngredients.flatMap((k) => [k.name, ...(k.ingredient ? ingredientBySlug.get(k.ingredient)?.aka ?? [] : [])]);
    docs.push({
      type: 'product',
      id: p.code,
      title: p.short,
      sub: brandName(p),
      url: productUrl(p),
      code: p.code,
      price: p.price,
      thumb: t1.src,
      thumb2: t2.src,
      terms: [p.name, categoryLabel(p.category), stepLabel(p.step), p.subcategory, p.format.replace(/-/g, ' '), ...p.concerns.map(concernLabel), ...ingTerms].join(' '),
    });
  }
  for (const b of brands) {
    const n = productsByBrand(b.slug).length;
    docs.push({ type: 'brand', id: b.slug, title: b.name, sub: `${b.country} · ${n} ${n === 1 ? 'product' : 'products'}`, url: `/brands/${b.slug}`, terms: `${b.origin} brand` });
  }
  for (const i of ingredients) {
    const n = productsWithIngredient(i.slug).length;
    docs.push({
      type: 'ingredient',
      id: i.slug,
      title: i.name,
      sub: `${i.kind} · ${i.goals.map((g) => goals.find((x) => x.id === g)?.label).join(', ')} · ${n} products`,
      url: `/ingredients/${i.slug}`,
      terms: i.aka.join(' '),
    });
  }
  return new Response(JSON.stringify(docs), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
