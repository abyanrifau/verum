import { useEffect, useState } from 'preact/hooks';
import { readJSON } from '../stores/engine';
import { $quiz } from '../stores/routine';
import { loadCatalog, type LiteProduct } from '../lib/lite';
import { arrangeRoutine } from '../lib/arrange';
import { mvr, mvr2 } from '../lib/money';
import type { Order } from './Checkout';
import { Icon } from './icons';
import './checkout.css';
import './confirm.css';

export function formatDuration(s: number) {
  if (s === 1) return '1 second';
  if (s < 90) return `${s} seconds`;
  const m = Math.floor(s / 60);
  const r = s % 60;
  if (m < 60) return `${m} min ${r} s`;
  return `${Math.floor(m / 60)} h ${m % 60} min`;
}

export function RoutineList({ items, picks }: { items: LiteProduct[]; picks?: Record<string, string | null | undefined> | null }) {
  const { am, pm } = arrangeRoutine(items, picks ?? undefined);
  const col = (title: string, sub: string, list: LiteProduct[]) => (
    <section class="rs-col" aria-labelledby={`rs-${title}`}>
      <h3 id={`rs-${title}`} class="rs-col-title">
        <span class="mono">{title}</span> {sub}
      </h3>
      {list.length ? (
        <ol role="list" class="rs-steps">
          {list.map((p, i) => (
            <li class="rs-step">
              <span class="rs-n mono">{String(i + 1).padStart(2, '0')}</span>
              <img src={p.t2} width={64} height={64} alt="" loading="lazy" />
              <div>
                <p class="label">
                  {p.id} · {p.step.charAt(0).toUpperCase() + p.step.slice(1)}
                  {p.frequency ? ` · ${p.frequency}` : ''}
                </p>
                <p class="rs-name">
                  {p.brand} {p.short}
                </p>
                <p class="rs-how">{p.howToUse}</p>
              </div>
            </li>
          ))}
        </ol>
      ) : (
        <p class="muted rs-empty">Nothing in this order for the {sub.toLowerCase()} yet.</p>
      )}
    </section>
  );
  return (
    <div class="rs-cols">
      {col('AM', 'Morning', am)}
      {col('PM', 'Evening', pm)}
    </div>
  );
}

export default function Confirmation() {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [catalog, setCatalog] = useState<LiteProduct[] | null>(null);
  useEffect(() => {
    setOrder(readJSON<Order | null>('verum:order', null));
    loadCatalog().then(setCatalog).catch(() => setCatalog([]));
  }, []);

  if (order === undefined) return <p class="label">Loading your order…</p>;
  if (!order) {
    return (
      <div class="cf-none">
        <h2>No recent order on this device.</h2>
        <p class="muted">Orders are kept only in this browser. Start a new one in three taps.</p>
        <div class="co-empty-actions">
          <a class="btn btn--lg" href="/quiz">
            Find your routine in 30 seconds
          </a>
          <a class="btn btn--lg btn--quiet" href="/shop">
            Shop all products
          </a>
        </div>
      </div>
    );
  }

  const wa = `https://wa.me/9607000000?text=${encodeURIComponent(`Hi VERUM, this is about my order ${order.number}.`)}`;
  const map = new Map((catalog ?? []).map((p) => [p.id, p]));
  const bought = order.items.map((i) => map.get(i.id)).filter(Boolean) as LiteProduct[];
  const quiz = $quiz.get();
  const flow = order.flowSeconds
    ? `${order.flowSource === 'quiz' ? 'Quiz' : 'First add'} to order in ${formatDuration(order.flowSeconds)}.`
    : null;

  return (
    <div class="cf">
      <section class="cf-head" aria-labelledby="cf-title">
        <p class="cf-badge mono">
          <Icon name="check" size={16} /> {order.payment === 'bml' ? 'Order received, awaiting transfer check' : 'Payment approved (demo)'}
        </p>
        <h2 id="cf-title" class="cf-title">
          Order <span class="mono">{order.number}</span>
        </h2>
        <p class="cf-lede">
          Thank you, {order.contact.name.split(' ')[0]}. We will send updates to {order.contact.phone} on WhatsApp.
        </p>
        {flow && <p class="cf-speed mono">{flow}</p>}
        <div class="cf-actions">
          <a class="btn btn--lg" href={wa} target="_blank" rel="noopener">
            Message us on WhatsApp
          </a>
          <a class="btn btn--lg btn--quiet" href="#my-routine">
            Save my routine
          </a>
        </div>
        <p class="co-demo">This is a Nuit Works concept. No order is placed and no payment is taken.</p>
      </section>

      <div class="cf-grid">
        <section class="co-sec" aria-labelledby="cf-del">
          <h2 id="cf-del" class="co-h">{order.method === 'pickup' ? 'Pickup' : 'Delivery'}</h2>
          <dl class="cf-dl">
            <div>
              <dt>Method</dt>
              <dd>{order.methodLabel}</dd>
            </div>
            <div>
              <dt>Timing</dt>
              <dd>{order.timing}</dd>
            </div>
            {order.address && (
              <div>
                <dt>{order.method === 'pickup' ? 'Collect from' : order.method === 'islands' ? 'Island or resort' : 'Address'}</dt>
                <dd>{order.address}</dd>
              </div>
            )}
            <div>
              <dt>Payment</dt>
              <dd>
                {order.payment === 'card' ? 'Card (demo gateway)' : 'BML transfer. Use the order number as the reference.'}
                {order.slipName ? ` Slip attached: ${order.slipName} (kept in your browser).` : ''}
              </dd>
            </div>
          </dl>
        </section>

        <section class="co-sec" aria-labelledby="cf-sum">
          <h2 id="cf-sum" class="co-h">Summary</h2>
          <ul role="list" class="co-lines">
            {order.items.map((i) => (
              <li class="co-line">
                <span class="co-thumb">
                  <img src={i.thumb} width={56} height={56} alt="" />
                </span>
                <div>
                  <p class="co-line-name">
                    <span class="muted">{i.brand}</span> {i.name}
                  </p>
                  <p class="label">
                    {i.id} · {i.size} · Qty {i.qty}
                  </p>
                </div>
                <p class="mono co-line-price">{mvr(i.price * i.qty)}</p>
              </li>
            ))}
          </ul>
          <dl class="totals">
            <div>
              <dt>Subtotal</dt>
              <dd class="mono">{mvr(order.subtotal)}</dd>
            </div>
            <div class={order.discount ? 'is-saving' : ''}>
              <dt>Bundle discount {order.percent ? `(${order.steps} steps, ${order.percent}%)` : ''}</dt>
              <dd class="mono">{order.discount ? `−${mvr(order.discount)}` : mvr(0)}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>{order.method === 'islands' ? 'Quote on WhatsApp' : 'Free'}</dd>
            </div>
            <div class="totals-total">
              <dt>Total</dt>
              <dd class="mono">{mvr(order.total)}</dd>
            </div>
          </dl>
          <p class="label">Includes GST of {mvr2(order.gst)}.</p>
        </section>
      </div>

      <section id="my-routine" class="cf-routine" aria-labelledby="cf-rt">
        <div class="cf-rt-head">
          <div>
            <p class="eyebrow">Save my routine</p>
            <h2 id="cf-rt" class="cf-rt-title">
              Your AM and PM routine
            </h2>
          </div>
          <a class="btn btn--ghost" href="/my-routine">
            Open printable routine
          </a>
        </div>
        {catalog ? <RoutineList items={bought} picks={quiz?.picks} /> : <p class="label">Loading routine…</p>}
        <p class="label">Patch test anything new. Start acids and retinoids 2 to 3 times a week. Sunscreen every morning.</p>
      </section>
    </div>
  );
}
