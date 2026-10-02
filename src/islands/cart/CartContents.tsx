import { useStore } from '@nanostores/preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { $cart, addToCart, announce, removeFromCart, setQty, MAX_QTY, type CartLine } from '../../stores/cart';
import { $quiz } from '../../stores/routine';
import { loadCatalog, type LiteProduct } from '../../lib/lite';
import { bundle, tierMessage, tiers } from '../../lib/bundle';
import { mvr } from '../../lib/money';
import { Icon } from '../icons';
import type { Step } from '../../data/types';

const STEP_ORDER: Step[] = ['cleanse', 'exfoliate', 'treat', 'hydrate', 'protect'];
const STEP_LABEL: Record<Step, string> = {
  cleanse: 'Cleanse',
  exfoliate: 'Exfoliate',
  treat: 'Treat',
  hydrate: 'Hydrate',
  protect: 'Protect',
};
const STEP_N: Record<Step, string> = { cleanse: '01', exfoliate: '02', treat: '03', hydrate: '04', protect: '05' };
const MAIN_FORMATS = new Set(['oil-cleanser', 'balm-cleanser', 'gel-cleanser', 'foam-cleanser', 'cream-cleanser', 'micellar-water', 'exfoliant', 'serum', 'essence', 'ampoule', 'moisturiser', 'sunscreen', 'toner']);

export function useCatalog(eager: boolean) {
  const [catalog, setCatalog] = useState<LiteProduct[] | null>(null);
  const [error, setError] = useState(false);
  useEffect(() => {
    if (!eager || catalog) return;
    loadCatalog()
      .then(setCatalog)
      .catch(() => setError(true));
  }, [eager]);
  return { catalog, error };
}

/** "Complete your routine": one best product for each routine step the cart is missing. */
export function routineUpsell(catalog: LiteProduct[], lines: CartLine[], skin?: string, tolerance?: string) {
  const map = new Map(catalog.map((p) => [p.id, p]));
  const items = lines.map((l) => map.get(l.id)).filter(Boolean) as LiteProduct[];
  const have = new Set(items.map((p) => p.step));
  const missing = STEP_ORDER.filter((s) => !have.has(s) && !(s === 'exfoliate' && tolerance === 'reacts'));
  const skinVotes = new Map<string, number>();
  for (const p of items) for (const s of p.skin) skinVotes.set(s, (skinVotes.get(s) ?? 0) + 1);
  const profile = skin ?? [...skinVotes.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  const concerns = new Set(items.flatMap((p) => p.concerns));
  const inCart = new Set(lines.map((l) => l.id));
  return missing
    .map((step) => {
      const best = catalog
        .filter((p) => p.step === step && !inCart.has(p.id) && p.stock > 0 && MAIN_FORMATS.has(p.format))
        .filter((p) => !(tolerance === 'reacts' && p.strength === 'strong'))
        .map((p) => {
          let s = (60 - p.sales) / 30;
          if (profile && p.skin.includes(profile as never)) s += 3;
          s += p.concerns.filter((c) => concerns.has(c)).length;
          if (p.ff) s += 0.5;
          if (step === 'hydrate' && p.format === 'moisturiser') s += 1.5;
          return { p, s };
        })
        .sort((a, b) => b.s - a.s)[0]?.p;
      return best ? { step, product: best } : null;
    })
    .filter(Boolean) as { step: Step; product: LiteProduct }[];
}

export function TierMeter({ steps, compact = false }: { steps: number; compact?: boolean }) {
  const max = tiers[tiers.length - 1].minSteps;
  const b = bundleFromSteps(steps);
  return (
    <div class={`tier ${compact ? 'tier--compact' : ''}`}>
      <p class="tier-msg">
        <span class="mono tier-pct">{b.percent ? `−${b.percent}%` : '0%'}</span> {tierMessage(b)}
      </p>
      <div class="tier-bar" aria-hidden="true">
        {Array.from({ length: max }, (_, i) => (
          <span class={`tier-seg ${i < steps ? 'is-on' : ''}`}>
            {tiers.find((t) => t.minSteps === i + 1) && <span class="tier-mark mono">{tiers.find((t) => t.minSteps === i + 1)!.percent}%</span>}
          </span>
        ))}
      </div>
    </div>
  );
}

function bundleFromSteps(steps: number) {
  return bundle(Array.from({ length: steps }, (_, i) => ({ id: String(i), qty: 1, price: 0 })));
}

export function Thumb({ p, size = 64 }: { p: LiteProduct; size?: number }) {
  return (
    <span class="thumb" style={{ width: `${size}px`, height: `${size}px` }}>
      <img src={p.t1} srcset={`${p.t1} 96w, ${p.t2} 192w`} sizes={`${size}px`} width={size} height={size} alt="" loading="lazy" decoding="async" />
    </span>
  );
}

interface Props {
  variant: 'drawer' | 'page';
  open?: boolean;
  onNavigate?: () => void;
}

export default function CartContents({ variant, open = true, onNavigate }: Props) {
  const lines = useStore($cart);
  const quiz = useStore($quiz);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const { catalog, error } = useCatalog(variant === 'page' || open || lines.length > 0);
  const prev = useRef<CartLine[] | null>(null);

  const map = useMemo(() => new Map((catalog ?? []).map((p) => [p.id, p])), [catalog]);
  const items = lines.map((l) => ({ line: l, p: map.get(l.id) })).filter((x) => x.p) as { line: CartLine; p: LiteProduct }[];
  const b = bundle(items.map(({ line, p }) => ({ id: p.id, qty: line.qty, price: p.price })));
  const ups = catalog ? routineUpsell(catalog, lines, quiz?.answers.skin, quiz?.answers.tolerance).slice(0, 3) : [];

  // Announce cart and price changes.
  useEffect(() => {
    if (!catalog) return;
    const before = prev.current;
    prev.current = lines;
    if (!before) return;
    const added = lines.filter((l) => !before.some((x) => x.id === l.id)).map((l) => map.get(l.id)?.short).filter(Boolean);
    const count = lines.reduce((s, l) => s + l.qty, 0);
    const head = added.length === 1 ? `Added ${added[0]}. ` : added.length > 1 ? `Added ${added.length} products. ` : '';
    announce(
      `${head}${count} ${count === 1 ? 'item' : 'items'} in cart. Total ${mvr(b.total)}${b.percent ? `, ${b.percent}% bundle saving applied` : ''}.`,
    );
  }, [lines, catalog]);

  const nav = () => onNavigate?.();

  if (!ready || (lines.length > 0 && !catalog && !error)) {
    return (
      <div class="cart-body">
        <p class="label cart-loading">Loading your cart…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div class="cart-body">
        <p>Your cart could not load. Refresh the page to try again.</p>
      </div>
    );
  }
  if (!items.length) {
    return (
      <div class="cart-body cart-empty">
        <p class="cart-empty-title">Your cart is empty.</p>
        <p class="muted">Not sure where to start? Three taps build a full routine with prices.</p>
        <a href="/quiz" class="btn btn--lg btn--block" onClick={nav}>
          Find your routine in 30 seconds
        </a>
        <a href="/shop" class="btn btn--quiet btn--block" onClick={nav}>
          Shop all products
        </a>
        <TierMeter steps={0} />
      </div>
    );
  }

  return (
    <div class="cart-body">
      <TierMeter steps={b.steps} />

      <ul role="list" class="cart-lines">
        {items.map(({ line, p }) => (
          <li class="cart-line" key={p.id}>
            <a href={p.url} class="cart-line-img" tabIndex={-1} aria-hidden="true" onClick={nav}>
              <Thumb p={p} size={64} />
            </a>
            <div class="cart-line-main">
              <p class="label">
                {p.id} · {STEP_LABEL[p.step]}
              </p>
              <a href={p.url} class="cart-line-name" onClick={nav}>
                <span class="cart-line-brand">{p.brand}</span> {p.short}
              </a>
              <p class="label">{p.size}</p>
              <div class="cart-line-actions">
                <div class="qty" role="group" aria-label={`Quantity of ${p.short}`}>
                  <button type="button" aria-label={`Decrease quantity of ${p.short}`} onClick={() => setQty(p.id, line.qty - 1)}>
                    <Icon name="minus" size={16} />
                  </button>
                  <span class="mono qty-n" aria-live="off">
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    aria-label={`Increase quantity of ${p.short}`}
                    disabled={line.qty >= Math.min(MAX_QTY, p.stock)}
                    onClick={() => setQty(p.id, line.qty + 1)}
                  >
                    <Icon name="plus" size={16} />
                  </button>
                </div>
                <button type="button" class="cart-remove" onClick={() => removeFromCart(p.id)}>
                  Remove<span class="sr-only"> {p.short}</span>
                </button>
              </div>
            </div>
            <p class="cart-line-price mono">{mvr(p.price * line.qty)}</p>
          </li>
        ))}
      </ul>

      {ups.length > 0 && (
        <section class="upsell" aria-labelledby={`ups-${variant}`}>
          <div class="upsell-head">
            <h3 id={`ups-${variant}`} class="upsell-title">
              Complete your routine
            </h3>
            <p class="label">Missing: {ups.map((u) => STEP_LABEL[u.step]).join(', ')}</p>
          </div>
          <ul role="list" class="upsell-list">
            {ups.map(({ step, product: p }) => (
              <li class="upsell-item" key={p.id}>
                <Thumb p={p} size={52} />
                <div class="upsell-main">
                  <p class="label">
                    {STEP_N[step]} {STEP_LABEL[step]}
                  </p>
                  <a href={p.url} class="upsell-name" onClick={nav}>
                    {p.brand} {p.short}
                  </a>
                </div>
                <button
                  type="button"
                  class="btn btn--sm btn--ghost upsell-add"
                  onClick={() => addToCart(p.id, { open: true })}
                  aria-label={`Add ${p.brand} ${p.short}, ${mvr(p.price)}`}
                >
                  <span class="mono">+ {mvr(p.price)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      )}

      <dl class="totals">
        <div>
          <dt>Subtotal</dt>
          <dd class="mono">{mvr(b.subtotal)}</dd>
        </div>
        <div class={b.discount ? 'is-saving' : ''}>
          <dt>Bundle discount {b.percent ? `(${b.steps} steps, ${b.percent}%)` : ''}</dt>
          <dd class="mono">{b.discount ? `−${mvr(b.discount)}` : mvr(0)}</dd>
        </div>
        <div>
          <dt>Delivery</dt>
          <dd>Free in Malé, Hulhumalé, Villimalé</dd>
        </div>
        <div class="totals-total">
          <dt>Total</dt>
          <dd class="mono">{mvr(b.total)}</dd>
        </div>
      </dl>
      <p class="label gst-note">Prices include GST.</p>

      <div class={`cart-cta ${variant === 'drawer' ? 'cart-cta--sticky' : ''}`}>
        <a href="/checkout" class="btn btn--xl btn--block checkout-btn" onClick={nav}>
          Checkout <span class="price">{mvr(b.total)}</span>
        </a>
        <p class="cart-assure label">
          {b.percent ? `You save ${mvr(b.discount)}. ` : ''}One page. No account. Card or BML transfer.
        </p>
      </div>
    </div>
  );
}
