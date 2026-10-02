import { useStore } from '@nanostores/preact';
import { useEffect, useRef } from 'preact/hooks';
import { $announce, $cartCount, $cartOpen } from '../stores/cart';
import CartContents from './cart/CartContents';
import { Icon } from './icons';
import './cart/cart.css';

const WA = 'https://wa.me/9607000000?text=' + encodeURIComponent('Hi VERUM, I have a question about my cart.');

export default function CartDrawer() {
  const open = useStore($cartOpen);
  const count = useStore($cartCount);
  const msg = useStore($announce);
  const ref = useRef<HTMLDialogElement>(null);
  // Links inside the drawer close it instantly, so a page transition never starts while it animates out.
  const closeNow = () => {
    const d = ref.current;
    if (d?.open) {
      d.classList.remove('is-closing');
      d.close();
    }
    $cartOpen.set(false);
  };

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      d.classList.remove('is-closing');
    } else if (!open && d.open) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) d.close();
      else {
        d.classList.add('is-closing');
        setTimeout(() => {
          d.classList.remove('is-closing');
          d.close();
        }, 200);
      }
    }
  }, [open]);

  useEffect(() => {
    const d = ref.current!;
    const onClose = () => $cartOpen.set(false);
    const onClick = (e: MouseEvent) => {
      if (e.target === d) $cartOpen.set(false); // backdrop
    };
    const onSwap = () => {
      if (d.open) d.close();
      $cartOpen.set(false);
    };
    d.addEventListener('close', onClose);
    d.addEventListener('click', onClick);
    document.addEventListener('astro:before-swap', onSwap);
    return () => {
      d.removeEventListener('close', onClose);
      d.removeEventListener('click', onClick);
      document.removeEventListener('astro:before-swap', onSwap);
    };
  }, []);

  return (
    <>
      <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {open ? '' : msg}
      </div>
      <dialog ref={ref} class="drawer" aria-labelledby="drawer-title">
        <div class="drawer-inner">
          <header class="drawer-head">
            <h2 id="drawer-title" class="drawer-title">
              Your cart <span class="mono muted">({count})</span>
            </h2>
            <button type="button" class="icon-btn drawer-close" aria-label="Close cart" onClick={() => $cartOpen.set(false)}>
              <Icon name="close" />
            </button>
          </header>
          <div class="drawer-scroll">
            <CartContents variant="drawer" open={open} onNavigate={closeNow} />
          </div>
          <footer class="drawer-foot">
            <a href="/cart" class="link" onClick={closeNow}>
              View full cart
            </a>
            <a href={WA} class="wa-link" target="_blank" rel="noopener">
              <Icon name="chat" size={16} /> Questions? WhatsApp us
            </a>
          </footer>
        </div>
        <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">
          {open ? msg : ''}
        </div>
      </dialog>
    </>
  );
}
