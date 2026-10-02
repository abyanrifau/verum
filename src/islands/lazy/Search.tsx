import { render } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { prepare, search, type Prepared, type SearchDoc } from '../../lib/search';
import { addToCart } from '../../stores/cart';
import { mvr } from '../../lib/money';
import { Icon } from '../icons';
import './search.css';

let indexPromise: Promise<Prepared[]> | null = null;
const loadIndex = () =>
  (indexPromise ??= fetch('/search-index.json')
    .then((r) => r.json() as Promise<SearchDoc[]>)
    .then(prepare)
    .catch((e) => {
      indexPromise = null;
      throw e;
    }));

const SUGGEST = ['sunscreen', 'niacinamide', 'retinol', 'COSRX', 'oil cleanser', 'centella', 'vitamin c', 'The Ordinary'];

function SearchDialog({ onClosed }: { onClosed: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState('');
  const [index, setIndex] = useState<Prepared[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    input.current?.focus();
    loadIndex().then(setIndex).catch(() => setFailed(true));
    const close = () => onClosed();
    const swap = () => d.open && d.close();
    d.addEventListener('close', close);
    document.addEventListener('astro:before-swap', swap);
    return () => {
      d.removeEventListener('close', close);
      document.removeEventListener('astro:before-swap', swap);
    };
  }, []);

  const results = useMemo(() => (index && q.trim() ? search(index, q) : []), [index, q]);
  const groups = {
    product: results.filter((r) => r.doc.type === 'product').slice(0, 8),
    brand: results.filter((r) => r.doc.type === 'brand').slice(0, 4),
    ingredient: results.filter((r) => r.doc.type === 'ingredient').slice(0, 4),
  };
  const total = groups.product.length + groups.brand.length + groups.ingredient.length;

  const move = (dir: 1 | -1, from?: Element | null) => {
    const links = [...(ref.current?.querySelectorAll<HTMLElement>('[data-sr]') ?? [])];
    if (!links.length) return;
    const i = from ? links.indexOf(from as HTMLElement) : -1;
    const next = i + dir;
    if (next < 0) input.current?.focus();
    else links[Math.min(next, links.length - 1)]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const t = e.target as HTMLElement;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      move(1, t === input.current ? null : t.closest('[data-sr]') ?? t.closest('li')?.querySelector('[data-sr]'));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      move(-1, t.closest('[data-sr]') ?? t.closest('li')?.querySelector('[data-sr]'));
    } else if (e.key === 'Enter' && t === input.current) {
      const first = ref.current?.querySelector<HTMLAnchorElement>('a[data-sr]');
      if (first) {
        e.preventDefault();
        first.click();
      }
    }
  };

  const go = () => ref.current?.close();

  return (
    <dialog ref={ref} class="search" aria-labelledby="search-title" onKeyDown={onKey} onClick={(e) => e.target === ref.current && ref.current?.close()}>
      <div class="search-inner">
        <h2 id="search-title" class="sr-only">
          Search VERUM
        </h2>
        <div class="search-bar">
          <Icon name="search" />
          <input
            ref={input}
            type="search"
            class="search-input"
            placeholder="Products, brands, ingredients"
            aria-label="Search products, brands and ingredients"
            aria-describedby="search-help"
            autocomplete="off"
            autocapitalize="off"
            spellcheck={false}
            enterkeyhint="search"
            value={q}
            onInput={(e) => setQ((e.currentTarget as HTMLInputElement).value)}
          />
          <button type="button" class="search-close" onClick={() => ref.current?.close()}>
            Close<span class="sr-only"> search</span>
          </button>
        </div>
        <p id="search-help" class="sr-only">
          Use the down arrow to move through results. Escape closes search.
        </p>
        <p class="sr-only" role="status" aria-live="polite">
          {q.trim() ? (index ? `${groups.product.length} products, ${groups.brand.length} brands, ${groups.ingredient.length} ingredients` : 'Loading') : ''}
        </p>

        <div class="search-body">
          {failed && <p class="search-msg">Search could not load. Check your connection and try again.</p>}
          {!q.trim() && (
            <div class="search-suggest">
              <p class="label">Try</p>
              <div class="chip-row">
                {SUGGEST.map((s) => (
                  <button type="button" class="chip" onClick={() => setQ(s)}>
                    {s}
                  </button>
                ))}
              </div>
              <a href="/quiz" class="search-quiz" data-sr onClick={go}>
                Not sure what to search for? Find your routine in 30 seconds <span aria-hidden="true">→</span>
              </a>
            </div>
          )}
          {q.trim() && index && total === 0 && (
            <div class="search-msg">
              <p>No match for “{q}”. Try a brand, an ingredient such as niacinamide, or a step such as sunscreen.</p>
              <a href="/shop" data-sr onClick={go} class="link">
                Browse all products
              </a>
            </div>
          )}
          {groups.product.length > 0 && (
            <section aria-labelledby="sg-p">
              <h3 id="sg-p" class="search-group mono">
                Products
              </h3>
              <ul role="list">
                {groups.product.map(({ doc }) => (
                  <li class="search-row">
                    <a href={doc.url} data-sr onClick={go} class="search-link">
                      <span class="search-thumb">
                        <img src={doc.thumb} srcset={`${doc.thumb} 96w, ${doc.thumb2} 192w`} sizes="48px" width={48} height={48} alt="" />
                      </span>
                      <span class="search-text">
                        <span class="label">
                          {doc.code} · {doc.sub}
                        </span>
                        <span class="search-title">{doc.title}</span>
                        <span class="mono search-price">{mvr(doc.price!)}</span>
                      </span>
                    </a>
                    <button
                      type="button"
                      class="btn btn--sm search-add"
                      onClick={() => {
                        ref.current?.close();
                        addToCart(doc.id);
                      }}
                      aria-label={`Add to cart: ${doc.title}, ${mvr(doc.price!)}`}
                    >
                      Add
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {groups.brand.length > 0 && (
            <section aria-labelledby="sg-b">
              <h3 id="sg-b" class="search-group mono">
                Brands
              </h3>
              <ul role="list">
                {groups.brand.map(({ doc }) => (
                  <li class="search-row">
                    <a href={doc.url} data-sr onClick={go} class="search-link">
                      <span class="search-text">
                        <span class="search-title">{doc.title}</span>
                        <span class="label">{doc.sub}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {groups.ingredient.length > 0 && (
            <section aria-labelledby="sg-i">
              <h3 id="sg-i" class="search-group mono">
                Ingredients
              </h3>
              <ul role="list">
                {groups.ingredient.map(({ doc }) => (
                  <li class="search-row">
                    <a href={doc.url} data-sr onClick={go} class="search-link">
                      <span class="search-text">
                        <span class="search-title">{doc.title}</span>
                        <span class="label">{doc.sub}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <p class="search-foot label" aria-hidden="true">
          ↑ ↓ to move · Enter to open · Esc to close
        </p>
      </div>
    </dialog>
  );
}

let host: HTMLElement | null = null;
export function openSearch() {
  if (host && document.body.contains(host) && host.querySelector('dialog[open]')) return;
  host?.remove();
  host = document.createElement('div');
  host.id = 'search-host';
  document.body.appendChild(host);
  const h = host;
  render(<SearchDialog onClosed={() => setTimeout(() => render(null, h), 0)} />, h);
}
