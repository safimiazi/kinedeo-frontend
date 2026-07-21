"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Package,
  Clock,
  CheckCircle2,
  Truck,
  MapPin,
  XCircle,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  User,
  Heart,
  LogOut,
  Tag,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartPanel from "@/components/CartPanel";
import { useCart } from "@/lib/cart-context";
import { useAuth } from "@/lib/auth-context";
import { ordersApi, type Order } from "@/lib/api/orders";

// ─── Status helpers ───────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ElementType }> = {
  pending:    { label: "Order Placed",  color: "text-yellow-700", bg: "bg-yellow-100", icon: Clock },
  confirmed:  { label: "Confirmed",     color: "text-blue-700",   bg: "bg-blue-100",   icon: CheckCircle2 },
  processing: { label: "Processing",    color: "text-purple-700", bg: "bg-purple-100", icon: Package },
  shipped:    { label: "Shipped",       color: "text-indigo-700", bg: "bg-indigo-100", icon: Truck },
  delivered:  { label: "Delivered",     color: "text-green-700",  bg: "bg-green-100",  icon: MapPin },
  cancelled:  { label: "Cancelled",     color: "text-red-600",    bg: "bg-red-100",    icon: XCircle },
};

const STATUS_STEPS = ["pending", "confirmed", "processing", "shipped", "delivered"];
const STATUS_INDEX: Record<string, number> = Object.fromEntries(STATUS_STEPS.map((s, i) => [s, i]));

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { label: status, color: "text-gray-600", bg: "bg-gray-100", icon: Clock };
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full capitalize ${cfg.bg} ${cfg.color}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

function ProgressBar({ status }: { status: string }) {
  if (status === "cancelled") return null;
  const current = STATUS_INDEX[status] ?? 0;
  return (
    <div className="flex items-center gap-0 mt-4">
      {STATUS_STEPS.map((s, i) => {
        const done = i <= current;
        const Ic = STATUS_CONFIG[s]?.icon ?? Clock;
        return (
          <div key={s} className="flex items-center flex-1 last:flex-none">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${done ? "bg-[#e91e8c]" : "bg-pink-100"}`}>
              <Ic className={`w-3.5 h-3.5 ${done ? "text-white" : "text-[#ad1457]/30"}`} />
            </div>
            {i < STATUS_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-0.5 ${i < current ? "bg-[#e91e8c]" : "bg-pink-100"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Single Order Card ────────────────────────────────────────────────────────

function OrderCard({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-2xl border border-pink-100 hover:border-[#e91e8c]/30 hover:shadow-md transition-all overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 text-left"
      >
        <div className="flex items-start gap-3">
          {/* First product image */}
          <div className="w-12 h-12 rounded-xl bg-pink-50 border border-pink-100 overflow-hidden shrink-0 flex items-center justify-center">
            {order.items[0]?.image ? (
              <Image src={order.items[0].image} alt="" width={48} height={48} className="w-full h-full object-cover" />
            ) : (
              <Package className="w-5 h-5 text-[#ad1457]/30" />
            )}
          </div>
          <div>
            <p className="font-mono text-sm font-bold text-[#e91e8c]">{order.orderNumber}</p>
            <p className="text-xs text-[#6d1b3b]/50 mt-0.5">
              {new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "numeric", month: "short", year: "numeric",
              })}
              {" · "}
              {order.items.length} {order.items.length === 1 ? "item" : "items"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:flex-col sm:items-end">
          <StatusBadge status={order.status} />
          <div className="flex items-center gap-2">
            <span className="font-playfair font-extrabold text-[#e91e8c] text-lg">
              ৳{order.total.toLocaleString()}
            </span>
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-[#ad1457]/40" />
            ) : (
              <ChevronDown className="w-4 h-4 text-[#ad1457]/40" />
            )}
          </div>
        </div>
      </button>

      {/* Progress bar (always visible) */}
      {order.status !== "cancelled" && (
        <div className="px-5 pb-4 -mt-2">
          <ProgressBar status={order.status} />
        </div>
      )}

      {/* Expanded detail */}
      {expanded && (
        <div className="border-t border-pink-100 p-5 space-y-5 bg-[#fff8fb]">
          {/* Items */}
          <div>
            <p className="text-xs font-bold text-[#6d1b3b]/50 uppercase tracking-wide mb-3">Items</p>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-pink-50 border border-pink-100 overflow-hidden shrink-0 flex items-center justify-center">
                    {item.image ? (
                      <Image src={item.image} alt="" width={40} height={40} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-4 h-4 text-[#ad1457]/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#2d1a24] truncate">{item.name}</p>
                    {item.variantLabel && (
                      <p className="text-[11px] text-[#6d1b3b]/50">{item.variantLabel}</p>
                    )}
                    <p className="text-[11px] text-[#6d1b3b]/50">Qty: {item.qty}</p>
                  </div>
                  <span className="font-semibold text-sm text-[#e91e8c] shrink-0">
                    ৳{(item.price * item.qty).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Price summary */}
          <div className="bg-white rounded-xl border border-pink-100 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#6d1b3b]/60">Subtotal</span>
              <span className="font-medium">৳{order.subtotal.toLocaleString()}</span>
            </div>
            {order.couponCode && (order.discountAmount ?? 0) > 0 && (
              <div className="flex justify-between text-sm text-[#c2185b]">
                <span className="flex items-center gap-1">
                  <Tag className="w-3 h-3" /> {order.couponCode}
                </span>
                <span className="font-medium">-৳{order.discountAmount!.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-[#6d1b3b]/60 flex items-center gap-1">
                <Truck className="w-3 h-3" /> Shipping
              </span>
              <span className={`font-medium ${order.shippingCost === 0 ? "text-green-600" : ""}`}>
                {order.shippingCost === 0 ? "FREE" : `৳${order.shippingCost}`}
              </span>
            </div>
            <div className="border-t border-pink-100 pt-2 flex justify-between font-bold text-sm">
              <span className="text-[#2d1a24]">Total</span>
              <span className="text-[#e91e8c]">৳{order.total.toLocaleString()}</span>
            </div>
            {/* COD payment collection status */}
            {order.paymentMethod === "cod" && (
              <div className={`flex items-center justify-between text-xs font-semibold pt-1 border-t border-pink-50 ${
                order.paymentCollectionStatus === "collected" ? "text-green-600" : "text-amber-600"
              }`}>
                <span>💵 Cash on Delivery</span>
                <span>
                  {order.paymentCollectionStatus === "collected"
                    ? "✓ Payment collected"
                    : "⏳ Pay on delivery"}
                </span>
              </div>
            )}
            {/* Online payment status */}
            {order.paymentMethod === "sslcommerz" && (
              <div className={`flex items-center justify-between text-xs font-semibold pt-1 border-t border-pink-50 ${
                order.paymentVerified ? "text-green-600" : "text-yellow-600"
              }`}>
                <span>💳 Online Payment</span>
                <span>{order.paymentVerified ? "✓ Verified" : "⏳ Pending"}</span>
              </div>
            )}
          </div>

          {/* Shipping address */}
          <div className="grid sm:grid-cols-2 gap-4 text-xs">
            <div className="bg-white rounded-xl border border-pink-100 p-3">
              <p className="font-bold text-[#ad1457] uppercase tracking-wide mb-2 flex items-center gap-1">
                <Truck className="w-3 h-3" /> Delivering To
              </p>
              <p className="font-semibold text-[#2d1a24]">{order.shippingAddress.name}</p>
              <p className="text-[#6d1b3b]/60 mt-0.5">{order.shippingAddress.phone}</p>
              <p className="text-[#6d1b3b]/60">
                {order.shippingAddress.street}
                {order.shippingAddress.area ? `, ${order.shippingAddress.area}` : ""}
                , {order.shippingAddress.city}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-pink-100 p-3">
              <p className="font-bold text-[#ad1457] uppercase tracking-wide mb-2">Payment</p>
              <p className="font-semibold text-[#2d1a24] capitalize">
                {order.paymentMethod === "cod" ? "Cash on Delivery" :
                 order.paymentMethod === "sslcommerz" ? "Online (SSLCommerz)" :
                 order.paymentMethod}
              </p>
              {order.paymentMethod === "cod" ? (
                <p className={`text-xs font-semibold mt-1 ${
                  order.paymentCollectionStatus === "collected" ? "text-green-600" : "text-amber-600"
                }`}>
                  {order.paymentCollectionStatus === "collected"
                    ? "✓ Payment collected"
                    : "⏳ Pay when delivered"}
                </p>
              ) : (
                <p className={`text-xs font-semibold mt-1 ${order.paymentVerified ? "text-green-600" : "text-yellow-600"}`}>
                  {order.paymentVerified ? "✓ Payment verified" : "⏳ Pending verification"}
                </p>
              )}
              {order.cancelReason && (
                <p className="text-red-500 text-xs mt-1">Reason: {order.cancelReason}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AccountPage() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const { itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [activeTab, setActiveTab] = useState<"orders" | "profile">("orders");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/account");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch orders when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    setOrdersLoading(true);
    ordersApi
      .getMyOrders()
      .then(setOrders)
      .catch(() => setOrdersError("Could not load orders. Please try again."))
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#fff0f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#e91e8c]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fff0f5] font-nunito">
      <Navbar cartCount={itemCount} onCartOpen={() => setCartOpen(true)} />

      {/* Hero */}
      <div className="bg-linear-to-r from-[#e91e8c] via-[#c2185b] to-[#ad1457] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-semibold mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Home
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl font-bold font-playfair">
              {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div>
              <h1 className="font-playfair text-2xl md:text-3xl font-extrabold">{user?.name}</h1>
              <p className="text-white/70 text-sm mt-0.5">
                {user?.phone ? `+880 ${user.phone}` : user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Sidebar ── */}
          <aside className="lg:w-60 shrink-0">
            <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden sticky top-24">
              <nav className="p-2 space-y-1">
                {[
                  { id: "orders", label: "My Orders", icon: ShoppingBag },
                  { id: "profile", label: "Profile", icon: User },
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id as "orders" | "profile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      activeTab === id
                        ? "bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white"
                        : "text-[#6d1b3b] hover:bg-pink-50"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}

                <div className="mx-2 border-t border-pink-100 my-2" />

                <Link
                  href="/wishlist"
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#6d1b3b] hover:bg-pink-50 transition-colors"
                >
                  <Heart className="w-4 h-4" />
                  Wishlist
                </Link>

                <button
                  onClick={() => logout()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <main className="flex-1 min-w-0">

            {/* Orders Tab */}
            {activeTab === "orders" && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-playfair text-xl font-bold text-[#2d1a24]">My Orders</h2>
                  {orders.length > 0 && (
                    <span className="text-sm text-[#6d1b3b]/50 font-semibold">{orders.length} orders</span>
                  )}
                </div>

                {ordersLoading && (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-white rounded-2xl border border-pink-100 animate-pulse" />
                    ))}
                  </div>
                )}

                {ordersError && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-5 text-center text-sm text-red-600">
                    {ordersError}
                  </div>
                )}

                {!ordersLoading && !ordersError && orders.length === 0 && (
                  <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center">
                    <ShoppingBag className="w-14 h-14 text-[#ad1457]/20 mx-auto mb-4" />
                    <h3 className="font-playfair text-xl font-bold text-[#2d1a24] mb-2">No orders yet</h3>
                    <p className="text-sm text-[#6d1b3b]/60 mb-6">
                      You haven&apos;t placed any orders yet. Start shopping!
                    </p>
                    <Link
                      href="/products"
                      className="inline-block bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white px-8 py-3 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all"
                    >
                      Browse Products
                    </Link>
                  </div>
                )}

                {!ordersLoading && orders.length > 0 && (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <OrderCard key={order._id} order={order} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div>
                <h2 className="font-playfair text-xl font-bold text-[#2d1a24] mb-5">Profile</h2>
                <div className="bg-white rounded-2xl border border-pink-100 p-6 space-y-4">
                  {[
                    { label: "Full Name", value: user?.name ?? "—" },
                    { label: "Phone", value: user?.phone ? `+880 ${user.phone}` : "—" },
                    { label: "Email", value: user?.email ?? "—" },
                    { label: "Account Type", value: user?.role === "customer" ? "Customer" : user?.role ?? "—" },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 py-3 border-b border-pink-50 last:border-0">
                      <p className="text-xs font-bold text-[#6d1b3b]/50 uppercase tracking-wide sm:w-36 shrink-0">{label}</p>
                      <p className="text-sm font-semibold text-[#2d1a24]">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 bg-linear-to-r from-[#e91e8c]/10 to-pink-50 rounded-2xl p-5 border border-pink-100">
                  <p className="text-sm text-[#6d1b3b]/70 leading-relaxed">
                    To update your profile information, please{" "}
                    <Link href="/contact" className="text-[#e91e8c] font-semibold hover:underline">
                      contact us
                    </Link>
                    . We&apos;ll help you make the changes.
                  </p>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>

      <Footer />
      {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}
    </div>
  );
}
