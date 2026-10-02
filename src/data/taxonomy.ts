import type { Category, Concern, Goal, SkinType, Step } from './types';

export const steps: { id: Step; label: string; n: string; verb: string }[] = [
  { id: 'cleanse', label: 'Cleanse', n: '01', verb: 'a cleanser' },
  { id: 'exfoliate', label: 'Exfoliate', n: '02', verb: 'an exfoliant' },
  { id: 'treat', label: 'Treat', n: '03', verb: 'a serum or treatment' },
  { id: 'hydrate', label: 'Hydrate', n: '04', verb: 'a toner or moisturiser' },
  { id: 'protect', label: 'Protect', n: '05', verb: 'a sunscreen' },
];
export const stepLabel = (s: Step) => steps.find((x) => x.id === s)?.label ?? s;

export const categories: { id: Category; label: string; blurb: string }[] = [
  { id: 'cleanse', label: 'Cleanse', blurb: 'Oil cleansers, balms, gels and foams.' },
  { id: 'exfoliate', label: 'Exfoliate', blurb: 'AHA, BHA and PHA, at published strengths.' },
  { id: 'treat', label: 'Treat', blurb: 'Serums, essences and targeted treatments.' },
  { id: 'hydrate', label: 'Hydrate', blurb: 'Toners and moisturisers.' },
  { id: 'protect', label: 'Protect', blurb: 'Sunscreens for heat, humidity and reapplying.' },
  { id: 'masks', label: 'Masks and extras', blurb: 'Sleeping masks, wash-off masks, patches and mists.' },
];
export const categoryLabel = (c: Category) => categories.find((x) => x.id === c)?.label ?? c;

export const skinTypes: { id: SkinType; label: string; quiz: string; hint: string }[] = [
  { id: 'oily', label: 'Oily', quiz: 'Oily', hint: 'Shiny by midday, visible pores' },
  { id: 'dry', label: 'Dry', quiz: 'Dry', hint: 'Feels tight, can flake' },
  { id: 'combination', label: 'Combination', quiz: 'Combination', hint: 'Oily T-zone, drier cheeks' },
  { id: 'normal', label: 'Normal', quiz: 'Normal', hint: 'Rarely too oily or too dry' },
  { id: 'sensitive', label: 'Sensitive', quiz: 'Sensitive', hint: 'Stings, flushes or reacts' },
];
export const skinLabel = (s: SkinType) => skinTypes.find((x) => x.id === s)?.label ?? s;

export const concerns: { id: Concern; label: string; tile?: string; blurb: string }[] = [
  { id: 'breakouts', label: 'Breakouts', tile: 'Acne and breakouts', blurb: 'BHA, azelaic acid, niacinamide, patches.' },
  { id: 'dark-spots', label: 'Dark spots', tile: 'Dark spots', blurb: 'Vitamin C, arbutin, tranexamic acid.' },
  { id: 'dryness', label: 'Dryness', tile: 'Dryness', blurb: 'Hyaluronic acid, ceramides, squalane.' },
  { id: 'oil-control', label: 'Oil control', tile: 'Oil control', blurb: 'Light gels, zinc, niacinamide.' },
  { id: 'sensitivity', label: 'Sensitive skin', tile: 'Sensitive skin', blurb: 'Centella, panthenol, fragrance free.' },
  { id: 'sun-protection', label: 'Sun protection', tile: 'Sun protection', blurb: 'SPF 50, high UVA, made for heat.' },
  { id: 'pores', label: 'Pores', blurb: 'Clearer-looking pores.' },
  { id: 'barrier', label: 'Barrier support', blurb: 'Ceramides, panthenol, snail mucin.' },
  { id: 'ageing', label: 'Signs of ageing', blurb: 'Retinoids, vitamin C, peptides.' },
  { id: 'dullness', label: 'Dullness', blurb: 'Gentle acids, rice, vitamin C.' },
];
export const concernLabel = (c: Concern) => concerns.find((x) => x.id === c)?.label ?? c;

export const goals: { id: Goal; label: string }[] = [
  { id: 'calm', label: 'Calm' },
  { id: 'hydrate', label: 'Hydrate' },
  { id: 'brighten', label: 'Brighten' },
  { id: 'exfoliate', label: 'Exfoliate' },
  { id: 'clear', label: 'Clear breakouts' },
  { id: 'barrier', label: 'Repair the barrier' },
  { id: 'protect', label: 'Protect' },
];

export type Priority = 'breakouts' | 'dark-spots' | 'dryness' | 'oil-pores' | 'ageing' | 'basics';
export type Tolerance = 'most' | 'sometimes' | 'reacts';

export const priorities: { id: Priority; label: string; hint: string; concerns: Concern[] }[] = [
  { id: 'breakouts', label: 'Breakouts', hint: 'Spots, clogged pores', concerns: ['breakouts', 'pores', 'oil-control'] },
  { id: 'dark-spots', label: 'Dark spots and uneven tone', hint: 'Marks that linger', concerns: ['dark-spots', 'dullness'] },
  { id: 'dryness', label: 'Dryness and barrier', hint: 'Tight, flaky, easily upset', concerns: ['dryness', 'barrier'] },
  { id: 'oil-pores', label: 'Oil and pores', hint: 'Shine, visible pores', concerns: ['oil-control', 'pores'] },
  { id: 'ageing', label: 'Signs of ageing', hint: 'Fine lines, firmness', concerns: ['ageing', 'dullness'] },
  { id: 'basics', label: 'Sun protection and daily basics', hint: 'A simple routine that works', concerns: ['sun-protection', 'barrier'] },
];

export const tolerances: { id: Tolerance; label: string; hint: string }[] = [
  { id: 'most', label: 'Handles most things', hint: 'Acids and retinoids are fine' },
  { id: 'sometimes', label: 'Gets irritated sometimes', hint: 'Strong actives can sting' },
  { id: 'reacts', label: 'Reacts easily', hint: 'Fragrance and acids are a gamble' },
];
