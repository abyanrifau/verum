import { useStore } from '@nanostores/preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { loadCatalog, type LiteProduct } from '../lib/lite';
import { slotsFor, scoreProduct, type Slot } from '../lib/quiz';
import { routineWarnings } from '../lib/routine';
import { bundle, tierMessage } from '../lib/bundle';
import { mvr } from '../lib/money';
import { skinTypes, concerns } from '../data/taxonomy';
import type { Concern, Format, SkinType } from '../data/types';
import { $quiz, $routine, type Picks, type SlotKey } from '../stores/routine';
import { addToCart, announce } from '../stores/cart';
import { TierMeter } from './cart/CartContents';
import { Icon } from './icons';
import './routine.css';

const SLOTS = slotsFor('most');
const ALL_SLOTS = [...SLOTS.am, ...SLOTS.pm];

const BUILDER_FORMATS: Record<SlotKey, Format[]> = {
  'am-cleanse': ['gel-cleanser', 'foam-cleanser', 'cream-cleanser', 'micellar-water'],
  'pm-cleanse': ['oil-cleanser', 'balm-cleanser', 'micellar-water', 'gel-cleanser', 'foam-cleanser', 'cream-cleanser'],
  'am-treat': ['serum', 'essence', 'ampoule', 'patch'],
  'pm-treat': ['serum', 'essence', 'ampoule', 'patch'],
  'am-hydrate': ['moisturiser', 'toner'],
  'pm-hydrate': ['moisturiser', 'sleeping-mask', 'toner'],
  'am-protect': ['sunscreen'],
  'pm-protect': ['sunscreen'],
  'pm-exfoliate': ['exfoliant', 'wash-off-mask'],
  'am-exfoliate': ['exfoliant'],
};

const fits = (p: LiteProduct, s: Slot) =>
  p.step === s.step && (p.time === 'AM+PM' || p.time === s.time) && (BUILDER_FORMATS[s.key] ?? []).includes(p.format) && p.stock > 0;

const STEP_VERB: Record<string, string> = {
  cleanse: 'a cleanser',
  exfoliate: 'an exfoliant',
  treat: 'a treatment',
  hydrate: 'a moisturiser or toner',
  protect: 'a sunscreen',
};

function readUrl(): Picks | null {
  const q = new URLSearchParams(location.search);
  const out: Picks = {};
  let any = false;
  for (const s of ALL_SLOTS) {
    const v = q.get(s.key);
    if (v) {
      out[s.key] = v.toUpperCase();
      any = true;
    }
  }
  return any ? out : null;
}

function writeUrl(p: Picks) {
  const q = new URLSearchParams();
  for (const s of ALL_SLOTS) if (p[s.key]) q.set(s.key, p[s.key]!.toLowerCase());
  const url = `${location.pathname}${q.toString() ? `?${q}` : ''}`;
  history.replaceState(history.state, '', url);
  return `${location.origin}${url}`;
}

export default function RoutineBuilder() {
  const picks = useStore($routine);
  const quiz = useStore($quiz);
  const [catalog, setCatalog] = useState<LiteProduct[] | null>(null);
  const [picker, setPicker] = useState<Slot | null>(null);
  const [shareMsg, setShareMsg] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    loadCatalog().then(setCatalog).catch(() => setCatalog([]));
    const fromUrl = readUrl();
    if (fromUrl) $routine.set(fromUrl);
    setReady(true);
  }, []);

  const map = useMemo(() => new Map((catalog ?? []).map((p) => [p.id, p])), [catalog]);
  const valid: Picks = {};
  for (const s of ALL_SLOTS) {
    const id = picks[s.key];
    if (id && map.has(id)) valid[s.key] = id;
  }
  useEffect(() => {
    if (ready && catalog) writeUrl(valid);
  }, [JSON.stringify(valid), ready, catalog]);

  const amList = SLOTS.am.map((s) => valid[s.key]).filter(Boolean).map((id) => map.get(id!)!) as LiteProduct[];
  const pmList = SLOTS.pm.map((s) => valid[s.key]).filter(Boolean).map((id) => map.get(id!)!) as LiteProduct[];
  const ids = [...new Set([...amList, ...pmList].map((p) => p.id))];
  const b = bundle(ids.map((id) => ({ id, qty: 1, price: map.get(id)!.price })));
  const warnings = routineWarnings(amList, pmList);

  const choose = (slot: Slot, id: string | null) => {
    $routine.set({ ...$routine.get(), [slot.key]: id });
    const p = id ? map.get(id) : null;
    const next = bundle(
      [...new Set(Object.entries({ ...valid, [slot.key]: id }).map(([, v]) => v).filter(Boolean))].map((x) => ({ id: x!, qty: 1, price: map.get(x!)?.price ?? 0 })),
    );
    announce(`${p ? `${p.short} set for ${slot.time} ${slot.title}.` : `${slot.time} ${slot.title} cleared.`} ${next.steps} steps, total ${mvr(next.total)}.`);
  };

  const fillFromQuiz = () => {
    if (quiz) $routine.set({ ...quiz.picks });
  };

  const share = async () => {
    const url = writeUrl(valid);
    try {
      await navigator.clipboard.writeText(url);
      setShareMsg('Link copied. Anyone with it sees this routine.');
    } catch {
      setShareMsg(url);
    }
    announce('Routine link copied.');
  };

  if (!catalog) return <p class="label rb-loading">Loading products…</p>;

  return (
    <div class="rb">
      <div class="rb-main">
        {quiz && !ids.length && (
          <div class="rb-prefill">
            <p>You have a saved quiz result. Start from it and adjust.</p>
            <button type="button" class="btn" onClick={fillFromQuiz}>
              Fill from my quiz result
            </button>
          </div>
        )}
        {warnings.length > 0 && (
          <ul role="list" class="rb-warn" aria-label="Routine notes">
            {warnings.map((w) => (
              <li class={`rb-warn-${w.level}`}>
                <Icon name="warn" size={16} /> <span>{w.text}</span>
              </li>
            ))}
          </ul>
        )}
        <div class="rb-cols">
          {(['am', 'pm'] as const).map((col) => (
            <section class="rb-col" aria-labelledby={`rb-${col}`}>
              <h2 id={`rb-${col}`} class="rb-col-title">
                <span class="mono">{col.toUpperCase()}</span> {col === 'am' ? 'Morning' : 'Evening'}
              </h2>
              <ol role="list" class="rb-slots">
                {SLOTS[col].map((slot, i) => {
                  const id = valid[slot.key];
                  const p = id ? map.get(id) : undefined;
                  return (
                    <li class={`rb-slot ${p ? 'is-filled' : ''}`}>
                      <p class="rb-slot-label mono">
                        {String(i + 1).padStart(2, '0')} {slot.title}
                        <span class="muted"> · {slot.note}</span>
                      </p>
                      {p ? (
                        <div class="rb-pick">
                          <img src={p.t2} width={64} height={64} alt="" loading="lazy" />
                          <div class="rb-pick-main">
                            <p class="label">
                              {p.id} · {p.brand}
                            </p>
                            <a href={p.url} class="rb-pick-name">
                              {p.short}
                            </a>
                            <p class="mono rb-pick-price">{mvr(p.price)}</p>
                          </div>
                          <div class="rb-pick-actions">
                            <button type="button" class="btn btn--sm btn--quiet" onClick={() => setPicker(slot)}>
                              Change<span class="sr-only"> {col.toUpperCase()} {slot.title}</span>
                            </button>
                            <button type="button" class="cart-remove" onClick={() => choose(slot, null)}>
                              Remove<span class="sr-only"> {p.short}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button type="button" class="rb-empty" onClick={() => setPicker(slot)}>
                          <Icon name="plus" size={18} /> Choose {STEP_VERB[slot.step]}
                          <span class="sr-only"> for {col.toUpperCase()}</span>
                        </button>
                      )}
                    </li>
                  );
                })}
              </ol>
            </section>
          ))}
        </div>
      </div>

      <aside class="rb-summary" aria-label="Routine summary">
        <dl class="totals">
          <div>
            <dt>Steps</dt>
            <dd class="mono">{b.steps}</dd>
          </div>
          <div>
            <dt>Subtotal</dt>
            <dd class="mono">{mvr(b.subtotal)}</dd>
          </div>
          <div class={b.discount ? 'is-saving' : ''}>
            <dt>Saving {b.percent ? `(${b.percent}%)` : ''}</dt>
            <dd class="mono">{b.discount ? `−${mvr(b.discount)}` : mvr(0)}</dd>
          </div>
          <div class="totals-total">
            <dt>Total</dt>
            <dd class="mono">{mvr(b.total)}</dd>
          </div>
        </dl>
        <TierMeter steps={b.steps} compact />
        <button type="button" class="btn btn--xl btn--block rb-add" disabled={!ids.length} onClick={() => addToCart(ids, { open: true })}>
          Add routine to cart <span class="price">{mvr(b.total)}</span>
        </button>
        <button type="button" class="btn btn--quiet btn--block" disabled={!ids.length} onClick={share}>
          <Icon name="copy" size={16} /> Copy shareable routine link
        </button>
        {shareMsg && (
          <p class="label rb-share" role="status">
            {shareMsg}
          </p>
        )}
        <a class="link rb-print" href="/my-routine">
          Printable routine
        </a>
      </aside>

      <div class="rb-sticky" aria-hidden={ids.length ? undefined : 'true'}>
        <p class="mono rb-sticky-meta">
          {b.steps} steps · {b.percent ? `−${b.percent}% · ` : ''}
          {mvr(b.total)}
          <span class="rb-sticky-tier">{tierMessage(b)}</span>
        </p>
        <button type="button" class="btn btn--lg" disabled={!ids.length} tabIndex={ids.length ? 0 : -1} onClick={() => addToCart(ids, { open: true })}>
          Add routine
        </button>
      </div>

      {picker && (
        <Picker
          slot={picker}
          catalog={catalog}
          current={valid[picker.key] ?? null}
          defaultSkin={quiz?.answers.skin ?? null}
          defaultConcern={null}
          quiz={quiz?.answers ?? null}
          onPick={(id) => {
            choose(picker, id);
            setPicker(null);
          }}
          onClose={() => setPicker(null)}
        />
      )}
    </div>
  );
}

function Picker({
  slot,
  catalog,
  current,
  defaultSkin,
  quiz,
  onPick,
  onClose,
}: {
  slot: Slot;
  catalog: LiteProduct[];
  current: string | null;
  defaultSkin: SkinType | null;
  defaultConcern: Concern | null;
  quiz: import('../stores/routine').QuizAnswers | null;
  onPick: (id: string) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [skin, setSkin] = useState<SkinType | ''>(defaultSkin ?? '');
  const [concern, setConcern] = useState<Concern | ''>('');
  useEffect(() => {
    ref.current?.showModal();
    const d = ref.current!;
    const close = () => onClose();
    d.addEventListener('close', close);
    return () => d.removeEventListener('close', close);
  }, []);

  const list = catalog
    .filter((p) => fits(p, slot))
    .filter((p) => !skin || p.skin.includes(skin))
    .filter((p) => !concern || p.concerns.includes(concern))
    .map((p) => {
      const r = quiz ? scoreProduct(p, quiz, slot) : null;
      return { p, score: r ? r.score : (60 - p.sales) / 10, reasons: r?.reasons ?? [] };
    })
    .sort((a, b) => b.score - a.score);

  return (
    <dialog ref={ref} class="rb-picker" aria-labelledby="rb-picker-title" onClick={(e) => e.target === ref.current && ref.current?.close()}>
      <div class="rb-picker-inner">
        <header class="rb-picker-head">
          <h2 id="rb-picker-title">
            <span class="mono">{slot.time}</span> {slot.title}: choose {STEP_VERB[slot.step]}
          </h2>
          <button type="button" class="icon-btn" aria-label="Close picker" onClick={() => ref.current?.close()}>
            <Icon name="close" />
          </button>
        </header>
        <div class="rb-filters">
          <div class="field">
            <label for="rb-skin">Skin type</label>
            <select id="rb-skin" class="select" value={skin} onChange={(e) => setSkin((e.currentTarget as HTMLSelectElement).value as SkinType)}>
              <option value="">All skin types</option>
              {skinTypes.map((s) => (
                <option value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>
          <div class="field">
            <label for="rb-concern">Concern</label>
            <select id="rb-concern" class="select" value={concern} onChange={(e) => setConcern((e.currentTarget as HTMLSelectElement).value as Concern)}>
              <option value="">Any concern</option>
              {concerns.map((c) => (
                <option value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
        <p class="label rb-count" role="status">
          {list.length} {list.length === 1 ? 'product fits' : 'products fit'} this step{quiz ? ', ranked for your quiz answers' : ', ranked by what sells'}.
        </p>
        <ul role="list" class="rb-options">
          {list.map(({ p, reasons }) => (
            <li class={`rb-option ${current === p.id ? 'is-current' : ''}`}>
              <img src={p.t2} width={64} height={64} alt="" loading="lazy" />
              <div class="rb-option-main">
                <p class="label">
                  {p.id} · {p.brand} · {p.size}
                </p>
                <p class="rb-option-name">{p.short}</p>
                {reasons.length > 0 && <p class="rb-why">Fits because: {reasons.join(', ')}.</p>}
              </div>
              <div class="rb-option-buy">
                <p class="mono">{mvr(p.price)}</p>
                <button type="button" class="btn btn--sm" onClick={() => onPick(p.id)} aria-label={`${current === p.id ? 'Chosen' : 'Choose'}: ${p.brand} ${p.short}, ${mvr(p.price)}`}>
                  {current === p.id ? 'Chosen' : 'Choose'}
                </button>
              </div>
            </li>
          ))}
          {!list.length && <li class="muted rb-none">Nothing matches both filters. Clear one to see more.</li>}
        </ul>
      </div>
    </dialog>
  );
}
