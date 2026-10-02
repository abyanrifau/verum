import { site } from '../data/site';

export interface PricedLine {
  id: string;
  qty: number;
  price: number;
}

export interface BundleResult {
  subtotal: number;
  /** Routine steps = different products in the cart. */
  steps: number;
  percent: number;
  discount: number;
  total: number;
  next: { needed: number; percent: number; minSteps: number } | null;
  tiers: readonly { minSteps: number; percent: number }[];
}

export const tiers = [...site.discountTiers].sort((a, b) => a.minSteps - b.minSteps);
export const maxPercent = tiers[tiers.length - 1]?.percent ?? 0;

/** The one source of truth for bundle maths: cart, routine builder and quiz all call this. */
export function bundle(lines: PricedLine[]): BundleResult {
  const live = lines.filter((l) => l.qty > 0);
  const subtotal = live.reduce((s, l) => s + l.price * l.qty, 0);
  const steps = new Set(live.map((l) => l.id)).size;
  let percent = 0;
  for (const t of tiers) if (steps >= t.minSteps) percent = t.percent;
  const discount = Math.round((subtotal * percent) / 100);
  const nextTier = tiers.find((t) => t.minSteps > steps) ?? null;
  return {
    subtotal,
    steps,
    percent,
    discount,
    total: subtotal - discount,
    next: nextTier ? { needed: nextTier.minSteps - steps, percent: nextTier.percent, minSteps: nextTier.minSteps } : null,
    tiers,
  };
}

/** "Add 1 more step to save 15%" / "15% bundle saving applied" */
export function tierMessage(b: BundleResult): string {
  if (b.steps === 0) return `Add ${tiers[0].minSteps} different products to save ${tiers[0].percent}%`;
  if (!b.next) return `${b.percent}% bundle saving applied, the maximum`;
  const s = b.next.needed === 1 ? 'step' : 'steps';
  return b.percent
    ? `${b.percent}% off applied. Add ${b.next.needed} more ${s} to save ${b.next.percent}%`
    : `Add ${b.next.needed} more ${s} to save ${b.next.percent}%`;
}
