"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Package, 
  CreditCard, 
  Lock, 
  ArrowLeft, 
  Loader2,
  Shield,
  Truck
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

export default function CheckoutPage() {
  const { items, itemCount, subtotal } = useCart();
  const { user, isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    postcode: "",
    area: "",
    note: "",
  });
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponValidation, setCouponValidation] = useState<CouponValidationResult | null>(null);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [activeCoupons, setActiveCoupons] = useState<ActiveCoupon[]>([]);

  const shipping = subtotal >= 999 ? 0 : 99;
  const discount = couponValidation?.calculatedDiscount || 0;
  const total = Math.max(0, subtotal + shipping - discount);

  const updateForm = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  useEffect(() => {
    async function loadActiveCoupons() {
      try {
        const response = await fetch(`${API_BASE}/coupons/active`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
          return;
        }

        const coupons: ActiveCoupon[] = await response.json();
        setActiveCoupons(coupons);
      } catch {
        // ignore silently
      }
    }

    loadActiveCoupons();
  }, []);

  useEffect(() => {
    if (!couponCode.trim()) {
      setCouponValidation(null);
      setCouponMessage("");
    }
  }, [couponCode]);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const normalizedCode = (codeToApply ?? couponCode).trim().toUpperCase();
    if (!normalizedCode) {
      setCouponMessage("Enter a coupon code first.");
      setCouponValidation(null);
      return;
    }

    if (subtotal === 0) {
      setCouponMessage("Add items to your cart before applying a coupon.");
      setCouponValidation(null);
      return;
    }

    // Sync input field when applying from suggestion buttons
    if (codeToApply) {
      setCouponCode(normalizedCode);
    }

    setCouponLoading(true);
    setCouponMessage("");

    try {
      const response = await fetch(`${API_BASE}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: normalizedCode,
          orderAmount: subtotal,
          userEmail: form.email,
          items: items.map((item) => ({
            productId: item.productId,
            sku: item.sku,
            qty: item.qty,
            price: item.price,
          })),
        }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Invalid coupon code");
      }

      setCouponValidation(result);
      setCouponMessage(`Coupon applied: ${result.code} — you saved ৳${result.calculatedDiscount.toLocaleString()}`);
      setCouponCode(result.code);
    } catch (error: unknown) {
      setCouponValidation(null);
      setCouponMessage(error instanceof Error ? error.message : "Failed to validate coupon");
    } finally {
      setCouponLoading(false);
    }
  };

  const initiateSSLCommerzPayment = async (orderData: any) => {
    try {
      const response = await fetch(`${API_BASE}/payment/sslcommerz/init`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (data.success && data.redirectUrl) {
        // Redirect to SSLCommerz payment page
        window.location.href = data.redirectUrl;
      } else {
        throw new Error(data.message || "Failed to initiate payment");
      }
    } catch (error: any) {
      toast.error(error.message || "Payment initiation failed");
      setPlacing(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!form.name || !form.email || !form.phone || !form.address || !form.city || !form.postcode) {
      toast.error("Please fill in all required fields");
      return;
    }

    setPlacing(true);

    try {
      const orderPayload = {
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
          email: form.email,
          phone: form.phone,
          street: form.address,
          city: form.city,
          postcode: form.postcode,
          area: form.area || undefined,
          note: form.note || undefined,
        },
        deliveryMethod: 'standard',
        couponCode: couponValidation?.code,
        discountAmount: discount,
      };

      // Initiate SSLCommerz payment
      await initiateSSLCommerzPayment(orderPayload);
      
      // Note: Order will be created after successful payment via IPN
    } catch (err: any) {
      toast.error(err.message || "Failed to place order. Please try again.");
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
      <Navbar wishlistCount={0} cartCount={itemCount} onCartOpen={() => {}} />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left - Form */}
          <div className="flex-1">
            <h1 className="font-playfair text-3xl font-extrabold text-[#2d1a24] mb-2">Checkout</h1>
            <p className="font-nunito text-sm text-[#ad1457] mb-8">Complete your information to continue</p>

            {!isAuthenticated && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-6 text-sm text-blue-800 flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>
                  <Link href="/login" className="font-semibold text-[#e91e8c] hover:underline">Login</Link> to save your address for future orders
                </span>
              </div>
            )}

            {/* Shipping Information */}
            <div className="bg-white rounded-2xl p-6 border border-[#fce4ec] space-y-4">
              <h2 className="font-playfair text-lg font-bold text-[#2d1a24] flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#e91e8c]" />
                Shipping Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Full Name *</label>
                  <input 
                    type="text" 
                    value={form.name} 
                    onChange={(e) => updateForm("name", e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Email *</label>
                  <input 
                    type="email" 
                    value={form.email} 
                    onChange={(e) => updateForm("email", e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Phone *</label>
                  <input 
                    type="tel" 
                    value={form.phone} 
                    onChange={(e) => updateForm("phone", e.target.value)}
                    placeholder="01XXXXXXXXX"
                    className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">City *</label>
                  <input 
                    type="text" 
                    value={form.city} 
                    onChange={(e) => updateForm("city", e.target.value)}
                    placeholder="e.g. Dhaka"
                    className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Area</label>
                  <input 
                    type="text" 
                    value={form.area} 
                    onChange={(e) => updateForm("area", e.target.value)}
                    placeholder="e.g. Uttara, Mirpur"
                    className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors" 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Postcode *</label>
                  <input 
                    type="text" 
                    value={form.postcode} 
                    onChange={(e) => updateForm("postcode", e.target.value)}
                    placeholder="Enter postcode"
                    className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Delivery Address *</label>
                <input 
                  type="text" 
                  value={form.address} 
                  onChange={(e) => updateForm("address", e.target.value)}
                  placeholder="House/Road/Area"
                  className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors" 
                />
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Order Note (optional)</label>
                <textarea 
                  value={form.note} 
                  onChange={(e) => updateForm("note", e.target.value)}
                  placeholder="Any special instructions..." 
                  rows={2}
                  className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors resize-none" 
                />
              </div>
            </div>

            {/* Payment Info Note */}
            <div className="mt-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <div className="flex items-start gap-3">
                <CreditCard className="w-5 h-5 text-purple-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm text-[#2d1a24] mb-1">Secure Payment via SSLCommerz</h3>
                  <p className="text-xs text-[#6d1b3b]/70">
                    You will be redirected to SSLCommerz secure payment page where you can pay using:
                    Credit/Debit Cards, bKash, Nagad, Rocket, Internet Banking, and more.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Order Summary */}
          <div className="lg:w-[380px] shrink-0">
            <div className="bg-white rounded-2xl border-2 border-[#e91e8c]/20 p-6 sticky top-20">
              <h3 className="font-playfair text-xl font-bold text-[#2d1a24] mb-5">Order Summary</h3>
              
              <div className="space-y-3 mb-5 max-h-80 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.productId}-${item.variantId || "d"}`} className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-pink-50 rounded-lg flex items-center justify-center shrink-0 overflow-hidden">
                      {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <Package className="w-6 h-6 text-[#ad1457]/40" />}
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

              <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100 mb-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-sm font-semibold text-[#2d1a24]">Apply Coupon</h4>
                    <p className="text-xs text-[#6d1b3b]/70">Use code PETAL20 or any active coupon below to get a discount.</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-[1fr_auto] gap-3">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter coupon code"
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={!couponCode.trim() || couponLoading}
                    className="px-4 py-3 rounded-xl bg-[#e91e8c] text-white text-sm font-semibold hover:bg-[#c2185b] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {couponLoading ? "Checking..." : "Apply"}
                  </button>
                </div>
                {couponMessage && (
                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className={`text-xs ${couponValidation ? "text-green-700" : "text-red-500"}`}>
                      {couponMessage}
                    </p>
                    {couponValidation && (
                      <button
                        type="button"
                        onClick={() => {
                          setCouponValidation(null);
                          setCouponMessage("");
                          setCouponCode("");
                        }}
                        className="text-[10px] text-red-400 hover:text-red-600 font-semibold underline shrink-0"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
                {activeCoupons.length > 0 && (
                  <div className="mt-4">
                    <p className="text-[10px] text-[#6d1b3b]/70 mb-2">Available coupons</p>
                    <div className="flex flex-wrap gap-2">
                      {activeCoupons.map((active) => (
                        <button
                          key={active.code}
                          type="button"
                          onClick={() => handleApplyCoupon(active.code)}
                          className="text-[10px] bg-white px-3 py-1 rounded-full border border-pink-100 text-[#2d1a24] hover:bg-pink-50 transition-all"
                        >
                          <strong>{active.code}</strong>{active.description ? ` • ${active.description}` : ''}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-2.5 mb-5">
                <div className="flex justify-between text-sm">
                  <span className="text-[#2d1a24]/70">Subtotal</span>
                  <span className="font-semibold text-[#2d1a24]">৳{subtotal.toLocaleString()}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-[#2d1a24]/70">Coupon Discount</span>
                    <span className="font-semibold text-red-600">-৳{discount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-[#2d1a24]/70 flex items-center gap-1">
                    <Truck className="w-3 h-3" />
                    Shipping
                  </span>
                  <span className="font-semibold text-green-600">{shipping === 0 ? "FREE" : `৳${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-[10px] text-[#ad1457] text-right">
                    Free shipping on orders above ৳999
                  </p>
                )}
              </div>
              
              <div className="border-t border-[#fce4ec] my-4" />
              
              <div className="flex justify-between items-center mb-6">
                <span className="font-bold text-base text-[#2d1a24]">Total</span>
                <span className="font-playfair font-extrabold text-2xl text-[#e91e8c]">৳{total.toLocaleString()}</span>
              </div>
              
              <button 
                onClick={handlePlaceOrder} 
                disabled={placing}
                className="w-full bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white py-4 rounded-full font-bold text-base hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {placing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Redirecting to Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    Place Order & Pay
                  </>
                )}
              </button>
              
              <div className="mt-4 flex items-center justify-center gap-3">
                <div className="flex items-center gap-1">
                  <Lock className="w-3 h-3 text-green-600" />
                  <span className="text-[10px] text-[#ad1457]">Secure Payment</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-[#ad1457]/30" />
                <div className="flex items-center gap-1">
                  <Shield className="w-3 h-3 text-green-600" />
                  <span className="text-[10px] text-[#ad1457]">SSL Encrypted</span>
                </div>
              </div>

              {/* Payment Methods Icons */}
              <div className="mt-4 pt-4 border-t border-[#fce4ec]">
                <p className="text-[10px] text-[#ad1457]/60 text-center mb-2">We Accept:</p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  <span className="text-xs">💳 Visa</span>
                  <span className="text-xs">💳 Mastercard</span>
                  <span className="text-xs">📱 bKash</span>
                  <span className="text-xs">📱 Nagad</span>
                  <span className="text-xs">🏦 Rocket</span>
                  <span className="text-xs">🏦 Internet Banking</span>
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