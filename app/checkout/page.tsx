"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { ordersApi } from "@/lib/api/orders";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [deliveryMethod, setDeliveryMethod] = useState<"standard" | "express">("standard");
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    street: "",
    city: "",
    area: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "bkash" | "nagad">("cod");
  const [placing, setPlacing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shipping = deliveryMethod === "express" ? 120 : (subtotal >= 999 ? 0 : 60);
  const total = subtotal + shipping;

  const updateForm = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  const handlePlaceOrder = async () => {
    if (!form.name || !form.phone || !form.street || !form.city) {
      alert("Please fill in all required fields");
      return;
    }
    setPlacing(true);
    try {
      const payload = {
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty,
          sku: item.sku,
          variantLabel: item.variantLabel,
        })),
        shippingAddress: {
          name: form.name,
          phone: form.phone,
          street: form.street,
          city: form.city,
          area: form.area || undefined,
          note: form.note || undefined,
        },
        deliveryMethod,
        paymentMethod,
      };

      if (isAuthenticated) {
        await ordersApi.createAuthenticated(payload);
      } else {
        await ordersApi.create(payload);
      }

      clearCart();
      setOrderPlaced(true);
    } catch (err: any) {
      alert(err.message || "Failed to place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-[#fff0f5] font-nunito flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl block mb-4">🛒</span>
          <h1 className="text-2xl font-bold text-[#2d1a24] mb-3">Your cart is empty</h1>
          <Link href="/" className="text-[#e91e8c] font-semibold hover:underline">← Continue Shopping</Link>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#fff0f5] font-nunito flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <span className="text-7xl block mb-6">🎉</span>
          <h1 className="font-playfair text-3xl font-extrabold text-[#2d1a24] mb-3">Order Placed!</h1>
          <p className="text-sm text-[#6d1b3b]/70 mb-6">Thank you for your order. We will contact you shortly to confirm delivery.</p>
          <Link href="/" className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-8 py-3 rounded-full font-bold text-sm hover:shadow-lg transition-all inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff0f5] font-nunito">
      <Navbar wishlistCount={0} cartCount={itemCount} onCartOpen={() => {}} />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Form */}
          <div className="flex-1">
            <h1 className="font-playfair text-3xl font-extrabold text-[#2d1a24] mb-2">Checkout</h1>
            <p className="font-nunito text-sm text-[#ad1457] mb-8">Complete your order</p>

            {!isAuthenticated && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 mb-6 text-sm text-yellow-800">
                <Link href="/login" className="font-semibold text-[#e91e8c] hover:underline">Login</Link> to save your address for future orders
              </div>
            )}

            {/* Shipping Address */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 bg-[#e91e8c] rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                <h2 className="font-playfair text-lg font-bold text-[#2d1a24]">Shipping Address</h2>
              </div>
              <div className="bg-white rounded-2xl p-5 border border-[#fce4ec] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Full Name *</label>
                    <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)}
                      className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Phone *</label>
                    <input type="tel" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Street Address *</label>
                  <input type="text" value={form.street} onChange={(e) => updateForm("street", e.target.value)}
                    placeholder="House/Road/Area"
                    className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">City *</label>
                    <input type="text" value={form.city} onChange={(e) => updateForm("city", e.target.value)}
                      placeholder="e.g. Dhaka"
                      className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Area</label>
                    <input type="text" value={form.area} onChange={(e) => updateForm("area", e.target.value)}
                      placeholder="e.g. Dhanmondi"
                      className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Order Note (optional)</label>
                  <textarea value={form.note} onChange={(e) => updateForm("note", e.target.value)}
                    placeholder="Any special instructions..." rows={2}
                    className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors resize-none" />
                </div>
              </div>
            </div>

            {/* Delivery Method */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 bg-[#e91e8c] rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                <h2 className="font-playfair text-lg font-bold text-[#2d1a24]">Delivery Method</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button onClick={() => setDeliveryMethod("standard")}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${deliveryMethod === "standard" ? "border-[#e91e8c] bg-[#e91e8c]/5" : "border-[#fce4ec] bg-white hover:border-[#e91e8c]/30"}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-[#2d1a24]">Standard</span>
                    <span className="font-bold text-sm text-green-600">{subtotal >= 999 ? "Free" : "৳60"}</span>
                  </div>
                  <span className="text-xs text-[#ad1457]">3-5 business days</span>
                </button>
                <button onClick={() => setDeliveryMethod("express")}
                  className={`p-5 rounded-2xl border-2 text-left transition-all cursor-pointer ${deliveryMethod === "express" ? "border-[#e91e8c] bg-[#e91e8c]/5" : "border-[#fce4ec] bg-white hover:border-[#e91e8c]/30"}`}>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-sm text-[#2d1a24]">Express</span>
                    <span className="font-bold text-sm text-[#e91e8c]">৳120</span>
                  </div>
                  <span className="text-xs text-[#ad1457]">1-2 business days</span>
                </button>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-7 h-7 bg-[#e91e8c] rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                <h2 className="font-playfair text-lg font-bold text-[#2d1a24]">Payment Method</h2>
              </div>
              <div className="space-y-3">
                {[
                  { id: "cod" as const, label: "Cash on Delivery", icon: "💵", desc: "Pay when you receive" },
                  { id: "bkash" as const, label: "bKash", icon: "📱", desc: "Mobile payment" },
                  { id: "nagad" as const, label: "Nagad", icon: "📲", desc: "Mobile payment" },
                ].map((method) => (
                  <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                    className={`w-full p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all cursor-pointer ${paymentMethod === method.id ? "border-[#e91e8c] bg-[#e91e8c]/5" : "border-[#fce4ec] bg-white hover:border-[#e91e8c]/30"}`}>
                    <span className="text-2xl">{method.icon}</span>
                    <div>
                      <div className="font-bold text-sm text-[#2d1a24]">{method.label}</div>
                      <div className="text-xs text-[#ad1457]">{method.desc}</div>
                    </div>
                    {paymentMethod === method.id && <span className="ml-auto text-[#e91e8c] font-bold">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:w-[360px] shrink-0">
            <div className="bg-white rounded-2xl border-2 border-[#e91e8c]/20 p-6 sticky top-20">
              <h3 className="font-playfair text-xl font-bold text-[#2d1a24] mb-5">Order Summary</h3>
              <div className="space-y-3 mb-5 max-h-60 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId || "d"}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <span className="text-lg">📦</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-[#2d1a24] truncate">{item.name}</div>
                      <div className="text-[10px] text-[#ad1457]">Qty: {item.qty}</div>
                    </div>
                    <span className="font-bold text-sm text-[#e91e8c]">৳{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#fce4ec] my-4" />
              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#2d1a24]/70">Subtotal</span>
                  <span className="font-semibold text-[#2d1a24]">৳{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#2d1a24]/70">Shipping</span>
                  <span className="font-semibold text-green-600">{shipping === 0 ? "FREE" : `৳${shipping}`}</span>
                </div>
              </div>
              <div className="border-t border-[#fce4ec] my-4" />
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-base text-[#2d1a24]">Total</span>
                <span className="font-playfair font-extrabold text-2xl text-[#e91e8c]">৳{total.toLocaleString()}</span>
              </div>
              <button onClick={handlePlaceOrder} disabled={placing}
                className="w-full bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white py-4 rounded-full font-bold text-base hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all disabled:opacity-50">
                {placing ? "Placing Order..." : "Place Order ✨"}
              </button>
              <p className="text-center text-[10px] text-[#ad1457] mt-3">🔒 Your information is secure</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
