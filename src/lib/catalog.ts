import type { ImageMetadata } from 'astro';
import { products } from '../data/products';
import { brands } from '../data/brands';
import { ingredients } from '../data/ingredients';
import { reviews } from '../data/reviews';
import type { Product } from '../data/types';
import { stepLabel, categoryLabel } from '../data/taxonomy';
import { site } from '../data/site';

const productFiles = import.meta.glob<ImageMetadata>('/src/assets/products/*.{webp,png,jpg}', {
  eager: true,
  import: 'default',
});
const editorialFiles = import.meta.glob<ImageMetadata>('/src/assets/editorial/*.{jpg,webp}', {
  eager: true,
  import: 'default',
});

export function productImage(file: string): ImageMetadata {
  const hit = productFiles[`/src/assets/products/${file}`];
  if (!hit) throw new Error(`Missing product image: ${file}`);
  return hit;
}
export const productImages = (p: Product) => p.images.map(productImage);

export function editorialImage(key: string): ImageMetadata {
  const hit = Object.entries(editorialFiles).find(([k]) => k.includes(`/${key}.`))?.[1];
  if (!hit) throw new Error(`Missing editorial image: ${key}`);
  return hit;
}

export const brandBySlug = new Map(brands.map((b) => [b.slug, b]));
export const productBySlug = new Map(products.map((p) => [p.slug, p]));
export const productByCode = new Map(products.map((p) => [p.code, p]));
export const brandName = (p: Product) => brandBySlug.get(p.brand)?.name ?? p.brand;
export const productUrl = (p: Product) => `/products/${p.slug}`;
export const fullName = (p: Product) => `${brandName(p)} ${p.name}`;

export function reviewsFor(p: Product) {
  return reviews.filter((r) => r.product === p.slug);
}
export function rating(p: Product): { avg: number | null; count: number } {
  const rs = reviewsFor(p);
  if (!rs.length) return { avg: null, count: 0 };
  return { avg: Math.round((rs.reduce((s, r) => s + r.rating, 0) / rs.length) * 10) / 10, count: rs.length };
}

export const productIngredientSlugs = (p: Product) =>
  [...new Set(p.keyIngredients.map((k) => k.ingredient).filter(Boolean))] as string[];

export const productsWithIngredient = (slug: string) =>
  products.filter((p) => p.keyIngredients.some((k) => k.ingredient === slug));

export const productsByBrand = (slug: string) => products.filter((p) => p.brand === slug);

export const bestsellers = () => [...products].filter((p) => p.flags.includes('bestseller')).sort((a, b) => a.salesRank - b.salesRank);
export const newArrivals = () =>
  [...products].filter((p) => p.flags.includes('new')).sort((a, b) => b.addedOn.localeCompare(a.addedOn));

export const stockSignal = (p: Product): { text: string; tone: 'out' | 'low' | 'ok' } => {
  if (p.stock <= 0) return { text: 'Out of stock', tone: 'out' };
  if (p.stock <= site.lowStockAt) return { text: `Only ${p.stock} left`, tone: 'low' };
  return { text: 'In stock', tone: 'ok' };
};

/** Lab-label line: "VRM-04 · Glow Serum · Niacinamide 2%" */
export function labLine(p: Product) {
  const pub = p.keyIngredients.find((k) => k.concentration);
  return [p.code, p.short, pub ? `${pub.name} ${pub.concentration}` : stepLabel(p.step)].join(' · ');
}

export function describe(p: Product) {
  const keys = p.keyIngredients.slice(0, 3).map((k) => k.name.toLowerCase());
  return `${brandName(p)} ${p.name}, ${p.size}. ${categoryLabel(p.category)} step with ${keys.join(', ')}. ${p.note}`;
}

export { products, brands, ingredients };
