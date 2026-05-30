"use client";

import { useState } from "react";
import { useProducts, useCategories, useCreateProduct, useUpdateProduct, useDeleteProduct, useAddVariant } from "@/lib/hooks";
import { SearchableSelect, type SelectOption } from "@/components/ui/SearchableSelect";
import { ImageUploader } from "@/components/ui/ImageUploader";
import type { Product, ProductVariant } from "@/lib/api/types";

type ModalMode = "create" | "edit" | null;

interface VariantForm {
  sku: string;
  stockQuantity: number;
  priceOverride: number;
  lowStockThreshold: number;
  attributes: { key: string; value: string }[];
}

const emptyVariant: VariantForm = {
  sku: "",
  stockQuantity: 0,
  priceOverride: 0,
  lowStockThreshold: 10,
  attributes: [],
};

const defaultForm = {
  name: "",
  description: "",
  shortDescription: "",
  basePrice: 0,
  originalPrice: 0,
  categoryId: "",
  badge: "",
  images: [] as string[],
  stockQuantity: 0,
  variants: [] as VariantForm[],
  useVariants: false,
};

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const { data, isLoading } = useProducts({
    page,
    limit: 12,
    categoryId: filterCategory || undefined,
    search: search || undefined,
  });
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const addVariant = useAddVariant();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [error, setError] = useState("");

  const categoryOptions: SelectOption[] = (categories || []).map((cat) => ({
    value: cat._id,
    label: cat.name,
    description: `/${cat.slug}`,
  }));

  const openCreate = () => {
    setFormData(defaultForm);
    setEditingProduct(null);
    setModalMode("create");
    setError("");
  };

  const openEdit = (product: Product) => {
    setFormData({
      name: product.name,
      description: product.description,
      shortDescription: product.shortDescription,
      basePrice: product.basePrice,
      originalPrice: product.originalPrice || 0,
      categoryId: product.categoryId,
      badge: product.badge || "",
      images: product.images || [],
      stockQuantity: product.variants.reduce((sum, v) => sum + v.stockQuantity, 0),
      variants: product.variants.map((v) => ({
        sku: v.sku,
        stockQuantity: v.stockQuantity,
        priceOverride: v.priceOverride || 0,
        lowStockThreshold: v.lowStockThreshold,
        attributes: Object.entries(v.attributes || {}).map(([key, value]) => ({ key, value })),
      })),
      useVariants: product.variants.length > 1,
    });
    setEditingProduct(product);
    setModalMode("edit");
    setError("");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingProduct(null);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.description || !formData.shortDescription || !formData.categoryId) {
      setError("Name, description, short description, and category are required");
      return;
    }
    if (formData.basePrice <= 0) {
      setError("Base price must be greater than 0");
      return;
    }

    try {
      if (modalMode === "create") {
        const payload: any = {
          name: formData.name,
          description: formData.description,
          shortDescription: formData.shortDescription,
          basePrice: formData.basePrice,
          originalPrice: formData.originalPrice || undefined,
          categoryId: formData.categoryId,
          badge: formData.badge || undefined,
          images: formData.images.length > 0 ? formData.images : undefined,
        };

        if (formData.useVariants && formData.variants.length > 0) {
          payload.variants = formData.variants.map((v) => ({
            sku: v.sku,
            stockQuantity: v.stockQuantity,
            priceOverride: v.priceOverride || undefined,
            lowStockThreshold: v.lowStockThreshold || 10,
            attributes: v.attributes.length > 0
              ? Object.fromEntries(v.attributes.filter(a => a.key).map(a => [a.key, a.value]))
              : undefined,
          }));
        } else {
          payload.stockQuantity = formData.stockQuantity;
        }

        await createProduct.mutateAsync(payload);
      } else if (modalMode === "edit" && editingProduct) {
        await updateProduct.mutateAsync({
          id: editingProduct._id,
          data: {
            name: formData.name,
            description: formData.description,
            shortDescription: formData.shortDescription,
            basePrice: formData.basePrice,
            originalPrice: formData.originalPrice || undefined,
            categoryId: formData.categoryId,
            badge: formData.badge || undefined,
            images: formData.images,
          },
        });
      }
      closeModal();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await deleteProduct.mutateAsync(id);
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
    }
  };

  const addVariantRow = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { ...emptyVariant, sku: `SKU-${Date.now().toString(36).toUpperCase()}` }],
    }));
  };

  const removeVariantRow = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const updateVariantRow = (index: number, field: keyof VariantForm, value: any) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) => i === index ? { ...v, [field]: value } : v),
    }));
  };

  const addAttribute = (variantIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((v, i) =>
        i === variantIndex ? { ...v, attributes: [...v.attributes, { key: "", value: "" }] } : v
      ),
    }));
  };

  const getStatusInfo = (product: Product) => {
    const totalStock = product.variants?.reduce((sum, v) => sum + v.stockQuantity, 0) || 0;
    if (totalStock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (totalStock <= 10) return { label: "Low Stock", color: "bg-yellow-100 text-yellow-700" };
    return { label: "Active", color: "bg-green-100 text-green-700" };
  };

  const getTotalStock = (product: Product) => {
    return product.variants?.reduce((sum, v) => sum + v.stockQuantity, 0) || 0;
  };

  const getCategoryName = (categoryId: string) => {
    return categories?.find((c) => c._id === categoryId)?.name || "—";
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 bg-pink-100 rounded-lg animate-pulse" />
          <div className="h-10 w-36 bg-pink-100 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-pink-100 p-5 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Products</h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-1">{data?.total || 0} products in your store</p>
        </div>
        <button onClick={openCreate} className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all w-fit">
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-pink-100 p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-3 bg-pink-50 rounded-xl px-4 py-2.5 flex-1 max-w-md">
            <span className="text-[#ad1457]/50">🔍</span>
            <input type="text" placeholder="Search products..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="bg-transparent border-none outline-none text-sm text-[#2d1a24] placeholder:text-[#ad1457]/40 w-full" />
          </div>
          <div className="w-full sm:w-64">
            <SearchableSelect options={categoryOptions} value={filterCategory}
              onChange={(val) => { setFilterCategory(val); setPage(1); }} placeholder="Filter by category..." />
          </div>
        </div>
      </div>

      {/* Products grid */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center">
          <span className="text-4xl mb-4 block">📦</span>
          <h3 className="text-lg font-semibold text-[#2d1a24] mb-2">No products found</h3>
          <p className="text-sm text-[#6d1b3b]/50 mb-4">
            {search || filterCategory ? "Try adjusting your filters" : "Create your first product to get started"}
          </p>
          {!search && !filterCategory && (
            <button onClick={openCreate} className="text-sm text-[#e91e8c] font-semibold hover:underline">+ Create Product</button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => {
            const status = getStatusInfo(product);
            return (
              <div key={product._id} className="bg-white rounded-2xl border border-pink-100 p-5 hover:shadow-md hover:shadow-pink-100/50 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  {product.images?.[0] ? (
                    <div className="w-10 h-10 rounded-lg bg-pink-50 overflow-hidden">
                      <img src={product.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : (<span className="text-3xl">📦</span>)}
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.color}`}>{status.label}</span>
                </div>
                <h3 className="text-sm font-bold text-[#2d1a24] mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-xs text-[#6d1b3b]/50 mb-3">{getCategoryName(product.categoryId)}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-[#ad1457]">৳{product.basePrice.toLocaleString()}</span>
                    {product.originalPrice && product.originalPrice > product.basePrice && (
                      <span className="text-xs text-[#6d1b3b]/40 line-through">৳{product.originalPrice.toLocaleString()}</span>
                    )}
                  </div>
                  <span className="text-xs text-[#6d1b3b]/50">{getTotalStock(product)} stock</span>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-pink-50">
                  <span className="text-xs text-[#6d1b3b]/50">{product.salesCount} sold • {product.variants?.length || 0} variant{(product.variants?.length || 0) !== 1 ? 's' : ''}</span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(product)} className="text-xs text-[#e91e8c] font-semibold hover:text-[#ad1457]">Edit</button>
                    <button onClick={() => handleDelete(product._id)} className="text-xs text-red-400 font-semibold hover:text-red-600">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
            className="px-3 py-2 rounded-lg border border-pink-200 text-sm text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50 transition-all">← Prev</button>
          <span className="text-sm text-[#6d1b3b]/60 px-3">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
            className="px-3 py-2 rounded-lg border border-pink-200 text-sm text-[#6d1b3b] disabled:opacity-40 hover:bg-pink-50 transition-all">Next →</button>
        </div>
      )}

      {/* Create/Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-pink-100 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#2d1a24] font-playfair">
                {modalMode === "create" ? "Create Product" : "Edit Product"}
              </h2>
              <button onClick={closeModal} className="text-[#6d1b3b]/40 hover:text-[#6d1b3b] text-xl">×</button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Basic Info */}
              <div>
                <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Product Name</label>
                <input type="text" value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Silk Rose Serum"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Short Description</label>
                <input type="text" value={formData.shortDescription}
                  onChange={(e) => setFormData((prev) => ({ ...prev, shortDescription: e.target.value }))}
                  placeholder="Brief one-liner..."
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30" />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Description</label>
                <textarea value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Full product description..." rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30 resize-none" />
              </div>

              <SearchableSelect label="Category" options={categoryOptions}
                value={formData.categoryId || null}
                onChange={(val) => setFormData((prev) => ({ ...prev, categoryId: val || "" }))}
                placeholder="Select a category..." />

              {/* Pricing */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Base Price (৳)</label>
                  <input type="number" value={formData.basePrice || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, basePrice: Number(e.target.value) }))}
                    placeholder="0" min={0}
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Original Price (৳)</label>
                  <input type="number" value={formData.originalPrice || ""}
                    onChange={(e) => setFormData((prev) => ({ ...prev, originalPrice: Number(e.target.value) }))}
                    placeholder="Optional" min={0}
                    className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Badge (optional)</label>
                <input type="text" value={formData.badge}
                  onChange={(e) => setFormData((prev) => ({ ...prev, badge: e.target.value }))}
                  placeholder="e.g. New, Bestseller, Sale"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30" />
              </div>

              {/* Images */}
              <ImageUploader label="Product Images" multiple value={formData.images}
                onChange={(urls) => setFormData((prev) => ({ ...prev, images: urls }))} maxImages={8} />

              {/* Stock & Variants Section */}
              <div className="border-t border-pink-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-[#2d1a24]">Stock & Variants</label>
                  {modalMode === "create" && (
                    <button type="button"
                      onClick={() => setFormData((prev) => ({
                        ...prev,
                        useVariants: !prev.useVariants,
                        variants: !prev.useVariants ? [{ ...emptyVariant, sku: `SKU-${Date.now().toString(36).toUpperCase()}` }] : [],
                      }))}
                      className={`text-xs font-semibold px-3 py-1 rounded-lg transition-all ${formData.useVariants ? 'bg-[#e91e8c] text-white' : 'bg-pink-50 text-[#e91e8c] hover:bg-pink-100'}`}>
                      {formData.useVariants ? "✓ Multiple Variants" : "Add Variants"}
                    </button>
                  )}
                </div>

                {/* Simple stock (no variants) */}
                {!formData.useVariants && modalMode === "create" && (
                  <div>
                    <label className="block text-xs text-[#6d1b3b]/60 mb-1">Stock Quantity</label>
                    <input type="number" value={formData.stockQuantity || ""}
                      onChange={(e) => setFormData((prev) => ({ ...prev, stockQuantity: Number(e.target.value) }))}
                      placeholder="How many in stock?" min={0}
                      className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30" />
                    <p className="text-[10px] text-[#6d1b3b]/40 mt-1">A default variant will be auto-created with this stock</p>
                  </div>
                )}

                {/* Multiple variants */}
                {(formData.useVariants || (modalMode === "edit" && formData.variants.length > 0)) && (
                  <div className="space-y-3">
                    {formData.variants.map((variant, idx) => (
                      <div key={idx} className="bg-pink-50/50 rounded-xl p-4 border border-pink-100">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-[#ad1457]">Variant {idx + 1}</span>
                          {modalMode === "create" && formData.variants.length > 1 && (
                            <button type="button" onClick={() => removeVariantRow(idx)}
                              className="text-xs text-red-400 hover:text-red-600">Remove</button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <label className="block text-[10px] text-[#6d1b3b]/60 mb-0.5">SKU</label>
                            <input type="text" value={variant.sku}
                              onChange={(e) => updateVariantRow(idx, "sku", e.target.value)}
                              placeholder="SKU-001"
                              className="w-full px-3 py-2 rounded-lg border border-pink-200 text-xs text-[#2d1a24] outline-none focus:border-[#e91e8c]" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#6d1b3b]/60 mb-0.5">Stock</label>
                            <input type="number" value={variant.stockQuantity || ""}
                              onChange={(e) => updateVariantRow(idx, "stockQuantity", Number(e.target.value))}
                              min={0}
                              className="w-full px-3 py-2 rounded-lg border border-pink-200 text-xs text-[#2d1a24] outline-none focus:border-[#e91e8c]" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-[#6d1b3b]/60 mb-0.5">Price Override (৳)</label>
                            <input type="number" value={variant.priceOverride || ""}
                              onChange={(e) => updateVariantRow(idx, "priceOverride", Number(e.target.value))}
                              placeholder="Optional" min={0}
                              className="w-full px-3 py-2 rounded-lg border border-pink-200 text-xs text-[#2d1a24] outline-none focus:border-[#e91e8c]" />
                          </div>
                          <div>
                            <label className="block text-[10px] text-[#6d1b3b]/60 mb-0.5">Low Stock Alert</label>
                            <input type="number" value={variant.lowStockThreshold || ""}
                              onChange={(e) => updateVariantRow(idx, "lowStockThreshold", Number(e.target.value))}
                              min={0}
                              className="w-full px-3 py-2 rounded-lg border border-pink-200 text-xs text-[#2d1a24] outline-none focus:border-[#e91e8c]" />
                          </div>
                        </div>

                        {/* Attributes */}
                        {variant.attributes.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {variant.attributes.map((attr, attrIdx) => (
                              <div key={attrIdx} className="grid grid-cols-2 gap-2">
                                <input type="text" value={attr.key}
                                  onChange={(e) => {
                                    const newAttrs = [...variant.attributes];
                                    newAttrs[attrIdx] = { ...newAttrs[attrIdx], key: e.target.value };
                                    updateVariantRow(idx, "attributes", newAttrs);
                                  }}
                                  placeholder="e.g. Size, Color"
                                  className="px-3 py-1.5 rounded-lg border border-pink-200 text-xs outline-none focus:border-[#e91e8c]" />
                                <input type="text" value={attr.value}
                                  onChange={(e) => {
                                    const newAttrs = [...variant.attributes];
                                    newAttrs[attrIdx] = { ...newAttrs[attrIdx], value: e.target.value };
                                    updateVariantRow(idx, "attributes", newAttrs);
                                  }}
                                  placeholder="e.g. Large, Red"
                                  className="px-3 py-1.5 rounded-lg border border-pink-200 text-xs outline-none focus:border-[#e91e8c]" />
                              </div>
                            ))}
                          </div>
                        )}
                        <button type="button" onClick={() => addAttribute(idx)}
                          className="text-[10px] text-[#e91e8c] font-medium mt-2 hover:underline">
                          + Add Attribute (Size, Color, etc.)
                        </button>
                      </div>
                    ))}

                    {modalMode === "create" && (
                      <button type="button" onClick={addVariantRow}
                        className="w-full py-2 rounded-xl border border-dashed border-pink-200 text-xs text-[#e91e8c] font-semibold hover:bg-pink-50 transition-all">
                        + Add Another Variant
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Submit */}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-pink-200 text-sm font-semibold text-[#6d1b3b] hover:bg-pink-50 transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={createProduct.isPending || updateProduct.isPending}
                  className="flex-1 bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-50">
                  {(createProduct.isPending || updateProduct.isPending) ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
