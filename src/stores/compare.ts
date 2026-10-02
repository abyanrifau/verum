import './engine';
import { persistentAtom } from '@nanostores/persistent';
import { announce } from './cart';

export const COMPARE_MAX = 3;

export const $compare = persistentAtom<string[]>('verum:compare', [], {
  encode: JSON.stringify,
  decode: (raw) => {
    try {
      const v = JSON.parse(raw);
      return Array.isArray(v) ? v.slice(0, COMPARE_MAX) : [];
    } catch {
      return [];
    }
  },
});

/** Returns the new state for this id: true = in compare. */
export function toggleCompare(id: string, name = 'Product'): boolean {
  const list = $compare.get();
  if (list.includes(id)) {
    $compare.set(list.filter((x) => x !== id));
    announce(`${name} removed from compare. ${list.length - 1} of ${COMPARE_MAX}.`);
    return false;
  }
  if (list.length >= COMPARE_MAX) {
    announce(`Compare holds ${COMPARE_MAX} products. Remove one to add ${name}.`);
    return false;
  }
  $compare.set([...list, id]);
  announce(`${name} added to compare. ${list.length + 1} of ${COMPARE_MAX}.`);
  return true;
}

export function setCompare(ids: string[]) {
  $compare.set(ids.slice(0, COMPARE_MAX));
}
