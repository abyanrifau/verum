import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { loadCatalog, type LiteProduct } from '../lib/lite';
import { buildRoutine, answersSummary, type RoutinePlan, type Slot } from '../lib/quiz';
import { routineWarnings } from '../lib/routine';
import { bundle } from '../lib/bundle';
import { mvr } from '../lib/money';
import { skinTypes, priorities, tolerances } from '../data/taxonomy';
import { $quiz, $routine, type Picks, type QuizAnswers, type SlotKey } from '../stores/routine';
import { addToCart, announce, startFlow } from '../stores/cart';
import { Icon } from './icons';
import './quiz.css';

type Screen = 'q1' | 'q2' | 'q3' | 'results';
const QUESTIONS = [
  { id: 'q1', key: 'skin', title: 'Your skin type', hint: 'Pick the closest. You can change it later.', options: skinTypes.map((s) => ({ id: s.id, label: s.quiz, hint: s.hint })) },
  { id: 'q2', key: 'priority', title: 'Your priority', hint: 'What would you most like to change?', options: priorities.map((p) => ({ id: p.id, label: p.label, hint: p.hint })) },
  { id: 'q3', key: 'tolerance', title: 'Your tolerance', hint: 'How does your skin handle new products?', options: tolerances.map((t) => ({ id: t.id, label: t.label, hint: t.hint })) },
] as const;

const hashScreen = (): Screen => {
  const h = location.hash.replace('#', '');
  return h === 'q2' || h === 'q3' || h === 'results' ? h : 'q1';
};

export default function Quiz() {
  const [screen, setScreen] = useState<Screen>('q1');
  const [answers, setAnswers] = useState<Partial<QuizAnswers>>({});
  const [catalog, setCatalog] = useState<LiteProduct[] | null>(null);
  const [picks, setPicks] = useState<Picks>({});
  const [ready, setReady] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);

  useEffect(() => {
    loadCatalog().then(setCatalog).catch(() => setCatalog([]));
    const s = $quiz.get();
    const initial = hashScreen();
    if (s && (initial === 'results' || initial === 'q1') && !location.hash.includes('q1')) {
      setAnswers(s.answers);
      setPicks(s.picks);
      setScreen('results');
      history.replaceState(history.state, '', '#results');
    } else if (initial !== 'q1') {
      // Deep link to a later question without earlier answers: start at the top.
      setScreen('q1');
      history.replaceState(history.state, '', location.pathname);
    }
    setReady(true);
    const onPop = () => {
      const next = hashScreen();
      setScreen((cur) => {
        if (next === 'results' && !$quiz.get()) return cur;
        return next;
      });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Move focus to each new question so keyboard and screen reader users follow along.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headRef.current?.focus({ preventScroll: false });
    if (screen !== 'results') {
      const n = Number(screen[1]);
      announce(`Question ${n} of 3`);
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [screen]);

  const complete = answers.skin && answers.priority && answers.tolerance ? (answers as QuizAnswers) : null;
  const plan: RoutinePlan | null = useMemo(
    () => (complete && catalog?.length ? buildRoutine(catalog, complete, picks) : null),
    [complete?.skin, complete?.priority, complete?.tolerance, catalog, picks],
  );

  function answer(qi: number, value: string) {
    const key = QUESTIONS[qi].key;
    const next = { ...answers, [key]: value } as Partial<QuizAnswers>;
    setAnswers(next);
    if (qi === 0) startFlow('quiz', true);
    if (qi < 2) {
      const to = (`q${qi + 2}`) as Screen;
      history.pushState(null, '', `#${to}`);
      setScreen(to);
    } else {
      const full = next as QuizAnswers;
      const prevSaved = $quiz.get();
      const keep = prevSaved && sameAnswers(prevSaved.answers, full) ? prevSaved.picks : {};
      setPicks(keep);
      $quiz.set({ answers: full, picks: keep, at: Date.now() });
      history.pushState(null, '', '#results');
      setScreen('results');
    }
  }

  // Persist resolved picks once the plan exists.
  useEffect(() => {
    if (!plan || !complete) return;
    const cur = $quiz.get();
    if (!cur || JSON.stringify(cur.picks) !== JSON.stringify(plan.picks)) {
      $quiz.set({ answers: complete, picks: plan.picks, at: cur?.at ?? Date.now() });
    }
  }, [plan]);

  function retake() {
    setAnswers({});
    setPicks({});
    history.pushState(null, '', '#q1');
    setScreen('q1');
  }

  if (!ready) return <QuestionView qi={0} answers={{}} onAnswer={() => {}} headRef={headRef} />;

  if (screen === 'results') {
    if (!complete) return <QuestionView qi={0} answers={answers} onAnswer={answer} headRef={headRef} />;
    return (
      <Results
        plan={plan}
        catalog={catalog}
        answers={complete}
        headRef={headRef}
        onSwap={(key, id) => setPicks({ ...(plan?.picks ?? {}), [key]: id })}
        onRetake={retake}
      />
    );
  }
  const qi = Number(screen[1]) - 1;
  // Guard: a later question needs the earlier answers.
  if (qi === 1 && !answers.skin) return <QuestionView qi={0} answers={answers} onAnswer={answer} headRef={headRef} />;
  if (qi === 2 && !answers.priority) return <QuestionView qi={answers.skin ? 1 : 0} answers={answers} onAnswer={answer} headRef={headRef} />;
  return <QuestionView qi={qi} answers={answers} onAnswer={answer} headRef={headRef} onBack={qi > 0 ? () => history.back() : undefined} />;
}

const sameAnswers = (a: QuizAnswers, b: QuizAnswers) => a.skin === b.skin && a.priority === b.priority && a.tolerance === b.tolerance;

function Progress({ at }: { at: number }) {
  return (
    <div class="qz-progress" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span class={`qz-seg ${i < at ? 'is-done' : ''} ${i === at ? 'is-now' : ''}`} />
      ))}
    </div>
  );
}

function QuestionView({
  qi,
  answers,
  onAnswer,
  onBack,
  headRef,
}: {
  qi: number;
  answers: Partial<QuizAnswers>;
  onAnswer: (qi: number, v: string) => void;
  onBack?: () => void;
  headRef: { current: HTMLHeadingElement | null };
}) {
  const q = QUESTIONS[qi];
  const chosen = answers[q.key as keyof QuizAnswers];
  return (
    <div class="qz">
      <Progress at={qi} />
      <div class="qz-meta">
        <p class="mono qz-count">
          Question {qi + 1} of 3
        </p>
        {onBack && (
          <button type="button" class="qz-back" onClick={onBack}>
            ← Back
          </button>
        )}
      </div>
      <div class="qz-q" role="group" aria-labelledby={`qz-h-${q.id}`}>
        <h2 id={`qz-h-${q.id}`} class="qz-title" tabIndex={-1} ref={headRef}>
          <span class="mono qz-n">{String(qi + 1).padStart(2, '0')}</span> {q.title}
        </h2>
        <p class="qz-hint">{q.hint}</p>
        <ul role="list" class={`qz-options qz-options--${q.options.length}`}>
          {q.options.map((o, i) => (
            <li>
              <button type="button" class="qz-opt" aria-pressed={chosen === o.id} onClick={() => onAnswer(qi, o.id)}>
                <span class="mono qz-opt-n" aria-hidden="true">
                  {String.fromCharCode(65 + i)}
                </span>
                <span class="qz-opt-text">
                  <span class="qz-opt-label">{o.label}</span>
                  <span class="qz-opt-hint">{o.hint}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <p class="label qz-foot">No email. No account. Your answers stay on this device.</p>
    </div>
  );
}

function Results({
  plan,
  catalog,
  answers,
  headRef,
  onSwap,
  onRetake,
}: {
  plan: RoutinePlan | null;
  catalog: LiteProduct[] | null;
  answers: QuizAnswers;
  headRef: { current: HTMLHeadingElement | null };
  onSwap: (key: SlotKey, id: string) => void;
  onRetake: () => void;
}) {
  const map = useMemo(() => new Map((catalog ?? []).map((p) => [p.id, p])), [catalog]);
  if (!plan) {
    return (
      <div class="qz-results">
        <h2 class="qz-title" tabIndex={-1} ref={headRef}>
          Building your routine…
        </h2>
      </div>
    );
  }
  const amIds = plan.slots.am.map((s) => plan.picks[s.key]).filter(Boolean) as string[];
  const pmIds = plan.slots.pm.map((s) => plan.picks[s.key]).filter(Boolean) as string[];
  const allIds = [...new Set([...amIds, ...pmIds])];
  const calc = (ids: string[]) => bundle([...new Set(ids)].map((id) => ({ id, qty: 1, price: map.get(id)?.price ?? 0 })));
  const full = calc(allIds);
  const am = calc(amIds);
  const pm = calc(pmIds);
  const warnings = routineWarnings(
    amIds.map((id) => map.get(id)!).filter(Boolean),
    [...new Set(pmIds)].map((id) => map.get(id)!).filter(Boolean),
  );

  const addAll = () => addToCart(allIds, { open: true });
  const toBuilder = () => {
    $routine.set({ ...plan.picks });
  };

  return (
    <div class="qz-results">
      <div class="qz-res-head">
        <div>
          <p class="mono qz-count">Your routine · {answersSummary(answers)}</p>
          <h2 class="qz-res-title" tabIndex={-1} ref={headRef}>
            {allIds.length} products, AM and PM.
          </h2>
        </div>
        <button type="button" class="qz-back" onClick={onRetake}>
          Retake the quiz
        </button>
      </div>

      <section class="qz-total" aria-label="Routine total">
        <dl class="qz-total-dl">
          <div>
            <dt>Subtotal</dt>
            <dd class="mono">{mvr(full.subtotal)}</dd>
          </div>
          <div class="is-saving">
            <dt>
              Bundle discount, {full.percent}%
            </dt>
            <dd class="mono">−{mvr(full.discount)}</dd>
          </div>
          <div class="qz-total-row">
            <dt>Total</dt>
            <dd class="mono">{mvr(full.total)}</dd>
          </div>
        </dl>
        <p class="qz-saved mono" aria-live="polite">
          You save {mvr(full.discount)}
        </p>
        <button type="button" class="btn btn--xl btn--block" onClick={addAll}>
          Add full routine to cart <span class="price">{mvr(full.total)}</span>
        </button>
        <div class="qz-secondary">
          <button type="button" class="btn btn--quiet" onClick={() => addToCart(amIds, { open: true })}>
            Add AM only <span class="price">{mvr(am.total)}</span>
          </button>
          <button type="button" class="btn btn--quiet" onClick={() => addToCart([...new Set(pmIds)], { open: true })}>
            Add PM only <span class="price">{mvr(pm.total)}</span>
          </button>
          <a href="/routine" class="btn btn--quiet" onClick={toBuilder}>
            Open in routine builder
          </a>
        </div>
      </section>

      {warnings.length > 0 && (
        <ul role="list" class="qz-warn">
          {warnings.map((w) => (
            <li class={`qz-warn-${w.level}`}>
              <Icon name="warn" size={16} /> {w.text}
            </li>
          ))}
        </ul>
      )}

      <div class="qz-cols">
        <RoutineCol title="AM" sub="Morning" slots={plan.slots.am} plan={plan} map={map} onSwap={onSwap} />
        <RoutineCol title="PM" sub="Evening" slots={plan.slots.pm} plan={plan} map={map} onSwap={onSwap} amPicks={plan.picks} />
      </div>
      {answers.tolerance === 'reacts' && (
        <p class="label qz-note">Exfoliation is left out because your skin reacts easily. You can add a gentle PHA later in the routine builder.</p>
      )}
      <p class="label qz-note">
        Ranked by a scoring function: skin type, your priority, your tolerance and fragrance. Bestsellers only break ties. No brand pays for placement.
      </p>

      <div class="qz-sticky">
        <button type="button" class="btn btn--lg btn--block" onClick={addAll}>
          Add full routine <span class="price">{mvr(full.total)}</span>
        </button>
      </div>
    </div>
  );
}

function RoutineCol({
  title,
  sub,
  slots,
  plan,
  map,
  onSwap,
  amPicks,
}: {
  title: string;
  sub: string;
  slots: Slot[];
  plan: RoutinePlan;
  map: Map<string, LiteProduct>;
  onSwap: (key: SlotKey, id: string) => void;
  amPicks?: Picks;
}) {
  return (
    <section class="qz-col" aria-labelledby={`col-${title}`}>
      <h3 id={`col-${title}`} class="qz-col-title">
        <span class="mono">{title}</span> {sub}
      </h3>
      <ol role="list" class="qz-steps">
        {slots.map((slot, i) => {
          const id = plan.picks[slot.key];
          const p = id ? map.get(id) : undefined;
          const ranked = plan.ranked[slot.key] ?? [];
          const top = ranked.find((r) => r.product.id === id);
          const same = amPicks && slot.key.startsWith('pm') && Object.entries(amPicks).some(([k, v]) => k.startsWith('am') && v === id);
          return (
            <li class="qz-step">
              <p class="qz-step-label mono">
                {String(i + 1).padStart(2, '0')} {slot.title}
                <span class="muted"> · {slot.note}</span>
              </p>
              {p ? (
                <div class="qz-pick">
                  <a href={p.url} class="qz-pick-img" tabIndex={-1} aria-hidden="true">
                    <img src={p.t2} width={80} height={80} alt="" loading="lazy" decoding="async" />
                  </a>
                  <div class="qz-pick-main">
                    <p class="label">
                      {p.id} · {p.brand}
                    </p>
                    <a class="qz-pick-name" href={p.url}>
                      {p.short}
                    </a>
                    <p class="qz-pick-price mono">
                      {mvr(p.price)} <span class="muted">· {p.size}</span>
                      {same && <span class="qz-same"> · Same as AM, counted once</span>}
                    </p>
                    {top && top.reasons.length > 0 && <p class="qz-why">Ranked high because: {top.reasons.join(', ')}.</p>}
                  </div>
                </div>
              ) : (
                <p class="muted">No in-stock match for this step yet.</p>
              )}
              {ranked.filter((r) => r.product.id !== id).length > 0 && (
                <div class="qz-alts" role="group" aria-label={`Alternatives for ${title} ${slot.title}`}>
                  <span class="label">Swap:</span>
                  {ranked
                    .filter((r) => r.product.id !== id)
                    .slice(0, 2)
                    .map((r) => (
                      <button
                        type="button"
                        class="chip qz-alt"
                        onClick={() => {
                          onSwap(slot.key, r.product.id);
                          announce(`Swapped in ${r.product.brand} ${r.product.short} for ${title} ${slot.title}.`);
                        }}
                      >
                        <img src={r.product.t1} width={24} height={24} alt="" loading="lazy" />
                        {r.product.short} <span class="mono">{mvr(r.product.price)}</span>
                      </button>
                    ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
