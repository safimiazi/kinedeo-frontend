"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const orderItems = [
  { id: 1, name: "Silk Rose Serum", qty: 1, price: 1299, image: "🌹" },
  { id: 4, name: "Pearl Perfume", qty: 1, price: 2499, image: "🌸" },
];

export default function CheckoutPage() {
  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");
  const [form, setForm] = useState({
    firstName: "Priya",
    lastName: "M.",
    street: "123 Rose Garden Lane",
    city: "Mumbai",
    pincode: "400001",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = deliveryMethod === "express" ? 249 : 0;
  const taxes = 215;
  const total = subtotal + shipping + taxes;

  const updateForm = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] font-nunito">
      <Navbar wishlistCount={0} cartCount={0} onCartOpen={() => {}} />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Checkout Form */}
          <div className="flex-1">
            <h1 className="font-playfair text-3xl md:text-4xl font-extrabold text-[#2d1a24] mb-2">
              Checkout
            </h1>
            <p className="font-nunito text-sm text-[#ad1457] mb-10">
              Complete your purchase by providing your shipping and payment details. Your beauty ritual is just a step away.
            </p>

            {/* Section 1: Shipping Address */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 bg-[#e91e8c] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  1
                </div>
                <h2 className="font-playfair text-xl font-bold text-[#2d1a24]">Shipping Address</h2>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-[#fce4ec]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={form.firstName}
                      onChange={(e) => updateForm("firstName", e.target.value)}
                      className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={form.lastName}
                      onChange={(e) => updateForm("lastName", e.target.value)}
                      className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors bg-white"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1.5">Street Address</label>
                  <input
                    type="text"
                    value={form.street}
                    onChange={(e) => updateForm("street", e.target.value)}
                    className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1.5">City</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                      className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1.5">Pincode</label>
                    <input
                      type="text"
                      value={form.pincode}
                      onChange={(e) => updateForm("pincode", e.target.value)}
                      className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Delivery Method */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 bg-[#e91e8c] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
                <h2 className="font-playfair text-xl font-bold text-[#2d1a24]">Delivery Method</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => setDeliveryMethod("standard")}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    deliveryMethod === "standard"
                      ? "border-[#e91e8c] bg-[#e91e8c]/5"
                      : "border-[#fce4ec] bg-white hover:border-[#e91e8c]/30"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-[#2d1a24]">Standard Shipping</span>
                    <span className="font-bold text-sm text-green-600">Free</span>
                  </div>
                  <span className="text-xs text-[#ad1457]">3-5 business days</span>
                </button>
                <button
                  onClick={() => setDeliveryMethod("express")}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${
                    deliveryMethod === "express"
                      ? "border-[#e91e8c] bg-[#e91e8c]/5"
                      : "border-[#fce4ec] bg-white hover:border-[#e91e8c]/30"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-[#2d1a24]">Express Delivery</span>
                    <span className="font-bold text-sm text-[#e91e8c]">₹249</span>
                  </div>
                  <span className="text-xs text-[#ad1457]">1-2 business days</span>
                </button>
              </div>
            </div>

            {/* Section 3: Payment Details */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-7 h-7 bg-[#e91e8c] rounded-full flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
                <h2 className="font-playfair text-xl font-bold text-[#2d1a24]">Payment Details</h2>
              </div>
              <div className="bg-white rounded-2xl p-6 border border-[#fce4ec]">
                {/* Card type icons */}
                <div className="flex gap-2 mb-5">
                  <div className="w-10 h-7 bg-[#fce4ec] rounded-md flex items-center justify-center text-xs">💳</div>
                  <div className="w-10 h-7 bg-[#fce4ec] rounded-md flex items-center justify-center text-xs">🏦</div>
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1.5">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="•••• •••• •••• 1234"
                      value={form.cardNumber}
                      onChange={(e) => updateForm("cardNumber", e.target.value)}
                      className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors bg-white pr-10"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#e91e8c]/40">🔒</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1.5">Expiry Date</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={form.expiry}
                      onChange={(e) => updateForm("expiry", e.target.value)}
                      className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1.5">CVV</label>
                    <input
                      type="text"
                      placeholder="•••"
                      value={form.cvv}
                      onChange={(e) => updateForm("cvv", e.target.value)}
                      className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:w-[360px] shrink-0">
            <div className="bg-white rounded-2xl border-2 border-[#e91e8c]/20 p-6 sticky top-20">
              <h3 className="font-playfair text-xl font-bold text-[#2d1a24] mb-5">Order Summary</h3>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-14 h-14 bg-[#fce4ec] rounded-xl flex items-center justify-center text-2xl shrink-0">
                      {item.image}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-[#2d1a24]">{item.name}</div>
                      <div className="text-xs text-[#ad1457]">Qty: {item.qty}</div>
                      <div className="font-bold text-sm text-[#e91e8c]">₹{item.price.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-[#fce4ec] my-4" />

              {/* Totals */}
              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#2d1a24]/70">Subtotal</span>
                  <span className="font-semibold text-[#2d1a24]">₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#2d1a24]/70">Shipping</span>
                  <span className="font-semibold text-green-600">{shipping === 0 ? "FREE" : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#2d1a24]/70">Taxes</span>
                  <span className="font-semibold text-[#2d1a24]">₹{taxes}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-[#fce4ec] my-4" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-base text-[#2d1a24]">Total</span>
                <span className="font-playfair font-extrabold text-2xl text-[#e91e8c]">₹{total.toLocaleString()}</span>
              </div>

              {/* Place Order Button */}
              <button className="w-full bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white py-4 rounded-full font-bold text-base cursor-pointer hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all">
                Place Order ✨
              </button>

              <p className="text-center text-[10px] text-[#ad1457] mt-3 uppercase tracking-wider font-semibold">
                Secure checkout powered by PetalPay
              </p>

              {/* Trust badges */}
              <div className="flex justify-center gap-6 mt-6 pt-5 border-t border-[#fce4ec]">
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#fce4ec] rounded-full flex items-center justify-center mx-auto mb-1.5 text-lg">
                    🛡️
                  </div>
                  <span className="text-[10px] font-bold text-[#ad1457] uppercase tracking-wider">Secure Payment</span>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 bg-[#fce4ec] rounded-full flex items-center justify-center mx-auto mb-1.5 text-lg">
                    🚚
                  </div>
                  <span className="text-[10px] font-bold text-[#ad1457] uppercase tracking-wider">Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
