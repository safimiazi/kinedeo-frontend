// "use client";

// import Link from "next/link";
// import { useProducts, useCategories } from "@/lib/hooks";
// import { useCart } from "@/lib/cart-context";
// import { useState } from "react";
// import type { Product } from "@/lib/api/types";

// export default function ProductsSection() {
//   const [activeCategory, setActiveCategory] = useState<string | null>(null);
//   const { data, isLoading } = useProducts({ limit: 8, categoryId: activeCategory || undefined });
//   const { data: categories } = useCategories();
//   const { addItem } = useCart();

//   const products = data?.products || [];

//   const handleAddToCart = (p: Product) => {
//     const variant = p.variants?.[0];
//     addItem({
//       productId: p._id,
//       variantId: variant?._id,
//       name: p.name,
//       image: p.images?.[0] || "",
//       price: p.flashSalePrice || p.basePrice,
//       originalPrice: p.originalPrice,
//       sku: variant?.sku,
//     });
//   };

//   return (
//     <section className="py-16 px-[5%] bg-[#fff0f5]">
//       <div className="max-w-7xl mx-auto">
//         <div className="text-center mb-12">
//           <div className="font-nunito text-[13px] font-bold text-[#e91e8c] tracking-widest uppercase mb-2.5">Our Products</div>
//           <h2 className="font-playfair text-3xl md:text-[40px] font-extrabold text-[#2d1a24] mb-4">Shop by Category</h2>
//           <p className="font-nunito text-[#6d1b3b] text-base max-w-[520px] mx-auto">Handpicked bestsellers loved by thousands of customers</p>
//         </div>

//         {/* Category Filter */}
//         <div className="flex gap-2.5 justify-center mb-10 flex-wrap">
//           <button onClick={() => setActiveCategory(null)}
//             className={`font-nunito font-bold text-[13px] px-5 py-2 rounded-full cursor-pointer transition-all border-2 tracking-wide ${!activeCategory ? "bg-[#e91e8c] text-white border-[#e91e8c]" : "bg-white text-[#ad1457] border-[#fce4ec] hover:border-[#e91e8c]"}`}>
//             All
//           </button>
//           {(categories || []).map((c) => (
//             <button key={c._id} onClick={() => setActiveCategory(c._id)}
//               className={`font-nunito font-bold text-[13px] px-5 py-2 rounded-full cursor-pointer transition-all border-2 tracking-wide ${activeCategory === c._id ? "bg-[#e91e8c] text-white border-[#e91e8c]" : "bg-white text-[#ad1457] border-[#fce4ec] hover:border-[#e91e8c]"}`}>
//               {c.name}
//             </button>
//           ))}
//         </div>

//         {/* Products Grid */}
//         {isLoading ? (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {[1,2,3,4,5,6,7,8].map((i) => (
//               <div key={i} className="bg-white rounded-2xl overflow-hidden border border-[#fce4ec] h-80 animate-pulse" />
//             ))}
//           </div>
//         ) : products.length === 0 ? (
//           <div className="text-center py-16">
//             <span className="text-5xl block mb-4">🌸</span>
//             <p className="text-[#6d1b3b]/60">No products available yet</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {products.map((p) => {
//               const discount = p.originalPrice ? Math.round((1 - p.basePrice / p.originalPrice) * 100) : 0;
//               return (
//                 <div key={p._id} className="bg-white rounded-2xl overflow-hidden border border-[#fce4ec] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#e91e8c]/15 hover:border-[#e91e8c] transition-all">
//                   <Link href={`/product/${p._id}`}>
//                     <div className="aspect-square bg-pink-50 flex items-center justify-center relative overflow-hidden">
//                       {p.images?.[0] ? (
//                         <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
//                       ) : (
//                         <span className="text-7xl">📦</span>
//                       )}
//                       {p.badge && (
//                         <span className="absolute top-3 left-3 font-nunito text-[11px] font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase bg-[#e91e8c] text-white">
//                           {p.badge}
//                         </span>
//                       )}
//                       {discount > 0 && (
//                         <span className="absolute bottom-3 right-3 bg-[#c2185b] text-white rounded-lg px-2 py-0.5 font-nunito text-[11px] font-extrabold">
//                           -{discount}%
//                         </span>
//                       )}
//                     </div>
//                   </Link>
//                   <div className="p-4 pt-4 pb-4">
//                     <Link href={`/product/${p._id}`}>
//                       <div className="font-playfair text-[15px] font-bold text-[#2d1a24] mb-1 line-clamp-1 hover:text-[#e91e8c] transition-colors">{p.name}</div>
//                     </Link>
//                     <div className="font-nunito text-xs text-[#6d1b3b] mb-3 line-clamp-1">{p.shortDescription}</div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <span className="font-playfair text-lg font-extrabold text-[#e91e8c]">৳{p.basePrice.toLocaleString()}</span>
//                         {p.originalPrice && p.originalPrice > p.basePrice && (
//                           <span className="font-nunito text-[12px] text-[#ad1457] line-through ml-2">৳{p.originalPrice.toLocaleString()}</span>
//                         )}
//                       </div>
//                       <button onClick={() => handleAddToCart(p)}
//                         className="bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white border-none px-3 py-1.5 rounded-full cursor-pointer font-nunito font-bold text-[12px] hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all">
//                         Add +
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         <div className="text-center mt-12">
//           <Link href="/products" className="bg-transparent border-2 border-[#e91e8c] text-[#e91e8c] px-10 py-3.5 rounded-full font-nunito font-bold text-[15px] hover:bg-[#e91e8c] hover:text-white transition-all inline-block">
//             View All Products →
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import Link from "next/link";
import {
  useProducts,
  useCategories,
  useFavorites,
  useToggleFavorite,
} from "@/lib/hooks";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";
import type { Product } from "@/lib/api/types";
import {
  Eye,
  Heart,
  Package,
  ShoppingBag,
  Star,
  TrendingUp,
  Truck,
} from "lucide-react";

export default function ProductsSection() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const { data, isLoading } = useProducts({
    limit: 8,
    categoryId: activeCategory || undefined,
  });
  const { data: categories } = useCategories();
  const { addItem } = useCart();
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const { data: favoritesData } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const favorites = favoritesData?.favorites ?? [];

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
    <section className="py-20 bg-linear-to-b from-[#fff0f5] via-[#fdf2f8] to-[#fff0f5] relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 rounded-full bg-[#fce4ec]/60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#f8bbd0]/40 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block font-nunito text-[11px] font-extrabold text-[#e91e8c] tracking-[0.25em] uppercase mb-3 px-4 py-1.5 rounded-full bg-[#fce4ec] border border-[#f48fb1]/40">
            ✦ Our Collection
          </span>
          <h2 className="font-playfair text-4xl md:text-[46px] font-extrabold text-[#2d1a24] mt-3 mb-4 leading-tight">
            Shop by{" "}
            <span className="relative inline-block">
              Category
              <svg
                className="absolute -bottom-1 left-0 w-full"
                height="6"
                viewBox="0 0 200 6"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q50 0 100 5 Q150 10 200 5"
                  stroke="#e91e8c"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h2>
          <p className="font-nunito text-[#6d1b3b]/70 text-base max-w-120 mx-auto leading-relaxed">
            Handpicked bestsellers loved by thousands of customers across
            Bangladesh
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2.5 justify-center mb-12 flex-wrap">
          <button
            onClick={() => setActiveCategory(null)}
            className={`font-nunito font-bold text-[12px] px-5 py-2 rounded-full cursor-pointer transition-all duration-200 tracking-widest uppercase border ${
              !activeCategory
                ? "bg-[#e91e8c] text-white border-[#e91e8c] shadow-lg shadow-[#e91e8c]/30"
                : "bg-white/80 text-[#ad1457] border-[#fce4ec] hover:border-[#e91e8c] hover:text-[#e91e8c]"
            }`}
          >
            All
          </button>
          {(categories || []).map((c) => (
            <button
              key={c._id}
              onClick={() => setActiveCategory(c._id)}
              className={`font-nunito font-bold text-[12px] px-5 py-2 rounded-full cursor-pointer transition-all duration-200 tracking-widest uppercase border ${
                activeCategory === c._id
                  ? "bg-[#e91e8c] text-white border-[#e91e8c] shadow-lg shadow-[#e91e8c]/30"
                  : "bg-white/80 text-[#ad1457] border-[#fce4ec] hover:border-[#e91e8c] hover:text-[#e91e8c]"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-[#fce4ec] h-90 animate-pulse"
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">🌸</span>
            <p className="font-nunito text-[#6d1b3b]/60 text-base">
              No products available yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => {
              const discount = p.originalPrice
                ? Math.round((1 - p.basePrice / p.originalPrice) * 100)
                : 0;
              const isHovered = hoveredProduct === p._id;

              return (
                <div
                  key={p._id}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-[#fce4ec] hover:border-[#e91e8c] transition-all duration-300 hover:shadow-2xl hover:shadow-[#e91e8c]/15"
                  onMouseEnter={() => setHoveredProduct(p._id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                >
                  {/* Image Container */}
                  <Link href={`/product/${p._id}`}>
                    <div className="relative aspect-square bg-linear-to-br from-pink-50 to-rose-50 overflow-hidden">
                      {p.images?.[0] ? (
                        <>
                          <img
                            src={p.images[0]}
                            alt={p.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-[#ad1457]/30" />
                        </div>
                      )}

                      {/* Badges */}
                      <div className="absolute top-3 left-3 flex flex-col gap-2">
                        {p.badge && (
                          <span className="font-nunito text-[11px] font-extrabold px-3 py-1 rounded-full tracking-wider uppercase bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white shadow-lg">
                            {p.badge}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="bg-[#c2185b] text-white rounded-full px-3 py-1 font-nunito text-[11px] font-extrabold shadow-lg">
                            -{discount}% OFF
                          </span>
                        )}
                      </div>

                      {/* Quick View Overlay */}
                      <div
                        className={`absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center gap-3 transition-all duration-300 ${
                          isHovered
                            ? "opacity-100"
                            : "opacity-0 pointer-events-none"
                        }`}
                      >
                        <button className="bg-white rounded-full px-4 py-2 text-xs font-semibold text-[#e91e8c] hover:bg-[#e91e8c] hover:text-white transition-all flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          Quick View
                        </button>
                      </div>
                    </div>
                  </Link>

                  {/* Wishlist Button — outside Link to prevent navigation on click */}
                  {(() => {
                    const isFavorited = favorites.includes(p._id);
                    return (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite.mutate({
                            productId: p._id,
                            isFavorited,
                          });
                        }}
                        className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 ${
                          isFavorited
                            ? "bg-[#e91e8c] opacity-100"
                            : "bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 hover:bg-[#e91e8c]"
                        }`}
                        title={
                          isFavorited
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${isFavorited ? "fill-white text-white" : "text-[#ad1457] hover:text-white"}`}
                        />
                      </button>
                    );
                  })()}

                  {/* Product Info */}
                  <div className="p-4">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="w-3 h-3 text-yellow-400 fill-yellow-400"
                        />
                      ))}
                      <span className="text-[10px] text-[#6d1b3b]/50 ml-1">
                        (128)
                      </span>
                    </div>

                    {/* Title */}
                    <Link href={`/product/${p._id}`}>
                      <h3 className="font-playfair text-base font-bold text-[#2d1a24] mb-1 line-clamp-1 hover:text-[#e91e8c] transition-colors">
                        {p.name}
                      </h3>
                    </Link>

                    {/* Description */}
                    <p className="font-nunito text-xs text-[#6d1b3b]/60 mb-3 line-clamp-2">
                      {p.shortDescription}
                    </p>

                    {/* Price and Cart */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline gap-1">
                          <span className="font-playfair text-xl font-extrabold text-[#e91e8c]">
                            ৳
                            {(p.flashSalePrice || p.basePrice).toLocaleString()}
                          </span>
                          {p.flashSalePrice ? (
                            <span className="font-nunito text-xs text-[#ad1457]/50 line-through">
                              ৳{p.basePrice.toLocaleString()}
                            </span>
                          ) : p.originalPrice &&
                            p.originalPrice > p.basePrice ? (
                            <span className="font-nunito text-xs text-[#ad1457]/50 line-through">
                              ৳{p.originalPrice.toLocaleString()}
                            </span>
                          ) : null}
                        </div>
                        {p.flashSalePrice && (
                          <div className="flex items-center gap-1 mt-0.5">
                            <TrendingUp className="w-3 h-3 text-orange-500" />
                            <span className="text-[10px] text-orange-500 font-semibold">
                              Flash Sale
                            </span>
                          </div>
                        )}
                      </div>

                      <div
                        onClick={() => handleAddToCart(p)}
                        className="flex items-center gap-3 bg-gradient-to-r from-pink-50 to-rose-50 p-2 pr-4 rounded-full border border-pink-200/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] group/card"
                      >
                        <button
                          className="group/btn bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white border-none w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all duration-300 hover:scale-110 flex-shrink-0"
                          aria-label="কার্টে যোগ করুন"
                        >
                          <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <span className="text-sm font-medium text-gray-700 select-none">
                          কার্টে যোগ করুন
                        </span>
                      </div>
                    </div>

                    {/* Free Shipping Tag */}
                    {p.basePrice > 999 && (
                      <div className="mt-3 pt-3 border-t border-[#fce4ec] flex items-center gap-1">
                        <Truck className="w-3 h-3 text-green-500" />
                        <span className="text-[10px] text-green-600 font-semibold">
                          Free Shipping
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* View All CTA */}
        <div className="text-center mt-14">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 border-2 border-[#e91e8c] text-[#e91e8c] px-10 py-3.5 rounded-full font-nunito font-bold text-[14px] tracking-wide hover:bg-[#e91e8c] hover:text-white transition-all duration-200 shadow-sm hover:shadow-lg hover:shadow-[#e91e8c]/25"
          >
            View All Products
            <span className="group-hover:translate-x-1 transition-transform duration-200 inline-block">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
