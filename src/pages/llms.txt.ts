import type { APIRoute } from 'astro';
import { products, brands, ingredients, brandName, productsByBrand } from '../lib/catalog';
import { categories, stepLabel } from '../data/taxonomy';
import { site, deliveryZones } from '../data/site';
import { faq } from '../data/faq';
import { SITE_URL } from '../lib/seo';
import { mvr } from '../lib/money';

export const GET: APIRoute = () => {
  const tiers = site.discountTiers.map((t) => `${t.minSteps} or more steps: ${t.percent}% off`).join('; ');
  const lines = [
    '# VERUM',
    '',
    '> VERUM is a fictional skincare shop in Malé, Maldives, created by the web design studio Nuit Works (https://nuit.works) as a concept site. It is not a real business, it does not take orders and no payment is ever taken.',
    '',
    'Within the concept, VERUM resells Korean and Western skincare brands. Every product is described as bought directly from the brand or its authorised distributor and formula-checked before stocking. There are no sponsored placements. Prices are in Maldivian rufiyaa (MVR) and include GST.',
    '',
    '## Key facts',
    '',
    `- Location: ${site.address.city}, ${site.address.countryName} (placeholder address: ${site.address.building}, ${site.address.street}).`,
    `- Range: ${products.length} products from ${brands.length} brands, Korean and Western.`,
    `- Categories: ${categories.map((c) => c.label).join(', ')}.`,
    `- Routine steps: cleanse, exfoliate, treat, hydrate, protect.`,
    `- Bundle discount: each different product in the cart counts as one routine step. ${tiers}. It applies automatically.`,
    `- Delivery: ${deliveryZones.map((z) => `${z.short}: ${z.feeLabel.toLowerCase()}, ${z.timing.charAt(0).toLowerCase()}${z.timing.slice(1)}`).join('. ')}.`,
    `- Pickup: from the VERUM shop in Malé, ${site.pickup.days}, ${site.pickup.hours}.`,
    `- Payment (demo only): card through a demo bank gateway, or BML bank transfer.`,
    `- Contact (placeholders): ${site.contact.email}, WhatsApp ${site.contact.whatsappDisplay}. Brands: ${site.contact.tradeEmail}.`,
    '',
    '## The quiz',
    '',
    `- [Skin quiz](${SITE_URL}/quiz): three questions (skin type, priority, tolerance), tap-only, no email. It ranks every product with a transparent scoring function and builds a full AM and PM routine with one top pick per step and two alternatives, shows the bundle discount live, and adds the whole routine to the cart in one tap.`,
    `- [Routine builder](${SITE_URL}/routine): AM and PM slots, conflict warnings, shareable links.`,
    `- [Ingredient explorer](${SITE_URL}/ingredients): what each ingredient does, who it suits, when to use it and what not to layer it with.`,
    '',
    '## Pages',
    '',
    `- [Home](${SITE_URL}/)`,
    `- [Shop](${SITE_URL}/shop)`,
    `- [Brands](${SITE_URL}/brands)`,
    `- [Compare](${SITE_URL}/compare)`,
    `- [Philosophy](${SITE_URL}/philosophy)`,
    `- [Delivery, contact and FAQ](${SITE_URL}/contact)`,
    '',
    '## Brands',
    '',
    ...brands.map((b) => `- [${b.name}](${SITE_URL}/brands/${b.slug}) (${b.country}): ${productsByBrand(b.slug).length} products.`),
    '',
    '## Ingredients',
    '',
    ...ingredients.map((i) => `- [${i.name}](${SITE_URL}/ingredients/${i.slug}): ${i.answer}`),
    '',
    '## Products',
    '',
    ...products.map((p) => `- [${p.code} ${brandName(p)} ${p.name}](${SITE_URL}/products/${p.slug}), ${p.size}, ${stepLabel(p.step)}, ${mvr(p.price)}.`),
    '',
    '## FAQ',
    '',
    ...faq.map((f) => `- ${f.q} ${f.a}`),
    '',
    '## Notes',
    '',
    '- Ingredient concentrations are shown only where the brand publishes them. Elsewhere the breakdown says "Not published". VERUM does not estimate.',
    '- Product reviews on the site are sample reviews written for the concept.',
    '- Brand names and product images belong to their respective owners.',
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
