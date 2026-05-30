"use client";

import { useState } from "react";

const products = [
  { id: 1, name: "Silk Rose Serum", category: "Skincare", price: 1299, stock: 45, status: "Active", emoji: "🌹", sold: 342 },
  { id: 2, name: "Velvet Lip Kit", category: "Makeup", price: 899, stock: 128, status: "Active", emoji: "💄", sold: 287 },
  { id: 3, name: "Glow Radiance Cream", category: "Skincare", price: 1599, stock: 8, status: "Low Stock", emoji: "✨", sold: 198 },
  { id: 4, name: "Pearl Perfume", category: "Fragrance", price: 2499, stock: 32, status: "Active", emoji: "🌸", sold: 156 },
  { id: 5, name: "Rose Gold Palette", category: "Makeup", price: 1199, stock: 0, status: "Out of Stock", emoji: "🎨", sold: 310 },
  { id: 6, name: "Collagen Face Mask", category: "Skincare", price: 599, stock: 250, status: "Active", emoji: "🫧", sold: 542 },
  { id: 7, name: "Blush & Bronzer Duo", category: "Makeup", price: 749, stock: 67, status: "Active", emoji: "🌷", sold: 123 },
  { id: 8, name: "Hair Glow Serum", category: "Haircare", price: 999, stock: 5, status: "Low Stock", emoji: "💆‍♀️", sold: 234 },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  "Low Stock": "bg-yellow-100 text-yellow-700",
  "Out of Stock": "bg-red-100 text-red-700",
};

export default function ProductsPage() {
  const [search, setSearch] = useState("");

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Products</h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-1">{products.length} products in your store</p>
        </div>
        <button className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all w-fit">
          + Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl border border-pink-100 p-4">
        <div className="flex items-center gap-3 bg-pink-50 rounded-xl px-4 py-2.5 max-w-md">
          <span className="text-[#ad1457]/50">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm text-[#2d1a24] placeholder:text-[#ad1457]/40 w-full"
          />
        </div>
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-2xl border border-pink-100 p-5 hover:shadow-md hover:shadow-pink-100/50 transition-all group"
          >
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{product.emoji}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[product.status]}`}>
                {product.status}
              </span>
            </div>
            <h3 className="text-sm font-bold text-[#2d1a24] mb-1">{product.name}</h3>
            <p className="text-xs text-[#6d1b3b]/50 mb-3">{product.category}</p>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-[#ad1457]">₹{product.price.toLocaleString()}</span>
              <span className="text-xs text-[#6d1b3b]/50">{product.stock} in stock</span>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-pink-50">
              <span className="text-xs text-[#6d1b3b]/50">{product.sold} sold</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-xs text-[#e91e8c] font-semibold hover:text-[#ad1457]">Edit</button>
                <button className="text-xs text-red-400 font-semibold hover:text-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
