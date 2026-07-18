'use client';

/**
 * HomeClientShell
 *
 * A thin client wrapper for the home page that provides:
 * - Navbar with live cart count
 * - CartPanel (slide-in drawer)
 * - Toast notifications
 * - AnnouncementBar with server-rendered initial text (avoids CLS)
 *
 * All heavy static sections (HeroSection, FlashSale, etc.) are passed
 * as children and rendered as-is — they remain server-rendered HTML.
 */

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import CartPanel from '@/components/CartPanel';
import Toast from '@/components/Toast';
import { useCart } from '@/lib/cart-context';

interface Props {
  children: React.ReactNode;
  /** Pre-rendered announcement text from the server — shown immediately, no flash */
  announcementMessage: string | null;
}

export default function HomeClientShell({ children, announcementMessage }: Props) {
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // expose showToast to children via a context if needed in the future
  void setToast; // referenced to avoid lint warning

  return (
    <div className="font-playfair bg-[#fff0f5] min-h-screen text-[#2d1a24]">
      <Navbar cartCount={itemCount} onCartOpen={() => setCartOpen(true)} />

      {/* Announcement bar — server-rendered text prevents layout shift */}
      {announcementMessage && (
        <div className="bg-linear-to-r from-[#e91e8c] via-[#c2185b] to-[#e91e8c] text-white text-center py-2.5 px-5 font-nunito text-[13px] font-bold tracking-wider">
          {announcementMessage}
        </div>
      )}

      {children}

      {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}
      {toast && <Toast message={toast} />}
    </div>
  );
}
