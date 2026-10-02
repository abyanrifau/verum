import { safeStorage, readJSON, writeJSON, removeKey } from './engine';
import { persistentAtom } from '@nanostores/persistent';
import { atom, computed } from 'nanostores';

export interface CartLine {
  id: string;
  qty: number;
}

const decode = <T,>(fallback: T) => (raw: string): T => {
  try {
    const v = JSON.parse(raw);
    return v ?? fallback;
  } catch {
    return fallback;
  }
};

void safeStorage; // engine must be installed before stores are created

export const $cart = persistentAtom<CartLine[]>('verum:cart', [], {
  encode: JSON.stringify,
  decode: decode<CartLine[]>([]),
});

export const $cartCount = computed($cart, (lines) => lines.reduce((s, l) => s + l.qty, 0));
export const $cartOpen = atom(false);
/** Text for the shared ARIA live region. */
export const $announce = atom('');
export const $bump = atom(0);

export const MAX_QTY = 9;

export function announce(msg: string) {
  // Clear first so repeated identical messages are still read out.
  $announce.set('');
  setTimeout(() => $announce.set(msg), 30);
}

export function addToCart(ids: string | string[], opts: { open?: boolean; label?: string } = {}) {
  const list = Array.isArray(ids) ? ids : [ids];
  const next = [...$cart.get()];
  for (const id of list) {
    const found = next.find((l) => l.id === id);
    if (found) {
      // Adding a routine never stacks duplicates: one of each step is the point.
      if (!Array.isArray(ids)) found.qty = Math.min(MAX_QTY, found.qty + 1);
    } else {
      next.push({ id, qty: 1 });
    }
  }
  $cart.set(next);
  startFlow('cart');
  $bump.set($bump.get() + 1);
  if (opts.open !== false) $cartOpen.set(true);
  if (opts.label) announce(opts.label);
}

export function setQty(id: string, qty: number) {
  const q = Math.max(0, Math.min(MAX_QTY, Math.round(qty)));
  const next = $cart
    .get()
    .map((l) => (l.id === id ? { ...l, qty: q } : l))
    .filter((l) => l.qty > 0);
  $cart.set(next);
}

export function removeFromCart(id: string) {
  $cart.set($cart.get().filter((l) => l.id !== id));
}

export function clearCart() {
  $cart.set([]);
}

export function openCart() {
  $cartOpen.set(true);
}

/* ---------- speed showcase: first quiz answer or first add, to order placed ---------- */
export interface Flow {
  t: number;
  source: 'quiz' | 'cart';
}
const FLOW_KEY = 'verum:flow';

export function startFlow(source: Flow['source'], force = false) {
  const current = readJSON<Flow | null>(FLOW_KEY, null);
  // A stale start (over 2 hours) no longer describes this visit.
  const stale = current && Date.now() - current.t > 2 * 60 * 60 * 1000;
  if (force || !current || stale) writeJSON(FLOW_KEY, { t: Date.now(), source });
}
export const readFlow = () => readJSON<Flow | null>(FLOW_KEY, null);
export const clearFlow = () => removeKey(FLOW_KEY);
