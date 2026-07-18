"use client";

import { useState } from "react";
import { Search, Package, Truck, CheckCircle2, Clock, MapPin } from "lucide-react";
import StaticPageLayout from "@/components/StaticPageLayout";
import { API_BASE } from "@/lib/api/client";

interface OrderDetails {
  orderNumber: string;
  status: string;
  createdAt: string;
  shippingAddress: { name: string; city: string; street: string };
  items: { name: string; qty: number; price: number }[];
  total: number;
}

const STATUS_STEPS = [
  { key: "pending", label: "Order Placed", icon: Clock },
  { key: "confirmed", label: "Confirmed", icon: CheckCircle2 },
  { key: "processing", label: "Processing", icon: Package },
  { key: "shipped", label: "Shipped", icon: Truck },
  { key: "delivered", label: "Delivered", icon: MapPin },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0, confirmed: 1, processing: 2, shipped: 3, delivered: 4,
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderId.trim() || !phone.trim()) {
      setError("Please enter both Order ID and phone number.");
      return;
    }
    setLoading(true);
    setError("");
    setOrder(null);
    try {
      const res = await fetch(
        `${API_BASE}/orders/by-transaction/${encodeURIComponent(orderId.trim())}?phone=${encodeURIComponent(phone.trim())}`
      );
      if (!res.ok) throw new Error("Order not found. Please check your Order ID and phone number.");
      const data = await res.json();
      setOrder(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? (STATUS_INDEX[order.status] ?? 0) : -1;

  return (
    <StaticPageLayout
      title="Track Your Order"
      subtitle="Enter your Order ID and phone number to see the latest status."
      backLabel="Home"
      backHref="/"
    >
      {/* Search card */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 sm:p-8 shadow-sm mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Order ID / Transaction ID"
            className="flex-1 px-4 py-3 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] transition-colors"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone number"
            className="sm:w-48 px-4 py-3 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] transition-colors"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {loading ? "Searching..." : "Track"}
          </button>
        </form>
        {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
      </div>

      {/* Result */}
      {order && (
        <div className="bg-white rounded-2xl border border-pink-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="bg-linear-to-r from-[#e91e8c]/10 to-pink-50 px-6 py-4 border-b border-pink-100 flex flex-wrap gap-3 items-center justify-between">
            <div>
              <p className="font-playfair text-lg font-bold text-[#2d1a24]">Order #{order.orderNumber}</p>
              <p className="text-xs text-[#6d1b3b]/50 mt-0.5">
                Placed {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            </div>
            <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
              order.status === "delivered" ? "bg-green-100 text-green-700"
              : order.status === "shipped" ? "bg-blue-100 text-blue-700"
              : order.status === "cancelled" ? "bg-red-100 text-red-600"
              : "bg-yellow-100 text-yellow-700"
            }`}>{order.status}</span>
          </div>

          {/* Progress stepper */}
          {order.status !== "cancelled" && (
            <div className="px-6 py-6 border-b border-pink-100">
              <div className="flex items-center justify-between relative">
                {/* Track line */}
                <div className="absolute left-0 right-0 top-4 h-0.5 bg-pink-100 z-0" />
                <div
                  className="absolute left-0 top-4 h-0.5 bg-linear-to-r from-[#e91e8c] to-[#c2185b] z-0 transition-all duration-500"
                  style={{ width: `${(currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
                />
                {STATUS_STEPS.map((step, i) => {
                  const Icon = step.icon;
                  const done = i <= currentStep;
                  return (
                    <div key={step.key} className="flex flex-col items-center gap-2 z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                        done ? "bg-[#e91e8c] shadow-lg shadow-[#e91e8c]/30" : "bg-pink-100"
                      }`}>
                        <Icon className={`w-4 h-4 ${done ? "text-white" : "text-[#ad1457]/40"}`} />
                      </div>
                      <p className={`text-[10px] font-semibold text-center max-w-[60px] leading-tight ${
                        done ? "text-[#e91e8c]" : "text-[#6d1b3b]/40"
                      }`}>{step.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Items + address */}
          <div className="grid sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-pink-100">
            <div className="p-6">
              <p className="font-semibold text-sm text-[#2d1a24] mb-3">Items Ordered</p>
              <ul className="space-y-2">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between text-sm">
                    <span className="text-[#6d1b3b]/70 truncate mr-2">{item.name} × {item.qty}</span>
                    <span className="font-semibold text-[#e91e8c] shrink-0">৳{(item.price * item.qty).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-3 pt-3 border-t border-pink-100 flex justify-between font-bold text-sm">
                <span className="text-[#2d1a24]">Total</span>
                <span className="text-[#e91e8c]">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
            <div className="p-6">
              <p className="font-semibold text-sm text-[#2d1a24] mb-3">Delivering To</p>
              <p className="font-semibold text-[#2d1a24] text-sm">{order.shippingAddress.name}</p>
              <p className="text-sm text-[#6d1b3b]/60 mt-1">{order.shippingAddress.street}</p>
              <p className="text-sm text-[#6d1b3b]/60">{order.shippingAddress.city}</p>
            </div>
          </div>
        </div>
      )}

      {/* Help note */}
      {!order && !loading && (
        <p className="text-center text-sm text-[#6d1b3b]/50 mt-4">
          Can&apos;t find your order?{" "}
          <a href="/contact" className="text-[#e91e8c] font-semibold hover:underline">Contact us</a> for help.
        </p>
      )}
    </StaticPageLayout>
  );
}
