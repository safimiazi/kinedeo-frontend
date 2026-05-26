"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const initialCartItems = [
  { id: 1, name: "Silk Rose Serum", category: "Skincare", badge: "Best Seller", desc: "Anti-aging formula with pure rose extract • 30ml", price: 1299, originalPrice: 1899, emoji: "🌹", qty: 1 },
  { id: 2, name: "Velvet Lip Kit", category: "Makeup", badge: "New Arrival", desc: "Shade: Dusk Rose • Long-lasting matte finish", price: 899, originalPrice: 1299, emoji: "💄", qty: 1 },
];

const recommendedProducts = [
  { id: 3, name: "Glow Radiance Cream", price: 1599, emoji: "✨" },
  { id: 4, name: "Pearl Perfume", price: 2499, emoji: "🌸" },
  { id: 6, name: "Collagen Mask", price: 599, emoji: "🫧" },
  { id: 8, name: "Hair Glow Serum", price: 999, emoji: "💆‍♀️" },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [giftWrap, setGiftWrap] = useState(false);

  const updateQty = (id: number, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discount = promoApplied ? Math.round(subtotal * 0.2) : 0;
  const shipping = subtotal >= 999 ? 0 : 99;
  const tax = Math.round((subtotal - discount) * 0.05);
  const total = subtotal - discount + shipping + tax + (giftWrap ? 99 : 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.qty, 0);

  const applyPromo = () => {
    if (promoCode.toUpperCase() === "PETAL20") {
      setPromoApplied(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] font-nunito">
      <Navbar wishlistCount={0} cartCount={totalItems} onCartOpen={() => {}} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Page Header */}
        <h1 className="font-playfair text-3xl md:text-4xl font-extrabold text-[#2d1a24] mb-2">
          Your Shopping Bag
        </h1>
        <p className="font-nunito text-sm text-[#ad1457] mb-8">
          Enjoy complimentary samples with every order
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Cart Items */}
          <div className="flex-1">
            {/* Cart Items */}
            <div className="space-y-4 mb-6">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-5 border border-[#fce4ec] flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 bg-linear-to-br from-[#fce4ec] to-[#f8bbd0] rounded-xl flex items-center justify-center text-5xl shrink-0">
                    {item.emoji}
                  </div>
                  {/* Product Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-nunito text-[10px] font-extrabold px-2 py-0.5 rounded-full tracking-wider uppercase bg-[#e91e8c] text-white">
                          {item.badge}
                        </span>
                        <h3 className="font-playfair text-lg font-bold text-[#2d1a24] mt-2">{item.name}</h3>
                        <p className="font-nunito text-xs text-[#ad1457] mt-0.5">{item.desc}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-[#ad1457]/50 hover:text-[#e91e8c] transition-colors cursor-pointer text-lg"
                        aria-label="Remove item"
                      >
                        🗑️
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-8 h-8 rounded-full border border-[#fce4ec] flex items-center justify-center text-[#e91e8c] font-bold cursor-pointer hover:bg-[#fce4ec] transition-colors"
                        >
                          −
                        </button>
                        <span className="font-bold text-sm text-[#2d1a24] w-6 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-8 h-8 rounded-full border border-[#fce4ec] flex items-center justify-center text-[#e91e8c] font-bold cursor-pointer hover:bg-[#fce4ec] transition-colors"
                        >
                          +
                        </button>
                      </div>
                      {/* Price */}
                      <div className="text-right">
                        <span className="font-nunito text-xs text-[#ad1457] line-through mr-2">₹{item.originalPrice.toLocaleString()}</span>
                        <span className="font-playfair text-xl font-extrabold text-[#e91e8c]">₹{(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gift Wrap Option */}
            <div className="bg-white rounded-2xl p-5 border border-[#fce4ec] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#fce4ec] rounded-full flex items-center justify-center text-lg">🎁</div>
                <div>
                  <div className="font-bold text-sm text-[#2d1a24]">Make it a Gift?</div>
                  <div className="text-xs text-[#ad1457]">Add premium gift wrapping and a personal note</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setGiftWrap(!giftWrap)}
                  className={`w-12 h-6 rounded-full transition-all cursor-pointer relative ${
                    giftWrap ? "bg-[#e91e8c]" : "bg-[#fce4ec]"
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${
                    giftWrap ? "left-6.5" : "left-0.5"
                  }`} />
                </button>
                <span className="font-bold text-sm text-[#e91e8c]">₹99</span>
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:w-[360px] shrink-0">
            <div className="bg-white rounded-2xl border-2 border-[#e91e8c]/20 p-6 sticky top-20">
              <h3 className="font-playfair text-xl font-bold text-[#2d1a24] mb-5">Order Summary</h3>

              {/* Totals */}
              <div className="space-y-3 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#2d1a24]/70">Subtotal ({totalItems} items)</span>
                  <span className="font-semibold text-[#2d1a24]">₹{subtotal.toLocaleString()}</span>
                </div>
                {promoApplied && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#e91e8c] font-semibold">Discount (PETAL20)</span>
                    <span className="font-semibold text-[#e91e8c]">-₹{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#2d1a24]/70">Shipping</span>
                  <span className="font-semibold text-green-600">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#2d1a24]/70">Estimated Tax</span>
                  <span className="font-semibold text-[#2d1a24]">₹{tax}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#fce4ec] my-4" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-base text-[#2d1a24]">Total</span>
                <span className="font-playfair font-extrabold text-2xl text-[#e91e8c]">₹{total.toLocaleString()}</span>
              </div>

              {/* Promo Code */}
              <div className="flex gap-2 mb-5">
                <input
                  type="text"
                  placeholder="Promo Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-2.5 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors bg-white"
                />
                <button
                  onClick={applyPromo}
                  className="bg-[#2d1a24] text-white px-5 py-2.5 rounded-xl font-bold text-sm cursor-pointer hover:bg-[#e91e8c] transition-colors"
                >
                  Apply
                </button>
              </div>

              {/* Checkout Button */}
              <button className="w-full bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white py-4 rounded-full font-bold text-base cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all tracking-wide">
                PROCEED TO CHECKOUT ✨
              </button>

              {/* Payment icons */}
              <div className="flex justify-center gap-2 mt-4">
                {["💳", "🏦", "📱"].map((icon) => (
                  <div key={icon} className="w-8 h-6 bg-[#fce4ec] rounded flex items-center justify-center text-xs">
                    {icon}
                  </div>
                ))}
              </div>

              {/* Trust badges */}
              <div className="flex justify-center gap-6 mt-5 pt-5 border-t border-[#fce4ec]">
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#fce4ec] rounded-full flex items-center justify-center mx-auto mb-1.5 text-lg">
                    🛡️
                  </div>
                  <span className="text-[10px] font-bold text-[#ad1457] uppercase tracking-wider">Secure Checkout</span>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#fce4ec] rounded-full flex items-center justify-center mx-auto mb-1.5 text-lg">
                    🐰
                  </div>
                  <span className="text-[10px] font-bold text-[#ad1457] uppercase tracking-wider">Vegan & Cruelty Free</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* You Might Also Love Section */}
        <div className="mt-16">
          <div className="mb-6">
            <div className="font-nunito text-[13px] font-bold text-[#e91e8c] tracking-widest uppercase mb-2">
              Completing Your Routine
            </div>
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-2xl md:text-3xl font-extrabold text-[#2d1a24]">
                You Might Also Love
              </h2>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-full border border-[#fce4ec] flex items-center justify-center text-[#ad1457] hover:border-[#e91e8c] hover:text-[#e91e8c] transition-colors cursor-pointer">
                  ←
                </button>
                <button className="w-9 h-9 rounded-full border border-[#fce4ec] flex items-center justify-center text-[#ad1457] hover:border-[#e91e8c] hover:text-[#e91e8c] transition-colors cursor-pointer">
                  →
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {recommendedProducts.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-[#fce4ec] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#e91e8c]/15 hover:border-[#e91e8c] transition-all cursor-pointer">
                <div className="bg-linear-to-br from-[#fce4ec] to-[#f8bbd0] h-44 flex items-center justify-center text-6xl">
                  {p.emoji}
                </div>
                <div className="p-4">
                  <div className="font-playfair text-sm font-bold text-[#2d1a24] mb-1">{p.name}</div>
                  <div className="font-playfair text-base font-extrabold text-[#e91e8c]">₹{p.price.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
