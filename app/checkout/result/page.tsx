"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Package,
  Truck,
  CreditCard,
  Tag,
} from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { API_BASE } from "@/lib/api/client";

interface OrderItem {
  name: string;
  qty: number;
  price: number;
  image?: string;
  variantLabel?: string;
}

interface OrderDetails {
  _id: string;
  orderNumber: string;
  status: string;
  paymentMethod: string;
  paymentVerified: boolean;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount?: number;
  total: number;
  couponCode?: string;
  shippingAddress: {
    name: string;
    phone: string;
    email: string;
    street: string;
    city: string;
    postcode: string;
    area?: string;
  };
  createdAt: string;
}

function CheckoutResult() {
  const { clearCart, addItem } = useCart();
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const tranId = searchParams.get("tran_id");

  const success = status === "success";
  const cancelled = status === "cancelled";

  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    if (success) {
      clearCart();
      sessionStorage.removeItem("cart_snapshot");
    } else {
      // Restore cart from snapshot if payment failed or was cancelled
      const snapshot = sessionStorage.getItem("cart_snapshot");
      if (snapshot) {
        try {
          const savedItems = JSON.parse(snapshot);
          if (Array.isArray(savedItems) && savedItems.length > 0) {
            savedItems.forEach((item: import("@/lib/cart-context").CartItem) => {
              addItem(
                {
                  productId: item.productId,
                  variantId: item.variantId,
                  name: item.name,
                  image: item.image,
                  price: item.price,
                  originalPrice: item.originalPrice,
                  sku: item.sku,
                  variantLabel: item.variantLabel,
                  isBundleItem: item.isBundleItem,
                  bundleId: item.bundleId,
                },
                item.qty
              );
            });
          }
        } catch { /* ignore parse errors */ }
        sessionStorage.removeItem("cart_snapshot");
      }
    }
  }, [success]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!tranId) return;

    // Phone is saved to sessionStorage before SSLCommerz redirect
    // It's used here to verify order ownership on the backend
    const phone = sessionStorage.getItem("checkout_phone") ?? "";

    setLoadingOrder(true);
    const url = phone
      ? `${API_BASE}/orders/by-transaction/${encodeURIComponent(tranId)}?phone=${encodeURIComponent(phone)}`
      : `${API_BASE}/orders/by-transaction/${encodeURIComponent(tranId)}`;

    fetch(url)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setOrder(data);
      })
      .catch(() => {})
      .finally(() => {
        setLoadingOrder(false);
        sessionStorage.removeItem("pending_tran_id");
        sessionStorage.removeItem("checkout_phone");
      });
  }, [tranId]);

  return (
    <div className="w-full max-w-2xl space-y-6">
      {/* Status card */}
      <div className="bg-white rounded-[28px] border border-[#f3d4e0] shadow-sm p-8 text-center">
        <div className="mx-auto mb-5 w-20 h-20 rounded-full flex items-center justify-center bg-[#f8bbd0]/30">
          {success ? (
            <CheckCircle2 className="w-12 h-12 text-[#c2185b]" />
          ) : (
            <XCircle className="w-12 h-12 text-[#ad1457]" />
          )}
        </div>

        <h1 className="font-playfair text-3xl font-extrabold text-[#2d1a24] mb-3">
          {success
            ? "Payment Successful!"
            : cancelled
              ? "Payment Cancelled"
              : "Payment Failed"}
        </h1>

        <p className="text-sm text-[#6d1b3b]/70 mb-5">
          {success
            ? "Your order has been placed and payment confirmed. We'll start processing it right away."
            : cancelled
              ? "You cancelled the payment. Your cart items are still saved."
              : "The payment did not complete. Please try again or contact support."}
        </p>

        {tranId && (
          <div className="bg-[#fff0f5] border border-[#fce4ec] rounded-xl px-4 py-3 text-left text-sm mb-5">
            <p className="text-xs text-[#6d1b3b]/50 mb-0.5">
              Transaction Reference
            </p>
            <p className="font-mono text-xs text-[#2d1a24] break-all">
              {tranId}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white font-semibold text-sm hover:shadow-lg transition-all"
          >
            Continue Shopping
          </Link>
          {!success && (
            <Link
              href="/checkout"
              className="px-6 py-3 rounded-full border-2 border-[#e91e8c] text-[#e91e8c] font-semibold text-sm hover:bg-pink-50 transition-all"
            >
              Try Again
            </Link>
          )}
        </div>
      </div>

      {/* Order details */}
      {success && (
        <div className="bg-white rounded-[28px] border border-[#f3d4e0] shadow-sm p-6">
          {loadingOrder ? (
            <div className="flex items-center justify-center py-8 gap-2 text-[#ad1457]">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading order details...</span>
            </div>
          ) : order ? (
            <div className="space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="font-playfair text-lg font-bold text-[#2d1a24]">
                    Order Details
                  </h2>
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
                  <p className="font-mono text-sm font-bold text-[#e91e8c]">
                    {order.orderNumber}
                  </p>
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

              {/* Items */}
              <div className="space-y-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-11 h-11 bg-pink-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0 border border-pink-100">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Package className="w-5 h-5 text-[#ad1457]/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2d1a24] truncate">
                        {item.name}
                      </p>
                      {item.variantLabel && (
                        <p className="text-[10px] text-[#6d1b3b]/50">
                          {item.variantLabel}
                        </p>
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
                  <span className="font-medium">
                    ৳{order.subtotal.toLocaleString()}
                  </span>
                </div>
                {order.couponCode &&
                  order.discountAmount &&
                  order.discountAmount > 0 && (
                    <div className="flex justify-between text-[#c2185b]">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3" /> {order.couponCode}
                      </span>
                      <span className="font-medium">
                        -৳{order.discountAmount.toLocaleString()}
                      </span>
                    </div>
                  )}
                <div className="flex justify-between">
                  <span className="text-[#6d1b3b]/60 flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Shipping
                  </span>
                  <span
                    className={`font-medium ${order.shippingCost === 0 ? "text-green-600" : ""}`}
                  >
                    {order.shippingCost === 0
                      ? "FREE"
                      : `৳${order.shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-base pt-1 border-t border-pink-100">
                  <span className="text-[#2d1a24]">Total Paid</span>
                  <span className="text-[#e91e8c]">
                    ৳{order.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="border-t border-pink-100" />

              {/* Shipping + Payment info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-pink-50/60 rounded-xl p-3">
                  <p className="font-bold text-[#ad1457] uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <Truck className="w-3 h-3" /> Shipping To
                  </p>
                  <p className="font-semibold text-[#2d1a24]">
                    {order.shippingAddress.name}
                  </p>
                  <p className="text-[#6d1b3b]/70">
                    {order.shippingAddress.phone}
                  </p>
                  <p className="text-[#6d1b3b]/70">
                    {order.shippingAddress.street}
                    {order.shippingAddress.area
                      ? `, ${order.shippingAddress.area}`
                      : ""}
                    , {order.shippingAddress.city}
                  </p>
                </div>
                <div className="bg-pink-50/60 rounded-xl p-3">
                  <p className="font-bold text-[#ad1457] uppercase tracking-wide mb-1.5 flex items-center gap-1">
                    <CreditCard className="w-3 h-3" /> Payment
                  </p>
                  <p className="font-semibold text-[#2d1a24] capitalize">
                    {order.paymentMethod}
                  </p>
                  <p
                    className={`font-semibold ${order.paymentVerified ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {order.paymentVerified
                      ? "✓ Verified"
                      : "⏳ Pending verification"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-sm text-[#6d1b3b]/50">
              <p>Order details will appear here once confirmed.</p>
              <p className="text-xs mt-1">Reference: {tranId}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CheckoutResultPage() {
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
        <CheckoutResult />
      </Suspense>
    </div>
  );
}
