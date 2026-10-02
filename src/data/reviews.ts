import type { Review, SkinType, Format } from './types';
import { products } from './products';

/**
 * SAMPLE reviews written for this concept. They are labelled as samples on every page
 * and are never added to structured data.
 */
const POOL: Partial<Record<Format | 'default', string[]>> = {
  sunscreen: [
    'No white cast on me, and it does not pill under make-up.',
    'Light enough that I actually reapply at lunch.',
    'Survived a ferry ride and an afternoon outside without feeling greasy.',
    'Does not sting my eyes, which is a first for me.',
    'Dewy rather than shiny. Works on its own as a primer.',
    'I go through a tube a month now. That says enough.',
  ],
  serum: [
    'Absorbs in seconds and layers well under my moisturiser.',
    'My skin looks more even after about six weeks.',
    'No stickiness, even in this humidity.',
    'Gentle. I use it morning and night without any tingling.',
    'Small bottle, but a few drops cover the whole face.',
    'Took a while to see a difference, but it is there.',
  ],
  essence: [
    'Skin feels bouncy straight after. I use it every day.',
    'Strange texture at first, now I miss it when I skip it.',
    'My dry patches settled within a week.',
    'Layers under everything without pilling.',
  ],
  ampoule: [
    'Calms my cheeks after a day in the sun.',
    'Watery, light, and nothing in it bothers my skin.',
    'My go-to on days my skin feels angry.',
    'Simple formula. Exactly what I wanted.',
  ],
  moisturiser: [
    'Rich enough for air-conditioning, light enough for outside.',
    'No breakouts, which is rare for me with creams.',
    'Skin feels comfortable all day.',
    'A small amount goes a long way.',
    'Sits well under sunscreen with no pilling.',
  ],
  toner: [
    'Cooling and light. I keep it by the sink.',
    'Skin feels less tight after cleansing.',
    'Nothing fancy, just works.',
    'I use it on a cotton pad and the next steps absorb better.',
  ],
  exfoliant: [
    'Fewer clogged pores after a month of every other night.',
    'Started twice a week, now every other day. Smoother skin.',
    'Strong, so I take it slowly. Worth it.',
    'My skin looks brighter in the mornings.',
  ],
  'gel-cleanser': [
    'Clean, not stripped. Exactly right.',
    'Gentle enough for the mornings.',
    'Lasts ages and never leaves my skin tight.',
  ],
  'foam-cleanser': ['Takes off sunscreen and sweat without drying me out.', 'Good lather, rinses fast.', 'My oily T-zone stays calmer.'],
  'cream-cleanser': ['Feels like washing with lotion, in a good way.', 'My skin is never tight after.', 'Perfect for dry mornings.'],
  'oil-cleanser': ['Melts sunscreen off in seconds.', 'Rinses clean with no film.', 'Double cleansing is easy with this.'],
  'balm-cleanser': ['Takes off waterproof mascara easily.', 'Melts into an oil and rinses milky. Lovely.', 'No sting around my eyes.'],
  'micellar-water': ['Quick and gentle for the end of a long day.', 'Does not sting my eyes.', 'A bottle by the bed for lazy nights.'],
  'sleeping-mask': ['I wake up with plumper-looking skin.', 'A nice treat twice a week.', 'Feels cooling going on.'],
  'wash-off-mask': ['My nose looks clearer after each use.', 'Does not leave my skin tight.', 'Once a week keeps my T-zone in check.'],
  patch: ['Stays on overnight and keeps my hands off.', 'Nearly invisible on my skin tone.', 'A spot looks flatter by morning.'],
  'lip-mask': ['My lips are soft in the morning.', 'Smells nice and lasts forever.', 'I keep one in my bag and one by the bed.'],
  mist: ['Lovely after the beach.', 'Cool and calming in the heat.', 'I spray it before my serum.'],
  default: ['Does what it says.', 'Would buy again.', 'Good value for how long it lasts.'],
};

const NAMES = ['Aishath', 'Mariyam', 'Fathimath', 'Hawwa', 'Aminath', 'Shifa', 'Nashwa', 'Zara', 'Leena', 'Sara', 'Priya', 'Hana', 'Ibrahim', 'Ahmed', 'Mohamed', 'Hassan', 'Ali', 'Yoosuf', 'Emma', 'Mina', 'Ji-woo', 'Nadia', 'Rasha', 'Sofia'];
const SKINS: SkinType[] = ['oily', 'combination', 'dry', 'normal', 'sensitive'];
const MONTHS = ['April 2026', 'May 2026', 'June 2026', 'July 2026', 'August 2026', 'September 2026'];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

export const reviews: Review[] = products.flatMap((p) => {
  const n = Number(p.code.slice(4));
  // New arrivals have no reviews yet: that is what a real shop looks like.
  if (p.flags.includes('new')) return [];
  const r = rng(n * 7919);
  const pool = POOL[p.format] ?? POOL.default!;
  const count = 3 + Math.floor(r() * 4); // 3 to 6
  const used = new Set<number>();
  const out: Review[] = [];
  for (let i = 0; i < count; i++) {
    let t = Math.floor(r() * pool.length);
    let guard = 0;
    while (used.has(t) && guard++ < 10) t = (t + 1) % pool.length;
    if (used.has(t)) t = Math.floor(r() * (POOL.default!.length));
    used.add(t);
    const roll = r();
    const rating = (roll > 0.82 ? 4 : roll > 0.95 ? 3 : 5) as Review['rating'];
    const skin = p.skinTypes.length ? p.skinTypes[Math.floor(r() * p.skinTypes.length)] : SKINS[Math.floor(r() * SKINS.length)];
    out.push({
      product: p.slug,
      name: NAMES[Math.floor(r() * NAMES.length)],
      rating: (i === count - 1 && roll > 0.7 ? 4 : rating) as Review['rating'],
      skinType: skin,
      month: MONTHS[Math.floor(r() * MONTHS.length)],
      text: pool[t] ?? POOL.default![0],
    });
  }
  return out;
});
