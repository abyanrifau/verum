import { useStore } from '@nanostores/preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { $bump, $cartCount, openCart } from '../stores/cart';
import { Icon } from './icons';

export default function CartButton() {
  const count = useStore($cartCount);
  const bump = useStore($bump);
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => setHydrated(true), []);
  useEffect(() => {
    if (!bump || !ref.current) return;
    const el = ref.current;
    el.classList.remove('is-bump');
    void el.offsetWidth;
    el.classList.add('is-bump');
  }, [bump]);

  const shown = hydrated ? count : 0;
  return (
    <a
      href="/cart"
      class="icon-btn cart-btn"
      aria-label={shown ? `Cart, ${shown} ${shown === 1 ? 'item' : 'items'}` : 'Cart, empty'}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey) return;
        e.preventDefault();
        openCart();
      }}
    >
      <Icon name="bag" />
      <span ref={ref} class="cart-count mono" data-empty={shown ? undefined : ''} aria-hidden="true">
        {shown > 9 ? '9+' : shown}
      </span>
    </a>
  );
}
