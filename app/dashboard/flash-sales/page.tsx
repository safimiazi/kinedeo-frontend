// "use client";

// import { useState } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { apiRequest } from "@/lib/api/client";

// interface FlashSaleProduct {
//   productId: string;
//   salePrice: number;
// }

// interface FlashSale {
//   _id: string;
//   name: string;
//   startTime: string;
//   endTime: string;
//   isActive: boolean;
//   products: FlashSaleProduct[];
//   createdAt: string;
// }

// type ModalMode = "create" | "edit" | null;

// interface ProductRow {
//   productId: string;
//   salePrice: number;
// }

// const defaultForm = {
//   name: "",
//   startTime: "",
//   endTime: "",
//   products: [{ productId: "", salePrice: 0 }] as ProductRow[],
// };

// export default function FlashSalesPage() {
//   const [modalMode, setModalMode] = useState<ModalMode>(null);
//   const [editingSale, setEditingSale] = useState<FlashSale | null>(null);
//   const [formData, setFormData] = useState(defaultForm);
//   const [error, setError] = useState("");
//   const queryClient = useQueryClient();

//   const { data: flashSales, isLoading } = useQuery({
//     queryKey: ["flash-sales"],
//     queryFn: () => apiRequest<FlashSale[]>("/flash-sales"),
//   });

//   const createMutation = useMutation({
//     mutationFn: (payload: any) =>
//       apiRequest("/flash-sales", { method: "POST", body: payload }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
//       closeModal();
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, payload }: { id: string; payload: any }) =>
//       apiRequest(`/flash-sales/${id}`, { method: "PUT", body: payload }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
//       closeModal();
//     },
//   });

//   const toggleActiveMutation = useMutation({
//     mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
//       apiRequest(`/flash-sales/${id}`, { method: "PUT", body: { isActive: !isActive } }),
//     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["flash-sales"] }),
//   });

//   const getStatus = (sale: FlashSale) => {
//     const now = new Date();
//     const start = new Date(sale.startTime);
//     const end = new Date(sale.endTime);

//     if (now < start) return { label: "Upcoming", color: "bg-blue-100 text-blue-700" };
//     if (now > end) return { label: "Ended", color: "bg-gray-100 text-gray-700" };
//     return { label: "Active", color: "bg-green-100 text-green-700" };
//   };

//   const openCreate = () => {
//     setFormData(defaultForm);
//     setEditingSale(null);
//     setModalMode("create");
//     setError("");
//   };

//   const openEdit = (sale: FlashSale) => {
//     setFormData({
//       name: sale.name,
//       startTime: new Date(sale.startTime).toISOString().slice(0, 16),
//       endTime: new Date(sale.endTime).toISOString().slice(0, 16),
//       products: sale.products.length > 0
//         ? sale.products.map((p) => ({ productId: p.productId, salePrice: p.salePrice }))
//         : [{ productId: "", salePrice: 0 }],
//     });
//     setEditingSale(sale);
//     setModalMode("edit");
//     setError("");
//   };

//   const closeModal = () => {
//     setModalMode(null);
//     setEditingSale(null);
//     setError("");
//   };

//   const addProductRow = () => {
//     setFormData((prev) => ({
//       ...prev,
//       products: [...prev.products, { productId: "", salePrice: 0 }],
//     }));
//   };

//   const removeProductRow = (index: number) => {
//     setFormData((prev) => ({
//       ...prev,
//       products: prev.products.filter((_, i) => i !== index),
//     }));
//   };

//   const updateProductRow = (index: number, field: keyof ProductRow, value: string | number) => {
//     setFormData((prev) => ({
//       ...prev,
//       products: prev.products.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError("");

//     if (!formData.name || !formData.startTime || !formData.endTime) {
//       setError("Name, start time, and end time are required");
//       return;
//     }

//     const validProducts = formData.products.filter((p) => p.productId && p.salePrice > 0);
//     if (validProducts.length === 0) {
//       setError("At least one product with a sale price is required");
//       return;
//     }

//     const payload = {
//       name: formData.name,
//       startTime: new Date(formData.startTime).toISOString(),
//       endTime: new Date(formData.endTime).toISOString(),
//       products: validProducts,
//     };

//     try {
//       if (modalMode === "create") {
//         await createMutation.mutateAsync(payload);
//       } else if (editingSale) {
//         await updateMutation.mutateAsync({ id: editingSale._id, payload });
//       }
//     } catch (err: any) {
//       setError(err.message || "Something went wrong");
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="space-y-6">
//         <div className="flex items-center justify-between">
//           <div className="h-8 w-48 bg-pink-100 rounded-lg animate-pulse" />
//           <div className="h-10 w-40 bg-pink-100 rounded-xl animate-pulse" />
//         </div>
//         <div className="space-y-4">
//           {[1, 2, 3].map((i) => (
//             <div key={i} className="bg-white rounded-2xl border border-pink-100 p-6 h-28 animate-pulse" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   const sales = flashSales || [];

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Flash Sales</h1>
//           <p className="text-sm text-[#6d1b3b]/60 mt-1">{sales.length} flash sales configured</p>
//         </div>
//         <button
//           onClick={openCreate}
//           className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all w-fit"
//         >
//           + Create Flash Sale
//         </button>
//       </div>

//       {/* Flash Sales List */}
//       {sales.length === 0 ? (
//         <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center">
//           <span className="text-4xl mb-4 block">⚡</span>
//           <h3 className="text-lg font-semibold text-[#2d1a24] mb-2">No flash sales yet</h3>
//           <p className="text-sm text-[#6d1b3b]/50 mb-4">Create a flash sale to boost your sales</p>
//           <button onClick={openCreate} className="text-sm text-[#e91e8c] font-semibold hover:underline">
//             + Create Flash Sale
//           </button>
//         </div>
//       ) : (
//         <div className="space-y-4">
//           {sales.map((sale) => {
//             const status = getStatus(sale);
//             return (
//               <div
//                 key={sale._id}
//                 className="bg-white rounded-2xl border border-pink-100 p-5 hover:shadow-md hover:shadow-pink-100/50 transition-all"
//               >
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
//                   <div className="flex-1">
//                     <div className="flex items-center gap-3 mb-2">
//                       <span className="text-lg">⚡</span>
//                       <h3 className="text-sm font-bold text-[#2d1a24]">{sale.name}</h3>
//                       <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
//                         {status.label}
//                       </span>
//                       <span
//                         className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
//                           sale.isActive
//                             ? "bg-green-100 text-green-700"
//                             : "bg-red-100 text-red-700"
//                         }`}
//                       >
//                         {sale.isActive ? "Enabled" : "Disabled"}
//                       </span>
//                     </div>
//                     <div className="flex items-center gap-4 text-xs text-[#6d1b3b]/60">
//                       <span>
//                         📅 {new Date(sale.startTime).toLocaleString()} → {new Date(sale.endTime).toLocaleString()}
//                       </span>
//                       <span>📦 {sale.products.length} product{sale.products.length !== 1 ? "s" : ""}</span>
//                     </div>
//                   </div>

//                   {/* Actions */}
//                   <div className="flex items-center gap-2 shrink-0">
//                     <button
//                       onClick={() => openEdit(sale)}
//                       className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-50 text-[#e91e8c] hover:bg-pink-100 transition-all"
//                     >
//                       Edit
//                     </button>
//                     <button
//                       onClick={() => toggleActiveMutation.mutate({ id: sale._id, isActive: sale.isActive })}
//                       disabled={toggleActiveMutation.isPending}
//                       className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
//                         sale.isActive
//                           ? "bg-red-50 text-red-600 hover:bg-red-100"
//                           : "bg-green-50 text-green-600 hover:bg-green-100"
//                       }`}
//                     >
//                       {sale.isActive ? "Disable" : "Enable"}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Create/Edit Modal */}
//       {modalMode && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
//           <div className="bg-white rounded-2xl border border-pink-100 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
//             <div className="flex items-center justify-between mb-5">
//               <h2 className="text-lg font-bold text-[#2d1a24] font-playfair">
//                 {modalMode === "create" ? "Create Flash Sale" : "Edit Flash Sale"}
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
//                 <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Sale Name</label>
//                 <input
//                   type="text"
//                   value={formData.name}
//                   onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
//                   placeholder="e.g. Summer Flash Sale"
//                   className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Start Time</label>
//                   <input
//                     type="datetime-local"
//                     value={formData.startTime}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
//                     className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">End Time</label>
//                   <input
//                     type="datetime-local"
//                     value={formData.endTime}
//                     onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
//                     className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
//                   />
//                 </div>
//               </div>

//               {/* Products Section */}
//               <div className="border-t border-pink-100 pt-4">
//                 <div className="flex items-center justify-between mb-3">
//                   <label className="text-sm font-medium text-[#2d1a24]">Products</label>
//                   <span className="text-xs text-[#6d1b3b]/40">{formData.products.length} product(s)</span>
//                 </div>

//                 <div className="space-y-3">
//                   {formData.products.map((product, idx) => (
//                     <div key={idx} className="flex items-center gap-2">
//                       <div className="flex-1">
//                         <input
//                           type="text"
//                           value={product.productId}
//                           onChange={(e) => updateProductRow(idx, "productId", e.target.value)}
//                           placeholder="Product ID"
//                           className="w-full px-3 py-2 rounded-lg border border-pink-200 text-xs text-[#2d1a24] outline-none focus:border-[#e91e8c] placeholder:text-[#ad1457]/30"
//                         />
//                       </div>
//                       <div className="w-28">
//                         <input
//                           type="number"
//                           value={product.salePrice || ""}
//                           onChange={(e) => updateProductRow(idx, "salePrice", Number(e.target.value))}
//                           placeholder="Sale ৳"
//                           min={0}
//                           className="w-full px-3 py-2 rounded-lg border border-pink-200 text-xs text-[#2d1a24] outline-none focus:border-[#e91e8c] placeholder:text-[#ad1457]/30"
//                         />
//                       </div>
//                       {formData.products.length > 1 && (
//                         <button
//                           type="button"
//                           onClick={() => removeProductRow(idx)}
//                           className="text-red-400 hover:text-red-600 text-sm px-1"
//                         >
//                           ✕
//                         </button>
//                       )}
//                     </div>
//                   ))}
//                 </div>

//                 <button
//                   type="button"
//                   onClick={addProductRow}
//                   className="w-full mt-3 py-2 rounded-xl border border-dashed border-pink-200 text-xs text-[#e91e8c] font-semibold hover:bg-pink-50 transition-all"
//                 >
//                   + Add Product
//                 </button>
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
//                     ? "Create Sale"
//                     : "Update Sale"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { 
  Zap, 
  Plus, 
  Edit, 
  Eye, 
  EyeOff, 
  X,
  AlertCircle,
  Calendar,
  Clock,
  Package,
  Trash2,
  Save,
  CheckCircle,
  Circle,
  Timer,
  CalendarClock
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api/client";

interface FlashSaleProduct {
  productId: string;
  salePrice: number;
}

interface FlashSale {
  _id: string;
  name: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  products: FlashSaleProduct[];
  createdAt: string;
}

type ModalMode = "create" | "edit" | null;

interface ProductRow {
  productId: string;
  salePrice: number;
}

const defaultForm = {
  name: "",
  startTime: "",
  endTime: "",
  products: [{ productId: "", salePrice: 0 }] as ProductRow[],
};

export default function FlashSalesPage() {
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingSale, setEditingSale] = useState<FlashSale | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { data: flashSales, isLoading } = useQuery({
    queryKey: ["flash-sales"],
    queryFn: () => apiRequest<FlashSale[]>("/flash-sales"),
  });

  const createMutation = useMutation({
    mutationFn: (payload: any) =>
      apiRequest("/flash-sales", { method: "POST", body: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) =>
      apiRequest(`/flash-sales/${id}`, { method: "PUT", body: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      closeModal();
    },
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiRequest(`/flash-sales/${id}`, { method: "PUT", body: { isActive: !isActive } }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["flash-sales"] }),
  });

  const getStatus = (sale: FlashSale) => {
    const now = new Date();
    const start = new Date(sale.startTime);
    const end = new Date(sale.endTime);

    if (now < start) return { label: "Upcoming", color: "bg-blue-100 text-blue-700", icon: Clock };
    if (now > end) return { label: "Ended", color: "bg-gray-100 text-gray-700", icon: Circle };
    return { label: "Active", color: "bg-green-100 text-green-700", icon: Zap };
  };

  const openCreate = () => {
    setFormData(defaultForm);
    setEditingSale(null);
    setModalMode("create");
    setError("");
  };

  const openEdit = (sale: FlashSale) => {
    setFormData({
      name: sale.name,
      startTime: new Date(sale.startTime).toISOString().slice(0, 16),
      endTime: new Date(sale.endTime).toISOString().slice(0, 16),
      products: sale.products.length > 0
        ? sale.products.map((p) => ({ productId: p.productId, salePrice: p.salePrice }))
        : [{ productId: "", salePrice: 0 }],
    });
    setEditingSale(sale);
    setModalMode("edit");
    setError("");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingSale(null);
    setError("");
  };

  const addProductRow = () => {
    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, { productId: "", salePrice: 0 }],
    }));
  };

  const removeProductRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index),
    }));
  };

  const updateProductRow = (index: number, field: keyof ProductRow, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.startTime || !formData.endTime) {
      setError("Name, start time, and end time are required");
      return;
    }

    const validProducts = formData.products.filter((p) => p.productId && p.salePrice > 0);
    if (validProducts.length === 0) {
      setError("At least one product with a sale price is required");
      return;
    }

    const payload = {
      name: formData.name,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      products: validProducts,
    };

    try {
      if (modalMode === "create") {
        await createMutation.mutateAsync(payload);
      } else if (editingSale) {
        await updateMutation.mutateAsync({ id: editingSale._id, payload });
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-pink-100 rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-pink-50 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-40 bg-pink-100 rounded-xl animate-pulse" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-pink-100 p-6 h-28 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const sales = flashSales || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#e91e8c]" />
            Flash Sales
          </h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-1 flex items-center gap-1">
            <Timer className="w-3 h-3" />
            {sales.length} flash sale{sales.length !== 1 ? "s" : ""} configured
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all w-fit flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Flash Sale
        </button>
      </div>

      {/* Flash Sales List */}
      {sales.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
            <Zap className="w-10 h-10 text-[#e91e8c]" />
          </div>
          <h3 className="text-lg font-semibold text-[#2d1a24] mb-2">No flash sales yet</h3>
          <p className="text-sm text-[#6d1b3b]/50 mb-4">Create a flash sale to boost your sales and engagement</p>
          <button 
            onClick={openCreate} 
            className="inline-flex items-center gap-1 text-sm text-[#e91e8c] font-semibold hover:underline"
          >
            <Plus className="w-4 h-4" /> Create Flash Sale
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {sales.map((sale) => {
            const status = getStatus(sale);
            const StatusIcon = status.icon;
            return (
              <div
                key={sale._id}
                className="bg-white rounded-2xl border border-pink-100 hover:shadow-md hover:shadow-pink-100/50 transition-all group overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center">
                            <Zap className="w-4 h-4 text-[#e91e8c]" />
                          </div>
                          <h3 className="text-base font-bold text-[#2d1a24]">{sale.name}</h3>
                        </div>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            sale.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {sale.isActive ? (
                            <Eye className="w-3 h-3" />
                          ) : (
                            <EyeOff className="w-3 h-3" />
                          )}
                          {sale.isActive ? "Enabled" : "Disabled"}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs text-[#6d1b3b]/60">
                        <div className="flex items-center gap-1">
                          <CalendarClock className="w-3 h-3" />
                          <span>
                            {new Date(sale.startTime).toLocaleString()} → {new Date(sale.endTime).toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="w-3 h-3" />
                          <span>{sale.products.length} product{sale.products.length !== 1 ? "s" : ""}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openEdit(sale)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-pink-50 text-[#e91e8c] hover:bg-pink-100 transition-all"
                      >
                        <Edit className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => toggleActiveMutation.mutate({ id: sale._id, isActive: sale.isActive })}
                        disabled={toggleActiveMutation.isPending}
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                          sale.isActive
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {sale.isActive ? (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Disable
                          </>
                        ) : (
                          <>
                            <Eye className="w-3 h-3" />
                            Enable
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
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
                    <Zap className="w-5 h-5 text-[#e91e8c]" />
                    Create Flash Sale
                  </>
                ) : (
                  <>
                    <Edit className="w-5 h-5 text-[#e91e8c]" />
                    Edit Flash Sale
                  </>
                )}
              </h2>
              <button 
                onClick={closeModal} 
                className="text-[#6d1b3b]/40 hover:text-[#6d1b3b] transition-colors"
              >
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
                  <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">
                    Sale Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Summer Flash Sale"
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">
                      Start Time *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ad1457]/40" />
                      <input
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">
                      End Time *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ad1457]/40" />
                      <input
                        type="datetime-local"
                        value={formData.endTime}
                        onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Products Section */}
                <div className="border-t border-pink-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-[#2d1a24] flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      Products *
                    </label>
                    <span className="text-xs text-[#6d1b3b]/40">{formData.products.length} product(s)</span>
                  </div>

                  <div className="space-y-2">
                    {formData.products.map((product, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="flex-1">
                          <input
                            type="text"
                            value={product.productId}
                            onChange={(e) => updateProductRow(idx, "productId", e.target.value)}
                            placeholder="Product ID"
                            className="w-full px-3 py-2 rounded-lg border border-pink-200 text-xs text-[#2d1a24] outline-none focus:border-[#e91e8c] placeholder:text-[#ad1457]/30"
                          />
                        </div>
                        <div className="w-28">
                          <input
                            type="number"
                            value={product.salePrice || ""}
                            onChange={(e) => updateProductRow(idx, "salePrice", Number(e.target.value))}
                            placeholder="Sale ৳"
                            min={0}
                            className="w-full px-3 py-2 rounded-lg border border-pink-200 text-xs text-[#2d1a24] outline-none focus:border-[#e91e8c] placeholder:text-[#ad1457]/30"
                          />
                        </div>
                        {formData.products.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeProductRow(idx)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={addProductRow}
                    className="w-full mt-3 py-2 rounded-xl border border-dashed border-pink-200 text-xs text-[#e91e8c] font-semibold hover:bg-pink-50 transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Product
                  </button>
                  
                  <p className="text-[10px] text-[#6d1b3b]/40 mt-2">
                    Add product IDs and their discounted sale prices
                  </p>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2.5 rounded-xl border border-pink-200 text-sm font-semibold text-[#6d1b3b] hover:bg-pink-50 transition-all flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1 bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {createMutation.isPending || updateMutation.isPending
                      ? "Saving..."
                      : modalMode === "create"
                      ? "Create Sale"
                      : "Update Sale"}
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