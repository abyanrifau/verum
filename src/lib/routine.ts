import type { LiteProduct } from './lite';
import { ingredients } from '../data/ingredients';
import type { PairVerdict } from '../data/types';

const bySlug = new Map(ingredients.map((i) => [i.slug, i]));

/** Symmetric lookup: what happens when two ingredients meet. */
export function pairVerdict(a: string, b: string): { verdict: PairVerdict; note: string } {
  if (a === b) return { verdict: 'fine', note: 'Same ingredient. Using it in two products adds up, so check the total strength.' };
  const ia = bySlug.get(a);
  const ib = bySlug.get(b);
  const rule = ia?.pairs.find((p) => p.with === b) ?? ib?.pairs.find((p) => p.with === a);
  if (rule) return { verdict: rule.verdict, note: rule.note };
  const special: Record<string, string> = {
    'niacinamide|vitamin-c':
      'Fine together. The old warning comes from studies on unstable, heated formulas, not modern serums.',
  };
  const k = [a, b].sort().join('|');
  return { verdict: 'fine', note: special[k] ?? 'Fine together in the same routine.' };
}

export interface Warning {
  id: string;
  level: 'avoid' | 'split' | 'info';
  text: string;
}

const NIGHT = new Set(['retinol', 'aha', 'salicylic-acid']);

export function routineWarnings(am: LiteProduct[], pm: LiteProduct[]): Warning[] {
  const out: Warning[] = [];
  const seen = new Set<string>();
  const check = (list: LiteProduct[], label: 'AM' | 'PM') => {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (list[i].id === list[j].id) continue;
        for (const x of list[i].ings) {
          for (const y of list[j].ings) {
            const v = pairVerdict(x, y);
            if (v.verdict === 'fine') continue;
            const id = `${label}:${[x, y].sort().join('|')}`;
            if (seen.has(id)) continue;
            seen.add(id);
            out.push({ id, level: v.verdict, text: `${label}: ${list[i].short} + ${list[j].short}. ${v.note}` });
          }
        }
      }
    }
  };
  check(am, 'AM');
  check(pm, 'PM');
  for (const p of am) {
    if (p.time === 'PM' || p.ings.some((s) => s === 'retinol')) {
      out.push({ id: `night:${p.id}`, level: 'split', text: `${p.short} is a night-time product. Move it to your PM routine.` });
    }
  }
  const usesNightActive = [...am, ...pm].some((p) => p.ings.some((s) => NIGHT.has(s)));
  const hasSpf = am.some((p) => p.step === 'protect');
  if (usesNightActive && !hasSpf) {
    out.push({ id: 'spf', level: 'info', text: 'You are using an acid or a retinoid. Add a morning sunscreen: they make skin more sensitive to sun.' });
  }
  return out;
}
