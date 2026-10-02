import type { APIRoute } from 'astro';
import { getImage } from 'astro:assets';
import { products, brandName, productImage, productUrl, rating, productIngredientSlugs } from '../lib/catalog';
import type { LiteProduct } from '../lib/lite';

/** Compact catalog for islands (cart, quiz, routine builder, compare). Fetched once, cached. */
export const GET: APIRoute = async () => {
  const out: LiteProduct[] = await Promise.all(
    products.map(async (p) => {
      const src = productImage(p.images[0]);
      const [t1, t2, img] = await Promise.all(
        [96, 192, 400].map((w) => getImage({ src, width: w, height: w, format: 'webp', quality: 74 })),
      );
      const r = rating(p);
      return {
        id: p.code,
        slug: p.slug,
        name: p.name,
        short: p.short,
        brand: brandName(p),
        brandSlug: p.brand,
        size: p.size,
        sizeValue: p.sizeValue,
        sizeUnit: p.sizeUnit,
        price: p.price,
        stock: p.stock,
        step: p.step,
        time: p.time,
        category: p.category,
        format: p.format,
        skin: p.skinTypes,
        concerns: p.concerns,
        ings: productIngredientSlugs(p),
        key: p.keyIngredients.map((k) => ({ name: k.name, c: k.concentration, ...(k.ingredient ? { ing: k.ingredient } : {}) })),
        ff: p.fragranceFree,
        strength: p.strength,
        flags: p.flags,
        rating: r.avg,
        reviews: r.count,
        texture: p.texture,
        howToUse: p.howToUse,
        ...(p.frequency ? { frequency: p.frequency } : {}),
        sales: p.salesRank,
        url: productUrl(p),
        t1: t1.src,
        t2: t2.src,
        img: img.src,
        alt: p.imageAlt,
      };
    }),
  );
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
