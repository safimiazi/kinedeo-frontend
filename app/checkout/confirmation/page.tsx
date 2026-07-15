"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  Loader2,
  Package,
  Truck,
  Banknote,
  Tag,
  ArrowLeft,
  MapPin,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { API_BASE } from "@/lib/api/client";

interface OrderDetails {
  _id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentCollectionStatus?: "unpaid" | "collected";
  items: Array<{
    name: string;
    qty: number;
    price: number;
    image?: string;
    variantLabel?: string;
  }>;
  subtotal: number;
  shippingCost: number;
  discountAmount?: number;
  total: number;
  couponCode?: string;
  shippingAddress: {
    name: string;
    phone: string;
    email?: string;
    street: string;
    city: string;
    postcode: string;
    area?: string;
  };
  createdAt: string;
}

function CODConfirmation() {
  const { clearCart } = useCart();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber") ?? "";

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [fetchFailed, setFetchFailed] = useState(false);

  useEffect(() => {
    // Clear the cart and snapshot on mount
    clearCart();
    sessionStorage.removeItem("cart_snapshot");

    const phone = sessionStorage.getItem("checkout_phone") ?? "";

    if (!orderNumber) {
      setLoadingOrder(false);
      setFetchFailed(true);
      return;
    }

    const url = phone
      ? `${API_BASE}/orders/by-order-number/${encodeURIComponent(orderNumber)}?phone=${encodeURIComponent(phone)}`
      : `${API_BASE}/orders/by-order-number/${encodeURIComponent(orderNumber)}`;

    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) {
          setOrder(data);
        } else {
          setFetchFailed(true);
        }
      })
      .catch(() => {
        setFetchFailed(true);
      })
      .finally(() => {
        setLoadingOrder(false);
        sessionStorage.removeItem("checkout_phone");
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loadingOrder) {
    return (
      <div className="w-full max-w-2xl flex items-center justify-center py-16">
        <div className="flex items-center gap-2 text-[#ad1457]">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-semibold">Loading your order...</span>
        </div>
      </div>
    );
  }

  // Fallback when fetch fails or returns 404
  if (fetchFailed || !order) {
    return (
      <div className="w-full max-w-2xl space-y-6">
        <div className="bg-white rounded-[28px] border border-[#f3d4e0] shadow-sm p-8 text-center">
          <div className="mx-auto mb-5 w-20 h-20 rounded-full flex items-center justify-center bg-[#f8bbd0]/30">
            <CheckCircle2 className="w-12 h-12 text-[#c2185b]" />
          </div>
          <h1 className="font-playfair text-3xl font-extrabold text-[#2d1a24] mb-3">
            Order Received
          </h1>
          <p className="text-sm text-[#6d1b3b]/70 mb-5">
            Thank you for your order! We&apos;ve received it and will process it shortly.
          </p>
          {orderNumber && (
            <div className="bg-[#fff0f5] border border-[#fce4ec] rounded-xl px-4 py-3 text-left text-sm mb-5">
              <p className="text-xs text-[#6d1b3b]/50 mb-0.5">Order Number</p>
              <p className="font-mono text-sm font-bold text-[#e91e8c]">{orderNumber}</p>
            </div>
          )}
          <p className="text-xs text-[#6d1b3b]/60 mb-6">
            If you need help, please contact our support team with your order number{" "}
            {orderNumber && (
              <span className="font-mono font-bold text-[#e91e8c]">{orderNumber}</span>
            )}{" "}
            as your reference.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white font-semibold text-sm hover:shadow-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Success header card */}
      <div className="bg-white rounded-[28px] border border-[#f3d4e0] shadow-sm p-8 text-center">
        <div className="mx-auto mb-5 w-20 h-20 rounded-full flex items-center justify-center bg-[#f8bbd0]/30">
          <CheckCircle2 className="w-12 h-12 text-[#c2185b]" />
        </div>
        <h1 className="font-playfair text-3xl font-extrabold text-[#2d1a24] mb-3">
          Order Placed!
        </h1>
        <p className="text-sm text-[#6d1b3b]/70 mb-5">
          Your order has been received and is being prepared. Our team will confirm it shortly.
        </p>

        {/* COD notice banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 font-medium text-left mb-5 flex items-start gap-2">
          <Banknote className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
          <span>
            <strong>Pay on Delivery</strong> — Payment is due in cash upon delivery. Please have
            the exact amount of{" "}
            <strong className="text-amber-900">৳{order.total.toLocaleString()}</strong> ready when
            your order arrives.
          </span>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white font-semibold text-sm hover:shadow-lg transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>

      {/* Order details card */}
      <div className="bg-white rounded-[28px] border border-[#f3d4e0] shadow-sm p-6">
        <div className="space-y-5">
          {/* Header: order number, date, status */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="font-playfair text-lg font-bold text-[#2d1a24]">Order Details</h2>
              <p className="text-xs text-[#6d1b3b]/50 mt-0.5">
                {new Date(order.createdAt).toLocaleString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-sm font-bold text-[#e91e8c]">{order.orderNumber}</p>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                  order.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-600"
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          {/* Item list */}
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-11 h-11 bg-pink-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-pink-100">
                  {item.image ? (
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-5 h-5 text-[#ad1457]/30" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#2d1a24] truncate">{item.name}</p>
                  {item.variantLabel && (
                    <p className="text-[10px] text-[#6d1b3b]/50">{item.variantLabel}</p>
                  )}
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold text-[#e91e8c]">
                    ৳{(item.price * item.qty).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-[#6d1b3b]/40">
                    ৳{item.price} × {item.qty}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-pink-100" />

          {/* Price breakdown */}
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span className="text-[#6d1b3b]/60">Subtotal</span>
              <span className="font-medium">৳{order.subtotal.toLocaleString()}</span>
            </div>
            {order.couponCode && order.discountAmount && order.discountAmount > 0 && (
              <div className="flex justify-between text-[#c2185b]">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {order.couponCode}
                </span>
                <span className="font-medium">-৳{order.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#6d1b3b]/60 flex items-center gap-1">
                <Truck className="w-3 h-3" /> Shipping
              </span>
              <span className={`font-medium ${order.shippingCost === 0 ? "text-green-600" : ""}`}>
                {order.shippingCost === 0 ? "FREE" : `৳${order.shippingCost}`}
              </span>
            </div>
            <div className="flex justify-between font-bold text-base pt-1 border-t border-pink-100">
              <span className="text-[#2d1a24]">Total to Pay</span>
              <span className="text-[#e91e8c]">৳{order.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t border-pink-100" />

          {/* Shipping address */}
          <div className="bg-pink-50/60 rounded-xl p-3 text-xs">
            <p className="font-bold text-[#ad1457] uppercase tracking-wide mb-1.5 flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Deliver To
            </p>
            <p className="font-semibold text-[#2d1a24]">{order.shippingAddress.name}</p>
            <p className="text-[#6d1b3b]/70">{order.shippingAddress.phone}</p>
            <p className="text-[#6d1b3b]/70">
              {order.shippingAddress.street}
              {order.shippingAddress.area ? `, ${order.shippingAddress.area}` : ""},{" "}
              {order.shippingAddress.city}
            </p>
          </div>

          {/* COD reminder */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800 flex items-start gap-2">
            <Banknote className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
            <span>
              💵 Payment is due in cash upon delivery. Please have the exact amount ready when your
              order arrives.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CODConfirmationPage() {
  return (
    <div className="min-h-screen bg-[#fff0f5] font-nunito flex items-center justify-center px-4 py-10">
      <Suspense
        fallback={
          <div className="flex items-center gap-2 text-[#ad1457]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-semibold">Loading...</span>
          </div>
        }
      >
        <CODConfirmation />
      </Suspense>
    </div>
  );
}
