import type { Category, Concern, Flag, Format, SkinType, Step, Strength, Time } from '../data/types';

/** Compact product record shipped to islands via /catalog.json. */
export interface LiteProduct {
  id: string; // VRM code
  slug: string;
  name: string;
  short: string;
  brand: string;
  brandSlug: string;
  size: string;
  sizeValue: number;
  sizeUnit: 'ml' | 'g' | 'patches';
  price: number;
  stock: number;
  step: Step;
  time: Time;
  category: Category;
  format: Format;
  skin: SkinType[];
  concerns: Concern[];
  ings: string[];
  key: { name: string; c: string | null; ing?: string }[];
  ff: boolean;
  strength: Strength;
  flags: Flag[];
  rating: number | null;
  reviews: number;
  texture: string;
  howToUse: string;
  frequency?: string;
  sales: number;
  url: string;
  /** 96px and 192px WebP thumbnails. */
  t1: string;
  t2: string;
  /** 400px WebP for larger panels. */
  img: string;
  alt: string;
}

let catalogPromise: Promise<LiteProduct[]> | null = null;

/** Loaded once per session, only when an island needs it. */
export function loadCatalog(): Promise<LiteProduct[]> {
  if (!catalogPromise) {
    catalogPromise = fetch('/catalog.json')
      .then((r) => {
        if (!r.ok) throw new Error(`catalog ${r.status}`);
        return r.json() as Promise<LiteProduct[]>;
      })
      .catch((e) => {
        catalogPromise = null;
        throw e;
      });
  }
  return catalogPromise;
}

export const byId = (list: LiteProduct[]) => new Map(list.map((p) => [p.id, p]));
