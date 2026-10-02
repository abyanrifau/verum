import { useEffect, useState } from 'preact/hooks';
import { readJSON } from '../stores/engine';
import { $quiz, $routine } from '../stores/routine';
import { loadCatalog, type LiteProduct } from '../lib/lite';
import { RoutineList } from './Confirmation';
import type { Order } from './Checkout';
import './confirm.css';

export default function RoutineSheet() {
  const [catalog, setCatalog] = useState<LiteProduct[] | null>(null);
  const [src, setSrc] = useState<{ label: string; ids: string[]; picks: Record<string, string | null | undefined> | null } | null | undefined>(undefined);

  useEffect(() => {
    loadCatalog().then(setCatalog).catch(() => setCatalog([]));
    const order = readJSON<Order | null>('verum:order', null);
    const quiz = $quiz.get();
    const routine = $routine.get();
    if (order) setSrc({ label: `From order ${order.number}`, ids: order.items.map((i) => i.id), picks: quiz?.picks ?? null });
    else if (quiz) setSrc({ label: 'From your quiz result', ids: Object.values(quiz.picks).filter(Boolean) as string[], picks: quiz.picks });
    else if (Object.values(routine).some(Boolean)) setSrc({ label: 'From your routine builder', ids: Object.values(routine).filter(Boolean) as string[], picks: routine });
    else setSrc(null);
  }, []);

  if (src === undefined || (src && !catalog)) return <p class="label">Loading routine…</p>;
  if (!src) {
    return (
      <div class="cf-none">
        <p>No routine saved on this device yet.</p>
        <a class="btn btn--lg" href="/quiz">
          Find your routine in 30 seconds
        </a>
      </div>
    );
  }
  const map = new Map(catalog!.map((p) => [p.id, p]));
  const items = [...new Set(src.ids)].map((id) => map.get(id)).filter(Boolean) as LiteProduct[];
  return (
    <div class="rs">
      <div class="rs-bar no-print">
        <p class="label">{src.label}</p>
        <button type="button" class="btn" onClick={() => window.print()}>
          Print this routine
        </button>
      </div>
      <RoutineList items={items} picks={src.picks} />
      <p class="label">Patch test anything new. Start acids and retinoids 2 to 3 times a week. Sunscreen every morning, reapply outdoors.</p>
    </div>
  );
}
