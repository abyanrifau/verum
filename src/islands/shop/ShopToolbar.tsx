import { useStore } from '@nanostores/preact';
import { useEffect } from 'preact/hooks';
import { $filters, $sheet, $shown, activeCount, empty, FACETS, SORTS, startShop, toggle, type Sort } from './state';
import type { FacetOption } from './ShopFacets';
import '../shop.css';

interface Props {
  labels: Record<string, FacetOption[]>;
  total: number;
}

export default function ShopToolbar({ labels, total }: Props) {
  const s = useStore($filters);
  const shown = useStore($shown);
  useEffect(() => startShop(), []);
  const n = activeCount(s);
  const label = (k: string, v: string) => labels[k]?.find((o) => o.id === v)?.label ?? v;

  return (
    <div class="st">
      <div class="st-row">
        <button type="button" class="btn btn--quiet st-filters" onClick={() => $sheet.set(true)} aria-haspopup="dialog">
          Filters{n ? ` (${n})` : ''}
        </button>
        <div class="st-sort">
          <label for="shop-sort" class="st-sort-label">
            Sort
          </label>
          <select
            id="shop-sort"
            class="select"
            value={s.sort}
            onChange={(e) => $filters.set({ ...s, sort: (e.currentTarget as HTMLSelectElement).value as Sort })}
          >
            {SORTS.map((o) => (
              <option value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>
      {n > 0 && (
        <div class="st-active" aria-label="Active filters" role="group">
          {FACETS.flatMap((k) =>
            s[k].map((v) => (
              <button type="button" class="chip is-active st-chip" onClick={() => toggle(k, v)}>
                {label(k, v)} <span aria-hidden="true">×</span>
                <span class="sr-only">, remove filter</span>
              </button>
            )),
          )}
          <button type="button" class="st-reset" onClick={() => $filters.set({ ...empty(), sort: s.sort })}>
            Reset all
          </button>
        </div>
      )}
      <p class="sr-only" role="status" aria-live="polite">
        {shown === null ? '' : `Showing ${shown} of ${total} products`}
      </p>
    </div>
  );
}
