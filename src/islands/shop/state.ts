import { atom } from 'nanostores';

export const FACETS = ['category', 'step', 'skin', 'concern', 'brand', 'ing', 'price'] as const;
export type FacetKey = (typeof FACETS)[number];
export type Sort = 'featured' | 'bestsellers' | 'newest' | 'price-asc' | 'price-desc';
export type FilterState = Record<FacetKey, string[]> & { sort: Sort };

export const SORTS: { id: Sort; label: string }[] = [
  { id: 'featured', label: 'Featured' },
  { id: 'bestsellers', label: 'Bestsellers' },
  { id: 'newest', label: 'Newest' },
  { id: 'price-asc', label: 'Price, low to high' },
  { id: 'price-desc', label: 'Price, high to low' },
];

export const empty = (): FilterState => ({
  category: [],
  step: [],
  skin: [],
  concern: [],
  brand: [],
  ing: [],
  price: [],
  sort: 'featured',
});

export function fromUrl(search: string): FilterState {
  const q = new URLSearchParams(search);
  const s = empty();
  for (const k of FACETS) s[k] = (q.get(k) ?? '').split(',').map((x) => x.trim()).filter(Boolean);
  const sort = q.get('sort') as Sort | null;
  if (sort && SORTS.some((x) => x.id === sort)) s.sort = sort;
  return s;
}

export function toUrl(s: FilterState) {
  const q = new URLSearchParams();
  for (const k of FACETS) if (s[k].length) q.set(k, s[k].join(','));
  if (s.sort !== 'featured') q.set('sort', s.sort);
  const str = q.toString().replace(/%2C/g, ',');
  return `${location.pathname}${str ? `?${str}` : ''}`;
}

export const $filters = atom<FilterState>(empty());
export const $sheet = atom(false);
export const $shown = atom<number | null>(null);

export const activeCount = (s: FilterState) => FACETS.reduce((n, k) => n + s[k].length, 0);

function inBand(price: number, band: string) {
  const [lo, hi] = band.split('-');
  const min = Number(lo || 0);
  const max = hi ? Number(hi) : Infinity;
  return price >= min && price < max;
}

/** Filters and sorts the static product cards in place. */
export function applyToGrid(s: FilterState) {
  const grid = document.getElementById('shop-grid');
  if (!grid) return 0;
  const items = [...grid.children] as HTMLElement[];
  let shown = 0;
  for (const li of items) {
    const d = li.dataset;
    let ok = true;
    for (const k of FACETS) {
      const sel = s[k];
      if (!sel.length) continue;
      if (k === 'price') {
        ok = sel.some((b) => inBand(Number(d.price), b));
      } else {
        const have = (d[k] ?? '').split(' ');
        ok = sel.some((v) => have.includes(v));
      }
      if (!ok) break;
    }
    li.hidden = !ok;
    if (ok) shown++;
  }
  const num = (el: HTMLElement, k: string) => Number(el.dataset[k] ?? 0);
  const cmp: Record<Sort, (a: HTMLElement, b: HTMLElement) => number> = {
    featured: (a, b) => num(a, 'featured') - num(b, 'featured'),
    bestsellers: (a, b) => num(a, 'sales') - num(b, 'sales'),
    newest: (a, b) => (b.dataset.added ?? '').localeCompare(a.dataset.added ?? '') || num(a, 'featured') - num(b, 'featured'),
    'price-asc': (a, b) => num(a, 'price') - num(b, 'price'),
    'price-desc': (a, b) => num(b, 'price') - num(a, 'price'),
  };
  const sorted = [...items].sort(cmp[s.sort]);
  if (sorted.some((el, i) => el !== items[i])) grid.append(...sorted);
  const count = document.getElementById('shop-count');
  if (count) count.textContent = `${shown} ${shown === 1 ? 'product' : 'products'}`;
  const emptyEl = document.getElementById('shop-empty');
  if (emptyEl) emptyEl.hidden = shown > 0;
  $shown.set(shown);
  return shown;
}

/** One controller for both islands: URL -> state -> grid. Returns a stop function. */
export function startShop() {
  $filters.set(fromUrl(location.search));
  return $filters.subscribe((s) => {
    applyToGrid(s);
    const url = toUrl(s);
    if (url !== location.pathname + location.search) history.replaceState(history.state, '', url);
  });
}

export function toggle(k: FacetKey, v: string) {
  const s = $filters.get();
  const has = s[k].includes(v);
  $filters.set({ ...s, [k]: has ? s[k].filter((x) => x !== v) : [...s[k], v] });
}
