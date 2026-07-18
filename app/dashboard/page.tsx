"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  IndianRupee,
  Package,
  Users,
  ShoppingBag,
  TrendingUp,
  ChevronRight,
  Tag,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  BarChart3,
  Loader2,
} from "lucide-react";
import { apiRequest } from "@/lib/api/client";
import { ordersApi } from "@/lib/api/orders";
import { productsApi } from "@/lib/api/products";

// ─── Status helpers ────────────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  pending:    "bg-yellow-100 text-yellow-700",
  confirmed:  "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped:    "bg-indigo-100 text-indigo-700",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-red-100 text-red-700",
};

// ─── Mini bar chart (pure CSS, no library) ─────────────────────────────────────

function RevenueChart({ data }: { data: { date: string; revenue: number; orders: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);

  const fmt = (d: string) => {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-BD", { weekday: "short" }).slice(0, 3);
  };

  return (
    <div className="flex items-end gap-2 h-44 w-full">
      {data.map((d, i) => {
        const pct = Math.max((d.revenue / max) * 100, d.revenue > 0 ? 4 : 0);
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group relative">
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#2d1a24] text-white text-[10px] font-semibold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              ৳{d.revenue.toLocaleString()}
              <br />
              <span className="text-white/60">{d.orders} orders</span>
            </div>
            <div className="w-full relative" style={{ height: "160px" }}>
              <div
                className="absolute bottom-0 w-full bg-linear-to-t from-[#e91e8c] to-[#f48fb1] rounded-t-lg transition-all duration-500 group-hover:from-[#c2185b] group-hover:to-[#e91e8c]"
                style={{ height: `${pct}%` }}
              />
              {d.revenue === 0 && (
                <div className="absolute bottom-0 w-full h-1 bg-pink-100 rounded-t-lg" />
              )}
            </div>
            <span className="text-[10px] text-[#6d1b3b]/50 font-medium">{fmt(d.date)}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Order status donut (pure CSS) ────────────────────────────────────────────

function OrderStatusDonut({ stats }: { stats: { pending: number; confirmed: number; processing: number; shipped: number; delivered: number; cancelled: number } }) {
  const segments = [
    { label: "Delivered",  value: stats.delivered,  color: "#22c55e" },
    { label: "Shipped",    value: stats.shipped,     color: "#6366f1" },
    { label: "Processing", value: stats.processing,  color: "#a855f7" },
    { label: "Confirmed",  value: stats.confirmed,   color: "#3b82f6" },
    { label: "Pending",    value: stats.pending,     color: "#eab308" },
    { label: "Cancelled",  value: stats.cancelled,   color: "#ef4444" },
  ];

  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let cumulative = 0;

  // Build SVG conic-gradient via stroke-dasharray on a circle
  const R = 40;
  const C = 2 * Math.PI * R;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {segments.map((seg, i) => {
            const pct = seg.value / total;
            const dash = pct * C;
            const offset = cumulative * C;
            cumulative += pct;
            return (
              <circle
                key={i}
                cx="50" cy="50" r={R}
                fill="none"
                stroke={seg.color}
                strokeWidth="18"
                strokeDasharray={`${dash} ${C - dash}`}
                strokeDashoffset={-offset}
                className="transition-all duration-700"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-playfair text-xl font-extrabold text-[#2d1a24]">{total}</span>
          <span className="text-[10px] text-[#6d1b3b]/50 font-semibold">orders</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full">
        {segments.map((seg) => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
            <span className="text-[11px] text-[#6d1b3b]/70 font-medium truncate">{seg.label}</span>
            <span className="text-[11px] font-bold text-[#2d1a24] ml-auto">{seg.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function DashboardOverview() {
  const [chartDays, setChartDays] = useState(7);

  const { data: orderStats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard", "order-stats"],
    queryFn: () => ordersApi.getStats(),
    staleTime: 60_000,
  });

  const { data: customerStats } = useQuery({
    queryKey: ["dashboard", "customer-stats"],
    queryFn: () => apiRequest<{ total: number; active: number; newThisMonth: number }>("/customers/stats"),
    staleTime: 60_000,
  });

  const { data: productsData } = useQuery({
    queryKey: ["dashboard", "products-count"],
    queryFn: () => productsApi.getAll({ page: 1, limit: 1 }),
    staleTime: 60_000,
  });

  const { data: topProductsData } = useQuery({
    queryKey: ["dashboard", "top-products"],
    queryFn: () => productsApi.getAll({ page: 1, limit: 5, sortBy: "salesCount", sortOrder: "desc" }),
    staleTime: 60_000,
  });

  const { data: recentOrdersData } = useQuery({
    queryKey: ["dashboard", "recent-orders"],
    queryFn: () => ordersApi.getAll({ page: 1, limit: 6 }),
    staleTime: 30_000,
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["dashboard", "revenue-chart", chartDays],
    queryFn: () => ordersApi.getRevenueChart(chartDays),
    staleTime: 60_000,
  });

  const statCards = [
    {
      label: "Total Revenue",
      value: orderStats ? `৳${orderStats.revenue.toLocaleString()}` : "—",
      sub: "from confirmed orders",
      icon: IndianRupee,
      color: "from-[#e91e8c] to-[#c2185b]",
      light: "bg-pink-50",
    },
    {
      label: "Total Orders",
      value: orderStats ? orderStats.total.toLocaleString() : "—",
      sub: `${orderStats?.pending ?? 0} pending`,
      icon: Package,
      color: "from-indigo-500 to-indigo-600",
      light: "bg-indigo-50",
    },
    {
      label: "Customers",
      value: customerStats ? customerStats.total.toLocaleString() : "—",
      sub: `${customerStats?.newThisMonth ?? 0} new this month`,
      icon: Users,
      color: "from-purple-500 to-purple-600",
      light: "bg-purple-50",
    },
    {
      label: "Products",
      value: productsData ? productsData.total.toLocaleString() : "—",
      sub: "active listings",
      icon: ShoppingBag,
      color: "from-emerald-500 to-emerald-600",
      light: "bg-emerald-50",
    },
  ];

  const recentOrders = recentOrdersData?.orders ?? [];
  const topProducts = topProductsData?.products ?? [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Dashboard</h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-0.5">Here's what's happening with your store.</p>
        </div>
        <div className="text-xs text-[#6d1b3b]/40 font-medium hidden sm:block">
          {new Date().toLocaleDateString("en-BD", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-pink-100 hover:shadow-md hover:shadow-pink-100/40 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-xl bg-linear-to-br ${s.color} flex items-center justify-center`}>
                <s.icon className="w-5 h-5 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-500" />
            </div>
            <p className="text-2xl font-extrabold text-[#2d1a24] font-playfair">
              {statsLoading && s.label === "Total Revenue" ? (
                <Loader2 className="w-5 h-5 animate-spin text-[#ad1457]" />
              ) : s.value}
            </p>
            <p className="text-xs text-[#6d1b3b]/50 mt-1 font-medium">{s.label}</p>
            <p className="text-[11px] text-[#6d1b3b]/40 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue bar chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-pink-100">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-[#e91e8c]" />
              <h2 className="text-base font-bold text-[#2d1a24]">Revenue Overview</h2>
            </div>
            <div className="flex gap-1 bg-pink-50 rounded-xl p-1">
              {[7, 14, 30].map((d) => (
                <button
                  key={d}
                  onClick={() => setChartDays(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                    chartDays === d
                      ? "bg-white text-[#e91e8c] shadow-sm"
                      : "text-[#6d1b3b]/50 hover:text-[#ad1457]"
                  }`}
                >
                  {d}d
                </button>
              ))}
            </div>
          </div>

          {chartLoading ? (
            <div className="h-44 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#ad1457]/40" />
            </div>
          ) : chartData && chartData.length > 0 ? (
            <>
              <RevenueChart data={chartData} />
              <div className="mt-4 pt-4 border-t border-pink-50 flex items-center justify-between text-xs text-[#6d1b3b]/50">
                <span>
                  Total: <strong className="text-[#e91e8c]">
                    ৳{chartData.reduce((s, d) => s + d.revenue, 0).toLocaleString()}
                  </strong>
                </span>
                <span>
                  Orders: <strong className="text-[#2d1a24]">
                    {chartData.reduce((s, d) => s + d.orders, 0)}
                  </strong>
                </span>
              </div>
            </>
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-[#6d1b3b]/30">
              <BarChart3 className="w-10 h-10 mb-2" />
              <p className="text-sm font-medium">No revenue data yet</p>
            </div>
          )}
        </div>

        {/* Order status donut */}
        <div className="bg-white rounded-2xl p-6 border border-pink-100">
          <h2 className="text-base font-bold text-[#2d1a24] mb-5">Order Status</h2>
          {orderStats ? (
            <OrderStatusDonut stats={orderStats} />
          ) : (
            <div className="h-44 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-[#ad1457]/40" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: Top Products + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Top Products */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-pink-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[#2d1a24]">Top Products</h2>
            <Link href="/dashboard/products" className="text-xs font-semibold text-[#e91e8c] hover:text-[#ad1457] flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {topProducts.length === 0 ? (
            <div className="py-10 text-center">
              <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-[#ad1457]/20" />
              <p className="text-sm text-[#6d1b3b]/40">No products yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p._id} className="flex items-center gap-3 group">
                  <span className="w-5 text-xs font-bold text-[#6d1b3b]/30 shrink-0">{i + 1}</span>
                  <div className="w-10 h-10 rounded-xl bg-pink-50 overflow-hidden shrink-0 border border-pink-100">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-4 h-4 text-[#ad1457]/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#2d1a24] truncate group-hover:text-[#e91e8c] transition-colors">
                      {p.name}
                    </p>
                    <p className="text-[11px] text-[#6d1b3b]/50">{p.salesCount ?? 0} sold</p>
                  </div>
                  <span className="text-sm font-bold text-[#ad1457] shrink-0">
                    ৳{(p.basePrice).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-pink-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-pink-50">
            <h2 className="text-base font-bold text-[#2d1a24]">Recent Orders</h2>
            <Link href="/dashboard/orders" className="text-xs font-semibold text-[#e91e8c] hover:text-[#ad1457] flex items-center gap-0.5">
              View all <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="py-14 text-center">
              <Package className="w-10 h-10 mx-auto mb-2 text-[#ad1457]/20" />
              <p className="text-sm text-[#6d1b3b]/40">No orders yet</p>
            </div>
          ) : (
            <div className="divide-y divide-pink-50">
              {recentOrders.map((order) => (
                <div key={order._id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-pink-50/40 transition-colors">
                  {/* Status icon */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    order.status === "delivered" ? "bg-green-100" :
                    order.status === "cancelled" ? "bg-red-100" :
                    order.status === "shipped" ? "bg-indigo-100" : "bg-yellow-100"
                  }`}>
                    {order.status === "delivered" ? <CheckCircle className="w-4 h-4 text-green-600" /> :
                     order.status === "cancelled" ? <XCircle className="w-4 h-4 text-red-500" /> :
                     order.status === "shipped" ? <Truck className="w-4 h-4 text-indigo-600" /> :
                     <Clock className="w-4 h-4 text-yellow-600" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-[#2d1a24]">{order.orderNumber}</span>
                      {order.couponCode && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-[#fce4ec] text-[#c2185b]">
                          <Tag className="w-2.5 h-2.5" />{order.couponCode}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6d1b3b]/50 truncate">
                      {order.shippingAddress.name} • {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-[#e91e8c]">৳{order.total.toLocaleString()}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
