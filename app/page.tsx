"use client";

import { useState } from "react";
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
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="font-playfair bg-[#fff0f5] min-h-screen text-[#2d1a24]">
      <Navbar wishlistCount={0} cartCount={itemCount} onCartOpen={() => setCartOpen(true)} />
      <AnnouncementBar />
      <HeroSection />
      <FlashSale />
      <Features />
      <ProductsSection />
      <PromoBanner />
      <Testimonials />
      <NewsletterCTA emailInput={emailInput} setEmailInput={setEmailInput}
        onSubscribe={() => { if (emailInput) { showToast("Welcome to Petal Club! 🌸"); setEmailInput(""); } }} />
      <Footer />

      {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}

      {toast && <Toast message={toast} />}
    </div>
  );
}
