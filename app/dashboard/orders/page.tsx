"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi, type Order, type OrderStats } from "@/lib/api/orders";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  processing: "bg-purple-100 text-purple-700",
  shipped: "bg-indigo-100 text-indigo-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-700",
};

const statusOptions = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState<string>("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");

  const { data: statsData } = useQuery({
    queryKey: ["orders", "stats"],
    queryFn: () => ordersApi.getStats(),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["orders", "admin", page, filterStatus],
    queryFn: () => ordersApi.getAll({ page, limit: 15, status: filterStatus || undefined }),
  });

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      ordersApi.updateStatus(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setSelectedOrder(null);
    },
  });

  const stats = statsData as OrderStats | undefined;
  const orders = data?.orders || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Orders</h1>
        <p className="text-sm text-[#6d1b3b]/60 mt-1">{stats?.total || 0} total orders</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Pending", value: stats.pending, color: "text-yellow-600" },
            { label: "Confirmed", value: stats.confirmed, color: "text-blue-600" },
            { label: "Processing", value: stats.processing, color: "text-purple-600" },
            { label: "Shipped", value: stats.shipped, color: "text-indigo-600" },
            { label: "Delivered", value: stats.delivered, color: "text-green-600" },
            { label: "Cancelled", value: stats.cancelled, color: "text-red-600" },
            { label: "Revenue", value: `৳${stats.revenue.toLocaleString()}`, color: "text-[#e91e8c]" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-pink-100 p-3 text-center">
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-[#6d1b3b]/50 font-medium uppercase">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-pink-100 p-4">
        <div className="flex flex-wrap gap-2">
          <button onClick={() => { setFilterStatus(""); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${!filterStatus ? "bg-[#e91e8c] text-white" : "bg-pink-50 text-[#ad1457] hover:bg-pink-100"}`}>
            All
          </button>
          {statusOptions.map((s) => (
            <button key={s} onClick={() => { setFilterStatus(s); setPage(1); }}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all capitalize ${filterStatus === s ? "bg-[#e91e8c] text-white" : "bg-pink-50 text-[#ad1457] hover:bg-pink-100"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      {isLoading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map((i) => <div key={i} className="bg-white rounded-xl border border-pink-100 h-20 animate-pulse" />)}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center">
          <span className="text-4xl block mb-4">📋</span>
          <h3 className="text-lg font-semibold text-[#2d1a24] mb-2">No orders yet</h3>
          <p className="text-sm text-[#6d1b3b]/50">Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl border border-pink-100 p-4 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => setSelectedOrder(order)}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="font-bold text-sm text-[#2d1a24]">{order.orderNumber}</div>
                    <div className="text-xs text-[#6d1b3b]/50">{order.shippingAddress.name} • {order.shippingAddress.phone}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-sm text-[#e91e8c]">৳{order.total.toLocaleString()}</div>
                    <div className="text-[10px] text-[#6d1b3b]/40">{order.items.length} item{order.items.length > 1 ? "s" : ""} • {order.paymentMethod.toUpperCase()}</div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full capitalize ${statusColors[order.status] || "bg-gray-100 text-gray-700"}`}>
                    {order.status}
                  </span>
                  <div className="text-xs text-[#6d1b3b]/40">{new Date(order.createdAt).toLocaleDateString("en-GB")}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-2 rounded-lg border border-pink-200 text-sm text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50">← Prev</button>
          <span className="text-sm text-[#6d1b3b]/60 px-3">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-2 rounded-lg border border-pink-200 text-sm text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50">Next →</button>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-pink-100 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-[#2d1a24] font-playfair">{selectedOrder.orderNumber}</h2>
                <p className="text-xs text-[#6d1b3b]/50">{new Date(selectedOrder.createdAt).toLocaleString("en-GB")}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-[#6d1b3b]/40 hover:text-[#6d1b3b] text-xl">×</button>
            </div>

            {/* Status */}
            <div className="flex items-center gap-3 mb-5">
              <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${statusColors[selectedOrder.status]}`}>
                {selectedOrder.status}
              </span>
              <span className="text-xs text-[#6d1b3b]/50">{selectedOrder.paymentMethod.toUpperCase()} • {selectedOrder.deliveryMethod}</span>
            </div>

            {/* Customer Info */}
            <div className="bg-pink-50/50 rounded-xl p-4 mb-4">
              <h4 className="text-xs font-bold text-[#ad1457] uppercase mb-2">Shipping To</h4>
              <p className="text-sm font-semibold text-[#2d1a24]">{selectedOrder.shippingAddress.name}</p>
              <p className="text-xs text-[#6d1b3b]/70">{selectedOrder.shippingAddress.phone}</p>
              <p className="text-xs text-[#6d1b3b]/70">{selectedOrder.shippingAddress.street}, {selectedOrder.shippingAddress.area && `${selectedOrder.shippingAddress.area}, `}{selectedOrder.shippingAddress.city}</p>
              {selectedOrder.shippingAddress.note && <p className="text-xs text-[#6d1b3b]/50 mt-1 italic">Note: {selectedOrder.shippingAddress.note}</p>}
            </div>

            {/* Items */}
            <div className="mb-4">
              <h4 className="text-xs font-bold text-[#ad1457] uppercase mb-2">Items</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm">
                    <div className="w-10 h-10 bg-pink-50 rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <span>📦</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#2d1a24] truncate">{item.name}</div>
                      {item.variantLabel && <div className="text-[10px] text-[#6d1b3b]/50">{item.variantLabel}</div>}
                    </div>
                    <div className="text-xs text-[#6d1b3b]/60">×{item.qty}</div>
                    <div className="font-bold text-sm text-[#e91e8c]">৳{(item.price * item.qty).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Totals */}
            <div className="border-t border-pink-100 pt-3 mb-5 space-y-1">
              <div className="flex justify-between text-xs"><span className="text-[#6d1b3b]/60">Subtotal</span><span>৳{selectedOrder.subtotal.toLocaleString()}</span></div>
              <div className="flex justify-between text-xs"><span className="text-[#6d1b3b]/60">Shipping</span><span>{selectedOrder.shippingCost === 0 ? "Free" : `৳${selectedOrder.shippingCost}`}</span></div>
              <div className="flex justify-between text-sm font-bold pt-1"><span>Total</span><span className="text-[#e91e8c]">৳{selectedOrder.total.toLocaleString()}</span></div>
            </div>

            {/* Update Status */}
            <div className="border-t border-pink-100 pt-4">
              <h4 className="text-xs font-bold text-[#ad1457] uppercase mb-2">Update Status</h4>
              <div className="flex gap-2">
                <select value={newStatus || selectedOrder.status}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl border border-pink-200 text-sm outline-none focus:border-[#e91e8c]">
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <button onClick={() => {
                  if (newStatus && newStatus !== selectedOrder.status) {
                    updateStatus.mutate({ id: selectedOrder._id, status: newStatus });
                  }
                }}
                  disabled={updateStatus.isPending || !newStatus || newStatus === selectedOrder.status}
                  className="px-5 py-2 bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:shadow-lg transition-all">
                  {updateStatus.isPending ? "..." : "Update"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
