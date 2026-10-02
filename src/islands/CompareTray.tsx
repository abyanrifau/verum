import { useStore } from '@nanostores/preact';
import { useEffect, useState } from 'preact/hooks';
import { $compare, COMPARE_MAX, setCompare, toggleCompare } from '../stores/compare';
import { loadCatalog, type LiteProduct } from '../lib/lite';
import { Icon } from './icons';
import './compare-tray.css';

export default function CompareTray() {
  const ids = useStore($compare);
  const [catalog, setCatalog] = useState<LiteProduct[] | null>(null);
  const [path, setPath] = useState('');
  const [narrow, setNarrow] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sync = () => setPath(location.pathname);
    sync();
    const mq = window.matchMedia('(max-width: 899px)');
    const mqSync = () => setNarrow(mq.matches);
    mqSync();
    mq.addEventListener('change', mqSync);
    // On phones the tray waits until the first screen is scrolled past, so it never covers the
    // above-the-fold buy and quiz actions.
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > window.innerHeight * 0.6));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('astro:page-load', sync);
    document.addEventListener('astro:page-load', onScroll);
    return () => {
      document.removeEventListener('astro:page-load', sync);
      document.removeEventListener('astro:page-load', onScroll);
      window.removeEventListener('scroll', onScroll);
      mq.removeEventListener('change', mqSync);
    };
  }, []);
  useEffect(() => {
    if (ids.length && !catalog) loadCatalog().then(setCatalog).catch(() => {});
  }, [ids.length]);

  // Never cover a page's own buy bar: these pages have one, or don't need the tray.
  const HIDE = ['/compare', '/checkout', '/quiz', '/routine', '/cart', '/my-routine'];
  const show =
    ids.length > 0 && !HIDE.some((h) => path.startsWith(h)) && !(narrow && (path.startsWith('/products/') || !scrolled));
  useEffect(() => {
    document.body.classList.toggle('has-tray', show);
  }, [show, path, narrow, scrolled]);
  if (!show) return <div class="compare-tray-anchor" hidden />;

  const map = new Map((catalog ?? []).map((p) => [p.id, p]));
  return (
    <aside class="compare-tray" aria-label="Compare tray">
      <div class="ct-inner">
        <p class="ct-label mono">
          Compare <span class="muted">{ids.length}/{COMPARE_MAX}</span>
        </p>
        <ul role="list" class="ct-slots">
          {Array.from({ length: COMPARE_MAX }, (_, i) => {
            const p = map.get(ids[i]);
            return (
              <li class="ct-slot">
                {p ? (
                  <button type="button" class="ct-thumb" onClick={() => toggleCompare(p.id, p.short)} aria-label={`Remove ${p.short} from compare`}>
                    <img src={p.t1} width={40} height={40} alt="" loading="lazy" />
                    <span class="ct-x" aria-hidden="true">
                      <Icon name="close" size={12} />
                    </span>
                  </button>
                ) : (
                  <span class="ct-empty" aria-hidden="true" />
                )}
              </li>
            );
          })}
        </ul>
        <a class={`btn btn--sm ct-go ${ids.length < 2 ? 'btn--quiet' : ''}`} href={`/compare?ids=${ids.join(',').toLowerCase()}`}>
          {ids.length < 2 ? 'Add one more' : `Compare now (${ids.length})`}
        </a>
        <button type="button" class="ct-clear" onClick={() => setCompare([])}>
          Clear<span class="sr-only"> compare list</span>
        </button>
      </div>
    </aside>
  );
}
