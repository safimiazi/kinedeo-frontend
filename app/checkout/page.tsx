"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, Package, CreditCard, Lock, ArrowLeft,
  Loader2, Shield, Truck, Banknote
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { API_BASE } from "@/lib/api/client";
import toast from "react-hot-toast";

interface ActiveCoupon {
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderAmount: number;
  maximumDiscount?: number;
}

interface CouponValidationResult {
  valid: boolean;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  calculatedDiscount: number;
  finalAmount: number;
}

import { useShippingSettings, calcShipping, DEFAULT_SHIPPING_SETTINGS } from "@/lib/hooks/use-shipping-settings";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, itemCount, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const { data: shippingData } = useShippingSettings();
  const shippingSettings = shippingData ?? DEFAULT_SHIPPING_SETTINGS;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    area: "",
    note: "",
  });

  // Auto-fill from logged-in user
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'sslcommerz' | null>(null);
  const [paymentMethodError, setPaymentMethodError] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponValidation, setCouponValidation] = useState<CouponValidationResult | null>(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [activeCoupons, setActiveCoupons] = useState<ActiveCoupon[]>([]);

  const shipping = calcShipping(shippingSettings, subtotal);
  const discount = couponValidation?.calculatedDiscount || 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const updateForm = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    async function loadActiveCoupons() {
      try {
        const res = await fetch(`${API_BASE}/coupons/active`);
        if (res.ok) setActiveCoupons(await res.json());
      } catch { /* silent */ }
    }
    loadActiveCoupons();
  }, []);

  useEffect(() => {
    if (!couponCode.trim()) { setCouponValidation(null); setCouponMessage(""); }
  }, [couponCode]);

  // ── Coupon ──────────────────────────────────────────────────────────────────

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply ?? couponCode).trim().toUpperCase();
    if (!code) { setCouponMessage("Enter a coupon code first."); return; }
    if (subtotal === 0) { setCouponMessage("Add items to your cart first."); return; }
    if (codeToApply) setCouponCode(code);
    setCouponLoading(true);
    setCouponMessage("");
    try {
      const res = await fetch(`${API_BASE}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code,
          orderAmount: subtotal,
          userEmail: form.email || undefined,
          userPhone: form.phone || undefined,
          items: items.map((i) => ({ productId: i.productId, sku: i.sku, qty: i.qty, price: i.price })),
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Invalid coupon");
      setCouponValidation(result);
      setCouponMessage(`Coupon applied — you saved ৳${result.calculatedDiscount.toLocaleString()}`);
      setCouponCode(result.code);
    } catch (err: unknown) {
      setCouponValidation(null);
      setCouponMessage(err instanceof Error ? err.message : "Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  // ── Place Order ─────────────────────────────────────────────────────────────

  const handlePlaceOrder = async () => {
    if (!form.name || !form.phone || !form.address || !form.city || !form.area) {
      toast.error("নাম, ফোন, বিভাগ, এলাকা এবং পূর্ণ ঠিকানা দিন");
      return;
    }
    if (!/^01[3-9]\d{8}$/.test(form.phone)) {
      toast.error("সঠিক বাংলাদেশি ফোন নম্বর দিন (01XXXXXXXXX)");
      return;
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error("সঠিক email ঠিকানা দিন");
      return;
    }
    if (!paymentMethod) {
      setPaymentMethodError(true);
      toast.error("Please select a payment method");
      return;
    }

    setPlacing(true);

    try {
      // Re-fetch current prices to avoid stale cart prices (e.g. flash sale ended)
      // Bundle items are skipped — their price is pre-calculated and locked at cart time
      const freshItems = await Promise.all(
        items.map(async (item) => {
          // Don't re-fetch price for bundle items — bundle discount must be preserved
          if (item.isBundleItem) return item;
          try {
            const res = await fetch(`${API_BASE}/products/${item.productId}`);
            if (!res.ok) return item;
            const product = await res.json();
            const variant = item.sku
              ? product.variants?.find((v: { sku: string }) => v.sku === item.sku)
              : undefined;
            const currentPrice =
              product.flashSalePrice ?? variant?.priceOverride ?? product.basePrice ?? item.price;
            if (currentPrice !== item.price) {
              toast(`Price updated for "${item.name}": ৳${item.price} → ৳${currentPrice}`, {
                icon: "ℹ️",
                duration: 4000,
              });
            }
            return { ...item, price: currentPrice };
          } catch { return item; }
        })
      );

      const payload = {
        items: freshItems.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          name: item.name,
          image: item.image,
          price: item.price,
          qty: item.qty,
          sku: item.sku,
          variantLabel: item.variantLabel,
          isBundleItem: item.isBundleItem,
          bundleId: item.bundleId,
        })),
        shippingAddress: {
          name: form.name,
          email: form.email || undefined,
          phone: form.phone,
          street: form.address,
          city: form.city,
          postcode: form.postcode || "0000",
          area: form.area || undefined,
          note: form.note || undefined,
        },
        deliveryMethod: "standard",
        couponCode: couponValidation?.code,
        discountAmount: discount,
      };

      if (paymentMethod === 'cod') {
        // ── COD path ──────────────────────────────────────────────────────────
        const res = await fetch(`${API_BASE}/orders/cod`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to place order");

        // Store the phone from the response so confirmation page can look up the order
        sessionStorage.setItem("checkout_phone", data.shippingAddress.phone);

        clearCart();
        router.push(`/checkout/confirmation?orderNumber=${data.orderNumber}`);
      } else {
        // ── SSLCommerz path (unchanged) ───────────────────────────────────────
        const res = await fetch(`${API_BASE}/payment/sslcommerz/init`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Failed to initiate payment");
        if (!data.redirectUrl) throw new Error("No payment URL received");

        // Store transaction ID so result page can show order details
        if (data.transactionId) {
          sessionStorage.setItem("pending_tran_id", data.transactionId);
        }

        // Save cart and phone to sessionStorage so:
        // - cart can be restored if payment fails/cancels
        // - phone can verify ownership on the result page
        sessionStorage.setItem("cart_snapshot", JSON.stringify(items));
        sessionStorage.setItem("checkout_phone", form.phone);

        // Redirect to SSLCommerz — do NOT clear cart here
        // Cart is cleared in checkout/result/page.tsx on success status
        window.location.href = data.redirectUrl;
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to place order. Please try again.");
      setPlacing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#fff0f5] font-nunito flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-[#ad1457]/40" />
          <h1 className="text-2xl font-bold text-[#2d1a24] mb-3">Your cart is empty</h1>
          <Link href="/" className="text-[#e91e8c] font-semibold hover:underline inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff0f5] font-nunito">
      <Navbar cartCount={itemCount} onCartOpen={() => {}} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Left: Form ── */}
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="font-playfair text-3xl font-extrabold text-[#2d1a24] mb-1">Checkout</h1>
              <p className="text-sm text-[#ad1457]/70">Complete your information to continue</p>
            </div>

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl p-6 border border-[#fce4ec] space-y-4">
              <h2 className="font-playfair text-lg font-bold text-[#2d1a24] flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#e91e8c]" /> Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { field: "name",     label: "পুরো নাম *",                     placeholder: "আপনার পুরো নাম",       type: "text" },
                  { field: "phone",    label: "ফোন নম্বর * (01XXXXXXXXX)",       placeholder: "01XXXXXXXXX",           type: "tel"  },
                  { field: "city",     label: "বিভাগ / শহর *",                  placeholder: "যেমন: Dhaka, Sylhet",   type: "text" },
                  { field: "area",     label: "জেলা / উপজেলা / এলাকা *",       placeholder: "যেমন: Uttara, Mirpur", type: "text" },
                ].map(({ field, label, placeholder, type }) => (
                  <div key={field}>
                    <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">{label}</label>
                    <input
                      type={type}
                      value={form[field as keyof typeof form]}
                      onChange={(e) => updateForm(field, e.target.value)}
                      placeholder={placeholder}
                      className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">পূর্ণ ঠিকানা * (বাড়ি নম্বর, রোড, মহল্লা)</label>
                <textarea
                  value={form.address}
                  onChange={(e) => updateForm("address", e.target.value)}
                  placeholder="বাড়ি নম্বর, রোড, মহল্লা লিখুন..."
                  rows={2}
                  className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">পোস্টকোড</label>
                  <input
                    type="text"
                    value={form.postcode}
                    onChange={(e) => updateForm("postcode", e.target.value)}
                    placeholder="পোস্টকোড (ঐচ্ছিক)"
                    className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Email (receipt-এর জন্য)</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateForm("email", e.target.value)}
                    placeholder="your@email.com (ঐচ্ছিক)"
                    className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">অর্ডার নোট (ঐচ্ছিক)</label>
                <textarea
                  value={form.note}
                  onChange={(e) => updateForm("note", e.target.value)}
                  placeholder='যেমন: "দরজায় রেখে যান", "সন্ধ্যার পরে দিন"...'
                  rows={2}
                  className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors resize-none"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white rounded-2xl p-6 border border-[#fce4ec] space-y-4">
              <h2 className="font-playfair text-lg font-bold text-[#2d1a24] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#e91e8c]" /> Payment Method
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Pay Online */}
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('sslcommerz'); setPaymentMethodError(false); }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === 'sslcommerz'
                      ? 'border-[#e91e8c] bg-pink-50 shadow-sm shadow-[#e91e8c]/20'
                      : 'border-[#fce4ec] bg-white hover:border-[#e91e8c]/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'sslcommerz' ? 'border-[#e91e8c]' : 'border-[#ad1457]/30'
                  }`}>
                    {paymentMethod === 'sslcommerz' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#e91e8c]" />
                    )}
                  </div>
                  <CreditCard className={`w-5 h-5 shrink-0 ${paymentMethod === 'sslcommerz' ? 'text-[#e91e8c]' : 'text-[#ad1457]/50'}`} />
                  <div>
                    <p className="text-sm font-bold text-[#2d1a24]">Pay Online</p>
                    <p className="text-[10px] text-[#6d1b3b]/60">SSLCommerz</p>
                  </div>
                </button>

                {/* Cash on Delivery */}
                <button
                  type="button"
                  onClick={() => { setPaymentMethod('cod'); setPaymentMethodError(false); }}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#e91e8c] bg-pink-50 shadow-sm shadow-[#e91e8c]/20'
                      : 'border-[#fce4ec] bg-white hover:border-[#e91e8c]/50'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    paymentMethod === 'cod' ? 'border-[#e91e8c]' : 'border-[#ad1457]/30'
                  }`}>
                    {paymentMethod === 'cod' && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#e91e8c]" />
                    )}
                  </div>
                  <Banknote className={`w-5 h-5 shrink-0 ${paymentMethod === 'cod' ? 'text-[#e91e8c]' : 'text-[#ad1457]/50'}`} />
                  <div>
                    <p className="text-sm font-bold text-[#2d1a24]">Cash on Delivery</p>
                    <p className="text-[10px] text-[#6d1b3b]/60">Pay when delivered</p>
                  </div>
                </button>
              </div>

              {/* COD inline note */}
              {paymentMethod === 'cod' && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 font-medium">
                  💵 Payment is due upon delivery. Please have the exact amount ready.
                </div>
              )}

              {/* Validation message */}
              {paymentMethodError && !paymentMethod && (
                <p className="text-xs text-red-500 font-semibold">
                  Please select a payment method to continue
                </p>
              )}
            </div>

            {/* Payment info — SSLCommerz (only shown when online payment is selected or nothing selected) */}
            {paymentMethod !== 'cod' && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-sm text-[#2d1a24] mb-1">Secure Payment via SSLCommerz</h3>
                    <p className="text-xs text-[#6d1b3b]/70">
                      Pay with Credit/Debit Cards, bKash, Nagad, Rocket, Internet Banking and more.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Right: Order Summary ── */}
          <div className="lg:w-[400px] shrink-0">
            <div className="bg-white rounded-2xl border-2 border-[#e91e8c]/20 p-6 sticky top-20 space-y-5">
              <h3 className="font-playfair text-xl font-bold text-[#2d1a24]">Order Summary</h3>

              {/* Items */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId || "d"}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-pink-100">
                      {item.image
                        ? <img src={item.image} alt="" className="w-full h-full object-cover" />
                        : <Package className="w-6 h-6 text-[#ad1457]/40" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs text-[#2d1a24] truncate">{item.name}</p>
                      {item.variantLabel && <p className="text-[10px] text-[#ad1457]/60">{item.variantLabel}</p>}
                      <p className="text-[10px] text-[#ad1457]">Qty: {item.qty}</p>
                    </div>
                    <span className="font-bold text-sm text-[#e91e8c] shrink-0">৳{(item.price * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#fce4ec]" />

              {/* Coupon */}
              <div className="bg-pink-50 rounded-xl p-4 border border-pink-100 space-y-3">
                <h4 className="text-sm font-semibold text-[#2d1a24]">Apply Coupon</h4>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon code"
                    className="flex-1 px-3 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] transition-all"
                  />
                  <button
                    onClick={() => handleApplyCoupon()}
                    disabled={!couponCode.trim() || couponLoading}
                    className="px-4 py-2.5 rounded-xl bg-[#e91e8c] text-white text-sm font-semibold hover:bg-[#c2185b] transition-all disabled:opacity-50"
                  >
                    {couponLoading ? "..." : "Apply"}
                  </button>
                </div>
                {couponMessage && (
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs ${couponValidation ? "text-green-700" : "text-red-500"}`}>{couponMessage}</p>
                    {couponValidation && (
                      <button onClick={() => { setCouponValidation(null); setCouponMessage(""); setCouponCode(""); }}
                        className="text-[10px] text-red-400 hover:text-red-600 font-semibold underline shrink-0">
                        Remove
                      </button>
                    )}
                  </div>
                )}
                {activeCoupons.length > 0 && (
                  <div>
                    <p className="text-[10px] text-[#6d1b3b]/60 mb-1.5">Available coupons</p>
                    <div className="flex flex-wrap gap-1.5">
                      {activeCoupons.map((c) => (
                        <button key={c.code} onClick={() => handleApplyCoupon(c.code)}
                          className="text-[10px] bg-white px-2.5 py-1 rounded-full border border-pink-100 text-[#2d1a24] hover:bg-pink-50 transition-all">
                          <strong>{c.code}</strong>{c.description ? ` • ${c.description}` : ""}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Price breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#2d1a24]/70">Subtotal</span>
                  <span className="font-semibold">৳{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#2d1a24]/70">Coupon Discount</span>
                    <span className="font-semibold text-red-600">-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#2d1a24]/70 flex items-center gap-1"><Truck className="w-3 h-3" /> Shipping</span>
                  <span className={`font-semibold ${shipping === 0 ? "text-green-600" : ""}`}>
                    {shipping === 0 ? "FREE" : `৳${shipping}`}
                  </span>
                </div>
                {shipping > 0 && <p className="text-[10px] text-[#ad1457] text-right">Free shipping on orders above ৳{shippingSettings.freeShippingThreshold.toLocaleString()}</p>}
              </div>

              <div className="border-t border-[#fce4ec]" />

              <div className="flex justify-between items-center">
                <span className="font-bold text-base text-[#2d1a24]">Total</span>
                <span className="font-playfair font-extrabold text-2xl text-[#e91e8c]">৳{total.toLocaleString()}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placing || !paymentMethod}
                className="w-full bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white py-4 rounded-full font-bold text-base hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {placing ? (
                  paymentMethod === 'cod'
                    ? <><Loader2 className="w-5 h-5 animate-spin" /> Placing Order...</>
                    : <><Loader2 className="w-5 h-5 animate-spin" /> Redirecting to Payment...</>
                ) : paymentMethod === 'cod' ? (
                  <><Banknote className="w-4 h-4" /> Place Order (Pay on Delivery)</>
                ) : (
                  <><CreditCard className="w-4 h-4" /> Place Order & Pay</>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-[10px] text-[#ad1457]/60">
                <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-green-600" /> Secure Payment</span>
                <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-green-600" /> SSL Encrypted</span>
              </div>

              <div className="pt-3 border-t border-[#fce4ec] text-center">
                <p className="text-[10px] text-[#ad1457]/50 mb-2">We Accept</p>
                <div className="flex items-center justify-center gap-3 flex-wrap text-xs">
                  <span>💳 Visa</span><span>💳 Mastercard</span>
                  <span>📱 bKash</span><span>📱 Nagad</span>
                  <span>🏦 Rocket</span><span>🏦 Net Banking</span>
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
