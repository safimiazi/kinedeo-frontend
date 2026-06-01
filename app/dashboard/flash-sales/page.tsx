"use client";

import { useState } from "react";
import {
  Zap,
  Plus,
  Edit,
  Eye,
  EyeOff,
  X,
  Calendar,
  Package,
  Trash2,
  Save,
  Clock,
  Timer,
  CalendarClock,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "@/lib/api";
import { SearchableSelect, type SelectOption } from "@/components/ui/SearchableSelect";
import toast from "react-hot-toast";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FlashSaleProduct {
  productId: string;
  salePrice: number;
  originalPrice?: number;
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
  products: [] as ProductRow[],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatus(sale: FlashSale) {
  const now = new Date();
  const start = new Date(sale.startTime);
  const end = new Date(sale.endTime);

  if (now < start) return { label: "Upcoming", color: "bg-blue-100 text-blue-700", Icon: Clock };
  if (now > end) return { label: "Ended", color: "bg-gray-100 text-gray-700", Icon: Timer };
  return { label: "Live", color: "bg-green-100 text-green-700", Icon: Zap };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FlashSalesPage() {
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingSale, setEditingSale] = useState<FlashSale | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const queryClient = useQueryClient();

  // ── Data fetching ──────────────────────────────────────────────────────────

  const { data: flashSales, isLoading } = useQuery({
    queryKey: ["flash-sales"],
    queryFn: () => productsApi.getAllFlashSales(),
  });

  // Fetch all products for the searchable selector (up to 500)
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ["flash-sale-products"],
    queryFn: () => productsApi.getAll({ limit: 500 }),
    enabled: modalMode !== null,
  });

  const productOptions: SelectOption[] = (productsData?.products || []).map((p) => ({
    value: p._id,
    label: p.name,
    description: `৳${p.basePrice}`,
  }));

  // ── Mutations ──────────────────────────────────────────────────────────────

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; startTime: string; endTime: string; products: ProductRow[] }) =>
      productsApi.createFlashSale(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      closeModal();
      toast.success("Flash sale created!");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to create flash sale"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<{ name: string; startTime: string; endTime: string; isActive: boolean; products: ProductRow[] }> }) =>
      productsApi.updateFlashSale(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      closeModal();
      toast.success("Flash sale updated!");
    },
    onError: (err: Error) => toast.error(err.message || "Failed to update flash sale"),
  });

  const toggleActiveMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      productsApi.updateFlashSale(id, { isActive: !isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flash-sales"] });
      toast.success("Flash sale status updated!");
    },
  });

  // ── Modal helpers ──────────────────────────────────────────────────────────

  const openCreate = () => {
    setFormData(defaultForm);
    setEditingSale(null);
    setModalMode("create");
  };

  const openEdit = (sale: FlashSale) => {
    setFormData({
      name: sale.name,
      startTime: new Date(sale.startTime).toISOString().slice(0, 16),
      endTime: new Date(sale.endTime).toISOString().slice(0, 16),
      products: sale.products.map((p) => ({ productId: p.productId, salePrice: p.salePrice })),
    });
    setEditingSale(sale);
    setModalMode("edit");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingSale(null);
  };

  // ── Product row helpers ────────────────────────────────────────────────────

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

  const updateProductId = (index: number, productId: string | null) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index ? { ...p, productId: productId ?? "" } : p
      ),
    }));
  };

  const updateSalePrice = (index: number, salePrice: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p, i) =>
        i === index ? { ...p, salePrice } : p
      ),
    }));
  };

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Sale name is required");
      return;
    }
    if (!formData.startTime || !formData.endTime) {
      toast.error("Start time and end time are required");
      return;
    }
    if (new Date(formData.startTime) >= new Date(formData.endTime)) {
      toast.error("Start time must be before end time");
      return;
    }

    const validProducts = formData.products.filter((p) => p.productId && p.salePrice > 0);
    if (validProducts.length === 0) {
      toast.error("Add at least one product with a sale price greater than 0");
      return;
    }

    // Check for duplicate products
    const ids = validProducts.map((p) => p.productId);
    if (new Set(ids).size !== ids.length) {
      toast.error("Duplicate products found — each product can only appear once");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      products: validProducts,
    };

    if (modalMode === "create") {
      createMutation.mutate(payload);
    } else if (editingSale) {
      updateMutation.mutate({ id: editingSale._id, payload });
    }
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-pink-100 rounded-lg animate-pulse" />
            <div className="h-4 w-32 bg-pink-50 rounded-lg animate-pulse" />
          </div>
          <div className="h-10 w-44 bg-pink-100 rounded-xl animate-pulse" />
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
  const isSaving = createMutation.isPending || updateMutation.isPending;

  // ── Render ─────────────────────────────────────────────────────────────────

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

      {/* Empty state */}
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
            const StatusIcon = status.Icon;
            return (
              <div
                key={sale._id}
                className="bg-white rounded-2xl border border-pink-100 hover:shadow-md hover:shadow-pink-100/50 transition-all"
              >
                <div className="p-5">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-100 to-orange-100 flex items-center justify-center shrink-0">
                          <Zap className="w-4 h-4 text-[#e91e8c]" />
                        </div>
                        <h3 className="text-base font-bold text-[#2d1a24]">{sale.name}</h3>
                        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {status.label}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            sale.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {sale.isActive ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
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
                        className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all disabled:opacity-50 ${
                          sale.isActive
                            ? "bg-red-50 text-red-600 hover:bg-red-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {sale.isActive ? (
                          <><EyeOff className="w-3 h-3" /> Disable</>
                        ) : (
                          <><Eye className="w-3 h-3" /> Enable</>
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

      {/* Create / Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-pink-100 shadow-xl w-full max-w-xl max-h-[90vh] flex flex-col">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-pink-100 shrink-0">
              <h2 className="text-lg font-bold text-[#2d1a24] font-playfair flex items-center gap-2">
                {modalMode === "create" ? (
                  <><Zap className="w-5 h-5 text-[#e91e8c]" /> Create Flash Sale</>
                ) : (
                  <><Edit className="w-5 h-5 text-[#e91e8c]" /> Edit Flash Sale</>
                )}
              </h2>
              <button
                onClick={closeModal}
                className="text-[#6d1b3b]/40 hover:text-[#6d1b3b] transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
              <form id="flash-sale-form" onSubmit={handleSubmit} className="space-y-4">
                {/* Sale name */}
                <div>
                  <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">
                    Sale Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. Summer Flash Sale"
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
                  />
                </div>

                {/* Time range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">
                      Start Time <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ad1457]/40 pointer-events-none" />
                      <input
                        type="datetime-local"
                        value={formData.startTime}
                        onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">
                      End Time <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ad1457]/40 pointer-events-none" />
                      <input
                        type="datetime-local"
                        value={formData.endTime}
                        onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Products section */}
                <div className="border-t border-pink-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-[#2d1a24] flex items-center gap-1.5">
                      <Package className="w-4 h-4" />
                      Products <span className="text-red-400">*</span>
                    </label>
                    <span className="text-xs text-[#6d1b3b]/40">
                      {formData.products.length} added
                    </span>
                  </div>

                  {formData.products.length === 0 && (
                    <p className="text-xs text-[#6d1b3b]/40 text-center py-4 border border-dashed border-pink-200 rounded-xl mb-3">
                      No products added yet. Click below to add one.
                    </p>
                  )}

                  <div className="space-y-2">
                    {formData.products.map((product, idx) => {
                      // Find the selected product's base price for hint
                      const selectedProduct = productsData?.products?.find(
                        (p) => p._id === product.productId
                      );

                      return (
                        <div key={idx} className="flex items-start gap-2 p-3 bg-pink-50/50 rounded-xl border border-pink-100">
                          {/* Product selector */}
                          <div className="flex-1 min-w-0">
                            <SearchableSelect
                              options={productOptions}
                              value={product.productId || null}
                              onChange={(val) => updateProductId(idx, val)}
                              placeholder="Search product..."
                              loading={productsLoading}
                            />
                            {selectedProduct && (
                              <p className="text-[10px] text-[#6d1b3b]/50 mt-1 ml-1">
                                Original price: ৳{selectedProduct.basePrice}
                              </p>
                            )}
                          </div>

                          {/* Sale price */}
                          <div className="w-28 shrink-0">
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#ad1457]/50 font-medium">৳</span>
                              <input
                                type="number"
                                value={product.salePrice || ""}
                                onChange={(e) => updateSalePrice(idx, Number(e.target.value))}
                                placeholder="Sale price"
                                min={0}
                                className="w-full pl-6 pr-3 py-2.5 rounded-xl border border-pink-200 text-xs text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30 bg-white"
                              />
                            </div>
                            {selectedProduct && product.salePrice > 0 && (
                              <p className={`text-[10px] mt-1 ml-1 ${product.salePrice >= selectedProduct.basePrice ? "text-red-500" : "text-green-600"}`}>
                                {product.salePrice >= selectedProduct.basePrice
                                  ? "Must be less than original"
                                  : `${Math.round((1 - product.salePrice / selectedProduct.basePrice) * 100)}% off`}
                              </p>
                            )}
                          </div>

                          {/* Remove */}
                          <button
                            type="button"
                            onClick={() => removeProductRow(idx)}
                            className="text-red-400 hover:text-red-600 transition-colors p-1.5 mt-0.5 shrink-0"
                            title="Remove product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={addProductRow}
                    className="w-full mt-3 py-2.5 rounded-xl border border-dashed border-pink-200 text-xs text-[#e91e8c] font-semibold hover:bg-pink-50 transition-all flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Add Product
                  </button>
                </div>
              </form>
            </div>

            {/* Modal footer */}
            <div className="px-6 py-4 border-t border-pink-100 flex gap-3 shrink-0">
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
                form="flash-sale-form"
                disabled={isSaving}
                className="flex-1 bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? "Saving..." : modalMode === "create" ? "Create Sale" : "Update Sale"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
