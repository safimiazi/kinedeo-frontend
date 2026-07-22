'use client';

/**
 * FloatingCartWidget
 *
 * Mobile-only floating cart indicator that appears at the vertical center
 * of the right edge.
 *
 * - Shows cart icon, item count, and formatted total
 * - Only visible on mobile (md:hidden)
 * - Hidden when cart is empty
 * - Tapping opens the CartPanel
 */

import { ShoppingBag } from 'lucide-react';

interface Props {
  itemCount: number;
  subtotal: number;
  onCartOpen: () => void;
}

export default function FloatingCartWidget({ itemCount, subtotal, onCartOpen }: Props) {
  if (itemCount === 0) return null;

  return (
    <button
      onClick={onCartOpen}
      aria-label={`Cart — ${itemCount} items, ৳${subtotal.toLocaleString()}`}
      className="
        md:hidden
        fixed right-0 top-1/2 -translate-y-1/2
        z-40
        flex flex-col items-center justify-center gap-1.5
        bg-linear-to-b from-[#e91e8c] to-[#c2185b]
        text-white
        w-16 py-4 px-2
        rounded-l-2xl
        shadow-2xl shadow-[#e91e8c]/50
        active:scale-95
        transition-transform duration-150
      "
    >
      {/* Cart icon */}
      <ShoppingBag className="w-6 h-6 stroke-[1.8]" />

      {/* Item count */}
      <span className="font-nunito font-extrabold text-[11px] leading-none tracking-wide uppercase">
        {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
      </span>

      {/* Divider */}
      <div className="w-9 border-t border-white/40" />

      {/* Total */}
      <span className="font-nunito font-bold text-[11px] leading-none">
        ৳{subtotal.toLocaleString()}
      </span>
    </button>
  );
}
