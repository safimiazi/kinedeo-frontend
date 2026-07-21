"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Tag,
  Truck,
  CreditCard,
  MapPin,
  ShoppingBag,
  TrendingDown,
  CheckCircle,
  Clock,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi, type Order, type OrderStats } from "@/lib/api/orders";
import toast from "react-hot-toast";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  pending:    { bg: "bg-yellow-100",  text: "text-yellow-700",  dot: "bg-yellow-400" },
  confirmed:  { bg: "bg-blue-100",    text: "text-blue-700",    dot: "bg-blue-400" },
  processing: { bg: "bg-purple-100",  text: "text-purple-700",  dot: "bg-purple-400" },
  shipped:    { bg: "bg-indigo-100",  text: "text-indigo-700",  dot: "bg-indigo-400" },
  delivered:  { bg: "bg-green-100",   text: "text-green-700",   dot: "bg-green-400" },
  cancelled:  { bg: "bg-red-100",     text: "text-red-700",     dot: "bg-red-400" },
};

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full capitalize ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function CouponBadge({ code, discount }: { code: string; discount?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#fce4ec] text-[#c2185b] border border-[#f48fb1]/40">
      <Tag className="w-2.5 h-2.5" />
      {code}
      {discount ? ` −৳${discount.toLocaleString()}` : ""}
    </span>
  );
}

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");
  const [confirmRepush, setConfirmRepush] = useState(false);

  // Pathao push modal state
  const [pathaoModal, setPathaoModal] = useState(false);
  const [pathaoWeight, setPathaoWeight] = useState("0.5");
  const [pathaoDescription, setPathaoDescription] = useState("");
  const [pathaoInstruction, setPathaoInstruction] = useState("");

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
      toast.success("Order status updated!");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update status"),
  });

  const pathaoMutation = useMutation({
    mutationFn: (params: { orderId: string; itemWeight?: number; itemDescription?: string; specialInstruction?: string }) =>
      ordersApi.pathaoLush(params.orderId, { itemWeight: params.itemWeight, itemDescription: params.itemDescription, specialInstruction: params.specialInstruction }),
    onSuccess: (updatedOrder: Order) => {
      setSelectedOrder(updatedOrder);
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      setPathaoModal(false);
      toast.success(`Pushed to Pathao: ${updatedOrder.pathaoConsignmentId}`);
    },
    onError: (err: Error) => toast.error(err.message || 'Failed to push to Pathao'),
  });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setConfirmRepush(false);
  }, [selectedOrder?._id]);

  const stats = statsData as OrderStats | undefined;
  const orders = data?.orders ?? [];
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-[#e91e8c]" />
          Orders
        </h1>
        <p className="text-sm text-[#6d1b3b]/60 mt-1">{stats?.total ?? 0} total orders</p>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { label: "Pending",    value: stats.pending,                              color: "text-yellow-600" },
            { label: "Confirmed",  value: stats.confirmed,                            color: "text-blue-600" },
            { label: "Processing", value: stats.processing,                           color: "text-purple-600" },
            { label: "Shipped",    value: stats.shipped,                              color: "text-indigo-600" },
            { label: "Delivered",  value: stats.delivered,                            color: "text-green-600" },
            { label: "Cancelled",  value: stats.cancelled,                            color: "text-red-600" },
            { label: "Revenue",    value: `৳${stats.revenue.toLocaleString()}`,       color: "text-[#e91e8c]" },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-xl border border-pink-100 p-3 text-center hover:shadow-sm transition-all">
              <div className={`text-lg font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-[#6d1b3b]/50 font-semibold uppercase tracking-wide mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-2xl border border-pink-100 p-3 flex flex-wrap gap-2">
        <button
          onClick={() => { setFilterStatus(""); setPage(1); }}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            !filterStatus ? "bg-[#e91e8c] text-white shadow-sm" : "bg-pink-50 text-[#ad1457] hover:bg-pink-100"
          }`}
        >
          All
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setFilterStatus(s); setPage(1); }}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize ${
              filterStatus === s ? "bg-[#e91e8c] text-white shadow-sm" : "bg-pink-50 text-[#ad1457] hover:bg-pink-100"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Orders List */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-pink-100 h-20 animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pink-100 p-14 text-center">
          <Package className="w-14 h-14 mx-auto mb-4 text-[#ad1457]/20" />
          <h3 className="text-lg font-semibold text-[#2d1a24] mb-2">No orders yet</h3>
          <p className="text-sm text-[#6d1b3b]/50">Orders will appear here when customers place them</p>
        </div>
      ) : (
        <div className="space-y-2">
          {orders.map((order) => (
            <div
              key={order._id}
              onClick={() => { setSelectedOrder(order); setNewStatus(order.status); }}
              className="bg-white rounded-xl border border-pink-100 px-4 py-3.5 hover:shadow-md hover:border-pink-200 transition-all cursor-pointer group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                {/* Left */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-linear-to-br from-pink-100 to-rose-100 flex items-center justify-center shrink-0">
                    <Package className="w-4 h-4 text-[#ad1457]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-[#2d1a24] group-hover:text-[#e91e8c] transition-colors">
                        {order.orderNumber}
                      </span>
                      <StatusBadge status={order.status} />
                      {/* Coupon badge in list */}
                      {order.couponCode && (
                        <CouponBadge code={order.couponCode} discount={order.discountAmount} />
                      )}
                    </div>
                    <div className="text-xs text-[#6d1b3b]/50 mt-0.5">
                      {order.shippingAddress.name} • {order.shippingAddress.phone}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                  <div className="text-right">
                    <div className="font-bold text-sm text-[#e91e8c]">৳{order.total.toLocaleString()}</div>
                    <div className="text-[10px] text-[#6d1b3b]/40">
                      {order.items.length} item{order.items.length !== 1 ? "s" : ""} •{" "}
                      {order.paymentMethod.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-xs text-[#6d1b3b]/40 hidden md:block">
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </div>
                  <Link
                    href={`/dashboard/orders/${order._id}`}
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-pink-50 text-[#ad1457] text-xs font-semibold hover:bg-pink-100 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-pink-200 text-sm text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50"
          >
            <ChevronLeft className="w-4 h-4" /> Prev
          </button>
          <span className="text-sm text-[#6d1b3b]/60 px-3">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-pink-200 text-sm text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50"
          >
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-pink-100 shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-pink-100 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
              <div>
                <h2 className="text-lg font-bold text-[#2d1a24] font-playfair">{selectedOrder.orderNumber}</h2>
                <p className="text-xs text-[#6d1b3b]/50">
                  {new Date(selectedOrder.createdAt).toLocaleString("en-GB", {
                    day: "numeric", month: "short", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-[#ad1457]" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Status + Payment row */}
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={selectedOrder.status} />
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  <CreditCard className="w-3 h-3" />
                  {selectedOrder.paymentMethod.toUpperCase()}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                  <Truck className="w-3 h-3" />
                  {selectedOrder.deliveryMethod}
                </span>
                {selectedOrder.paymentVerified && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3" />
                    Payment Verified
                  </span>
                )}
                {!selectedOrder.paymentVerified && selectedOrder.paymentMethod === "sslcommerz" && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-yellow-100 text-yellow-700">
                    <Clock className="w-3 h-3" />
                    Awaiting Payment
                  </span>
                )}
              </div>

              {/* Coupon highlight box — shown prominently if coupon was used */}
              {selectedOrder.couponCode && (
                <div className="bg-linear-to-r from-[#fce4ec] to-pink-50 rounded-xl border border-[#f48fb1]/40 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#e91e8c]/10 flex items-center justify-center">
                      <Tag className="w-4 h-4 text-[#e91e8c]" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#2d1a24]">Coupon Applied</p>
                      <p className="text-[11px] text-[#6d1b3b]/60">Code: <strong className="text-[#c2185b]">{selectedOrder.couponCode}</strong></p>
                    </div>
                  </div>
                  {selectedOrder.discountAmount && selectedOrder.discountAmount > 0 && (
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-[#c2185b]">−৳{selectedOrder.discountAmount.toLocaleString()}</p>
                      <p className="text-[10px] text-[#6d1b3b]/50">discount</p>
                    </div>
                  )}
                </div>
              )}

              {/* Shipping Address */}
              <div className="bg-pink-50/60 rounded-xl p-4">
                <h4 className="text-[11px] font-bold text-[#ad1457] uppercase tracking-wide mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Shipping To
                </h4>
                <p className="text-sm font-semibold text-[#2d1a24]">{selectedOrder.shippingAddress.name}</p>
                <p className="text-xs text-[#6d1b3b]/70">{selectedOrder.shippingAddress.phone}</p>
                {selectedOrder.shippingAddress.email && (
                  <p className="text-xs text-[#6d1b3b]/70">{selectedOrder.shippingAddress.email}</p>
                )}
                <p className="text-xs text-[#6d1b3b]/70 mt-1">
                  {selectedOrder.shippingAddress.street}
                  {selectedOrder.shippingAddress.area && `, ${selectedOrder.shippingAddress.area}`}
                  {`, ${selectedOrder.shippingAddress.city}`}
                </p>
                {selectedOrder.shippingAddress.note && (
                  <p className="text-xs text-[#6d1b3b]/50 mt-1 italic">
                    Note: {selectedOrder.shippingAddress.note}
                  </p>
                )}
              </div>

              {/* Items */}
              <div>
                <h4 className="text-[11px] font-bold text-[#ad1457] uppercase tracking-wide mb-2 flex items-center gap-1">
                  <ShoppingBag className="w-3 h-3" /> Items ({selectedOrder.items.length})
                </h4>
                <div className="space-y-2">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
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
                        {item.sku && (
                          <p className="text-[10px] text-[#6d1b3b]/40">SKU: {item.sku}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-bold text-[#e91e8c]">৳{(item.price * item.qty).toLocaleString()}</p>
                        <p className="text-[10px] text-[#6d1b3b]/40">৳{item.price.toLocaleString()} × {item.qty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-pink-100 pt-4">
                <h4 className="text-[11px] font-bold text-[#ad1457] uppercase tracking-wide mb-3 flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" /> Price Breakdown
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#6d1b3b]/60">Subtotal</span>
                    <span className="font-semibold text-[#2d1a24]">৳{selectedOrder.subtotal.toLocaleString()}</span>
                  </div>

                  {/* Coupon discount line */}
                  {selectedOrder.couponCode && selectedOrder.discountAmount && selectedOrder.discountAmount > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-[#c2185b] flex items-center gap-1">
                        <TrendingDown className="w-3.5 h-3.5" />
                        Coupon ({selectedOrder.couponCode})
                      </span>
                      <span className="font-semibold text-[#c2185b]">−৳{selectedOrder.discountAmount.toLocaleString()}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-[#6d1b3b]/60 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> Shipping
                    </span>
                    <span className="font-semibold text-green-600">
                      {selectedOrder.shippingCost === 0 ? "FREE" : `৳${selectedOrder.shippingCost}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold pt-2 border-t border-pink-100">
                    <span className="text-[#2d1a24]">Total</span>
                    <span className="text-[#e91e8c]">৳{selectedOrder.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Cancel reason */}
              {selectedOrder.cancelReason && (
                <div className="bg-red-50 rounded-xl px-4 py-3 border border-red-100">
                  <p className="text-xs font-bold text-red-600 mb-1">Cancel Reason</p>
                  <p className="text-sm text-red-700">{selectedOrder.cancelReason}</p>
                </div>
              )}

              {/* Pathao Courier Section */}
              <div className="border-t border-pink-100 pt-4">
                <h4 className="text-[11px] font-bold text-[#ad1457] uppercase tracking-wide mb-3 flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Pathao Courier
                </h4>
                {!selectedOrder.pathaoConsignmentId ? (
                  <button
                    onClick={() => {
                      setPathaoDescription(selectedOrder.items.map((i) => i.name).join(", "));
                      setPathaoWeight("0.5");
                      setPathaoInstruction("");
                      setPathaoModal(true);
                    }}
                    className="w-full px-4 py-2.5 bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    Send to Pathao
                  </button>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 rounded-xl border border-green-200 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-bold text-green-700">Pathao Consignment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-green-700">{selectedOrder.pathaoConsignmentId}</span>
                      <button
                        onClick={() => setConfirmRepush(true)}
                        className="text-[10px] text-[#ad1457] underline hover:text-[#e91e8c]"
                      >
                        Re-push
                      </button>
                    </div>
                  </div>
                )}

                {/* Re-push confirmation */}
                {confirmRepush && (
                  <div className="mt-2 bg-yellow-50 rounded-xl border border-yellow-200 px-4 py-3 space-y-2">
                    <p className="text-xs font-semibold text-yellow-800">
                      Re-push will create a new Pathao consignment and overwrite the existing ID. Continue?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setConfirmRepush(false);
                          setPathaoDescription(selectedOrder.items.map((i) => i.name).join(", "));
                          setPathaoWeight("0.5");
                          setPathaoInstruction("");
                          setPathaoModal(true);
                        }}
                        className="px-3 py-1.5 bg-[#e91e8c] text-white rounded-lg text-xs font-bold hover:bg-[#c2185b] transition-colors"
                      >
                        Yes, Re-push
                      </button>
                      <button
                        onClick={() => setConfirmRepush(false)}
                        className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Update Status */}
              <div className="border-t border-pink-100 pt-4">
                <h4 className="text-[11px] font-bold text-[#ad1457] uppercase tracking-wide mb-3">Update Status</h4>
                <div className="flex gap-2">
                  <select
                    value={newStatus || selectedOrder.status}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="flex-1 px-3 py-2.5 rounded-xl border border-pink-200 text-sm outline-none focus:border-[#e91e8c] bg-white"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => {
                      if (newStatus && newStatus !== selectedOrder.status) {
                        updateStatus.mutate({ id: selectedOrder._id, status: newStatus });
                      }
                    }}
                    disabled={updateStatus.isPending || !newStatus || newStatus === selectedOrder.status}
                    className="px-5 py-2.5 bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:shadow-lg transition-all"
                  >
                    {updateStatus.isPending ? "Saving..." : "Update"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pathao Push Modal */}
      {pathaoModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[#2d1a24] flex items-center gap-2 text-base">
                <Truck className="w-5 h-5 text-[#e91e8c]" /> Send to Pathao
              </h2>
              <button
                onClick={() => setPathaoModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-pink-50 text-[#ad1457] transition-colors text-lg font-bold"
              >
                ×
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">
                  Total Weight (kg) <span className="text-[#e91e8c]">*</span>
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={pathaoWeight}
                  onChange={(e) => setPathaoWeight(e.target.value)}
                  className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors"
                  placeholder="e.g. 0.5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Item Description</label>
                <textarea
                  value={pathaoDescription}
                  onChange={(e) => setPathaoDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors resize-none"
                  placeholder="Product names / description"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Special Instructions (optional)</label>
                <textarea
                  value={pathaoInstruction}
                  onChange={(e) => setPathaoInstruction(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors resize-none"
                  placeholder="e.g. Handle with care, fragile item..."
                />
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <button
                onClick={() => setPathaoModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() =>
                  pathaoMutation.mutate({
                    orderId: selectedOrder._id,
                    itemWeight: parseFloat(pathaoWeight) || 0.5,
                    itemDescription: pathaoDescription || undefined,
                    specialInstruction: pathaoInstruction || undefined,
                  })
                }
                disabled={pathaoMutation.isPending}
                className="flex-1 px-4 py-3 bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                {pathaoMutation.isPending ? "Sending..." : "Send to Pathao"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

