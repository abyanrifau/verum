export type Step = 'cleanse' | 'exfoliate' | 'treat' | 'hydrate' | 'protect';
export type Category = 'cleanse' | 'exfoliate' | 'treat' | 'hydrate' | 'protect' | 'masks';
export type SkinType = 'oily' | 'dry' | 'combination' | 'normal' | 'sensitive';
export type Concern =
  | 'breakouts'
  | 'dark-spots'
  | 'dryness'
  | 'barrier'
  | 'oil-control'
  | 'pores'
  | 'sensitivity'
  | 'ageing'
  | 'sun-protection'
  | 'dullness';
export type Time = 'AM' | 'PM' | 'AM+PM';
export type Strength = 'gentle' | 'moderate' | 'strong';
export type Flag = 'bestseller' | 'new' | 'restocked';
export type Format =
  | 'oil-cleanser'
  | 'balm-cleanser'
  | 'gel-cleanser'
  | 'foam-cleanser'
  | 'cream-cleanser'
  | 'micellar-water'
  | 'exfoliant'
  | 'toner'
  | 'essence'
  | 'serum'
  | 'ampoule'
  | 'moisturiser'
  | 'sleeping-mask'
  | 'wash-off-mask'
  | 'patch'
  | 'lip-mask'
  | 'mist'
  | 'sunscreen';

export interface KeyIngredient {
  /** Slug in ingredients.ts when this maps to an explorer ingredient. */
  ingredient?: string;
  /** Name as we display it. */
  name: string;
  /** INCI name as the brand lists it. */
  inci: string;
  /** Only where the brand publishes it. null renders as "Not published". */
  concentration: string | null;
  /** Short role, e.g. "Brightening". */
  role: string;
}

export interface Product {
  code: string;
  slug: string;
  brand: string;
  name: string;
  /** Short display name used in tight spaces. */
  short: string;
  size: string;
  sizeValue: number;
  sizeUnit: 'ml' | 'g' | 'patches';
  category: Category;
  subcategory: string;
  format: Format;
  step: Step;
  time: Time;
  skinTypes: SkinType[];
  concerns: Concern[];
  texture: string;
  keyIngredients: KeyIngredient[];
  fragranceFree: boolean;
  fragranceNote?: string;
  strength: Strength;
  price: number;
  stock: number;
  flags: Flag[];
  /** ISO date the product was added to the shop (drives "Newest"). */
  addedOn: string;
  /** Lower is more featured. */
  featured: number;
  /** Bestseller rank from sales data (lower sells more). */
  salesRank: number;
  images: string[];
  imageAlt: string;
  note: string;
  howToUse: string;
  frequency?: string;
  pairsWith: string[];
  source: string;
}

export interface Brand {
  slug: string;
  name: string;
  country: string;
  origin: 'Korean' | 'Western';
  founded: number | null;
  website: string;
  blurb: string;
}

export type Goal = 'calm' | 'hydrate' | 'brighten' | 'exfoliate' | 'clear' | 'barrier' | 'protect';
export type PairVerdict = 'fine' | 'split' | 'avoid';

export interface Ingredient {
  slug: string;
  name: string;
  /** Lower-case INCI names and synonyms used to match product key ingredients. */
  aka: string[];
  kind: 'Active' | 'Supporting';
  goals: Goal[];
  /** First sentence: a direct answer to "What does X do?" */
  answer: string;
  whatItDoes: string;
  suits: string;
  careful: string;
  time: 'AM' | 'PM' | 'AM or PM';
  timeNote: string;
  /** Pair rules with other ingredient slugs. Anything not listed is fine together. */
  pairs: { with: string; verdict: Exclude<PairVerdict, 'fine'>; note: string }[];
  /** Used in quiz reasoning, e.g. "contains niacinamide for pores". */
  reason: string;
  concerns: Concern[];
}

export interface Review {
  product: string;
  name: string;
  rating: 1 | 2 | 3 | 4 | 5;
  skinType: SkinType;
  month: string;
  text: string;
}

export interface FaqItem {
  id: string;
  q: string;
  a: string;
  short?: boolean;
}

export interface DeliveryZone {
  id: 'male' | 'hulhumale' | 'islands' | 'pickup';
  label: string;
  short: string;
  fee: number | null;
  feeLabel: string;
  timing: string;
  needs: 'address' | 'island' | 'none';
  areas?: string[];
}

export interface Photo {
  key: string;
  file: string;
  alt: string;
  photographer: string;
  photographerUrl: string;
  photoUrl: string;
  site: 'Unsplash' | 'Pexels';
  license: string;
}
