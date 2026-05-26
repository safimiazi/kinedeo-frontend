"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const product = {
  id: 1,
  name: "Silk Rose Serum",
  tagline: "Glow Like Never Before 🌹",
  badge: "Best Seller",
  price: 1299,
  originalPrice: 1899,
  rating: 4.9,
  reviews: 2341,
  description: "A transformative elixir crafted with pure Bulgarian rose extract and hyaluronic acid. This lightweight serum deeply hydrates, visibly brightens, and smooths skin texture for an ethereal, petal-soft finish.",
  emoji: "🌹",
  images: ["🌹", "💧", "👩", "✨"],
};

const relatedProducts = [
  { id: 2, name: "Velvet Lip Kit", category: "Makeup", price: 899, originalPrice: 1299, badge: "New", emoji: "💄" },
  { id: 4, name: "Pearl Perfume", category: "Fragrance", price: 2499, originalPrice: 3299, badge: "Limited", emoji: "🌸" },
  { id: 3, name: "Glow Radiance Cream", category: "Skincare", price: 1599, originalPrice: 2199, badge: "", emoji: "✨" },
  { id: 5, name: "Rose Gold Palette", category: "Makeup", price: 1199, originalPrice: 1699, badge: "", emoji: "🎨" },
];

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<string | null>("how-to-use");

  const discount = Math.round((1 - product.price / product.originalPrice) * 100);

  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] font-nunito">
      <Navbar wishlistCount={0} cartCount={2} onCartOpen={() => {}} />

      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 md:px-8 py-6 flex items-center gap-2 text-xs font-bold text-[#ad1457] uppercase tracking-wider">
        <a className="hover:text-[#e91e8c] transition-colors" href="/">Home</a>
        <span className="text-[#ad1457]/50">›</span>
        <a className="hover:text-[#e91e8c] transition-colors" href="/">Skincare</a>
        <span className="text-[#ad1457]/50">›</span>
        <span className="text-[#2d1a24]">Silk Rose Serum</span>
      </nav>

      {/* Product Detail Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-24">
        {/* Image Gallery */}
        <div className="md:col-span-7 flex flex-col gap-5">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-linear-to-br from-[#fce4ec] to-[#f8bbd0] shadow-xl shadow-[#e91e8c]/10 flex items-center justify-center">
            <span className="text-[180px] md:text-[220px]">{product.images[selectedImage]}</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(i)}
                className={`aspect-square rounded-xl overflow-hidden bg-linear-to-br from-[#fce4ec] to-[#f8bbd0] flex items-center justify-center text-4xl transition-all cursor-pointer ${
                  selectedImage === i
                    ? "border-2 border-[#e91e8c] shadow-lg shadow-[#e91e8c]/20"
                    : "opacity-60 hover:opacity-100 border border-[#fce4ec]"
                }`}
              >
                {img}
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="md:col-span-5 flex flex-col">
          <span className="inline-block px-3 py-1 bg-[#e91e8c] text-white font-nunito text-[10px] font-extrabold rounded-full w-fit mb-4 uppercase tracking-widest">
            {product.badge}
          </span>
          <h1 className="font-playfair text-4xl md:text-5xl font-extrabold text-[#2d1a24] mb-2">
            {product.name}
          </h1>
          <p className="font-playfair text-xl md:text-2xl text-[#ad1457] mb-6 italic">
            {product.tagline}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex text-[#ff9800] text-lg">{"★".repeat(5)}</div>
            <span className="font-nunito text-sm text-[#ad1457] underline cursor-pointer">
              {product.reviews.toLocaleString()} reviews
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-playfair text-3xl font-extrabold text-[#e91e8c]">₹{product.price.toLocaleString()}</span>
            <span className="font-nunito text-base text-[#ad1457] line-through">₹{product.originalPrice.toLocaleString()}</span>
            <span className="font-nunito text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">-{discount}% OFF</span>
          </div>

          {/* Description */}
          <p className="font-nunito text-base text-[#6d1b3b] leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mb-10">
            <button className="w-full py-4 bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white font-nunito font-bold text-sm rounded-full flex items-center justify-center gap-2 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all tracking-wider uppercase cursor-pointer">
              Add to Cart ✨
            </button>
            <button className="w-full py-4 border-2 border-[#e91e8c] text-[#e91e8c] font-nunito font-bold text-sm rounded-full flex items-center justify-center gap-2 hover:bg-[#e91e8c] hover:text-white transition-all tracking-wider uppercase cursor-pointer">
              Buy It Now
            </button>
          </div>

          {/* Accordion */}
          <div className="border-t border-[#fce4ec]">
            {/* How to Use */}
            <div className="border-b border-[#fce4ec]">
              <button
                onClick={() => toggleAccordion("how-to-use")}
                className="w-full flex justify-between items-center py-5 cursor-pointer"
              >
                <span className="font-nunito text-sm font-bold text-[#e91e8c] uppercase tracking-widest">How to Use</span>
                <span className={`text-[#e91e8c] transition-transform ${openAccordion === "how-to-use" ? "rotate-180" : ""}`}>▼</span>
              </button>
              {openAccordion === "how-to-use" && (
                <div className="pb-5 grid grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">🤲</span>
                    <span className="font-nunito text-xs font-semibold text-[#2d1a24]">Apply 2-3 drops</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">💆</span>
                    <span className="font-nunito text-xs font-semibold text-[#2d1a24]">Gently massage</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-2xl">🌙</span>
                    <span className="font-nunito text-xs font-semibold text-[#2d1a24]">Day & Night</span>
                  </div>
                </div>
              )}
            </div>

            {/* Ingredients */}
            <div className="border-b border-[#fce4ec]">
              <button
                onClick={() => toggleAccordion("ingredients")}
                className="w-full flex justify-between items-center py-5 cursor-pointer"
              >
                <span className="font-nunito text-sm font-bold text-[#e91e8c] uppercase tracking-widest">Ingredients</span>
                <span className={`text-[#e91e8c] transition-transform ${openAccordion === "ingredients" ? "rotate-180" : ""}`}>▼</span>
              </button>
              {openAccordion === "ingredients" && (
                <p className="pb-5 font-nunito text-sm text-[#6d1b3b] leading-relaxed">
                  Rosa Damascena Flower Water, Sodium Hyaluronate, Vitamin C (ascorbic acid), Aloe Vera Extract, Glycerin, Aqua, Rosehip Seed Oil, Niacinamide. Cruelty-free & Vegan.
                </p>
              )}
            </div>

            {/* Shipping & Returns */}
            <div className="border-b border-[#fce4ec]">
              <button
                onClick={() => toggleAccordion("shipping")}
                className="w-full flex justify-between items-center py-5 cursor-pointer"
              >
                <span className="font-nunito text-sm font-bold text-[#e91e8c] uppercase tracking-widest">Shipping & Returns</span>
                <span className={`text-[#e91e8c] transition-transform ${openAccordion === "shipping" ? "rotate-180" : ""}`}>▼</span>
              </button>
              {openAccordion === "shipping" && (
                <p className="pb-5 font-nunito text-sm text-[#6d1b3b] leading-relaxed">
                  Free shipping on orders above ₹999. Easy 7-day returns on all unopened products. Delivered in eco-friendly, luxury packaging.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* The Ritual of Radiance Section */}
      <section className="bg-linear-to-br from-[#fff0f5] to-[#fce4ec] py-20 mb-24 overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 items-center gap-16 relative z-10">
          <div className="order-2 md:order-1">
            <h2 className="font-playfair text-3xl md:text-4xl font-extrabold text-[#2d1a24] mb-6">
              The Ritual of Radiance
            </h2>
            <p className="font-nunito text-base text-[#6d1b3b] mb-10 max-w-lg leading-relaxed">
              Petal Beauty isn&apos;t just about the final look; it&apos;s about the feeling of care. Our Silk Rose Serum is formulated to connect you with the power of nature, one drop at a time.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl shadow-sm shrink-0">
                  🌿
                </div>
                <div>
                  <h4 className="font-nunito text-sm font-bold text-[#2d1a24] mb-1">Ethically Sourced</h4>
                  <p className="font-nunito text-xs text-[#ad1457]">Roses picked at dawn for maximum potency.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-xl shadow-sm shrink-0">
                  🔬
                </div>
                <div>
                  <h4 className="font-nunito text-sm font-bold text-[#2d1a24] mb-1">Clinically Proven</h4>
                  <p className="font-nunito text-xs text-[#ad1457]">89% saw brighter skin in 14 days.</p>
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-[#e91e8c]/5 rounded-full scale-110 animate-pulse-dot" />
              <div className="w-full h-full bg-linear-to-br from-[#f48fb1] to-[#e91e8c] rounded-full flex items-center justify-center text-[100px] border-8 border-white shadow-xl shadow-[#e91e8c]/20 relative z-10">
                🌹
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="font-nunito text-xs font-bold text-[#ad1457] uppercase tracking-widest block mb-2">
              Complete the Look
            </span>
            <h2 className="font-playfair text-2xl md:text-3xl font-extrabold text-[#2d1a24]">
              You May Also Love
            </h2>
          </div>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full border border-[#fce4ec] flex items-center justify-center text-[#ad1457] hover:bg-[#e91e8c] hover:text-white hover:border-[#e91e8c] transition-all cursor-pointer">
              ←
            </button>
            <button className="w-10 h-10 rounded-full border border-[#fce4ec] flex items-center justify-center text-[#ad1457] hover:bg-[#e91e8c] hover:text-white hover:border-[#e91e8c] transition-all cursor-pointer">
              →
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {relatedProducts.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-[#fce4ec] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#e91e8c]/15 hover:border-[#e91e8c] transition-all cursor-pointer group">
              <div className="aspect-[4/5] bg-linear-to-br from-[#fce4ec] to-[#f8bbd0] flex items-center justify-center text-7xl relative overflow-hidden">
                <span className="transition-transform duration-500 group-hover:scale-110">{p.emoji}</span>
                {p.badge && (
                  <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-[#e91e8c]">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-4">
                <span className="font-nunito text-[10px] font-bold text-[#ad1457] uppercase tracking-widest block mb-1">
                  {p.category}
                </span>
                <h3 className="font-nunito text-sm font-bold text-[#2d1a24] group-hover:text-[#e91e8c] transition-colors">
                  {p.name}
                </h3>
                <div className="flex gap-2 mt-2">
                  <span className="font-playfair text-base font-extrabold text-[#e91e8c]">₹{p.price.toLocaleString()}</span>
                  <span className="font-nunito text-xs text-[#ad1457] line-through self-center">₹{p.originalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
        <div className="bg-linear-to-br from-[#e91e8c] to-[#c2185b] py-16 px-8 rounded-[2rem] text-center text-white relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="text-4xl mb-4">🌸</div>
            <h2 className="font-playfair text-3xl md:text-4xl font-extrabold mb-4">Join the Petal Club</h2>
            <p className="font-nunito text-base mb-8 opacity-90 leading-relaxed">
              Subscribe for exclusive deals, beauty tips, and early access to new launches. Get ₹200 off your first order!
            </p>
            <div className="flex flex-col sm:flex-row gap-3 items-stretch max-w-lg mx-auto">
              <input
                className="flex-grow px-6 py-4 rounded-full border-none text-[#2d1a24] text-sm outline-none"
                placeholder="Enter your email address..."
                type="email"
              />
              <button className="bg-white text-[#e91e8c] px-8 py-4 rounded-full font-nunito font-bold text-sm whitespace-nowrap hover:-translate-y-0.5 hover:shadow-lg transition-all cursor-pointer">
                Subscribe ✨
              </button>
            </div>
            <p className="mt-5 font-nunito text-xs text-white/60">No spam, ever. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
