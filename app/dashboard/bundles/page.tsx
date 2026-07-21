"use client";

import { useState } from "react";
import {
  Gift,
  Plus,
  Edit,
  Trash2,
  X,
  AlertCircle,
  CheckCircle,
  Package,
  ToggleLeft,
  ToggleRight,
  Search,
} from "lucide-react";
import { useAllBundles, useCreateBundle, useUpdateBundle, useDeleteBundle, useProducts } from "@/lib/hooks";
import Image from "next/image";
import toast from "react-hot-toast";
import type { Bundle } from "@/lib/api/types";

type ModalMode = "create" | "edit" | null;

const defaultForm = {
  name: "",
  description: "",
  badge: "",
  emoji: "🎀",
  bundlePrice: 0,
  originalPrice: 0,
  productIds: [] as string[],
  isActive: false,
};

export default function BundlesPage() {
  const { data: bundles = [], isLoading } = useAllBundles();
  const createBundle = useCreateBundle();
  const updateBundle = useUpdateBundle();
  const deleteBundle = useDeleteBundle();

  const { data: productsData } = useProducts({ limit: 100 });
  const allProducts = productsData?.products ?? [];

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [error, setError] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const filteredProducts = productSearch
    ? allProducts.filter((p) =>
        p.name.toLowerCase().includes(productSearch.toLowerCase())
      )
    : allProducts;

  const openCreate = () => {
    setFormData(defaultForm);
    setEditingBundle(null);
    setModalMode("create");
    setError("");
  };

  const openEdit = (bundle: Bundle) => {
    setFormData({
      name: bundle.name,
      description: bundle.description,
      badge: bundle.badge ?? "",
      emoji: bundle.emoji ?? "🎀",
      bundlePrice: bundle.bundlePrice,
      originalPrice: bundle.originalPrice ?? 0,
      productIds: bundle.productIds.map((p) =>
        typeof p === "string" ? p : p._id
      ),
      isActive: bundle.isActive,
    });
    setEditingBundle(bundle);
    setModalMode("edit");
    setError("");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingBundle(null);
    setError("");
    setProductSearch("");
  };

  const toggleProduct = (productId: string) => {
    setFormData((prev) => {
      const newProductIds = prev.productIds.includes(productId)
        ? prev.productIds.filter((id) => id !== productId)
        : [...prev.productIds, productId];

      // Auto-sum original price from selected products' base prices
      const sum = newProductIds.reduce((acc, id) => {
        const product = allProducts.find((p) => p._id === id);
        return acc + (product?.basePrice ?? 0);
      }, 0);

      return {
        ...prev,
        productIds: newProductIds,
        originalPrice: sum,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!formData.name.trim()) return setError("Bundle name is required");
    if (!formData.description.trim()) return setError("Description is required");
    if (formData.bundlePrice <= 0) return setError("Bundle price must be greater than 0");
    if (formData.productIds.length < 2) return setError("Select at least 2 products");

    const payload = {
      name: formData.name,
      description: formData.description,
      badge: formData.badge || undefined,
      emoji: formData.emoji || undefined,
      bundlePrice: formData.bundlePrice,
      originalPrice: formData.originalPrice || undefined,
      productIds: formData.productIds,
      isActive: formData.isActive,
    };

    try {
      if (modalMode === "create") {
        await createBundle.mutateAsync(payload);
        toast.success("Bundle created!");
      } else if (modalMode === "edit" && editingBundle) {
        await updateBundle.mutateAsync({ id: editingBundle._id, data: payload });
        toast.success("Bundle updated!");
      }
      closeModal();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this bundle?")) return;
    try {
      await deleteBundle.mutateAsync(id);
      toast.success("Bundle deleted");
    } catch {
      toast.error("Failed to delete bundle");
    }
  };

  const handleToggleActive = async (bundle: Bundle) => {
    try {
      await updateBundle.mutateAsync({
        id: bundle._id,
        data: { isActive: !bundle.isActive },
      });
      toast.success(bundle.isActive ? "Bundle deactivated" : "Bundle activated");
    } catch {
      toast.error("Failed to update bundle");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-pink-100 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-pink-100 p-6 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair flex items-center gap-2">
            <Gift className="w-6 h-6 text-[#e91e8c]" />
            Bundles / Gift Sets
          </h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-1">
            Manage product bundles shown on the homepage banner
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all w-fit"
        >
          <Plus className="w-4 h-4" /> Create Bundle
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm text-blue-700 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
        <span>Only one bundle can be active at a time. Activating a bundle will deactivate others and show it on the homepage banner.</span>
      </div>

      {/* Bundles list */}
      {bundles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center">
          <Gift className="w-16 h-16 mx-auto mb-4 text-[#ad1457]/30" />
          <h3 className="text-lg font-semibold text-[#2d1a24] mb-2">No bundles yet</h3>
          <p className="text-sm text-[#6d1b3b]/50 mb-4">Create your first product bundle to feature on the homepage</p>
          <button
            onClick={openCreate}
            className="text-sm text-[#e91e8c] font-semibold hover:underline inline-flex items-center gap-1"
          >
            <Plus className="w-4 h-4" /> Create Bundle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bundles.map((bundle) => {
            const productCount = bundle.productIds?.length ?? 0;
            const discount = bundle.originalPrice && bundle.originalPrice > bundle.bundlePrice
              ? Math.round((1 - bundle.bundlePrice / bundle.originalPrice) * 100)
              : 0;

            return (
              <div
                key={bundle._id}
                className={`bg-white rounded-2xl border transition-all ${
                  bundle.isActive
                    ? "border-[#e91e8c] shadow-md shadow-pink-100"
                    : "border-pink-100"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{bundle.emoji ?? "🎀"}</span>
                      <div>
                        <h3 className="text-sm font-bold text-[#2d1a24]">{bundle.name}</h3>
                        {bundle.badge && (
                          <span className="text-[10px] font-semibold text-[#e91e8c] uppercase tracking-wide">
                            {bundle.badge}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                        bundle.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {bundle.isActive ? "● Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="text-xs text-[#6d1b3b]/60 mb-3 line-clamp-2">{bundle.description}</p>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="font-playfair text-lg font-bold text-[#e91e8c]">
                      ৳{bundle.bundlePrice.toLocaleString()}
                    </span>
                    {bundle.originalPrice && bundle.originalPrice > bundle.bundlePrice && (
                      <>
                        <span className="text-xs text-[#6d1b3b]/40 line-through">
                          ৳{bundle.originalPrice.toLocaleString()}
                        </span>
                        {discount > 0 && (
                          <span className="text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                            -{discount}%
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-1 text-xs text-[#6d1b3b]/50 mb-4">
                    <Package className="w-3 h-3" />
                    {productCount} product{productCount !== 1 ? "s" : ""}
                  </div>

                  <div className="flex items-center gap-2 pt-3 border-t border-pink-50">
                    <button
                      onClick={() => handleToggleActive(bundle)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                        bundle.isActive
                          ? "bg-green-50 text-green-700 hover:bg-green-100"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {bundle.isActive ? (
                        <ToggleRight className="w-4 h-4" />
                      ) : (
                        <ToggleLeft className="w-4 h-4" />
                      )}
                      {bundle.isActive ? "Active" : "Activate"}
                    </button>
                    <button
                      onClick={() => openEdit(bundle)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#e91e8c] hover:text-[#ad1457] px-3 py-1.5 rounded-lg hover:bg-pink-50 transition-all"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(bundle._id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-all ml-auto"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
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
          <div className="bg-white rounded-2xl border border-pink-100 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-pink-100 px-6 py-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#2d1a24] font-playfair flex items-center gap-2">
                <Gift className="w-5 h-5 text-[#e91e8c]" />
                {modalMode === "create" ? "Create Bundle" : "Edit Bundle"}
              </h2>
              <button onClick={closeModal}>
                <X className="w-5 h-5 text-[#6d1b3b]/40 hover:text-[#6d1b3b]" />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Bundle Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. The Rosé Luxe Gift Set"
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Describe what's in this bundle..."
                    rows={2}
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all resize-none"
                  />
                </div>

                {/* Badge + Emoji */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Badge (optional)</label>
                    <input
                      type="text"
                      value={formData.badge}
                      onChange={(e) => setFormData((p) => ({ ...p, badge: e.target.value }))}
                      placeholder="e.g. Limited Edition"
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Emoji</label>
                    <input
                      type="text"
                      value={formData.emoji}
                      onChange={(e) => setFormData((p) => ({ ...p, emoji: e.target.value }))}
                      placeholder="🎀"
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Bundle Price (৳) *</label>
                    <input
                      type="number"
                      value={formData.bundlePrice || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, bundlePrice: Number(e.target.value) }))}
                      placeholder="0"
                      min={0}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Original Price (৳)</label>
                    <input
                      type="number"
                      value={formData.originalPrice || ""}
                      onChange={(e) => setFormData((p) => ({ ...p, originalPrice: Number(e.target.value) }))}
                      placeholder="e.g. sum of all products"
                      min={0}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Product selection */}
                <div>
                  <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">
                    Select Products * <span className="text-[#6d1b3b]/50 font-normal">(min. 2)</span>
                  </label>

                  {/* Search */}
                  <div className="flex items-center gap-2 bg-pink-50 rounded-xl px-3 py-2 mb-3">
                    <Search className="w-4 h-4 text-[#ad1457]/50 shrink-0" />
                    <input
                      type="text"
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      placeholder="Search products..."
                      className="bg-transparent outline-none text-sm text-[#2d1a24] placeholder:text-[#ad1457]/40 w-full"
                    />
                  </div>

                  {/* Selected count */}
                  {formData.productIds.length > 0 && (
                    <p className="text-xs text-[#e91e8c] font-semibold mb-2">
                      {formData.productIds.length} product{formData.productIds.length !== 1 ? "s" : ""} selected
                    </p>
                  )}

                  <div className="max-h-52 overflow-y-auto rounded-xl border border-pink-100 divide-y divide-pink-50">
                    {filteredProducts.map((p) => {
                      const selected = formData.productIds.includes(p._id);
                      return (
                        <button
                          key={p._id}
                          type="button"
                          onClick={() => toggleProduct(p._id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                            selected ? "bg-pink-50" : "hover:bg-pink-50/50"
                          }`}
                        >
                          {p.images?.[0] ? (
                            <Image src={p.images[0]} alt="" width={32} height={32} className="w-8 h-8 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center shrink-0">
                              <Package className="w-4 h-4 text-[#ad1457]/40" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-[#2d1a24] truncate">{p.name}</p>
                            <p className="text-xs text-[#6d1b3b]/50">৳{p.basePrice.toLocaleString()}</p>
                          </div>
                          {selected && <CheckCircle className="w-4 h-4 text-[#e91e8c] shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active toggle */}
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl hover:bg-pink-50 transition-colors">
                  <div
                    onClick={() => setFormData((p) => ({ ...p, isActive: !p.isActive }))}
                    className={`relative w-10 h-6 rounded-full transition-colors ${
                      formData.isActive ? "bg-[#e91e8c]" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                        formData.isActive ? "translate-x-5" : "translate-x-1"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#2d1a24]">Set as active banner</p>
                    <p className="text-xs text-[#6d1b3b]/50">Will deactivate other bundles and show on homepage</p>
                  </div>
                </label>

                {/* Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 py-2.5 rounded-xl border border-pink-200 text-sm font-semibold text-[#6d1b3b] hover:bg-pink-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createBundle.isPending || updateBundle.isPending}
                    className="flex-1 bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-50"
                  >
                    {createBundle.isPending || updateBundle.isPending ? "Saving..." : "Save Bundle"}
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
