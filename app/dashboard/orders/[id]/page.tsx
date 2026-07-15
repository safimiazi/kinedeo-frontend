"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Package,
  ArrowLeft,
  Tag,
  Truck,
  CreditCard,
  MapPin,
  ShoppingBag,
  TrendingDown,
  CheckCircle,
  Clock,
  BarChart3,
  Phone,
  Mail,
  RefreshCw,
  AlertCircle,
  User,
  Calendar,
  Hash,
  Edit3,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ordersApi, type Order } from "@/lib/api/orders";
import toast from "react-hot-toast";

const STATUS_STYLES: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  pending:    { bg: "bg-yellow-50",  text: "text-yellow-700",  dot: "bg-yellow-400",  border: "border-yellow-200" },
  confirmed:  { bg: "bg-blue-50",    text: "text-blue-700",    dot: "bg-blue-400",    border: "border-blue-200" },
  processing: { bg: "bg-purple-50",  text: "text-purple-700",  dot: "bg-purple-400",  border: "border-purple-200" },
  shipped:    { bg: "bg-indigo-50",  text: "text-indigo-700",  dot: "bg-indigo-400",  border: "border-indigo-200" },
  delivered:  { bg: "bg-green-50",   text: "text-green-700",   dot: "bg-green-400",   border: "border-green-200" },
  cancelled:  { bg: "bg-red-50",     text: "text-red-700",     dot: "bg-red-400",     border: "border-red-200" },
};

const STATUS_OPTIONS = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400", border: "border-gray-200" };
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-bold px-3 py-1.5 rounded-full capitalize border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-2 h-2 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [newStatus, setNewStatus] = useState("");
  const [confirmRepush, setConfirmRepush] = useState(false);
  const [editingStatus, setEditingStatus] = useState(false);

  // Pathao push modal state
  const [pathaoModal, setPathaoModal] = useState(false);
  const [pathaoWeight, setPathaoWeight] = useState("0.5");
  const [pathaoDescription, setPathaoDescription] = useState("");
  const [pathaoInstruction, setPathaoInstruction] = useState("");

  const { data: order, isLoading, error } = useQuery({
    queryKey: ["order", id],
    queryFn: () => ordersApi.getOrderAdmin(id),
    enabled: !!id,
  });

  const updateStatus = useMutation({
    mutationFn: ({ status }: { status: string }) =>
      ordersApi.updateStatus(id, { status }),
    onSuccess: (updated) => {
      queryClient.setQueryData(["order", id], updated);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setEditingStatus(false);
      toast.success("Status updated!");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update status"),
  });

  const pathaoMutation = useMutation({
    mutationFn: (params?: { itemWeight?: number; itemDescription?: string; specialInstruction?: string }) =>
      ordersApi.pathaoLush(id, params),
    onSuccess: (updated: Order) => {
      queryClient.setQueryData(["order", id], updated);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setConfirmRepush(false);
      setPathaoModal(false);
      toast.success(`Pushed to Pathao: ${updated.pathaoConsignmentId}`);
    },
    onError: (err: Error) => toast.error(err.message || "Failed to push to Pathao"),
  });

  const markCodCollected = useMutation({
    mutationFn: () => ordersApi.markCodCollected(id),
    onSuccess: (updated: Order) => {
      queryClient.setQueryData(["order", id], updated);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("COD payment marked as collected!");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to mark COD collected"),
  });

  const checkPathaoStatusMutation = useMutation({
    mutationFn: () => ordersApi.checkPathaoStatus(id),
    onSuccess: (result) => {
      queryClient.setQueryData(["order", id], result.order);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      const status = result.order.pathaoStatus ?? (result.pathaoData as any)?.order_status ?? "Updated";
      toast.success(`Pathao status: ${status}`);
    },
    onError: (err: Error) => toast.error(err.message || "Failed to check Pathao status"),
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-pink-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-pink-50 rounded-2xl animate-pulse" />)}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <AlertCircle className="w-12 h-12 text-red-400" />
        <p className="text-[#2d1a24] font-semibold">Order not found</p>
        <Link href="/dashboard/orders" className="text-sm text-[#e91e8c] hover:underline flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[order.status] ?? { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-600", dot: "bg-gray-400" };

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/orders"
            className="w-9 h-9 rounded-xl bg-white border border-pink-100 flex items-center justify-center hover:bg-pink-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#ad1457]" />
          </Link>
          <div>
            <h1 className="text-xl font-bold text-[#2d1a24] font-playfair flex items-center gap-2">
              <Hash className="w-5 h-5 text-[#e91e8c]" />
              {order.orderNumber}
            </h1>
            <p className="text-xs text-[#6d1b3b]/50 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3 h-3" />
              {new Date(order.createdAt).toLocaleString("en-GB", {
                day: "numeric", month: "long", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN — Items + Price */}
        <div className="lg:col-span-2 space-y-5">

          {/* Items Card */}
          <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-pink-50 flex items-center justify-between">
              <h2 className="font-bold text-[#2d1a24] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#e91e8c]" />
                Order Items
                <span className="text-xs font-normal text-[#6d1b3b]/50">({order.items.length} item{order.items.length !== 1 ? "s" : ""})</span>
              </h2>
            </div>
            <div className="divide-y divide-pink-50">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 px-6 py-4">
                  <div className="w-14 h-14 bg-pink-50 rounded-xl overflow-hidden shrink-0 border border-pink-100">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-6 h-6 text-[#ad1457]/30" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-[#2d1a24] truncate">{item.name}</p>
                    {item.variantLabel && (
                      <p className="text-xs text-[#6d1b3b]/50 mt-0.5">{item.variantLabel}</p>
                    )}
                    {item.sku && (
                      <p className="text-xs text-[#6d1b3b]/40">SKU: {item.sku}</p>
                    )}
                    <p className="text-xs text-[#6d1b3b]/50 mt-1">Qty: {item.qty}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-bold text-[#e91e8c]">৳{(item.price * item.qty).toLocaleString()}</p>
                    <p className="text-xs text-[#6d1b3b]/40 mt-0.5">৳{item.price.toLocaleString()} each</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="px-6 py-4 bg-pink-50/40 border-t border-pink-100 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#6d1b3b]/60">Subtotal</span>
                <span className="font-semibold text-[#2d1a24]">৳{order.subtotal.toLocaleString()}</span>
              </div>
              {order.couponCode && order.discountAmount && order.discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#c2185b] flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" /> Coupon ({order.couponCode})
                  </span>
                  <span className="font-semibold text-[#c2185b]">−৳{order.discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[#6d1b3b]/60 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" /> Shipping ({order.deliveryMethod})
                </span>
                <span className="font-semibold text-green-600">
                  {order.shippingCost === 0 ? "FREE" : `৳${order.shippingCost.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t border-pink-100">
                <span className="text-[#2d1a24]">Total</span>
                <span className="text-[#e91e8c]">৳{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Status + Payment Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Payment Info */}
            <div className="bg-white rounded-2xl border border-pink-100 p-5">
              <h3 className="text-xs font-bold text-[#ad1457] uppercase tracking-wide mb-3 flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5" /> Payment
              </h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6d1b3b]/60">Method</span>
                  <span className="text-sm font-bold text-[#2d1a24] uppercase">{order.paymentMethod}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#6d1b3b]/60">Status</span>
                  {order.paymentMethod === "cod" ? (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      (order as any).paymentCollectionStatus === "collected"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {(order as any).paymentCollectionStatus === "collected" ? "Collected" : "Pending"}
                    </span>
                  ) : (
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      order.paymentVerified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {order.paymentVerified ? "Verified" : "Pending"}
                    </span>
                  )}
                </div>
                {order.paymentMethod === "cod" && (order as any).paymentCollectionStatus !== "collected" && (
                  <button
                    onClick={() => markCodCollected.mutate()}
                    disabled={markCodCollected.isPending}
                    className="w-full mt-2 px-3 py-2 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    {markCodCollected.isPending ? "Marking..." : "Mark as Collected"}
                  </button>
                )}
              </div>
            </div>

            {/* Coupon Info */}
            {order.couponCode ? (
              <div className="bg-gradient-to-br from-[#fce4ec] to-pink-50 rounded-2xl border border-[#f48fb1]/30 p-5">
                <h3 className="text-xs font-bold text-[#ad1457] uppercase tracking-wide mb-3 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Coupon Applied
                </h3>
                <p className="text-lg font-bold text-[#c2185b]">{order.couponCode}</p>
                {order.discountAmount && order.discountAmount > 0 && (
                  <p className="text-sm text-[#ad1457] mt-1">Saved ৳{order.discountAmount.toLocaleString()}</p>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-pink-100 p-5">
                <h3 className="text-xs font-bold text-[#ad1457] uppercase tracking-wide mb-3 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> Timeline
                </h3>
                <div className="space-y-1">
                  <p className="text-xs text-[#6d1b3b]/50">
                    Placed: {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                  <p className="text-xs text-[#6d1b3b]/50">
                    Updated: {new Date(order.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cancel Reason */}
          {order.cancelReason && (
            <div className="bg-red-50 rounded-2xl border border-red-100 p-5">
              <h3 className="text-xs font-bold text-red-600 uppercase tracking-wide mb-2 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Cancel Reason
              </h3>
              <p className="text-sm text-red-700">{order.cancelReason}</p>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Customer + Actions */}
        <div className="space-y-5">

          {/* Customer Info */}
          <div className="bg-white rounded-2xl border border-pink-100 p-5">
            <h3 className="text-xs font-bold text-[#ad1457] uppercase tracking-wide mb-4 flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Customer
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#e91e8c] to-[#c2185b] flex items-center justify-center text-white font-bold text-lg shrink-0">
                {order.shippingAddress.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-[#2d1a24]">{order.shippingAddress.name}</p>
                <p className="text-xs text-[#6d1b3b]/50">Customer</p>
              </div>
            </div>
            <div className="space-y-2">
              <a href={`tel:${order.shippingAddress.phone}`} className="flex items-center gap-2 text-sm text-[#6d1b3b]/70 hover:text-[#e91e8c] transition-colors">
                <Phone className="w-4 h-4 shrink-0" />
                {order.shippingAddress.phone}
              </a>
              {order.shippingAddress.email && (
                <a href={`mailto:${order.shippingAddress.email}`} className="flex items-center gap-2 text-sm text-[#6d1b3b]/70 hover:text-[#e91e8c] transition-colors">
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="truncate">{order.shippingAddress.email}</span>
                </a>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl border border-pink-100 p-5">
            <h3 className="text-xs font-bold text-[#ad1457] uppercase tracking-wide mb-3 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" /> Delivery Address
            </h3>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[#2d1a24]">{order.shippingAddress.street}</p>
              {order.shippingAddress.area && (
                <p className="text-sm text-[#6d1b3b]/70">{order.shippingAddress.area}</p>
              )}
              <p className="text-sm text-[#6d1b3b]/70">{order.shippingAddress.city}</p>
              <p className="text-sm text-[#6d1b3b]/70">Postcode: {order.shippingAddress.postcode}</p>
              {order.shippingAddress.note && (
                <p className="text-xs text-[#6d1b3b]/50 mt-2 italic bg-pink-50 rounded-lg px-3 py-2">
                  📝 {order.shippingAddress.note}
                </p>
              )}
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-2xl border border-pink-100 p-5">
            <h3 className="text-xs font-bold text-[#ad1457] uppercase tracking-wide mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1"><Edit3 className="w-3.5 h-3.5" /> Update Status</span>
            </h3>
            {editingStatus ? (
              <div className="space-y-2">
                <select
                  value={newStatus || order.status}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-pink-200 text-sm outline-none focus:border-[#e91e8c] bg-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      if (newStatus && newStatus !== order.status) {
                        updateStatus.mutate({ status: newStatus });
                      }
                    }}
                    disabled={updateStatus.isPending || !newStatus || newStatus === order.status}
                    className="flex-1 px-4 py-2 bg-[#e91e8c] text-white rounded-lg text-sm font-bold disabled:opacity-50 hover:bg-[#c2185b] transition-colors"
                  >
                    {updateStatus.isPending ? "Saving..." : "Update"}
                  </button>
                  <button
                    onClick={() => setEditingStatus(false)}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <StatusBadge status={order.status} />
                <button
                  onClick={() => { setEditingStatus(true); setNewStatus(order.status); }}
                  className="text-xs text-[#ad1457] hover:text-[#e91e8c] font-semibold underline"
                >
                  Change
                </button>
              </div>
            )}
          </div>

          {/* Pathao Courier */}
          <div className="bg-white rounded-2xl border border-pink-100 p-5">
            <h3 className="text-xs font-bold text-[#ad1457] uppercase tracking-wide mb-3 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" /> Pathao Courier
            </h3>

            {!order.pathaoConsignmentId ? (
              <button
                onClick={() => {
                  setPathaoDescription(order.items.map((i) => i.name).join(", "));
                  setPathaoWeight("0.5");
                  setPathaoInstruction("");
                  setPathaoModal(true);
                }}
                className="w-full px-4 py-3 bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white rounded-xl text-sm font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Truck className="w-4 h-4" />
                Send to Pathao
              </button>
            ) : (
              <div className="space-y-3">
                <div className="bg-green-50 rounded-xl border border-green-200 px-4 py-3">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-bold text-green-700">Sent to Pathao</span>
                  </div>
                  <p className="text-xs font-mono text-green-600 bg-green-100 rounded px-2 py-1 mt-1 break-all">
                    {order.pathaoConsignmentId}
                  </p>
                </div>

                {/* Pathao delivery status */}
                {order.pathaoStatus && (
                  <div className="bg-blue-50 rounded-xl border border-blue-200 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-blue-700">Delivery Status</span>
                    <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">{order.pathaoStatus}</span>
                  </div>
                )}

                {/* Check status button */}
                <button
                  onClick={() => checkPathaoStatusMutation.mutate()}
                  disabled={checkPathaoStatusMutation.isPending}
                  className="w-full px-3 py-2 border border-blue-200 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${checkPathaoStatusMutation.isPending ? "animate-spin" : ""}`} />
                  {checkPathaoStatusMutation.isPending ? "Checking..." : "Refresh Pathao Status"}
                </button>
                {!confirmRepush ? (
                  <button
                    onClick={() => setConfirmRepush(true)}
                    className="w-full px-3 py-2 border border-pink-200 text-[#ad1457] rounded-lg text-xs font-bold hover:bg-pink-50 transition-colors flex items-center justify-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Re-push to Pathao
                  </button>
                ) : (
                  <div className="bg-yellow-50 rounded-xl border border-yellow-200 px-4 py-3 space-y-2">
                    <p className="text-xs font-semibold text-yellow-800">
                      This will create a new Pathao consignment and overwrite the existing ID. Continue?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setConfirmRepush(false);
                          setPathaoDescription(order.items.map((i) => i.name).join(", "));
                          setPathaoWeight("0.5");
                          setPathaoInstruction("");
                          setPathaoModal(true);
                        }}
                        className="flex-1 px-3 py-1.5 bg-[#e91e8c] text-white rounded-lg text-xs font-bold"
                      >
                        Yes, Re-push
                      </button>
                      <button
                        onClick={() => setConfirmRepush(false)}
                        className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Order Meta */}
          <div className="bg-white rounded-2xl border border-pink-100 p-5">
            <h3 className="text-xs font-bold text-[#ad1457] uppercase tracking-wide mb-3 flex items-center gap-1">
              <BarChart3 className="w-3.5 h-3.5" /> Order Info
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-[#6d1b3b]/60">Order ID</span>
                <span className="font-mono text-xs text-[#2d1a24] bg-pink-50 px-2 py-0.5 rounded">{order._id.slice(-8)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6d1b3b]/60">Delivery</span>
                <span className="font-semibold text-[#2d1a24] capitalize">{order.deliveryMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6d1b3b]/60">Payment</span>
                <span className="font-semibold text-[#2d1a24] uppercase">{order.paymentMethod}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pathao Push Modal */}
      {pathaoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-lg font-bold text-[#2d1a24] flex items-center gap-2">
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
              {/* Total Weight */}
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

              {/* Item Description */}
              <div>
                <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">
                  Item Description
                </label>
                <textarea
                  value={pathaoDescription}
                  onChange={(e) => setPathaoDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-[#fce4ec] rounded-xl text-sm outline-none focus:border-[#e91e8c] transition-colors resize-none"
                  placeholder="Product names / description"
                />
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">
                  Special Instructions (optional)
                </label>
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
                    itemWeight: parseFloat(pathaoWeight) || 0.5,
                    itemDescription: pathaoDescription || undefined,
                    specialInstruction: pathaoInstruction || undefined,
                  })
                }
                disabled={pathaoMutation.isPending}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:shadow-lg transition-all flex items-center justify-center gap-2"
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
