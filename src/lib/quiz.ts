import type { LiteProduct } from './lite';
import type { Format, SkinType, Step } from '../data/types';
import { priorities, skinLabel, concernLabel, type Priority, type Tolerance } from '../data/taxonomy';
import { ingredients } from '../data/ingredients';
import type { Picks, QuizAnswers, SlotKey } from '../stores/routine';

export interface Slot {
  key: SlotKey;
  step: Step;
  time: 'AM' | 'PM';
  title: string;
  note: string;
}

export interface Ranked {
  product: LiteProduct;
  score: number;
  reasons: string[];
}

const ingBySlug = new Map(ingredients.map((i) => [i.slug, i]));

const FORMATS: Record<string, Format[]> = {
  'am-cleanse': ['gel-cleanser', 'foam-cleanser', 'cream-cleanser'],
  'pm-cleanse': ['oil-cleanser', 'balm-cleanser', 'micellar-water'],
  treat: ['serum', 'essence', 'ampoule', 'moisturiser'],
  'am-hydrate': ['moisturiser'],
  'pm-hydrate': ['moisturiser', 'sleeping-mask'],
  protect: ['sunscreen'],
  exfoliate: ['exfoliant'],
};

export function slotsFor(tolerance: Tolerance | null): { am: Slot[]; pm: Slot[] } {
  const am: Slot[] = [
    { key: 'am-cleanse', step: 'cleanse', time: 'AM', title: 'Cleanse', note: 'A gentle wash to start the day.' },
    { key: 'am-treat', step: 'treat', time: 'AM', title: 'Treat', note: 'Your main active for the morning.' },
    { key: 'am-hydrate', step: 'hydrate', time: 'AM', title: 'Hydrate', note: 'Moisturiser, light enough for humidity.' },
    { key: 'am-protect', step: 'protect', time: 'AM', title: 'Protect', note: 'SPF, last step, reapply outdoors.' },
  ];
  const pm: Slot[] = [
    { key: 'pm-cleanse', step: 'cleanse', time: 'PM', title: 'Cleanse', note: 'First cleanse: lifts sunscreen and sweat.' },
  ];
  if (tolerance !== 'reacts') {
    pm.push({ key: 'pm-exfoliate', step: 'exfoliate', time: 'PM', title: 'Exfoliate', note: '2 to 3 nights a week.' });
  }
  pm.push(
    { key: 'pm-treat', step: 'treat', time: 'PM', title: 'Treat', note: 'Your night-time active.' },
    { key: 'pm-hydrate', step: 'hydrate', time: 'PM', title: 'Hydrate', note: 'Seal everything in.' },
  );
  return { am, pm };
}

function formatsFor(slot: Pick<Slot, 'key' | 'step'>): Format[] {
  return FORMATS[slot.key] ?? FORMATS[slot.step] ?? [];
}

export function fitsSlot(p: LiteProduct, slot: Pick<Slot, 'key' | 'step' | 'time'>): boolean {
  if (p.step !== slot.step) return false;
  if (p.time !== 'AM+PM' && p.time !== slot.time) return false;
  return formatsFor(slot).includes(p.format);
}

/**
 * Transparent scoring. Every point has a plain-language reason, and the top reasons are shown
 * on the result: "Ranked high because: suits oily skin, contains niacinamide for pores, fragrance free."
 */
export function scoreProduct(p: LiteProduct, a: QuizAnswers, slot: Pick<Slot, 'step' | 'time'>): Ranked | null {
  if (p.stock <= 0) return null;
  if (a.tolerance === 'reacts' && p.strength === 'strong') return null;
  if (a.skin === 'sensitive' && a.tolerance !== 'most' && p.strength === 'strong') return null;

  const parts: { w: number; why?: string }[] = [];
  const pr = priorities.find((x) => x.id === a.priority)!;

  // 1. Skin type
  const allTypes = p.skin.length >= 5;
  if (p.skin.includes(a.skin) && !allTypes) parts.push({ w: 3, why: `suits ${skinLabel(a.skin).toLowerCase()} skin` });
  else if (allTypes) parts.push({ w: 2, why: 'suits all skin types' });
  else parts.push({ w: -3 });

  // 2. Priority: primary concern counts double, and the ingredient doing the work is named.
  pr.concerns.forEach((c, i) => {
    if (!p.concerns.includes(c)) return;
    const w = i === 0 ? 4 : 2;
    const ing = p.ings.map((s) => ingBySlug.get(s)).find((ing) => ing?.concerns.includes(c));
    parts.push({ w, why: ing ? ing.reason : `targets ${concernLabel(c).toLowerCase()}` });
  });
  if (slot.step === 'protect' && a.priority === 'basics') parts.push({ w: 1 });

  // 3. Tolerance
  if (a.tolerance === 'reacts') {
    if (p.ff) parts.push({ w: 2.5, why: 'fragrance free' });
    else parts.push({ w: -4 });
    if (p.strength === 'gentle') parts.push({ w: 2, why: 'gentle formula' });
    if (p.strength === 'moderate') parts.push({ w: -1.5 });
  } else if (a.tolerance === 'sometimes') {
    if (p.strength === 'strong') parts.push({ w: -3 });
    if (p.ff) parts.push({ w: 1.2, why: 'fragrance free' });
    else parts.push({ w: -1 });
    if (p.strength === 'gentle') parts.push({ w: 0.8 });
  } else {
    if (p.strength === 'strong' && p.concerns.some((c) => pr.concerns.includes(c)))
      parts.push({ w: 1.2, why: 'a stronger active, which your skin can take' });
    if (p.ff) parts.push({ w: 0.6, why: 'fragrance free' });
  }
  if (a.skin === 'sensitive') {
    if (p.concerns.includes('sensitivity')) parts.push({ w: 1.5, why: 'made for sensitive skin' });
    if (!p.ff) parts.push({ w: -2 });
  }

  // 4. Time of day: morning antioxidants in the morning, night actives at night.
  const hasAmIng = p.ings.some((s) => ingBySlug.get(s)?.time === 'AM' && s !== 'uv-filters');
  if (hasAmIng) parts.push({ w: slot.time === 'AM' ? 1 : -2, why: slot.time === 'AM' ? 'best used in the morning' : undefined });
  if (p.time === slot.time) parts.push({ w: 0.6 });

  // 5. Tie-breaker: what sells. No reason text: popularity is not a formula argument.
  parts.push({ w: Math.max(0, (60 - p.sales) / 60) });

  const score = parts.reduce((s, x) => s + x.w, 0);
  const reasons = parts
    .filter((x) => x.why && x.w > 0)
    .sort((x, y) => y.w - x.w)
    .map((x) => x.why!)
    .filter((r, i, arr) => arr.indexOf(r) === i)
    .slice(0, 3);
  return { product: p, score: Math.round(score * 10) / 10, reasons };
}

export function rankSlot(list: LiteProduct[], a: QuizAnswers, slot: Slot, exclude: string[] = []): Ranked[] {
  return list
    .filter((p) => fitsSlot(p, slot) && !exclude.includes(p.id))
    .map((p) => scoreProduct(p, a, slot))
    .filter((r): r is Ranked => !!r)
    .filter((r) => {
      // Exfoliation must respect tolerance.
      if (slot.step !== 'exfoliate') return true;
      if (a.tolerance === 'sometimes' || a.skin === 'sensitive') return r.product.strength !== 'strong';
      return true;
    })
    .sort((x, y) => y.score - x.score || x.product.price - y.product.price);
}

export interface RoutinePlan {
  slots: { am: Slot[]; pm: Slot[] };
  ranked: Partial<Record<SlotKey, Ranked[]>>;
  picks: Picks;
}

/** Builds the full AM + PM routine: one top pick per step plus two alternatives. */
export function buildRoutine(list: LiteProduct[], a: QuizAnswers, saved?: Picks): RoutinePlan {
  const slots = slotsFor(a.tolerance);
  const ranked: RoutinePlan['ranked'] = {};
  const picks: Picks = {};
  const all = [...slots.am, ...slots.pm];
  for (const slot of all) {
    let exclude: string[] = [];
    // A different serum at night gives the routine a second active.
    if (slot.key === 'pm-treat' && picks['am-treat']) exclude = [picks['am-treat']!];
    const r = rankSlot(list, a, slot, exclude);
    ranked[slot.key] = r.slice(0, 3);
    const savedId = saved?.[slot.key];
    const savedOk = savedId && list.some((p) => p.id === savedId && fitsSlot(p, slot));
    picks[slot.key] = savedOk ? savedId! : r[0]?.product.id ?? null;
    // Keep the saved pick visible among the options.
    if (savedOk && !ranked[slot.key]!.some((x) => x.product.id === savedId)) {
      const extra = r.find((x) => x.product.id === savedId);
      if (extra) ranked[slot.key] = [extra, ...ranked[slot.key]!.slice(0, 2)];
    }
  }
  return { slots, ranked, picks };
}

export const answersSummary = (a: QuizAnswers) => {
  const pr = priorities.find((x) => x.id === a.priority)?.label ?? a.priority;
  return `${skinLabel(a.skin as SkinType)} skin · ${pr} · ${
    a.tolerance === 'most' ? 'handles most things' : a.tolerance === 'sometimes' ? 'gets irritated sometimes' : 'reacts easily'
  }`;
};

export type { Priority, Tolerance };
