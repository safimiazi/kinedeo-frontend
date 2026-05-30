"use client";

import Link from "next/link";
import { useProducts, useCategories } from "@/lib/hooks";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import type { Product } from "@/lib/api/types";

export default function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data, isLoading } = useProducts({ limit: 8, categoryId: activeCategory || undefined });
  const { data: categories } = useCategories();
  const { addItem } = useCart();

  const products = data?.products || [];

  const handleAddToCart = (p: Product) => {
    const variant = p.variants?.[0];
    addItem({
      productId: p._id,
      variantId: variant?._id,
      name: p.name,
      image: p.images?.[0] || "",
      price: p.flashSalePrice || p.basePrice,
      originalPrice: p.originalPrice,
      sku: variant?.sku,
    });
  };

  return (
    <section className="py-16 px-[5%] bg-[#fff0f5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="font-nunito text-[13px] font-bold text-[#e91e8c] tracking-widest uppercase mb-2.5">Our Products</div>
          <h2 className="font-playfair text-3xl md:text-[40px] font-extrabold text-[#2d1a24] mb-4">Shop by Category</h2>
          <p className="font-nunito text-[#6d1b3b] text-base max-w-[520px] mx-auto">Handpicked bestsellers loved by thousands of customers</p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2.5 justify-center mb-10 flex-wrap">
          <button onClick={() => setActiveCategory(null)}
            className={`font-nunito font-bold text-[13px] px-5 py-2 rounded-full cursor-pointer transition-all border-2 tracking-wide ${!activeCategory ? "bg-[#e91e8c] text-white border-[#e91e8c]" : "bg-white text-[#ad1457] border-[#fce4ec] hover:border-[#e91e8c]"}`}>
            All
          </button>
          {(categories || []).map((c) => (
            <button key={c._id} onClick={() => setActiveCategory(c._id)}
              className={`font-nunito font-bold text-[13px] px-5 py-2 rounded-full cursor-pointer transition-all border-2 tracking-wide ${activeCategory === c._id ? "bg-[#e91e8c] text-white border-[#e91e8c]" : "bg-white text-[#ad1457] border-[#fce4ec] hover:border-[#e91e8c]"}`}>
              {c.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1,2,3,4,5,6,7,8].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#fce4ec] h-80 animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-5xl block mb-4">🌸</span>
            <p className="text-[#6d1b3b]/60">No products available yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((p) => {
              const discount = p.originalPrice ? Math.round((1 - p.basePrice / p.originalPrice) * 100) : 0;
              return (
                <div key={p._id} className="bg-white rounded-2xl overflow-hidden border border-[#fce4ec] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#e91e8c]/15 hover:border-[#e91e8c] transition-all">
                  <Link href={`/product/${p._id}`}>
                    <div className="aspect-square bg-pink-50 flex items-center justify-center relative overflow-hidden">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-7xl">📦</span>
                      )}
                      {p.badge && (
                        <span className="absolute top-3 left-3 font-nunito text-[11px] font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase bg-[#e91e8c] text-white">
                          {p.badge}
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="absolute bottom-3 right-3 bg-[#c2185b] text-white rounded-lg px-2 py-0.5 font-nunito text-[11px] font-extrabold">
                          -{discount}%
                        </span>
                      )}
                    </div>
                  </Link>
                  <div className="p-4 pt-4 pb-4">
                    <Link href={`/product/${p._id}`}>
                      <div className="font-playfair text-[15px] font-bold text-[#2d1a24] mb-1 line-clamp-1 hover:text-[#e91e8c] transition-colors">{p.name}</div>
                    </Link>
                    <div className="font-nunito text-xs text-[#6d1b3b] mb-3 line-clamp-1">{p.shortDescription}</div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-playfair text-lg font-extrabold text-[#e91e8c]">৳{p.basePrice.toLocaleString()}</span>
                        {p.originalPrice && p.originalPrice > p.basePrice && (
                          <span className="font-nunito text-[12px] text-[#ad1457] line-through ml-2">৳{p.originalPrice.toLocaleString()}</span>
                        )}
                      </div>
                      <button onClick={() => handleAddToCart(p)}
                        className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white border-none px-3 py-1.5 rounded-full cursor-pointer font-nunito font-bold text-[12px] hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all">
                        Add +
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Link href="/products" className="bg-transparent border-2 border-[#e91e8c] text-[#e91e8c] px-10 py-3.5 rounded-full font-nunito font-bold text-[15px] hover:bg-[#e91e8c] hover:text-white transition-all inline-block">
            View All Products →
          </Link>
        </div>
      </div>
    </section>
  );
}
