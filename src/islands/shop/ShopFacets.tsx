import { useStore } from '@nanostores/preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { $filters, $sheet, $shown, activeCount, empty, toggle, type FacetKey } from './state';
import '../shop.css';

export interface FacetOption {
  id: string;
  label: string;
  count: number;
}
export interface Facet {
  key: FacetKey;
  label: string;
  options: FacetOption[];
  collapse?: number;
}

function FacetGroup({ f, idp }: { f: Facet; idp: string }) {
  const s = useStore($filters);
  const [all, setAll] = useState(false);
  const sel = s[f.key];
  const limit = f.collapse && !all ? f.collapse : f.options.length;
  // Selected options stay visible even when the list is collapsed.
  const visible = f.options.filter((o, i) => i < limit || sel.includes(o.id));
  return (
    <fieldset class="sf-group">
      <legend class="sf-legend">{f.label}</legend>
      <ul role="list" class="sf-list">
        {visible.map((o) => {
          const id = `${idp}-${f.key}-${o.id}`;
          return (
            <li>
              <input type="checkbox" id={id} class="sf-check" checked={sel.includes(o.id)} onChange={() => toggle(f.key, o.id)} />
              <label for={id} class="sf-label">
                <span>{o.label}</span>
                <span class="mono sf-count">{o.count}</span>
              </label>
            </li>
          );
        })}
      </ul>
      {f.collapse && f.options.length > f.collapse && (
        <button type="button" class="sf-more" aria-expanded={all} onClick={() => setAll(!all)}>
          {all ? 'Show fewer' : `Show all ${f.options.length}`}
          <span class="sr-only"> {f.label.toLowerCase()}</span>
        </button>
      )}
    </fieldset>
  );
}

export default function ShopFacets({ facets }: { facets: Facet[] }) {
  const open = useStore($sheet);
  const s = useStore($filters);
  const shown = useStore($shown);
  const ref = useRef<HTMLDialogElement>(null);
  const [desktop, setDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const sync = () => setDesktop(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open, desktop]);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    const close = () => $sheet.set(false);
    d.addEventListener('close', close);
    return () => d.removeEventListener('close', close);
  }, [desktop]);

  const groups = (idp: string) => facets.map((f) => <FacetGroup f={f} idp={idp} />);

  if (desktop) {
    return (
      <div class="sf" aria-label="Filter products" role="group">
        <div class="sf-head">
          <p class="sf-title">Filter</p>
          {activeCount(s) > 0 && (
            <button type="button" class="st-reset" onClick={() => $filters.set({ ...empty(), sort: s.sort })}>
              Reset
            </button>
          )}
        </div>
        {groups('d')}
      </div>
    );
  }
  return (
    <dialog ref={ref} class="sheet" aria-labelledby="sheet-title" onClick={(e) => e.target === ref.current && $sheet.set(false)}>
      <div class="sheet-inner">
        <header class="sheet-head">
          <h2 id="sheet-title" class="sf-title">
            Filter
          </h2>
          <button type="button" class="st-reset" onClick={() => $filters.set({ ...empty(), sort: s.sort })}>
            Reset
          </button>
        </header>
        <div class="sheet-body">{groups('m')}</div>
        <footer class="sheet-foot">
          <button type="button" class="btn btn--lg btn--block" onClick={() => $sheet.set(false)}>
            Show {shown ?? ''} {shown === 1 ? 'product' : 'products'}
          </button>
        </footer>
      </div>
    </dialog>
  );
}
