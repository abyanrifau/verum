import { useStore } from '@nanostores/preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { navigate } from 'astro:transitions/client';
import { $cart, announce, clearCart, clearFlow, readFlow, removeFromCart, setQty, MAX_QTY, type CartLine } from '../stores/cart';
import { writeJSON } from '../stores/engine';
import { loadCatalog, type LiteProduct } from '../lib/lite';
import { bundle } from '../lib/bundle';
import { mvr, mvr2, gstIncluded } from '../lib/money';
import { deliveryZones, site } from '../data/site';
import type { DeliveryZone } from '../data/types';
import { Icon } from './icons';
import { deliveryTiming } from '../lib/timing';
import './checkout.css';

type Method = DeliveryZone['id'];
type Pay = 'card' | 'bml';
type Field = 'name' | 'phone' | 'email' | 'building' | 'floor' | 'area' | 'island';

interface Form {
  name: string;
  phone: string;
  email: string;
  building: string;
  floor: string;
  area: string;
  island: string;
}

export interface Order {
  number: string;
  placedAt: number;
  items: { id: string; name: string; brand: string; size: string; qty: number; price: number; url: string; thumb: string }[];
  subtotal: number;
  discount: number;
  percent: number;
  steps: number;
  total: number;
  gst: number;
  method: Method;
  methodLabel: string;
  timing: string;
  address: string | null;
  contact: { name: string; phone: string; email: string };
  payment: Pay;
  slipName: string | null;
  flowSeconds: number | null;
  flowSource: 'quiz' | 'cart' | null;
  buyNow: boolean;
}

const normPhone = (v: string) => {
  let d = v.replace(/[^\d+]/g, '');
  if (d.startsWith('+960')) d = d.slice(4);
  else if (d.startsWith('00960')) d = d.slice(5);
  else if (d.startsWith('960') && d.length === 10) d = d.slice(3);
  return d.replace(/\D/g, '');
};

function validate(f: Form, method: Method): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  if (f.name.trim().length < 2) e.name = 'Enter your name so we know who the order is for.';
  const ph = normPhone(f.phone);
  if (!ph) e.phone = 'Enter your phone number. We send order updates on WhatsApp.';
  else if (!/^[3-9]\d{6}$/.test(ph)) e.phone = 'Enter a 7-digit Maldives number, for example 777 1234.';
  if (f.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email.trim())) e.email = 'Check the email address, or leave it blank.';
  if (method === 'male' || method === 'hulhumale') {
    if (!f.building.trim()) e.building = 'Enter the house or building name.';
    if (!f.floor.trim()) e.floor = 'Enter the floor, for example 3 or G.';
    if (!f.area) e.area = 'Choose the area.';
  }
  if (method === 'islands' && f.island.trim().length < 2) e.island = 'Enter the island or resort name.';
  return e;
}

const ORDER: Field[] = ['name', 'phone', 'email', 'building', 'floor', 'area', 'island'];

export default function Checkout() {
  const cart = useStore($cart);
  const [catalog, setCatalog] = useState<LiteProduct[] | null>(null);
  const [buyLines, setBuyLines] = useState<CartLine[] | null>(null);
  const [ready, setReady] = useState(false);
  const [form, setForm] = useState<Form>({ name: '', phone: '', email: '', building: '', floor: '', area: '', island: '' });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [method, setMethod] = useState<Method>('male');
  const [pay, setPay] = useState<Pay>('card');
  const [slip, setSlip] = useState<{ name: string; size: number; url: string | null } | null>(null);
  const [stage, setStage] = useState<'form' | 'gateway' | 'placing'>('form');
  const [submitted, setSubmitted] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const gatewayRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search).get('buy');
    if (q) setBuyLines([{ id: q.toUpperCase(), qty: 1 }]);
    loadCatalog().then(setCatalog).catch(() => setCatalog([]));
    setReady(true);
    const t = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(t);
  }, []);

  const buyNow = !!buyLines;
  const lines = buyLines ?? cart;
  useEffect(() => {
    if (ready) document.documentElement.dataset.cart = lines.length || buyNow ? 'full' : 'empty';
  }, [ready, lines.length, buyNow]);
  const map = useMemo(() => new Map((catalog ?? []).map((p) => [p.id, p])), [catalog]);
  const items = lines.map((l) => ({ line: l, p: map.get(l.id) })).filter((x) => x.p) as { line: CartLine; p: LiteProduct }[];
  const b = bundle(items.map(({ line, p }) => ({ id: p.id, qty: line.qty, price: p.price })));
  const zone = deliveryZones.find((z) => z.id === method)!;
  const timing = deliveryTiming(method, now);
  const errors = validate(form, method);
  const visibleErr = (f: Field) => ((touched[f] || submitted) && errors[f] ? errors[f] : undefined);
  const count = items.reduce((s, x) => s + x.line.qty, 0);

  const set = (f: Field) => (e: Event) => {
    const v = (e.currentTarget as HTMLInputElement).value;
    setForm((cur) => ({ ...cur, [f]: v }));
  };
  const blur = (f: Field) => () => setTouched((t) => ({ ...t, [f]: true }));

  const changeQty = (id: string, q: number) => {
    if (buyLines) setBuyLines(q <= 0 ? [] : buyLines.map((l) => (l.id === id ? { ...l, qty: Math.min(MAX_QTY, q) } : l)));
    else setQty(id, q);
    const p = map.get(id);
    if (p) announce(q <= 0 ? `Removed ${p.short}.` : `${p.short} quantity ${q}.`);
  };
  const remove = (id: string) => {
    if (buyLines) setBuyLines(buyLines.filter((l) => l.id !== id));
    else removeFromCart(id);
    const p = map.get(id);
    if (p) announce(`Removed ${p.short}.`);
  };

  useEffect(() => {
    if (catalog && items.length) announce(`Total ${mvr(b.total)}${b.percent ? `, ${b.percent}% bundle saving applied` : ''}.`);
  }, [b.total]);

  function onSubmit(e: Event) {
    e.preventDefault();
    setSubmitted(true);
    const errs = validate(form, method);
    const first = ORDER.find((f) => errs[f]);
    if (first) {
      const n = Object.keys(errs).length;
      announce(`${n} ${n === 1 ? 'field needs' : 'fields need'} attention.`);
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    if (!items.length) return;
    if (pay === 'card') {
      setStage('gateway');
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
        gatewayRef.current?.focus();
      }, 0);
      return;
    }
    place();
  }

  function place() {
    setStage('placing');
    const flow = readFlow();
    const d = new Date();
    const stamp = `${String(d.getFullYear()).slice(2)}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const number = `VR${stamp}-${String(Math.floor(1000 + Math.random() * 9000))}`;
    const address =
      method === 'male' || method === 'hulhumale'
        ? `${form.building.trim()}, floor ${form.floor.trim()}, ${form.area}`
        : method === 'islands'
          ? form.island.trim()
          : `${site.pickup.label}: ${site.address.building}, ${site.address.street}, ${site.address.city}`;
    const order: Order = {
      number,
      placedAt: Date.now(),
      items: items.map(({ line, p }) => ({ id: p.id, name: p.short, brand: p.brand, size: p.size, qty: line.qty, price: p.price, url: p.url, thumb: p.t2 })),
      subtotal: b.subtotal,
      discount: b.discount,
      percent: b.percent,
      steps: b.steps,
      total: b.total,
      gst: gstIncluded(b.total),
      method,
      methodLabel: zone.label,
      timing,
      address,
      contact: { name: form.name.trim(), phone: `+960 ${normPhone(form.phone)}`, email: form.email.trim() },
      payment: pay,
      slipName: slip?.name ?? null,
      flowSeconds: flow ? Math.max(1, Math.round((Date.now() - flow.t) / 1000)) : null,
      flowSource: flow?.source ?? null,
      buyNow,
    };
    writeJSON('verum:order', order);
    if (!buyNow) clearCart();
    clearFlow();
    navigate('/checkout/confirmed');
  }

  if (!ready) {
    return <p class="label co-loading">Loading checkout…</p>;
  }

  if (!lines.length && stage === 'form') {
    // The page shows its static empty-cart message (painted before hydration).
    return null;
  }

  if (stage === 'gateway' || (stage === 'placing' && pay === 'card')) {
    return (
      <div class="gw" role="region" aria-labelledby="gw-h">
        <p class="gw-badge mono">DEMO BANK PAYMENT GATEWAY</p>
        <h2 id="gw-h" class="gw-title" tabIndex={-1} ref={gatewayRef}>
          Approve payment to VERUM
        </h2>
        <dl class="gw-dl">
          <div>
            <dt>Merchant</dt>
            <dd>VERUM, Malé (concept)</dd>
          </div>
          <div>
            <dt>Amount</dt>
            <dd class="mono">{mvr(b.total)}</dd>
          </div>
          <div>
            <dt>Card</dt>
            <dd>No card details are collected in this demo.</dd>
          </div>
        </dl>
        <button type="button" class="btn btn--xl btn--block" onClick={place} disabled={stage === 'placing'}>
          {stage === 'placing' ? 'Approving…' : 'Approve demo payment'}
        </button>
        <button type="button" class="qz-back gw-cancel" onClick={() => setStage('form')}>
          Cancel and return to checkout
        </button>
        <p class="label">{site.concept.demoNote}</p>
      </div>
    );
  }

  const field = (f: Field, label: string, input: preact.JSX.Element, hint?: string) => {
    const err = visibleErr(f);
    return (
      <div class={`field ${err ? 'has-error' : ''}`}>
        <label for={`co-${f}`}>{label}</label>
        {input}
        {hint && !err && (
          <p class="hint" id={`co-${f}-hint`}>
            {hint}
          </p>
        )}
        {err && (
          <p class="field-error" id={`co-${f}-err`}>
            <Icon name="warn" size={14} /> {err}
          </p>
        )}
      </div>
    );
  };
  const aria = (f: Field, hasHint = false) => ({
    'aria-invalid': visibleErr(f) ? ('true' as const) : undefined,
    'aria-describedby': visibleErr(f) ? `co-${f}-err` : hasHint ? `co-${f}-hint` : undefined,
  });

  const summaryLines = !catalog ? (
    <p class="label co-loading">Loading your items…</p>
  ) : (
    <ul role="list" class="co-lines">
      {items.map(({ line, p }) => (
        <li class="co-line" key={p.id}>
          <span class="co-thumb">
            <img src={p.t1} srcset={`${p.t1} 96w, ${p.t2} 192w`} sizes="56px" width={56} height={56} alt="" />
          </span>
          <div class="co-line-main">
            <p class="co-line-name">
              <span class="muted">{p.brand}</span> {p.short}
            </p>
            <p class="label">
              {p.id} · {p.size}
            </p>
            <div class="co-line-actions">
              <div class="qty" role="group" aria-label={`Quantity of ${p.short}`}>
                <button type="button" aria-label={`Decrease quantity of ${p.short}`} onClick={() => changeQty(p.id, line.qty - 1)}>
                  <Icon name="minus" size={16} />
                </button>
                <span class="mono qty-n">{line.qty}</span>
                <button
                  type="button"
                  aria-label={`Increase quantity of ${p.short}`}
                  disabled={line.qty >= Math.min(MAX_QTY, p.stock)}
                  onClick={() => changeQty(p.id, line.qty + 1)}
                >
                  <Icon name="plus" size={16} />
                </button>
              </div>
              <button type="button" class="cart-remove" onClick={() => remove(p.id)}>
                Remove<span class="sr-only"> {p.short}</span>
              </button>
            </div>
          </div>
          <p class="mono co-line-price">{mvr(p.price * line.qty)}</p>
        </li>
      ))}
    </ul>
  );

  return (
    <form class="co" ref={formRef} onSubmit={onSubmit} noValidate aria-label="Checkout">
      <details class="co-mini">
        <summary>
          <span>
            Order summary <span class="muted">· {count} {count === 1 ? 'item' : 'items'}</span>
          </span>
          <span class="mono">{mvr(b.total)}</span>
        </summary>
        <ul role="list" class="co-mini-list">
          {items.map(({ line, p }) => (
            <li>
              <span>
                {line.qty} × {p.brand} {p.short}
              </span>
              <span class="mono">{mvr(p.price * line.qty)}</span>
            </li>
          ))}
          {b.discount > 0 && (
            <li class="is-saving">
              <span>Bundle discount ({b.percent}%)</span>
              <span class="mono">−{mvr(b.discount)}</span>
            </li>
          )}
        </ul>
      </details>

      {buyNow && (
        <p class="co-buynow">
          <Icon name="check" size={16} /> Buy now: just this item. Your cart is kept for later.
        </p>
      )}

      <section class="co-sec co-sec--contact" aria-labelledby="co-h1">
        <h2 id="co-h1" class="co-h">
          <span class="mono">1</span> Contact
        </h2>
        <div class="co-grid">
          {field(
            'name',
            'Full name',
            <input
              id="co-name"
              name="name"
              class="input"
              type="text"
              autocomplete="name"
              autocapitalize="words"
              enterkeyhint="next"
              required
              value={form.name}
              onInput={set('name')}
              onBlur={blur('name')}
              {...aria('name')}
            />,
          )}
          {field(
            'phone',
            'Phone (WhatsApp)',
            <div class="input-prefix">
              <span class="mono" aria-hidden="true">
                +960
              </span>
              <input
                id="co-phone"
                name="phone"
                class="input"
                type="tel"
                inputmode="tel"
                autocomplete="tel-national"
                enterkeyhint="next"
                required
                placeholder="777 1234"
                value={form.phone}
                onInput={set('phone')}
                onBlur={blur('phone')}
                {...aria('phone', true)}
              />
            </div>,
            'Order updates come by WhatsApp. No marketing.',
          )}
          {field(
            'email',
            'Email (optional)',
            <input
              id="co-email"
              name="email"
              class="input"
              type="email"
              inputmode="email"
              autocomplete="email"
              autocapitalize="off"
              spellcheck={false}
              enterkeyhint="next"
              value={form.email}
              onInput={set('email')}
              onBlur={blur('email')}
              {...aria('email', true)}
            />,
            'For a receipt. Leave blank if you prefer.',
          )}
        </div>
      </section>

      <section class="co-sec co-sec--delivery" aria-labelledby="co-h2">
        <h2 id="co-h2" class="co-h">
          <span class="mono">2</span> Delivery
        </h2>
        <fieldset class="co-options">
          <legend class="sr-only">Delivery method</legend>
          {deliveryZones.map((z) => (
            <label class={`co-opt ${method === z.id ? 'is-on' : ''}`}>
              <input type="radio" name="method" value={z.id} checked={method === z.id} onChange={() => setMethod(z.id)} />
              <span class="co-opt-main">
                <span class="co-opt-label">{z.label}</span>
                <span class="co-opt-sub">{z.timing}</span>
              </span>
              <span class="co-opt-fee mono">{z.feeLabel}</span>
            </label>
          ))}
        </fieldset>
        <p class="co-timing" aria-live="polite">
          <Icon name="check" size={16} /> {timing}
        </p>

        {(method === 'male' || method === 'hulhumale') && (
          <div class="co-grid co-grid--addr">
            {field(
              'building',
              'House or building name',
              <input
                id="co-building"
                name="building"
                class="input"
                type="text"
                autocomplete="address-line1"
                enterkeyhint="next"
                required
                placeholder="e.g. H. Sea Breeze"
                value={form.building}
                onInput={set('building')}
                onBlur={blur('building')}
                {...aria('building')}
              />,
            )}
            {field(
              'floor',
              'Floor',
              <input
                id="co-floor"
                name="floor"
                class="input"
                type="text"
                autocomplete="address-line2"
                enterkeyhint="next"
                required
                placeholder="e.g. 3"
                value={form.floor}
                onInput={set('floor')}
                onBlur={blur('floor')}
                {...aria('floor')}
              />,
            )}
            {field(
              'area',
              'Area',
              <select
                id="co-area"
                name="area"
                class="select"
                autocomplete="address-level3"
                required
                value={form.area}
                onChange={(e) => {
                  set('area')(e);
                  setTouched((t) => ({ ...t, area: true }));
                }}
                onBlur={blur('area')}
                {...aria('area')}
              >
                <option value="">Choose area</option>
                {zone.areas?.map((a) => (
                  <option value={a}>{a}</option>
                ))}
              </select>,
            )}
          </div>
        )}
        {method === 'islands' && (
          <div class="co-grid">
            {field(
              'island',
              'Island or resort',
              <input
                id="co-island"
                name="island"
                class="input"
                type="text"
                autocomplete="address-level2"
                required
                placeholder="e.g. Maafushi, or the resort name"
                value={form.island}
                onInput={set('island')}
                onBlur={blur('island')}
                {...aria('island', true)}
              />,
              'We will message you a quote on WhatsApp before anything is sent.',
            )}
          </div>
        )}
        {method === 'pickup' && (
          <div class="co-pickup">
            <p>
              <strong>{site.pickup.label}</strong>
              <br />
              {site.address.building}, {site.address.street}, {site.address.district}, {site.address.city} (placeholder address)
            </p>
            <p class="muted">
              {site.pickup.days}, {site.pickup.hours}. {site.pickup.readyIn}. Bring your order number.
            </p>
          </div>
        )}
      </section>

      <section class="co-sec co-sec--pay" aria-labelledby="co-h3">
        <h2 id="co-h3" class="co-h">
          <span class="mono">3</span> Payment
        </h2>
        <fieldset class="co-options">
          <legend class="sr-only">Payment method</legend>
          <label class={`co-opt ${pay === 'card' ? 'is-on' : ''}`}>
            <input type="radio" name="pay" value="card" checked={pay === 'card'} onChange={() => setPay('card')} />
            <span class="co-opt-main">
              <span class="co-opt-label">Pay by card</span>
              <span class="co-opt-sub">You approve on the bank’s payment page. We never see card numbers.</span>
            </span>
          </label>
          <label class={`co-opt ${pay === 'bml' ? 'is-on' : ''}`}>
            <input type="radio" name="pay" value="bml" checked={pay === 'bml'} onChange={() => setPay('bml')} />
            <span class="co-opt-main">
              <span class="co-opt-label">BML bank transfer</span>
              <span class="co-opt-sub">Transfer, then attach the slip here or on WhatsApp.</span>
            </span>
          </label>
        </fieldset>
        {pay === 'bml' && (
          <div class="co-bml">
            <p class="gw-badge mono">DEMO ACCOUNT DETAILS</p>
            <dl class="co-bml-dl">
              <div>
                <dt>Bank</dt>
                <dd>{site.bml.bank}</dd>
              </div>
              <div>
                <dt>Account name</dt>
                <dd>{site.bml.accountName}</dd>
              </div>
              <div>
                <dt>Account number</dt>
                <dd class="mono">{site.bml.accountNumber}</dd>
              </div>
              <div>
                <dt>Amount</dt>
                <dd class="mono">{mvr(b.total)}</dd>
              </div>
              <div>
                <dt>Reference</dt>
                <dd>Your order number, shown after you place the order</dd>
              </div>
            </dl>
            <div class="field">
              <label for="co-slip">Transfer slip (optional)</label>
              <input
                id="co-slip"
                name="slip"
                class="input co-file"
                type="file"
                accept="image/*,application/pdf"
                aria-describedby="co-slip-hint"
                onChange={(e) => {
                  const file = (e.currentTarget as HTMLInputElement).files?.[0];
                  if (slip?.url) URL.revokeObjectURL(slip.url);
                  setSlip(file ? { name: file.name, size: file.size, url: file.type.startsWith('image/') ? URL.createObjectURL(file) : null } : null);
                }}
              />
              <p class="hint" id="co-slip-hint">
                The file stays in your browser. Nothing is uploaded anywhere.
              </p>
              {slip && (
                <div class="co-slip">
                  {slip.url && <img src={slip.url} alt="Preview of your transfer slip" width={72} height={72} />}
                  <span class="mono">
                    {slip.name} · {Math.max(1, Math.round(slip.size / 1024))} KB
                  </span>
                </div>
              )}
            </div>
            <p class="co-note">Your order is confirmed once the transfer is checked, usually within the hour during opening times.</p>
          </div>
        )}
      </section>

      <section class="co-sec co-sec--summary" aria-labelledby="co-h4">
        <h2 id="co-h4" class="co-h">
          <span class="mono">4</span> Order summary
        </h2>
        {summaryLines}
        <dl class="totals">
          <div>
            <dt>Subtotal</dt>
            <dd class="mono">{mvr(b.subtotal)}</dd>
          </div>
          <div class={b.discount ? 'is-saving' : ''}>
            <dt>Bundle discount {b.percent ? `(${b.steps} steps, ${b.percent}%)` : `(add ${b.next?.needed ?? 0} more for ${b.next?.percent ?? 0}%)`}</dt>
            <dd class="mono">{b.discount ? `−${mvr(b.discount)}` : mvr(0)}</dd>
          </div>
          <div>
            <dt>Delivery · {zone.short}</dt>
            <dd class="mono">{zone.fee === null ? 'Quote on WhatsApp' : zone.fee === 0 ? 'Free' : mvr(zone.fee)}</dd>
          </div>
          <div class="totals-total">
            <dt>Total</dt>
            <dd class="mono">{mvr(b.total)}</dd>
          </div>
        </dl>
        <p class="label gst-note">
          Prices include GST ({Math.round(site.gstRate * 100)}%): {mvr2(gstIncluded(b.total))}.
        </p>
        <button type="submit" class="btn btn--xl btn--block co-place" disabled={stage !== 'form' || !catalog}>
          Place order <span class="price">{mvr(b.total)}</span>
        </button>
        <p class="co-demo">{site.concept.demoNote}</p>
      </section>
    </form>
  );
}
