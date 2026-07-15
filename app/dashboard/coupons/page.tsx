"use client";

import { useState } from "react";
import { 
  Ticket,
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  Tag,
  Percent,
  DollarSign,
  Calendar,
  Users,
  Infinity,
  CheckCircle,
  XCircle,
  Clock,
  Save,
  ChevronLeft,
  ChevronRight,
  Gift,
  Zap,
  Copy,
  Check,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";
import { productsApi, categoriesApi } from "@/lib/api";
import { SearchableSelect, type SelectOption } from "@/components/ui/SearchableSelect";
import toast from "react-hot-toast";

// interface Coupon {
//   _id: string;
//   code: string;
//   description?: string;
//   discountType: "percentage" | "fixed";
//   discountValue: number;
//   minimumOrderAmount?: number;
//   maximumDiscount?: number;
//   usageLimit?: number;
//   perUserLimit?: number;
//   usedCount: number;
//   validFrom: string;
//   validUntil: string;
//   isActive: boolean;
//   createdAt: string;
// }

// interface CouponsResponse {
//   coupons: Coupon[];
//   total: number;
//   page: number;
//   totalPages: number;
// }

// type ModalMode = "create" | "edit" | null;

// const defaultForm = {
//   code: "",
//   description: "",
//   discountType: "percentage" as "percentage" | "fixed",
//   discountValue: 0,
//   minimumOrderAmount: 0,
//   maximumDiscount: 0,
//   usageLimit: 0,
//   perUserLimit: 0,
//   validFrom: "",
//   validUntil: "",
// };

// export default function CouponsPage() {
//   const [page, setPage] = useState(1);
//   const [modalMode, setModalMode] = useState<ModalMode>(null);
//   const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
//   const [formData, setFormData] = useState(defaultForm);
//   const [error, setError] = useState("");
//   const queryClient = useQueryClient();

//   const { data, isLoading } = useQuery({
//     queryKey: ["coupons", page],
//     queryFn: () => apiRequest<CouponsResponse>(`/coupons?page=${page}&limit=10`),
//   });

//   const createMutation = useMutation({
//     mutationFn: (payload: any) =>
//       apiRequest("/coupons", { method: "POST", body: payload }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["coupons"] });
//       closeModal();
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: any }) =>
//       apiRequest(`/coupons/${id}`, { method: "PUT", body: payload }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["coupons"] });
//       closeModal();
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: (id: string) =>
//       apiRequest(`/coupons/${id}`, { method: "DELETE" }),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["coupons"] }),
//   });

//   const openCreate = () => {
//     setFormData(defaultForm);
//     setEditingCoupon(null);
//     setModalMode("create");
//     setError("");
//   };

//   const openEdit = (coupon: Coupon) => {
//     setFormData({
//       code: coupon.code,
//       description: coupon.description || "",
//       discountType: coupon.discountType,
//       discountValue: coupon.discountValue,
//       minimumOrderAmount: coupon.minimumOrderAmount || 0,
//       maximumDiscount: coupon.maximumDiscount || 0,
//       usageLimit: coupon.usageLimit || 0,
//       perUserLimit: coupon.perUserLimit || 0,
//       validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 16) : "",
//       validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 16) : "",
//     });
//     setEditingCoupon(coupon);
//     setModalMode("edit");
//     setError("");
//   };

//   const closeModal = () => {
//     setModalMode(null);
//     setEditingCoupon(null);
//     setError("");
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!formData.code || !formData.discountValue || !formData.validFrom || !formData.validUntil) {
//       setError("Code, discount value, and valid dates are required");
//       return;
//     }

//     const payload: any = {
//       code: formData.code.toUpperCase(),
//       description: formData.description || undefined,
//       discountType: formData.discountType,
//       discountValue: formData.discountValue,
//       minimumOrderAmount: formData.minimumOrderAmount || undefined,
//       maximumDiscount: formData.maximumDiscount || undefined,
//       usageLimit: formData.usageLimit || undefined,
//       perUserLimit: formData.perUserLimit || undefined,
//       validFrom: new Date(formData.validFrom).toISOString(),
//       validUntil: new Date(formData.validUntil).toISOString(),
//     };

//     try {
//       if (modalMode === "create") {
//         await createMutation.mutateAsync(payload);
//       } else if (editingCoupon) {
//         await updateMutation.mutateAsync({ id: editingCoupon._id, payload });
//       }
//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     }
//   };

//   const handleDeactivate = async (id: string) => {
//     if (!confirm("Are you sure you want to deactivate this coupon?")) return;
//     try {
//       await deleteMutation.mutateAsync(id);
//     } catch (err: any) {
//       alert(err.message || "Failed to deactivate coupon");
//     }
//   };

//   const formatDiscount = (coupon: Coupon) => {
//     if (coupon.discountType === "percentage") return `${coupon.discountValue}%`;
//     return `৳${coupon.discountValue}`;
//   };

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div className="h-8 w-40 bg-pink-100 rounded-lg animate-pulse" />
//           <div className="h-10 w-36 bg-pink-100 rounded-xl animate-pulse" />
//         </div>
//         <div className="space-y-4">
//           {[1, 2, 3, 4].map((i) => (
//             <div key={i} className="bg-white rounded-2xl border border-pink-100 p-6 h-28 animate-pulse" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   const coupons = data?.coupons || [];
//   const totalPages = data?.totalPages || 1;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Coupons</h1>
//           <p className="text-sm text-[#6d1b3b]/60 mt-1">{data?.total || 0} coupons configured</p>
//         </div>
//         <button
//           onClick={openCreate}
//           className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all w-fit"
//         >
//           + Add Coupon
//         </button>
//       </div>

//       {/* Coupons List */}
//       {coupons.length === 0 ? (
//         <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center">
//           <span className="text-4xl mb-4 block">🎟️</span>
//           <h3 className="text-lg font-semibold text-[#2d1a24] mb-2">No coupons yet</h3>
//           <p className="text-sm text-[#6d1b3b]/50 mb-4">Create your first coupon to offer discounts</p>
//           <button onClick={openCreate} className="text-sm text-[#e91e8c] font-semibold hover:underline">
//             + Create Coupon
//           </button>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {coupons.map((coupon) => (
//             <div
//               key={coupon._id}
//               className="bg-white rounded-2xl border border-pink-100 p-5 hover:shadow-md hover:shadow-pink-100/50 transition-all"
//             >
//               <div className="flex items-start justify-between mb-3">
//                 <div className="flex items-center gap-2">
//                   <span className="text-sm font-bold text-[#ad1457] bg-pink-50 px-3 py-1 rounded-lg font-mono tracking-wider">
//                     {coupon.code}
//                   </span>
//                   <span
//                     className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
//                       coupon.isActive
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     {coupon.isActive ? "Active" : "Inactive"}
//                   </span>
//                 </div>
//                 <span className="text-lg font-bold text-[#e91e8c]">{formatDiscount(coupon)}</span>
//               </div>

//               {coupon.description && (
//                 <p className="text-xs text-[#6d1b3b]/60 mb-3">{coupon.description}</p>
//               )}

//               <div className="grid grid-cols-2 gap-2 text-xs text-[#6d1b3b]/60 mb-3">
//                 <div>
//                   <span className="text-[#6d1b3b]/40">Min Order: </span>
//                   <span className="font-medium">
//                     {coupon.minimumOrderAmount ? `৳${coupon.minimumOrderAmount}` : "None"}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-[#6d1b3b]/40">Usage: </span>
//                   <span className="font-medium">
//                     {coupon.usedCount}/{coupon.usageLimit || "∞"}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-[#6d1b3b]/40">From: </span>
//                   <span className="font-medium">
//                     {new Date(coupon.validFrom).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <div>
//                   <span className="text-[#6d1b3b]/40">Until: </span>
//                   <span className="font-medium">
//                     {new Date(coupon.validUntil).toLocaleDateString()}
//                   </span>
//                 </div>
//               </div>

//               <div className="flex items-center gap-2 pt-3 border-t border-pink-50">
//                 <button
//                   onClick={() => openEdit(coupon)}
//                   className="text-xs font-semibold text-[#e91e8c] hover:text-[#ad1457] transition-colors"
//                 >
//                   Edit
//                 </button>
//                 {coupon.isActive && (
//                   <button
//                     onClick={() => handleDeactivate(coupon._id)}
//                     className="text-xs font-semibold text-red-400 hover:text-red-600 transition-colors"
//                   >
//                     Deactivate
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-center gap-2">
//           <button
//             onClick={() => setPage((p) => Math.max(1, p - 1))}
//             disabled={page === 1}
//             className="px-3 py-2 rounded-lg border border-pink-200 text-sm text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50 transition-all"
//           >
//             ← Prev
//           </button>
//           <span className="text-sm text-[#6d1b3b]/60 px-3">
//             Page {page} of {totalPages}
//           </span>
//           <button
//             onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
//             disabled={page === totalPages}
//             className="px-3 py-2 rounded-lg border border-pink-200 text-sm text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50 transition-all"
//           >
//             Next →
//           </button>
//         </div>
//       )}

//       {/* Create/Edit Modal */}
//       {modalMode && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-2xl border border-pink-100 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
//             <div className="flex items-center justify-between mb-5">
//               <h2 className="text-lg font-bold text-[#2d1a24] font-playfair">
//                 {modalMode === "create" ? "Create Coupon" : "Edit Coupon"}
//               </h2>
//               <button onClick={closeModal} className="text-[#6d1b3b]/40 hover:text-[#6d1b3b] text-xl">
//                 ×
//               </button>
//             </div>

//             {error && (
//               <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Coupon Code</label>
//                 <input
//                   type="text"
//                   value={formData.code}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
//                   placeholder="e.g. SUMMER20"
//                   className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30 uppercase"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Description</label>
//                 <input
//                   type="text"
//                   value={formData.description}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//                   placeholder="Optional description..."
//                   className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Discount Type</label>
//                   <select
//                     value={formData.discountType}
//                     onChange={(e) =>
//                       setFormData((prev) => ({
//                         ...prev,
//                         discountType: e.target.value as "percentage" | "fixed",
//                       }))
//                     }
//                     className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all bg-white"
//                   >
//                     <option value="percentage">Percentage (%)</option>
//                     <option value="fixed">Fixed (৳)</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Discount Value</label>
//                   <input
//                     type="number"
//                     value={formData.discountValue || ""}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, discountValue: Number(e.target.value) }))}
//                     placeholder="0"
//                     min={0}
//                     className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Min Order (৳)</label>
//                   <input
//                     type="number"
//                     value={formData.minimumOrderAmount || ""}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, minimumOrderAmount: Number(e.target.value) }))}
//                     placeholder="Optional"
//                     min={0}
//                     className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Max Discount (৳)</label>
//                   <input
//                     type="number"
//                     value={formData.maximumDiscount || ""}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, maximumDiscount: Number(e.target.value) }))}
//                     placeholder="Optional"
//                     min={0}
//                     className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Usage Limit</label>
//                   <input
//                     type="number"
//                     value={formData.usageLimit || ""}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, usageLimit: Number(e.target.value) }))}
//                     placeholder="Unlimited"
//                     min={0}
//                     className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Per User Limit</label>
//                   <input
//                     type="number"
//                     value={formData.perUserLimit || ""}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, perUserLimit: Number(e.target.value) }))}
//                     placeholder="Unlimited"
//                     min={0}
//                     className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Valid From</label>
//                   <input
//                     type="datetime-local"
//                     value={formData.validFrom}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, validFrom: e.target.value }))}
//                     className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Valid Until</label>
//                   <input
//                     type="datetime-local"
//                     value={formData.validUntil}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, validUntil: e.target.value }))}
//                     className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
//                   />
//                 </div>
//               </div>

//               {/* Submit */}
//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={closeModal}
//                   className="flex-1 py-2.5 rounded-xl border border-pink-200 text-sm font-semibold text-[#6d1b3b] hover:bg-pink-50 transition-all"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={createMutation.isPending || updateMutation.isPending}
//                   className="flex-1 bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-50"
//                 >
//                   {createMutation.isPending || updateMutation.isPending
//                     ? "Saving..."
//                     : modalMode === "create"
//                     ? "Create Coupon"
//                     : "Update Coupon"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

interface Coupon {
  _id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderAmount?: number;
  maximumDiscount?: number;
  usageLimit?: number;
  perUserLimit?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  usedCount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  createdAt: string;
}

interface CouponsResponse {
  coupons: Coupon[];
  total: number;
  page: number;
  totalPages: number;
}

type ModalMode = "create" | "edit" | null;

const defaultForm = {
  code: "",
  description: "",
  discountType: "percentage" as "percentage" | "fixed",
  discountValue: 0,
  minimumOrderAmount: 0,
  maximumDiscount: 0,
  usageLimit: 0,
  perUserLimit: 0,
  applicableProducts: [] as string[],
  applicableCategories: [] as string[],
  validFrom: "",
  validUntil: "",
};

export default function CouponsPage() {
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  // Quick coupon state
  const [quickOpen, setQuickOpen] = useState(false);
  const [quickForm, setQuickForm] = useState({
    discountType: "fixed" as "fixed" | "percentage",
    discountValue: 0,
    expiryHours: 48,
    note: "",
  });
  const [quickResult, setQuickResult] = useState<{ code: string; validUntil: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["coupon-admin-products"],
    queryFn: () => productsApi.getAll({ limit: 1000 }),
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["coupon-admin-categories"],
    queryFn: () => categoriesApi.getAllAdmin(),
  });

  const productOptions: SelectOption[] = (productsData?.products || []).map((product) => ({
    value: product._id,
    label: product.name,
  }));

  const categoryOptions: SelectOption[] = (categoriesData || []).map((category) => ({
    value: category._id,
    label: category.name,
  }));

  const { data, isLoading } = useQuery({
    queryKey: ["coupons", page],
    queryFn: () => apiRequest<CouponsResponse>(`/coupons?page=${page}&limit=10`),
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) =>
      apiRequest("/coupons", { method: "POST", body: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      closeModal();
      toast.success("Coupon created successfully!");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create coupon"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      apiRequest(`/coupons/${id}`, { method: "PUT", body: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      closeModal();
      toast.success("Coupon updated successfully!");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update coupon"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) =>
      apiRequest(`/coupons/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      toast.success("Coupon deactivated");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to deactivate coupon"),
  });

  const quickMutation = useMutation({
    mutationFn: (payload: { discountType: string; discountValue: number; expiryHours: number; note?: string }) =>
      apiRequest<Coupon>("/coupons/quick", { method: "POST", body: payload }),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      setQuickResult({ code: data.code, validUntil: data.validUntil });
      toast.success("Quick coupon created!");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create quick coupon"),
  });

  const openCreate = () => {
    setFormData(defaultForm);
    setEditingCoupon(null);
    setModalMode("create");
    setError("");
  };

  const openEdit = (coupon: Coupon) => {
    setFormData({
      code: coupon.code,
      description: coupon.description || "",
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minimumOrderAmount: coupon.minimumOrderAmount || 0,
      maximumDiscount: coupon.maximumDiscount || 0,
      usageLimit: coupon.usageLimit || 0,
      perUserLimit: coupon.perUserLimit || 0,
      applicableProducts: coupon.applicableProducts || [],
      applicableCategories: coupon.applicableCategories || [],
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 16) : "",
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().slice(0, 16) : "",
    });
    setEditingCoupon(coupon);
    setModalMode("edit");
    setError("");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingCoupon(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.code || !formData.discountValue || !formData.validFrom || !formData.validUntil) {
      setError("Code, discount value, and valid dates are required");
      return;
    }

    const payload: any = {
      code: formData.code.toUpperCase(),
      description: formData.description || undefined,
      discountType: formData.discountType,
      discountValue: formData.discountValue,
      minimumOrderAmount: formData.minimumOrderAmount || undefined,
      maximumDiscount: formData.maximumDiscount || undefined,
      usageLimit: formData.usageLimit || undefined,
      perUserLimit: formData.perUserLimit || undefined,
      applicableProducts: formData.applicableProducts.length ? formData.applicableProducts : undefined,
      applicableCategories: formData.applicableCategories.length ? formData.applicableCategories : undefined,
      validFrom: new Date(formData.validFrom).toISOString(),
      validUntil: new Date(formData.validUntil).toISOString(),
    };

    try {
      if (modalMode === "create") {
        await createMutation.mutateAsync(payload);
      } else if (editingCoupon) {
        await updateMutation.mutateAsync({ id: editingCoupon._id, payload });
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this coupon?")) return;
    deleteMutation.mutate(id);
  };

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickForm.discountValue) {
      toast.error("Enter a discount amount");
      return;
    }
    quickMutation.mutate({
      discountType: quickForm.discountType,
      discountValue: quickForm.discountValue,
      expiryHours: quickForm.expiryHours,
      note: quickForm.note || undefined,
    });
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openQuick = () => {
    setQuickOpen(true);
    setQuickResult(null);
    setCopied(false);
    setQuickForm({ discountType: "fixed", discountValue: 0, expiryHours: 48, note: "" });
  };

  const formatDiscount = (coupon: Coupon) => {
    if (coupon.discountType === "percentage") return `${coupon.discountValue}%`;
    return `৳${coupon.discountValue}`;
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-40 bg-pink-100 rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-pink-50 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-36 bg-pink-100 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-pink-100 p-6 h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const coupons = data?.coupons || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair flex items-center gap-2">
            <Ticket className="w-6 h-6 text-[#e91e8c]" />
            Coupons
          </h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-1 flex items-center gap-1">
            <Gift className="w-3 h-3" />
            {data?.total || 0} coupons configured
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openQuick}
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-amber-200"
          >
            <Zap className="w-4 h-4" />
            Quick Coupon
          </button>
          <button
            onClick={openCreate}
            className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Coupon
          </button>
        </div>
      </div>

      {/* Coupons List */}
      {coupons.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
            <Ticket className="w-10 h-10 text-[#ad1457]/40" />
          </div>
          <h3 className="text-lg font-semibold text-[#2d1a24] mb-2">No coupons yet</h3>
          <p className="text-sm text-[#6d1b3b]/50 mb-4">Create your first coupon to offer discounts</p>
          <button onClick={openCreate} className="inline-flex items-center gap-1 text-sm text-[#e91e8c] font-semibold hover:underline">
            <Plus className="w-4 h-4" /> Create Coupon
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {coupons.map((coupon) => (
            <div
              key={coupon._id}
              className="bg-white rounded-2xl border border-pink-100 p-5 hover:shadow-md hover:shadow-pink-100/50 transition-all group relative overflow-hidden"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-pink-50 to-transparent rounded-bl-3xl opacity-50" />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#ad1457] bg-pink-50 px-3 py-1.5 rounded-lg font-mono tracking-wider">
                      <Tag className="w-3.5 h-3.5" />
                      {coupon.code}
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        coupon.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {coupon.isActive ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <XCircle className="w-3 h-3" />
                      )}
                      {coupon.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {coupon.discountType === "percentage" ? (
                      <Percent className="w-4 h-4 text-[#e91e8c]" />
                    ) : (
                      <DollarSign className="w-4 h-4 text-[#e91e8c]" />
                    )}
                    <span className="text-xl font-bold text-[#e91e8c]">{formatDiscount(coupon)}</span>
                  </div>
                </div>

                {coupon.description && (
                  <p className="text-xs text-[#6d1b3b]/60 mb-3">{coupon.description}</p>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs text-[#6d1b3b]/60 mb-3">
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3 text-[#6d1b3b]/40" />
                    <span className="text-[#6d1b3b]/40">Min Order:</span>
                    <span className="font-medium">
                      {coupon.minimumOrderAmount ? `৳${coupon.minimumOrderAmount}` : "None"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#6d1b3b]/40" />
                    <span className="text-[#6d1b3b]/40">Usage:</span>
                    <span className="font-medium">
                      {coupon.usedCount}/{coupon.usageLimit || <Infinity className="w-3 h-3 inline" />}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#6d1b3b]/40" />
                    <span className="text-[#6d1b3b]/40">From:</span>
                    <span className="font-medium">
                      {new Date(coupon.validFrom).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-[#6d1b3b]/40" />
                    <span className="text-[#6d1b3b]/40">Until:</span>
                    <span className="font-medium">
                      {new Date(coupon.validUntil).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {(coupon.applicableProducts?.length || coupon.applicableCategories?.length) && (
                  <div className="space-y-1 text-xs text-[#6d1b3b]/70 mb-3">
                    {coupon.applicableProducts?.length ? (
                      <p>
                        <span className="font-semibold text-[#2d1a24]">Products:</span> {coupon.applicableProducts.join(', ')}
                      </p>
                    ) : null}
                    {coupon.applicableCategories?.length ? (
                      <p>
                        <span className="font-semibold text-[#2d1a24]">Categories:</span> {coupon.applicableCategories.join(', ')}
                      </p>
                    ) : null}
                  </div>
                )}

                <div className="flex items-center gap-3 pt-3 border-t border-pink-50">
                  <button
                    onClick={() => openEdit(coupon)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[#e91e8c] hover:text-[#ad1457] transition-colors"
                  >
                    <Edit className="w-3 h-3" />
                    Edit
                  </button>
                  {coupon.isActive && (
                    <button
                      onClick={() => handleDeactivate(coupon._id)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Deactivate
                    </button>
                  )}
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
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-pink-200 text-sm text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>
          <div className="flex items-center gap-2">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                    page === pageNum
                      ? "bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white shadow-md"
                      : "text-[#6d1b3b] hover:bg-pink-50"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-pink-200 text-sm text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50 transition-all"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Quick Coupon Modal */}
      {quickOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-amber-200 shadow-xl w-full max-w-sm">
            <div className="bg-gradient-to-r from-amber-500 to-orange-400 rounded-t-2xl px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white">
                <Zap className="w-5 h-5" />
                <h2 className="text-base font-bold">Quick Coupon</h2>
              </div>
              <button
                onClick={() => { setQuickOpen(false); setQuickResult(null); }}
                className="text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {!quickResult ? (
                <>
                  <p className="text-sm text-[#6d1b3b]/60 mb-4">
                    Generate a one-time use coupon instantly — perfect for personal deals with customers.
                  </p>
                  <form onSubmit={handleQuickSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#2d1a24] mb-1.5">Discount Type</label>
                        <select
                          value={quickForm.discountType}
                          onChange={(e) => setQuickForm((p) => ({ ...p, discountType: e.target.value as "fixed" | "percentage" }))}
                          className="w-full px-3 py-2.5 rounded-xl border border-amber-200 text-sm text-[#2d1a24] outline-none focus:border-amber-500 transition-all bg-white"
                        >
                          <option value="fixed">Fixed (৳)</option>
                          <option value="percentage">Percent (%)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#2d1a24] mb-1.5">
                          {quickForm.discountType === "fixed" ? "Amount (৳)" : "Percent (%)"}
                        </label>
                        <input
                          type="number"
                          value={quickForm.discountValue || ""}
                          onChange={(e) => setQuickForm((p) => ({ ...p, discountValue: Number(e.target.value) }))}
                          placeholder="e.g. 100"
                          min={1}
                          className="w-full px-3 py-2.5 rounded-xl border border-amber-200 text-sm text-[#2d1a24] outline-none focus:border-amber-500 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2d1a24] mb-1.5">Expires In</label>
                      <select
                        value={quickForm.expiryHours}
                        onChange={(e) => setQuickForm((p) => ({ ...p, expiryHours: Number(e.target.value) }))}
                        className="w-full px-3 py-2.5 rounded-xl border border-amber-200 text-sm text-[#2d1a24] outline-none focus:border-amber-500 transition-all bg-white"
                      >
                        <option value={6}>6 hours</option>
                        <option value={12}>12 hours</option>
                        <option value={24}>24 hours</option>
                        <option value={48}>48 hours</option>
                        <option value={72}>72 hours</option>
                        <option value={168}>1 week</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#2d1a24] mb-1.5">Note (optional)</label>
                      <input
                        type="text"
                        value={quickForm.note}
                        onChange={(e) => setQuickForm((p) => ({ ...p, note: e.target.value }))}
                        placeholder="e.g. Negotiated deal for Rahim vai"
                        className="w-full px-3 py-2.5 rounded-xl border border-amber-200 text-sm text-[#2d1a24] outline-none focus:border-amber-500 transition-all placeholder:text-[#ad1457]/30"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={quickMutation.isPending || !quickForm.discountValue}
                      className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      {quickMutation.isPending ? "Generating..." : "Generate Code"}
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                    <Check className="w-7 h-7 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-[#6d1b3b]/60 mb-2">One-time coupon ready — share this code:</p>
                    <div className="flex items-center gap-2 bg-amber-50 border-2 border-dashed border-amber-300 rounded-xl px-4 py-3">
                      <span className="flex-1 font-mono text-xl font-bold text-amber-700 tracking-widest">
                        {quickResult.code}
                      </span>
                      <button
                        onClick={() => handleCopy(quickResult.code)}
                        className={`shrink-0 p-1.5 rounded-lg transition-all ${copied ? "bg-green-100 text-green-600" : "bg-white text-[#6d1b3b] hover:bg-amber-100"}`}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-[#6d1b3b]/50 mt-2">
                      Valid for{" "}
                      <span className="font-semibold text-amber-600">
                        {quickForm.discountType === "fixed" ? `৳${quickForm.discountValue} off` : `${quickForm.discountValue}% off`}
                      </span>
                      {" · "}expires{" "}
                      <span className="font-semibold">
                        {new Date(quickResult.validUntil).toLocaleString("en-GB", {
                          day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
                        })}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setQuickResult(null); setQuickForm({ discountType: "fixed", discountValue: 0, expiryHours: 48, note: "" }); setCopied(false); }}
                      className="flex-1 py-2.5 rounded-xl border border-amber-200 text-sm font-semibold text-amber-700 hover:bg-amber-50 transition-all"
                    >
                      New Code
                    </button>
                    <button
                      onClick={() => { setQuickOpen(false); setQuickResult(null); }}
                      className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold transition-all"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-pink-100 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-pink-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#2d1a24] font-playfair flex items-center gap-2">
                {modalMode === "create" ? (
                  <>
                    <Ticket className="w-5 h-5 text-[#e91e8c]" />
                    Create Coupon
                  </>
                ) : (
                  <>
                    <Edit className="w-5 h-5 text-[#e91e8c]" />
                    Edit Coupon
                  </>
                )}
              </h2>
              <button onClick={closeModal} className="text-[#6d1b3b]/40 hover:text-[#6d1b3b] transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Coupon Code *</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ad1457]/40" />
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData((prev) => ({ ...prev, code: e.target.value }))}
                      placeholder="e.g. SUMMER20"
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30 uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Optional description..."
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Discount Type *</label>
                    <select
                      value={formData.discountType}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          discountType: e.target.value as "percentage" | "fixed",
                        }))
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all bg-white"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed (৳)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Discount Value *</label>
                    <input
                      type="number"
                      value={formData.discountValue || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, discountValue: Number(e.target.value) }))}
                      placeholder="0"
                      min={0}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Min Order (৳)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ad1457]/40" />
                      <input
                        type="number"
                        value={formData.minimumOrderAmount || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, minimumOrderAmount: Number(e.target.value) }))}
                        placeholder="Optional"
                        min={0}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Max Discount (৳)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ad1457]/40" />
                      <input
                        type="number"
                        value={formData.maximumDiscount || ""}
                        onChange={(e) => setFormData((prev) => ({ ...prev, maximumDiscount: Number(e.target.value) }))}
                        placeholder="Optional"
                        min={0}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Usage Limit</label>
                    <input
                      type="number"
                      value={formData.usageLimit || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, usageLimit: Number(e.target.value) }))}
                      placeholder="Unlimited"
                      min={0}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Per User Limit</label>
                    <input
                      type="number"
                      value={formData.perUserLimit || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, perUserLimit: Number(e.target.value) }))}
                      placeholder="Unlimited"
                      min={0}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <SearchableSelect
                      label="Applicable Products"
                      placeholder="Search products..."
                      multiple
                      options={productOptions}
                      value={formData.applicableProducts}
                      onChange={(values) => setFormData((prev) => ({ ...prev, applicableProducts: values }))}
                      loading={productsLoading}
                      className="w-full"
                    />
                    <p className="text-xs text-[#6d1b3b]/50 mt-1">Leave empty to apply to all products.</p>
                  </div>
                  <div>
                    <SearchableSelect
                      label="Applicable Categories"
                      placeholder="Search categories..."
                      multiple
                      options={categoryOptions}
                      value={formData.applicableCategories}
                      onChange={(values) => setFormData((prev) => ({ ...prev, applicableCategories: values }))}
                      loading={categoriesLoading}
                      className="w-full"
                    />
                    <p className="text-xs text-[#6d1b3b]/50 mt-1">Leave empty to apply to all categories.</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Valid From *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ad1457]/40" />
                      <input
                        type="datetime-local"
                        value={formData.validFrom}
                        onChange={(e) => setFormData((prev) => ({ ...prev, validFrom: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Valid Until *</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ad1457]/40" />
                      <input
                        type="datetime-local"
                        value={formData.validUntil}
                        onChange={(e) => setFormData((prev) => ({ ...prev, validUntil: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2.5 rounded-xl border border-pink-200 text-sm font-semibold text-[#6d1b3b] hover:bg-pink-50 transition-all inline-flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-50 inline-flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : modalMode === "create"
                      ? "Create Coupon"
                      : "Update Coupon"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}