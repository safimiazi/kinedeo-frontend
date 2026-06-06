"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartPanel from "@/components/CartPanel";
import { useCart } from "@/lib/cart-context";

interface StaticPageLayoutProps {
  children: React.ReactNode;
  /** Hero gradient title shown in the pink banner */
  title: string;
  /** Subtitle shown under the title */
  subtitle?: string;
  /** Back link href — defaults to "/" */
  backHref?: string;
  /** Back link label — defaults to "Home" */
  backLabel?: string;
}

export default function StaticPageLayout({
  children,
  title,
  subtitle,
  backHref = "/",
  backLabel = "Home",
}: StaticPageLayoutProps) {
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#fff0f5] font-nunito">
      <Navbar cartCount={itemCount} onCartOpen={() => setCartOpen(true)} />

      {/* Hero banner */}
      <div className="relative bg-gradient-to-r from-[#e91e8c] via-[#c2185b] to-[#ad1457] text-white overflow-hidden">
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-semibold mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
          <h1 className="font-playfair text-3xl md:text-5xl font-extrabold leading-tight">{title}</h1>
          {subtitle && (
            <p className="mt-3 text-white/75 text-base max-w-xl">{subtitle}</p>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {children}
      </main>

      <Footer />
      {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}
    </div>
  );
}
