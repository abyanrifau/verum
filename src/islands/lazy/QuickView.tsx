import { render } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { loadCatalog, type LiteProduct } from '../../lib/lite';
import { addToCart } from '../../stores/cart';
import { toggleCompare, $compare } from '../../stores/compare';
import { mvr } from '../../lib/money';
import { Icon } from '../icons';
import './quickview.css';

const STEP: Record<string, string> = { cleanse: 'Cleanse', exfoliate: 'Exfoliate', treat: 'Treat', hydrate: 'Hydrate', protect: 'Protect' };

function QuickView({ slug, onClosed }: { slug: string; onClosed: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [p, setP] = useState<LiteProduct | null>(null);
  const [inCompare, setInCompare] = useState(false);

  useEffect(() => {
    const d = ref.current!;
    d.showModal();
    loadCatalog().then((list) => {
      const found = list.find((x) => x.slug === slug) ?? null;
      setP(found);
      if (found) setInCompare($compare.get().includes(found.id));
    });
    const close = () => onClosed();
    const swap = () => d.open && d.close();
    d.addEventListener('close', close);
    document.addEventListener('astro:before-swap', swap);
    return () => {
      d.removeEventListener('close', close);
      document.removeEventListener('astro:before-swap', swap);
    };
  }, []);

  return (
    <dialog ref={ref} class="qv" aria-labelledby="qv-title" onClick={(e) => e.target === ref.current && ref.current?.close()}>
      <button type="button" class="qv-close" aria-label="Close quick view" onClick={() => ref.current?.close()}>
        <Icon name="close" />
      </button>
      {!p ? (
        <p class="label qv-loading" id="qv-title">
          Loading…
        </p>
      ) : (
        <div class="qv-grid">
          <div class="qv-img">
            <img src={p.img} width={400} height={400} alt={p.alt} />
          </div>
          <div class="qv-main">
            <p class="label">
              {p.id} · {STEP[p.step]} · {p.time === 'AM+PM' ? 'AM and PM' : p.time}
            </p>
            <p class="qv-brand">{p.brand}</p>
            <h2 id="qv-title" class="qv-title">
              {p.short}
            </h2>
            <p class="label">{p.size}</p>
            <p class="qv-price mono">{mvr(p.price)}</p>
            <p class="qv-stock label">{p.stock <= 0 ? 'Out of stock' : p.stock <= 5 ? `Only ${p.stock} left` : 'In stock · free same-day delivery in Malé'}</p>
            <ul role="list" class="qv-keys">
              {p.key.map((k) => (
                <li>
                  <span>{k.name}</span>
                  <span class={`mono ${k.c ? '' : 'qv-np'}`}>{k.c ?? 'Not published'}</span>
                </li>
              ))}
            </ul>
            <p class="qv-texture">{p.texture}</p>
            <button
              type="button"
              class="btn btn--lg btn--block"
              disabled={p.stock <= 0}
              onClick={() => {
                ref.current?.close();
                addToCart(p.id);
              }}
            >
              Add to cart <span class="price">{mvr(p.price)}</span>
            </button>
            <div class="qv-row">
              <a class="link" href={p.url} onClick={() => ref.current?.close()}>
                View full details
              </a>
              <button type="button" class="btn btn--sm btn--quiet" aria-pressed={inCompare} onClick={() => setInCompare(toggleCompare(p.id, p.short))}>
                {inCompare ? 'In compare' : 'Add to compare'}
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  );
}

let host: HTMLElement | null = null;
export function openQuickView(slug: string, _trigger?: HTMLElement) {
  host?.remove();
  host = document.createElement('div');
  document.body.appendChild(host);
  const h = host;
  render(<QuickView slug={slug} onClosed={() => setTimeout(() => render(null, h), 0)} />, h);
}
