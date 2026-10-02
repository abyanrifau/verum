/**
 * One small module for every page. Static product cards stay plain HTML:
 * their buttons are handled here by delegation, so 50 cards cost zero hydration.
 */
import { addToCart } from '../stores/cart';
import { $compare, toggleCompare } from '../stores/compare';

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- add to cart, add set, compare, quick view, search ---------- */
document.addEventListener('click', (e) => {
  const t = e.target as Element | null;
  if (!t || !(t instanceof Element)) return;

  const add = t.closest<HTMLElement>('[data-add]');
  if (add) {
    e.preventDefault();
    const id = add.dataset.add!;
    addToCart(id, { open: add.dataset.open !== 'false' });
    flashAdded(add);
    return;
  }
  const set = t.closest<HTMLElement>('[data-add-set]');
  if (set) {
    e.preventDefault();
    addToCart(set.dataset.addSet!.split(','), { open: true });
    flashAdded(set);
    return;
  }
  const cmp = t.closest<HTMLElement>('[data-compare]');
  if (cmp) {
    e.preventDefault();
    toggleCompare(cmp.dataset.compare!, cmp.dataset.name);
    return;
  }
  const quick = t.closest<HTMLElement>('[data-quick]');
  if (quick) {
    e.preventDefault();
    import('../islands/lazy/QuickView').then((m) => m.openQuickView(quick.dataset.quick!, quick));
    return;
  }
  if (t.closest('[data-search-open]')) {
    e.preventDefault();
    openSearch();
    return;
  }
  if (t.closest('[data-menu-open]')) {
    (document.getElementById('mobile-menu') as HTMLDialogElement | null)?.showModal();
    return;
  }
  if (t.closest('[data-menu-close]')) {
    (document.getElementById('mobile-menu') as HTMLDialogElement | null)?.close();
    return;
  }
  // Card image clicked: tag it for the shared-element transition to the product page.
  const card = t.closest<HTMLAnchorElement>('a[data-vt]');
  if (card && !reduceMotion()) {
    document.querySelectorAll<HTMLElement>('[data-vt-img]').forEach((el) => (el.style.viewTransitionName = ''));
    document.querySelectorAll<HTMLElement>('[data-vt-hero]').forEach((el) => (el.style.viewTransitionName = 'none'));
    const img = card.closest('[data-card]')?.querySelector<HTMLElement>('[data-vt-img]');
    if (img) img.style.viewTransitionName = 'product-hero';
    try {
      sessionStorage.setItem('verum:vt', card.dataset.vt!);
    } catch {
      /* ignore */
    }
  }
});

// Close the mobile menu when one of its links is used.
document.addEventListener('click', (e) => {
  const a = (e.target as Element)?.closest?.('#mobile-menu a');
  if (a) (document.getElementById('mobile-menu') as HTMLDialogElement | null)?.close();
});

function flashAdded(btn: HTMLElement) {
  const label = btn.querySelector<HTMLElement>('[data-label]');
  if (!label) return;
  const original = label.dataset.label!;
  label.textContent = 'Added';
  btn.classList.add('is-added');
  window.setTimeout(() => {
    label.textContent = original;
    btn.classList.remove('is-added');
  }, 1600);
}

/* ---------- compare toggles reflect the store ---------- */
function syncCompare(list: readonly string[] = $compare.get()) {
  document.querySelectorAll<HTMLElement>('[data-compare]').forEach((b) => {
    const on = list.includes(b.dataset.compare!);
    b.setAttribute('aria-pressed', String(on));
  });
  // Inline "Compare now" link where the bottom tray is not shown (product pages on phones).
  document.querySelectorAll<HTMLAnchorElement>('[data-compare-go]').forEach((a) => {
    a.hidden = list.length < 2;
    a.href = `/compare?ids=${list.join(',').toLowerCase()}`;
    a.textContent = `Compare now (${list.length})`;
  });
}
$compare.subscribe((l) => syncCompare(l));

/* ---------- search: loaded only when first opened ---------- */
let searchLoading: Promise<unknown> | null = null;
function openSearch() {
  searchLoading ??= import('../islands/lazy/Search');
  searchLoading.then((m) => (m as typeof import('../islands/lazy/Search')).openSearch());
}
document.addEventListener('keydown', (e) => {
  const el = e.target as HTMLElement;
  const typing = el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));
  if ((e.key === 'k' || e.key === 'K') && (e.metaKey || e.ctrlKey)) {
    e.preventDefault();
    openSearch();
  } else if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
    e.preventDefault();
    openSearch();
  }
});
// Warm the search chunk when the pointer heads for the button.
document.addEventListener(
  'pointerover',
  (e) => {
    if ((e.target as Element)?.closest?.('[data-search-open]')) searchLoading ??= import('../islands/lazy/Search');
  },
  { passive: true },
);

/* ---------- reveal + ingredient bars on scroll ---------- */
let io: IntersectionObserver | null = null;
function observe() {
  io?.disconnect();
  const els = document.querySelectorAll<HTMLElement>('.reveal:not(.is-in), [data-bars]:not(.is-in)');
  if (!('IntersectionObserver' in window) || reduceMotion()) {
    els.forEach((el) => el.classList.add('is-in'));
    return;
  }
  io = new IntersectionObserver(
    (entries) => {
      for (const en of entries) {
        if (en.isIntersecting) {
          en.target.classList.add('is-in');
          io?.unobserve(en.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
  );
  els.forEach((el) => io!.observe(el));
}

/* ---------- shared element on the way back to a listing ---------- */
document.addEventListener('astro:after-swap', () => {
  let slug: string | null = null;
  try {
    slug = sessionStorage.getItem('verum:vt');
  } catch {
    /* ignore */
  }
  if (!slug || reduceMotion() || document.querySelector('[data-vt-hero]')) return;
  const back = document.querySelector<HTMLElement>(`[data-card="${slug}"] [data-vt-img]`);
  if (back) back.style.viewTransitionName = 'product-hero';
});

/* ---------- mobile sticky bar offsets the compare tray ---------- */
function init() {
  observe();
  syncCompare();
}
document.addEventListener('astro:page-load', init);
