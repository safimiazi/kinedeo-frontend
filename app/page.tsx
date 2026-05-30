"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AnnouncementBar from "@/components/AnnouncementBar";
import HeroSection from "@/components/HeroSection";
import FlashSale from "@/components/FlashSale";
import Features from "@/components/Features";
import ProductsSection from "@/components/ProductsSection";
import PromoBanner from "@/components/PromoBanner";
import Testimonials from "@/components/Testimonials";
import NewsletterCTA from "@/components/NewsletterCTA";
import Footer from "@/components/Footer";
import CartPanel from "@/components/CartPanel";
import Toast from "@/components/Toast";
import { useCart } from "@/lib/cart-context";

export default function HomePage() {
  const router = useRouter();
  const { items, itemCount, subtotal } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 42, s: 17 });
  const [emailInput, setEmailInput] = useState("");

  useEffect(() => {
    const t = setInterval(() => {
      setTimeLeft((prev) => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) return { h: 5, m: 59, s: 59 };
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="font-playfair bg-[#fff0f5] min-h-screen text-[#2d1a24]">
      <Navbar wishlistCount={0} cartCount={itemCount} onCartOpen={() => setCartOpen(true)} />
      <AnnouncementBar />
      <HeroSection />
      <FlashSale timeLeft={timeLeft} />
      <Features />
      <ProductsSection />
      <PromoBanner />
      <Testimonials />
      <NewsletterCTA emailInput={emailInput} setEmailInput={setEmailInput}
        onSubscribe={() => { if (emailInput) { showToast("Welcome to Petal Club! 🌸"); setEmailInput(""); } }} />
      <Footer />

      {cartOpen && (
        <CartPanel cart={items.map((i, idx) => ({ id: idx + 1, name: i.name, price: i.price, emoji: i.image ? "🛍️" : "📦", qty: i.qty }))}
          cartTotal={subtotal} onClose={() => setCartOpen(false)}
          onCheckout={() => { setCartOpen(false); router.push("/cart"); }} />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}
