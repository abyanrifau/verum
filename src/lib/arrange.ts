import type { LiteProduct } from './lite';
import type { Picks } from '../stores/routine';
import type { Step } from '../data/types';

const AM_ORDER: Step[] = ['cleanse', 'treat', 'hydrate', 'protect'];
const PM_ORDER: Step[] = ['cleanse', 'exfoliate', 'treat', 'hydrate'];
const FIRST_CLEANSE = new Set(['oil-cleanser', 'balm-cleanser', 'micellar-water']);

/**
 * Lays bought products out as an AM and PM routine. Quiz picks win where they exist;
 * anything else is placed by its step and time of day.
 */
export function arrangeRoutine(items: LiteProduct[], picks?: Picks | null) {
  const am: LiteProduct[] = [];
  const pm: LiteProduct[] = [];
  const ids = new Set(items.map((p) => p.id));
  const byId = new Map(items.map((p) => [p.id, p]));
  const placed = new Set<string>();

  if (picks) {
    for (const [key, id] of Object.entries(picks)) {
      if (!id || !ids.has(id)) continue;
      const p = byId.get(id)!;
      (key.startsWith('am') ? am : pm).push(p);
      placed.add(id);
    }
  }
  for (const p of items) {
    if (placed.has(p.id)) continue;
    const canAm = p.time !== 'PM' && p.step !== 'exfoliate' && !(p.step === 'cleanse' && FIRST_CLEANSE.has(p.format));
    const canPm = p.time !== 'AM' && p.step !== 'protect';
    if (canAm) am.push(p);
    if (canPm) pm.push(p);
    if (!canAm && !canPm) am.push(p);
  }
  const sort = (order: Step[]) => (a: LiteProduct, b: LiteProduct) => {
    const d = order.indexOf(a.step) - order.indexOf(b.step);
    if (d) return d;
    // Oil or balm before a water cleanser at night.
    return Number(FIRST_CLEANSE.has(b.format)) - Number(FIRST_CLEANSE.has(a.format));
  };
  const dedupe = (l: LiteProduct[]) => l.filter((p, i) => l.findIndex((x) => x.id === p.id) === i);
  return { am: dedupe(am).sort(sort(AM_ORDER)), pm: dedupe(pm).sort(sort(PM_ORDER)) };
}
