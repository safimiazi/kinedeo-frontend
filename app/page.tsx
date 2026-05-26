"use client";

import { useState, useEffect } from "react";
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

const products = [
  { id: 1, name: "Silk Rose Serum", category: "Skincare", price: 1299, originalPrice: 1899, rating: 4.9, reviews: 2341, badge: "Best Seller", emoji: "🌹", desc: "Anti-aging formula with pure rose extract" },
  { id: 2, name: "Velvet Lip Kit", category: "Makeup", price: 899, originalPrice: 1299, rating: 4.8, reviews: 1872, badge: "New", emoji: "💄", desc: "Long-lasting matte finish, 12 shades" },
  { id: 3, name: "Glow Radiance Cream", category: "Skincare", price: 1599, originalPrice: 2199, rating: 4.7, reviews: 987, badge: "Hot", emoji: "✨", desc: "24hr hydration with vitamin C complex" },
  { id: 4, name: "Pearl Perfume", category: "Fragrance", price: 2499, originalPrice: 3299, rating: 5.0, reviews: 654, badge: "Luxury", emoji: "🌸", desc: "Floral bouquet with musk base notes" },
  { id: 5, name: "Rose Gold Palette", category: "Makeup", price: 1199, originalPrice: 1699, rating: 4.6, reviews: 3102, badge: "Trending", emoji: "🎨", desc: "18 eyeshadow shades with mirror" },
  { id: 6, name: "Collagen Face Mask", category: "Skincare", price: 599, originalPrice: 899, rating: 4.8, reviews: 5421, badge: "Fan Fav", emoji: "🫧", desc: "Hydrating sheet mask, pack of 5" },
  { id: 7, name: "Blush & Bronzer Duo", category: "Makeup", price: 749, originalPrice: 999, rating: 4.5, reviews: 1234, badge: "Sale", emoji: "🌷", desc: "Natural flush & sun-kissed glow" },
  { id: 8, name: "Hair Glow Serum", category: "Haircare", price: 999, originalPrice: 1499, rating: 4.9, reviews: 2890, badge: "Award", emoji: "💆‍♀️", desc: "Frizz control & shine boost formula" },
];

const categories = ["All", "Skincare", "Makeup", "Fragrance", "Haircare"];

export default function EcommerceLanding() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [cart, setCart] = useState<Array<{ id: number; name: string; price: number; emoji: string; qty: number }>>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
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

  const addToCart = (p: typeof products[0]) => {
    setCart((prev) => {
      const exists = prev.find((i) => i.id === p.id);
      if (exists) return prev.map((i) => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: p.id, name: p.name, price: p.price, emoji: p.emoji, qty: 1 }];
    });
    showToast(`${p.name} added to cart! 🛍️`);
  };

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]);
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div className="font-playfair bg-[#fff0f5] min-h-screen text-[#2d1a24]">
      <Navbar wishlistCount={wishlist.length} cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <AnnouncementBar />
      <HeroSection />
      <FlashSale timeLeft={timeLeft} />
      <Features />
      <ProductsSection
        products={products}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        wishlist={wishlist}
        toggleWishlist={toggleWishlist}
        addToCart={addToCart}
      />
      <PromoBanner />
      <Testimonials />
      <NewsletterCTA
        emailInput={emailInput}
        setEmailInput={setEmailInput}
        onSubscribe={() => {
          if (emailInput) {
            showToast("Welcome to Petal Club! 🌸");
            setEmailInput("");
          }
        }}
      />
      <Footer />

      {cartOpen && (
        <CartPanel
          cart={cart}
          cartTotal={cartTotal}
          onClose={() => setCartOpen(false)}
          onCheckout={() => showToast("Order Placed! Thank you! 🎉")}
        />
      )}

      {toast && <Toast message={toast} />}
    </div>
  );
}
