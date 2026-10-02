import { useEffect, useRef, useState } from 'preact/hooks';
import type { Goal, Ingredient } from '../data/types';
import { goals } from '../data/taxonomy';
import { pairVerdict } from '../lib/routine';
import { addToCart } from '../stores/cart';
import { mvr } from '../lib/money';
import './explorer.css';

export interface ExplorerProduct {
  id: string;
  slug: string;
  short: string;
  brand: string;
  price: number;
  size: string;
  url: string;
  t1: string;
  t2: string;
  ings: Record<string, string | null>;
}

interface Props {
  ingredients: Ingredient[];
  products: ExplorerProduct[];
}

const VERDICT = {
  fine: { label: 'Fine together', tone: 'fine' },
  split: { label: 'Best split AM and PM', tone: 'split' },
  avoid: { label: 'Not recommended together', tone: 'avoid' },
} as const;

export default function IngredientExplorer({ ingredients, products }: Props) {
  const [goal, setGoal] = useState<Goal | 'all'>('all');
  const [sel, setSel] = useState<string | null>(null);
  const [a, setA] = useState('retinol');
  const [b, setB] = useState('aha');
  const panel = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const i = q.get('i');
    const g = q.get('goal') as Goal | null;
    if (g && goals.some((x) => x.id === g)) setGoal(g);
    if (i && ingredients.some((x) => x.slug === i)) {
      setSel(i);
      if (window.matchMedia('(max-width: 899px)').matches)
        requestAnimationFrame(() => panel.current?.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior }));
    }
  }, []);

  const pick = (slug: string) => {
    setSel(slug);
    const q = new URLSearchParams(location.search);
    q.set('i', slug);
    history.replaceState(history.state, '', `${location.pathname}?${q}`);
    requestAnimationFrame(() => {
      if (window.matchMedia('(max-width: 899px)').matches) panel.current?.scrollIntoView({ block: 'start' });
      heading.current?.focus({ preventScroll: true });
    });
  };

  const shown = ingredients.filter((i) => goal === 'all' || i.goals.includes(goal));
  const ing = sel ? ingredients.find((i) => i.slug === sel) : null;
  const contains = ing ? products.filter((p) => ing.slug in p.ings) : [];
  const count = (slug: string) => products.filter((p) => slug in p.ings).length;
  const nameOf = (slug: string) => ingredients.find((i) => i.slug === slug)?.name ?? slug;
  const v = pairVerdict(a, b);

  return (
    <div class="ix">
      <div class="ix-filter" role="group" aria-label="Filter by what you want an ingredient to do">
        <button type="button" class="chip" aria-pressed={goal === 'all'} onClick={() => setGoal('all')}>
          All <span class="mono">{ingredients.length}</span>
        </button>
        {goals.map((g) => (
          <button type="button" class="chip" aria-pressed={goal === g.id} onClick={() => setGoal(g.id)}>
            {g.label} <span class="mono">{ingredients.filter((i) => i.goals.includes(g.id)).length}</span>
          </button>
        ))}
      </div>
      <p class="label ix-count" role="status">
        {shown.length} ingredients{goal !== 'all' ? ` that ${goals.find((g) => g.id === goal)!.label.toLowerCase()}` : ''}
      </p>

      <div class="ix-layout">
        <ul role="list" class="ix-grid">
          {shown.map((i) => (
            <li>
              <button type="button" class={`ix-tile ${sel === i.slug ? 'is-sel' : ''}`} aria-pressed={sel === i.slug} onClick={() => pick(i.slug)}>
                <span class="ix-kind mono">
                  {i.kind} · {i.time}
                </span>
                <span class="ix-name">{i.name}</span>
                <span class="ix-goals">{i.goals.map((g) => goals.find((x) => x.id === g)?.label).join(' · ')}</span>
                <span class="ix-n mono">
                  {count(i.slug)} {count(i.slug) === 1 ? 'product' : 'products'}
                </span>
              </button>
            </li>
          ))}
        </ul>

        <div class="ix-panel" ref={panel} aria-live="off">
          {!ing ? (
            <div class="ix-empty">
              <p class="ix-empty-title">Select an ingredient</p>
              <p class="muted">See what it does, who it suits, when to use it, what not to layer it with, and every product we stock that contains it.</p>
            </div>
          ) : (
            <article class="ix-detail" aria-labelledby="ix-h">
              <p class="mono ix-kind">
                {ing.kind} · {ing.time}
              </p>
              <h2 id="ix-h" class="ix-title" tabIndex={-1} ref={heading}>
                {ing.name}
              </h2>
              <p class="ix-answer">{ing.answer}</p>
              <dl class="ix-dl">
                <div>
                  <dt>What it does</dt>
                  <dd>{ing.whatItDoes}</dd>
                </div>
                <div>
                  <dt>Suits</dt>
                  <dd>{ing.suits}</dd>
                </div>
                <div>
                  <dt>Be careful</dt>
                  <dd>{ing.careful}</dd>
                </div>
                <div>
                  <dt>AM or PM</dt>
                  <dd>{ing.timeNote}</dd>
                </div>
                <div>
                  <dt>Don’t layer with</dt>
                  <dd>
                    {ing.pairs.length ? (
                      <ul role="list" class="ix-pairs">
                        {ing.pairs.map((p) => (
                          <li>
                            <strong>{nameOf(p.with)}</strong> <span class={`ix-v ix-v--${p.verdict}`}>{VERDICT[p.verdict].label}</span>
                            <br />
                            {p.note}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'No common conflicts. It layers well with most routines.'
                    )}
                  </dd>
                </div>
              </dl>
              <h3 class="ix-sub">
                Products with {ing.name.toLowerCase()} <span class="mono">({contains.length})</span>
              </h3>
              <ul role="list" class="ix-products">
                {contains.map((p) => (
                  <li class="ix-prod">
                    <img src={p.t1} srcset={`${p.t1} 96w, ${p.t2} 192w`} sizes="56px" width={56} height={56} alt="" loading="lazy" />
                    <div class="ix-prod-main">
                      <p class="label">
                        {p.id} · {p.brand} · {p.ings[ing.slug] ?? 'Strength not published'}
                      </p>
                      <a href={p.url} class="ix-prod-name">
                        {p.short}
                      </a>
                    </div>
                    <div class="ix-prod-buy">
                      <span class="mono">{mvr(p.price)}</span>
                      <button type="button" class="btn btn--sm" onClick={() => addToCart(p.id)} aria-label={`Add to cart: ${p.brand} ${p.short}, ${mvr(p.price)}`}>
                        Add to cart
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <a class="link-arrow" href={`/ingredients/${ing.slug}`}>
                Full guide to {ing.name.toLowerCase()}
              </a>
            </article>
          )}
        </div>
      </div>

      <section class="ix-check" aria-labelledby="ix-check-h">
        <h2 id="ix-check-h" class="ix-check-title">
          Check a pair
        </h2>
        <p class="muted">Pick two ingredients to see if they belong in the same routine.</p>
        <div class="ix-check-row">
          <div class="field">
            <label for="ix-a">First ingredient</label>
            <select id="ix-a" class="select" value={a} onChange={(e) => setA((e.currentTarget as HTMLSelectElement).value)}>
              {ingredients.map((i) => (
                <option value={i.slug}>{i.name}</option>
              ))}
            </select>
          </div>
          <span class="ix-plus mono" aria-hidden="true">
            +
          </span>
          <div class="field">
            <label for="ix-b">Second ingredient</label>
            <select id="ix-b" class="select" value={b} onChange={(e) => setB((e.currentTarget as HTMLSelectElement).value)}>
              {ingredients.map((i) => (
                <option value={i.slug}>{i.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div class={`ix-verdict ix-verdict--${v.verdict}`} role="status" aria-live="polite">
          <p class="ix-verdict-label">{VERDICT[v.verdict].label}</p>
          <p>{v.note}</p>
        </div>
      </section>
    </div>
  );
}
