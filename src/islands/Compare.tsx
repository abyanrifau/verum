import { useStore } from '@nanostores/preact';
import { useEffect, useMemo, useState } from 'preact/hooks';
import { loadCatalog, type LiteProduct } from '../lib/lite';
import { $compare, COMPARE_MAX, setCompare, toggleCompare } from '../stores/compare';
import { addToCart } from '../stores/cart';
import { mvr, pricePerUnit } from '../lib/money';
import { skinTypes, concerns, stepLabel } from '../data/taxonomy';
import { Icon } from './icons';
import './compare.css';

const skinL = (s: string) => skinTypes.find((x) => x.id === s)?.label ?? s;
const concernL = (c: string) => concerns.find((x) => x.id === c)?.label ?? c;
const timeL = (t: string) => (t === 'AM+PM' ? 'AM and PM' : `${t} only`);

interface Row {
  key: string;
  label: string;
  value: (p: LiteProduct) => string;
  render?: (p: LiteProduct) => preact.JSX.Element | string;
}

const ROWS: Row[] = [
  { key: 'price', label: 'Price', value: (p) => String(p.price), render: (p) => <span class="mono cmp-price">{mvr(p.price)}</span> },
  { key: 'ppu', label: 'Price per 10 ml or g', value: (p) => pricePerUnit(p.price, p.sizeValue, p.sizeUnit), render: (p) => <span class="mono">{pricePerUnit(p.price, p.sizeValue, p.sizeUnit)}</span> },
  { key: 'size', label: 'Size', value: (p) => p.size },
  { key: 'step', label: 'Routine step', value: (p) => stepLabel(p.step) },
  { key: 'time', label: 'AM or PM', value: (p) => timeL(p.time) },
  { key: 'skin', label: 'Skin types', value: (p) => (p.skin.length >= 5 ? 'All skin types' : p.skin.map(skinL).join(', ')) },
  { key: 'concerns', label: 'Concerns', value: (p) => p.concerns.map(concernL).join(', ') },
  { key: 'texture', label: 'Texture', value: (p) => p.texture },
  {
    key: 'key',
    label: 'Key ingredients',
    value: (p) => p.key.map((k) => `${k.name} ${k.c ?? 'np'}`).join('|'),
    render: (p) => (
      <ul role="list" class="cmp-keys">
        {p.key.map((k) => (
          <li>
            <span>{k.name}</span>
            <span class={`mono ${k.c ? '' : 'cmp-np'}`}>{k.c ?? 'Not published'}</span>
          </li>
        ))}
      </ul>
    ),
  },
  { key: 'ff', label: 'Fragrance free', value: (p) => (p.ff ? 'Yes' : 'No') },
  {
    key: 'rating',
    label: 'Average sample rating',
    value: (p) => (p.rating ? String(p.rating) : 'none'),
    render: (p) => (p.rating ? <span class="mono">{p.rating.toFixed(1)} / 5 · {p.reviews} samples</span> : <span class="muted">No samples</span>),
  },
];

export default function Compare() {
  const ids = useStore($compare);
  const [catalog, setCatalog] = useState<LiteProduct[] | null>(null);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    loadCatalog().then(setCatalog).catch(() => setCatalog([]));
    const q = new URLSearchParams(location.search).get('ids');
    if (q) setCompare(q.split(',').map((s) => s.trim().toUpperCase()).filter(Boolean));
    setSynced(true);
  }, []);
  useEffect(() => {
    if (!synced) return;
    const url = ids.length ? `${location.pathname}?ids=${ids.join(',').toLowerCase()}` : location.pathname;
    history.replaceState(history.state, '', url);
  }, [ids.join(','), synced]);

  const map = useMemo(() => new Map((catalog ?? []).map((p) => [p.id, p])), [catalog]);
  if (!catalog) return <p class="label">Loading comparison…</p>;
  const list = ids.map((id) => map.get(id)).filter(Boolean) as LiteProduct[];

  const adder = list.length < COMPARE_MAX && (
    <div class="field cmp-adder">
      <label for="cmp-add">{list.length ? 'Add another product' : 'Add a product to compare'}</label>
      <select
        id="cmp-add"
        class="select"
        value=""
        onChange={(e) => {
          const v = (e.currentTarget as HTMLSelectElement).value;
          if (v) {
            const p = map.get(v);
            toggleCompare(v, p?.short);
          }
        }}
      >
        <option value="">Choose from {catalog.length} products</option>
        {(['cleanse', 'exfoliate', 'treat', 'hydrate', 'protect'] as const).map((step) => (
          <optgroup label={stepLabel(step)}>
            {catalog
              .filter((p) => p.step === step && !ids.includes(p.id))
              .map((p) => (
                <option value={p.id}>
                  {p.brand} {p.short} · {mvr(p.price)}
                </option>
              ))}
          </optgroup>
        ))}
      </select>
    </div>
  );

  if (!list.length) {
    return (
      <div class="cmp-empty">
        <p>Nothing to compare yet. Tap “Compare” on up to {COMPARE_MAX} products, or add them here.</p>
        {adder}
        <a class="btn btn--quiet" href="/shop">
          Browse the shop
        </a>
      </div>
    );
  }

  const differs = (r: Row) => list.length > 1 && new Set(list.map(r.value)).size > 1;
  const cell = (r: Row, p: LiteProduct) => (r.render ? r.render(p) : r.value(p));
  const diffCount = ROWS.filter(differs).length;

  const head = (p: LiteProduct) => (
    <div class="cmp-head">
      <a href={p.url} class="cmp-img" tabIndex={-1} aria-hidden="true">
        <img src={p.img} width={200} height={200} alt="" loading="lazy" />
      </a>
      <p class="label">
        {p.id} · {p.brand}
      </p>
      <a href={p.url} class="cmp-name">
        {p.short}
      </a>
      <button type="button" class="cart-remove" onClick={() => toggleCompare(p.id, p.short)}>
        Remove<span class="sr-only"> {p.short} from compare</span>
      </button>
    </div>
  );
  const buy = (p: LiteProduct) => (
    <button type="button" class="btn btn--sm btn--block" onClick={() => addToCart(p.id)} aria-label={`Add to cart: ${p.brand} ${p.short}, ${mvr(p.price)}`}>
      Add to cart
    </button>
  );

  return (
    <div class="cmp">
      <div class="cmp-bar">
        <p class="label">
          {list.length} of {COMPARE_MAX} · {list.length > 1 ? `${diffCount} rows differ, marked with a bar` : 'Add another product to see differences'}
        </p>
        <button
          type="button"
          class="btn btn--sm btn--quiet"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(location.href);
            } catch {
              /* ignore */
            }
          }}
        >
          <Icon name="copy" size={16} /> Copy link to this comparison
        </button>
      </div>

      {/* Wide screens: products as columns, attributes as rows. */}
      <div class="cmp-wide">
        <table class="cmp-table">
          <caption class="sr-only">Product comparison</caption>
          <thead>
            <tr>
              <td />
              {list.map((p) => (
                <th scope="col">{head(p)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => (
              <tr class={differs(r) ? 'is-diff' : ''}>
                <th scope="row">
                  {r.label}
                  {differs(r) && <span class="cmp-flag mono">Differs</span>}
                </th>
                {list.map((p) => (
                  <td>{cell(r, p)}</td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">
                <span class="sr-only">Buy</span>
              </th>
              {list.map((p) => (
                <td>{buy(p)}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Narrow screens: label rows span all columns so 3 products fit at 375px. */}
      <div class="cmp-narrow">
        <table class={`cmp-table cmp-table--n${list.length}`}>
          <caption class="sr-only">Product comparison</caption>
          <thead>
            <tr>
              {list.map((p) => (
                <th scope="col">{head(p)}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {list.map((p) => (
                <td>{buy(p)}</td>
              ))}
            </tr>
            {ROWS.map((r) => [
              <tr class={`cmp-lbl ${differs(r) ? 'is-diff' : ''}`}>
                <th scope="colgroup" colSpan={list.length}>
                  {r.label}
                  {differs(r) && <span class="cmp-flag mono">Differs</span>}
                </th>
              </tr>,
              <tr class={differs(r) ? 'is-diff' : ''}>
                {list.map((p) => (
                  <td>{cell(r, p)}</td>
                ))}
              </tr>,
            ])}
          </tbody>
        </table>
      </div>
      {adder}
    </div>
  );
}
