"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  Shield,
  CheckCircle,
  XCircle,
  ShoppingBag,
  TrendingUp,
  Package,
  Truck,
  Clock,
  Ban,
  CreditCard,
  MapPin,
  UserX,
  UserCheck,
  BarChart3,
  Star,
  Hash,
  Wallet,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface OrderItem {
  name: string;
  price: number;
  qty: number;
  image?: string;
  variantLabel?: string;
  isBundleItem?: boolean;
}

interface ShippingAddress {
  name: string;
  phone: string;
  email: string;
  street: string;
  city: string;
  postcode: string;
  area?: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  status: string;
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  discountAmount?: number;
  total: number;
  couponCode?: string;
  createdAt: string;
}

interface Customer {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  role: string;
  isActive: boolean;
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  addresses: { street: string; city: string; state: string; postcode: string }[];
  lastLoginAt?: string;
  createdAt: string;
}

interface CustomerStats {
  totalOrders: number;
  totalSpent: number;
  completedOrders: number;
  cancelledOrders: number;
  pendingOrders: number;
  averageOrderValue: number;
  lastOrderAt: string | null;
}

interface CustomerDetailsResponse {
  customer: Customer;
  orders: Order[];
  stats: CustomerStats;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  pending:    { label: "Pending",    color: "bg-yellow-100 text-yellow-700", icon: <Clock className="w-3 h-3" /> },
  confirmed:  { label: "Confirmed",  color: "bg-blue-100 text-blue-700",    icon: <CheckCircle className="w-3 h-3" /> },
  processing: { label: "Processing", color: "bg-purple-100 text-purple-700", icon: <Package className="w-3 h-3" /> },
  shipped:    { label: "Shipped",    color: "bg-indigo-100 text-indigo-700", icon: <Truck className="w-3 h-3" /> },
  delivered:  { label: "Delivered",  color: "bg-green-100 text-green-700",  icon: <CheckCircle className="w-3 h-3" /> },
  cancelled:  { label: "Cancelled",  color: "bg-red-100 text-red-700",      icon: <Ban className="w-3 h-3" /> },
};

const paymentLabel: Record<string, string> = {
  cod: "Cash on Delivery",
  bkash: "bKash",
  nagad: "Nagad",
  sslcommerz: "Card / Online",
};

function fmt(n: number) {
  return `৳${n.toLocaleString("en-BD", { minimumFractionDigits: 0 })}`;
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-32 bg-pink-100 rounded-lg" />
      <div className="bg-white rounded-3xl border border-pink-100 p-8 h-40" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => <div key={i} className="bg-white rounded-2xl border border-pink-100 h-24" />)}
      </div>
      <div className="bg-white rounded-3xl border border-pink-100 p-6 h-96" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<CustomerDetailsResponse>({
    queryKey: ["customer-details", id],
    queryFn: () => apiRequest<CustomerDetailsResponse>(`/customers/${id}/details`),
    enabled: !!id,
  });

  const toggleActive = useMutation({
    mutationFn: () => apiRequest(`/customers/${id}/toggle-active`, { method: "PUT" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customer-details", id] });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });

  if (isLoading) return <Skeleton />;
  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="text-4xl">😕</div>
        <p className="text-[#6d1b3b]/60">Customer not found.</p>
        <button onClick={() => router.back()} className="text-sm text-[#e91e8c] hover:underline">
          ← Go back
        </button>
      </div>
    );
  }

  const { customer, orders, stats } = data;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="inline-flex items-center gap-2 text-sm text-[#6d1b3b]/60 hover:text-[#e91e8c] transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Customers
      </button>

      {/* ── Hero Card ── */}
      <div className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
        {/* gradient banner */}
        <div className="h-24 bg-linear-to-r from-[#e91e8c] via-[#c2185b] to-[#ad1457] relative">
          <div className="absolute inset-0 opacity-20"
            style={{ backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}
          />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar overlapping banner */}
          <div className="flex items-end justify-between -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-[#e91e8c] to-[#c2185b] flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white">
              {getInitials(customer.name)}
            </div>
            <div className="flex items-center gap-2 pb-1">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${
                customer.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {customer.isActive ? <CheckCircle className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                {customer.isActive ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => toggleActive.mutate()}
                disabled={toggleActive.isPending}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  customer.isActive
                    ? "bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
                    : "bg-green-50 text-green-600 hover:bg-green-100 border-green-200"
                }`}
              >
                {customer.isActive ? <><UserX className="w-3.5 h-3.5" /> Deactivate</> : <><UserCheck className="w-3.5 h-3.5" /> Activate</>}
              </button>
            </div>
          </div>

          {/* Name + meta */}
          <div className="space-y-3">
            <div>
              <h1 className="text-xl font-bold text-[#2d1a24] font-playfair">{customer.name}</h1>
              <p className="text-xs text-[#6d1b3b]/40 mt-0.5">Customer ID: {customer._id}</p>
            </div>

            <div className="flex flex-wrap gap-4">
              {customer.email && (
                <div className="flex items-center gap-1.5 text-sm text-[#6d1b3b]/70">
                  <Mail className="w-4 h-4 text-[#e91e8c]/60" />
                  <span>{customer.email}</span>
                  {customer.isEmailVerified && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                </div>
              )}
              {customer.phone && (
                <div className="flex items-center gap-1.5 text-sm text-[#6d1b3b]/70">
                  <Phone className="w-4 h-4 text-[#e91e8c]/60" />
                  <span>{customer.phone}</span>
                  {customer.isPhoneVerified && <CheckCircle className="w-3.5 h-3.5 text-green-500" />}
                </div>
              )}
              <div className="flex items-center gap-1.5 text-sm text-[#6d1b3b]/60">
                <Calendar className="w-4 h-4 text-[#e91e8c]/60" />
                <span>Joined {fmtDate(customer.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-sm text-[#6d1b3b]/60">
                <Shield className="w-4 h-4 text-[#e91e8c]/60" />
                <span className="capitalize">{customer.role}</span>
              </div>
              {customer.lastLoginAt && (
                <div className="flex items-center gap-1.5 text-sm text-[#6d1b3b]/60">
                  <Clock className="w-4 h-4 text-[#e91e8c]/60" />
                  <span>Last seen {fmtDate(customer.lastLoginAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            value: stats.totalOrders,
            icon: <ShoppingBag className="w-5 h-5 text-[#e91e8c]" />,
            bg: "from-pink-50 to-white",
            iconBg: "from-[#e91e8c]/10 to-[#c2185b]/10",
          },
          {
            label: "Total Spent",
            value: fmt(stats.totalSpent),
            icon: <Wallet className="w-5 h-5 text-emerald-600" />,
            bg: "from-emerald-50 to-white",
            iconBg: "from-emerald-100 to-emerald-50",
          },
          {
            label: "Avg Order Value",
            value: fmt(Math.round(stats.averageOrderValue)),
            icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
            bg: "from-blue-50 to-white",
            iconBg: "from-blue-100 to-blue-50",
          },
          {
            label: "Completed",
            value: `${stats.completedOrders} / ${stats.totalOrders}`,
            icon: <Star className="w-5 h-5 text-amber-500" />,
            bg: "from-amber-50 to-white",
            iconBg: "from-amber-100 to-amber-50",
          },
        ].map((s) => (
          <div key={s.label} className={`bg-linear-to-br ${s.bg} rounded-2xl border border-pink-100 p-5 hover:shadow-md hover:shadow-pink-100/40 transition-all`}>
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${s.iconBg} flex items-center justify-center shrink-0`}>
                {s.icon}
              </div>
              <div>
                <p className="text-xs text-[#6d1b3b]/55 font-medium leading-tight">{s.label}</p>
                <p className="text-lg font-bold text-[#2d1a24] mt-0.5">{s.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Secondary Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending / Active", value: stats.pendingOrders, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100" },
          { label: "Cancelled", value: stats.cancelledOrders, color: "text-red-600", bg: "bg-red-50 border-red-100" },
          { label: "Last Order", value: stats.lastOrderAt ? fmtDate(stats.lastOrderAt) : "—", color: "text-[#2d1a24]", bg: "bg-white border-pink-100" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.bg}`}>
            <p className="text-xs text-[#6d1b3b]/55 font-medium">{s.label}</p>
            <p className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* ── Order History ── */}
      <div className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-pink-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#e91e8c]" />
            <h2 className="font-bold text-[#2d1a24] font-playfair">Order History</h2>
            <span className="text-xs font-medium bg-pink-100 text-[#ad1457] px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-50 flex items-center justify-center">
              <ShoppingBag className="w-8 h-8 text-[#ad1457]/30" />
            </div>
            <p className="text-sm text-[#6d1b3b]/50">No orders placed yet</p>
          </div>
        ) : (
          <div className="divide-y divide-pink-50">
            {orders.map((order) => {
              const status = statusConfig[order.status] ?? statusConfig.pending;
              return (
                <div key={order._id} className="px-6 py-5 hover:bg-pink-50/30 transition-colors group">
                  {/* Order header */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-linear-to-br from-pink-100 to-pink-50 flex items-center justify-center shrink-0">
                        <Hash className="w-4 h-4 text-[#e91e8c]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#2d1a24] font-mono tracking-wide">
                          {order.orderNumber}
                        </p>
                        <p className="text-xs text-[#6d1b3b]/50">{fmtDate(order.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${status.color}`}>
                        {status.icon}
                        {status.label}
                      </span>
                      <span className="text-sm font-bold text-[#2d1a24]">{fmt(order.total)}</span>
                    </div>
                  </div>

                  {/* Order items */}
                  <div className="ml-12 space-y-1.5 mb-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {item.isBundleItem && (
                            <span className="text-xs bg-purple-100 text-purple-600 px-1.5 py-0.5 rounded font-medium">Bundle</span>
                          )}
                          <span className="text-sm text-[#2d1a24]">{item.name}</span>
                          {item.variantLabel && (
                            <span className="text-xs text-[#6d1b3b]/50">({item.variantLabel})</span>
                          )}
                        </div>
                        <div className="text-xs text-[#6d1b3b]/60 shrink-0">
                          {fmt(item.price)} × {item.qty}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order footer */}
                  <div className="ml-12 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-[#6d1b3b]/55">
                    <div className="flex items-center gap-1">
                      <CreditCard className="w-3 h-3" />
                      {paymentLabel[order.paymentMethod] ?? order.paymentMethod}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {order.shippingAddress.city}, {order.shippingAddress.postcode}
                    </div>
                    {order.shippingCost > 0 && (
                      <div className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        Shipping: {fmt(order.shippingCost)}
                      </div>
                    )}
                    {order.discountAmount && order.discountAmount > 0 ? (
                      <div className="flex items-center gap-1 text-green-600">
                        <span>Discount: −{fmt(order.discountAmount)}</span>
                        {order.couponCode && <span className="font-mono bg-green-100 px-1 rounded">{order.couponCode}</span>}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Addresses ── */}
      {customer.addresses && customer.addresses.length > 0 && (
        <div className="bg-white rounded-3xl border border-pink-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-pink-50 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#e91e8c]" />
            <h2 className="font-bold text-[#2d1a24] font-playfair">Saved Addresses</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 p-6">
            {customer.addresses.map((addr, idx) => (
              <div key={idx} className="rounded-2xl border border-pink-100 p-4 bg-pink-50/30 space-y-1">
                <p className="text-sm font-medium text-[#2d1a24]">{addr.street}</p>
                <p className="text-xs text-[#6d1b3b]/60">{addr.city}, {addr.state} {addr.postcode}</p>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
