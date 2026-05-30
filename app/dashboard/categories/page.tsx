"use client";

import { useState } from "react";
import { useCategoriesAdmin, useCreateCategory, useUpdateCategory, useDeleteCategory } from "@/lib/hooks";
import { ImageUploader } from "@/components/ui/ImageUploader";
import type { Category } from "@/lib/api/types";

type ModalMode = "create" | "edit" | null;

export default function CategoriesPage() {
  const { data: categories, isLoading } = useCategoriesAdmin();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    sortOrder: 0,
  });
  const [error, setError] = useState("");

  const activeCategories = categories?.filter((c) => c.isActive) || [];
  const inactiveCategories = categories?.filter((c) => !c.isActive) || [];

  const openCreate = () => {
    setFormData({ name: "", slug: "", description: "", image: "", sortOrder: 0 });
    setEditingCategory(null);
    setModalMode("create");
    setError("");
  };

  const openEdit = (cat: Category) => {
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || "",
      image: cat.image || "",
      sortOrder: cat.sortOrder,
    });
    setEditingCategory(cat);
    setModalMode("edit");
    setError("");
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingCategory(null);
    setError("");
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: modalMode === "create" ? generateSlug(name) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.slug) {
      setError("Name and slug are required");
      return;
    }

    try {
      if (modalMode === "create") {
        await createCategory.mutateAsync({
          name: formData.name,
          slug: formData.slug,
          description: formData.description || undefined,
          image: formData.image || undefined,
          sortOrder: formData.sortOrder,
        });
      } else if (modalMode === "edit" && editingCategory) {
        await updateCategory.mutateAsync({
          id: editingCategory._id,
          data: {
            name: formData.name,
            slug: formData.slug,
            description: formData.description || undefined,
            image: formData.image || undefined,
            sortOrder: formData.sortOrder,
          },
        });
      }
      closeModal();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this category?")) return;
    try {
      await deleteCategory.mutateAsync(id);
    } catch (err: any) {
      alert(err.message || "Failed to deactivate category");
    }
  };

  const handleReactivate = async (cat: Category) => {
    try {
      await updateCategory.mutateAsync({ id: cat._id, data: { isActive: true } });
    } catch (err: any) {
      alert(err.message || "Failed to reactivate category");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-40 bg-pink-100 rounded-lg animate-pulse" />
          <div className="h-10 w-36 bg-pink-100 rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-pink-100 p-6 h-40 animate-pulse" />
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
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Categories</h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-1">
            {activeCategories.length} active categories
          </p>
        </div>
        <button
          onClick={openCreate}
          className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all w-fit"
        >
          + Add Category
        </button>
      </div>

      {/* Active Categories */}
      {activeCategories.length === 0 ? (
        <div className="bg-white rounded-2xl border border-pink-100 p-12 text-center">
          <span className="text-4xl mb-4 block">📂</span>
          <h3 className="text-lg font-semibold text-[#2d1a24] mb-2">No categories yet</h3>
          <p className="text-sm text-[#6d1b3b]/50 mb-4">Create your first category to organize products</p>
          <button onClick={openCreate} className="text-sm text-[#e91e8c] font-semibold hover:underline">
            + Create Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeCategories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white rounded-2xl border border-pink-100 p-6 hover:shadow-md hover:shadow-pink-100/50 transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center text-xl">
                  📁
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  Active
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#2d1a24] mb-1">{cat.name}</h3>
              {cat.description && (
                <p className="text-xs text-[#6d1b3b]/50 mb-2 line-clamp-2">{cat.description}</p>
              )}
              <p className="text-xs text-[#6d1b3b]/40 mb-4">/{cat.slug}</p>
              <div className="flex items-center justify-between pt-3 border-t border-pink-50">
                <span className="text-xs text-[#6d1b3b]/40">Order: {cat.sortOrder}</span>
                <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEdit(cat)}
                    className="text-xs text-[#e91e8c] font-semibold hover:text-[#ad1457]"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="text-xs text-red-400 font-semibold hover:text-red-600"
                  >
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inactive Categories */}
      {inactiveCategories.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-[#2d1a24] mb-3">Inactive Categories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {inactiveCategories.map((cat) => (
              <div
                key={cat._id}
                className="bg-gray-50 rounded-2xl border border-gray-200 p-6 opacity-70"
              >
                <h3 className="text-base font-semibold text-[#2d1a24] mb-1">{cat.name}</h3>
                <p className="text-xs text-[#6d1b3b]/40 mb-3">/{cat.slug}</p>
                <button
                  onClick={() => handleReactivate(cat)}
                  className="text-xs text-[#e91e8c] font-semibold hover:underline"
                >
                  Reactivate
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-pink-100 shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-[#2d1a24] font-playfair">
                {modalMode === "create" ? "Create Category" : "Edit Category"}
              </h2>
              <button onClick={closeModal} className="text-[#6d1b3b]/40 hover:text-[#6d1b3b] text-xl">
                ×
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Skincare"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g. skincare"
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Description (optional)</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description..."
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all placeholder:text-[#ad1457]/30 resize-none"
                />
              </div>

              <ImageUploader
                label="Category Image (optional)"
                value={formData.image || null}
                onChange={(url) => setFormData((prev) => ({ ...prev, image: url || "" }))}
                endpoint="/upload/category-image"
              />

              <div>
                <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Sort Order</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData((prev) => ({ ...prev, sortOrder: Number(e.target.value) }))}
                  className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                />
              </div>

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
                  disabled={createCategory.isPending || updateCategory.isPending}
                  className="flex-1 bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white py-2.5 rounded-xl text-sm font-bold hover:shadow-lg hover:shadow-pink-200 transition-all disabled:opacity-50"
                >
                  {(createCategory.isPending || updateCategory.isPending) ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
