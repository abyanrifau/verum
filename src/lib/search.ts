/** Small typo-tolerant search. The index is tiny, so brute force is fast enough. */
export interface SearchDoc {
  type: 'product' | 'brand' | 'ingredient';
  id: string;
  title: string;
  sub: string;
  url: string;
  terms: string;
  price?: number;
  thumb?: string;
  thumb2?: string;
  code?: string;
}

export const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9%.+]+/g, ' ')
    .trim();

/** Optimal string alignment distance, capped. */
function distance(a: string, b: string, max: number): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const prev2 = new Array(b.length + 1).fill(0);
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const cur = [i];
    let rowMin = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, prev2[j - 2] + 1);
      cur[j] = v;
      if (v < rowMin) rowMin = v;
    }
    if (rowMin > max) return max + 1;
    for (let j = 0; j <= b.length; j++) prev2[j] = prev[j];
    prev = cur;
  }
  return prev[b.length];
}

function tokenScore(q: string, tokens: string[]): number {
  let best = 0;
  for (const t of tokens) {
    if (t === q) return 3;
    if (t.startsWith(q) && q.length >= 2) best = Math.max(best, 2.4);
    else if (q.length >= 3 && t.includes(q)) best = Math.max(best, 1.5);
    else if (q.length >= 4) {
      const max = q.length >= 8 ? 2 : 1;
      const cmp = t.length > q.length + 1 ? t.slice(0, q.length + 1) : t;
      const d = Math.min(distance(q, t, max), distance(q, cmp, max));
      if (d <= max) best = Math.max(best, 1.6 - d * 0.3);
    }
  }
  return best;
}

export interface Prepared extends SearchDoc {
  _title: string[];
  _all: string[];
}

export const prepare = (docs: SearchDoc[]): Prepared[] =>
  docs.map((d) => ({
    ...d,
    _title: norm(`${d.title} ${d.code ?? ''}`).split(' '),
    _all: norm(`${d.title} ${d.sub} ${d.terms} ${d.code ?? ''}`).split(' '),
  }));

export function search(index: Prepared[], query: string) {
  const qs = norm(query).split(' ').filter(Boolean);
  if (!qs.length) return [];
  const out: { doc: Prepared; score: number }[] = [];
  for (const doc of index) {
    let total = 0;
    let ok = true;
    for (const q of qs) {
      const s = Math.max(tokenScore(q, doc._title) * 1.3, tokenScore(q, doc._all));
      if (s === 0) {
        ok = false;
        break;
      }
      total += s;
    }
    if (ok) out.push({ doc, score: total + (doc.type === 'brand' ? 0.4 : doc.type === 'ingredient' ? 0.2 : 0) });
  }
  return out.sort((a, b) => b.score - a.score);
}
