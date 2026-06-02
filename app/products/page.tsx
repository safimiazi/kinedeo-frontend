"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  X,
  Package,
  ShoppingBag,
  Star,
  TrendingUp,
  Truck,
  Heart,
  ChevronDown,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartPanel from "@/components/CartPanel";
import { useCart } from "@/lib/cart-context";
import { useInfiniteProducts } from "@/lib/hooks/use-products";
import { useCategories } from "@/lib/hooks/use-categories";
import { useFavorites, useToggleFavorite } from "@/lib/hooks";
import type { Product } from "@/lib/api/types";

const SORT_OPTIONS = [
  { label: "Newest", value: "createdAt", order: "desc" as const },
  { label: "Price: Low to High", value: "basePrice", order: "asc" as const },
  { label: "Price: High to Low", value: "basePrice", order: "desc" as const },
  { label: "Best Selling", value: "salesCount", order: "desc" as const },
  { label: "Top Rated", value: "averageRating", order: "desc" as const },
];

export default function ProductsPage() {
  const { addItem, itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [sortIdx, setSortIdx] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const { data: favoritesData } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const favorites = favoritesData?.favorites ?? [];

  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const sort = SORT_OPTIONS[sortIdx];

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data: categories } = useCategories();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteProducts({
    limit: 12,
    categoryId,
    search: debouncedSearch || undefined,
    sortBy: sort.value,
    sortOrder: sort.order,
  });

  // Flatten all pages into one product list
  const products = data?.pages.flatMap((p) => p.products) ?? [];
  const total = data?.pages[0]?.total ?? 0;

  // Intersection Observer for infinite scroll
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [handleObserver]);

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
    setAddedId(p._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] font-nunito">
      <Navbar cartCount={itemCount} onCartOpen={() => setCartOpen(true)} />

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#e91e8c] via-[#c2185b] to-[#ad1457] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-extrabold mb-3">All Products</h1>
          <p className="font-nunito text-white/80 text-base">
            {total > 0 ? `${total} products available` : "Discover our full collection"}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ad1457]/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-11 pr-10 py-3 rounded-xl border border-pink-200 bg-white text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] transition-colors"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ad1457]/50 hover:text-[#e91e8c]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sortIdx}
              onChange={(e) => setSortIdx(Number(e.target.value))}
              className="appearance-none pl-4 pr-10 py-3 rounded-xl border border-pink-200 bg-white text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] transition-colors cursor-pointer font-semibold"
            >
              {SORT_OPTIONS.map((opt, i) => (
                <option key={i} value={i}>{opt.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#ad1457]/50 pointer-events-none" />
          </div>

          {/* Filter toggle (mobile) */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="sm:hidden flex items-center gap-2 px-4 py-3 rounded-xl border border-pink-200 bg-white text-sm font-semibold text-[#ad1457]"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="flex gap-6">
          {/* Sidebar — Categories */}
          <aside
            className={`${
              showFilters ? "block" : "hidden"
            } sm:block w-full sm:w-52 shrink-0`}
          >
            <div className="bg-white rounded-2xl border border-pink-100 p-4 sticky top-24">
              <h3 className="font-playfair font-bold text-[#2d1a24] mb-4 text-base">Categories</h3>
              <div className="space-y-1">
                <button
                  onClick={() => { setCategoryId(undefined); setShowFilters(false); }}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    !categoryId
                      ? "bg-[#e91e8c] text-white"
                      : "text-[#6d1b3b] hover:bg-pink-50"
                  }`}
                >
                  All Products
                </button>
                {(categories || []).map((c) => (
                  <button
                    key={c._id}
                    onClick={() => { setCategoryId(c._id); setShowFilters(false); }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      categoryId === c._id
                        ? "bg-[#e91e8c] text-white"
                        : "text-[#6d1b3b] hover:bg-pink-50"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {/* Active filters */}
            {(categoryId || debouncedSearch) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {debouncedSearch && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-[#ad1457] rounded-full text-xs font-semibold">
                    "{debouncedSearch}"
                    <button onClick={() => setSearch("")}><X className="w-3 h-3" /></button>
                  </span>
                )}
                {categoryId && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 text-[#ad1457] rounded-full text-xs font-semibold">
                    {categories?.find((c) => c._id === categoryId)?.name}
                    <button onClick={() => setCategoryId(undefined)}><X className="w-3 h-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Loading skeleton */}
            {isLoading && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl border border-pink-100 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-pink-50" />
                    <div className="p-4 space-y-2">
                      <div className="h-3 bg-pink-100 rounded w-3/4" />
                      <div className="h-3 bg-pink-100 rounded w-1/2" />
                      <div className="h-8 bg-pink-100 rounded-full mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Error */}
            {isError && (
              <div className="text-center py-20">
                <p className="text-[#ad1457] font-semibold">Failed to load products. Please try again.</p>
              </div>
            )}

            {/* Empty */}
            {!isLoading && !isError && products.length === 0 && (
              <div className="text-center py-20">
                <Package className="w-16 h-16 mx-auto mb-4 text-[#ad1457]/30" />
                <h3 className="font-playfair text-xl font-bold text-[#2d1a24] mb-2">No products found</h3>
                <p className="text-sm text-[#6d1b3b]/60">Try adjusting your search or filters</p>
              </div>
            )}

            {/* Grid */}
            {!isLoading && products.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.map((p) => {
                  const displayPrice = p.flashSalePrice || p.basePrice;
                  const strikePrice = p.flashSalePrice
                    ? p.basePrice
                    : p.originalPrice && p.originalPrice > p.basePrice
                    ? p.originalPrice
                    : null;
                  const discount = strikePrice
                    ? Math.round((1 - displayPrice / strikePrice) * 100)
                    : 0;
                  const isAdded = addedId === p._id;

                  return (
                    <div
                      key={p._id}
                      className="group relative bg-white rounded-2xl border border-[#fce4ec] hover:border-[#e91e8c] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#e91e8c]/10 flex flex-col"
                    >
                      {/* Image — Link wraps only the image, not the heart button */}
                      <div className="relative aspect-square bg-gradient-to-br from-pink-50 to-rose-50 overflow-hidden">
                        <Link href={`/product/${p._id}`} className="block w-full h-full">
                          {p.images?.[0] ? (
                            <img
                              src={p.images[0]}
                              alt={p.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-12 h-12 text-[#ad1457]/20" />
                            </div>
                          )}
                        </Link>

                        {/* Badges */}
                        <div className="absolute top-2 left-2 flex flex-col gap-1.5 pointer-events-none">
                          {p.flashSalePrice && (
                            <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              FLASH SALE
                            </span>
                          )}
                          {p.badge && !p.flashSalePrice && (
                            <span className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              {p.badge}
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="bg-[#c2185b] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                              -{discount}%
                            </span>
                          )}
                        </div>

                        {/* Wishlist — outside Link, stopPropagation not needed since Link doesn't wrap it */}
                        {(() => {
                          const isFav = favorites.includes(p._id);
                          return (
                            <button
                              onClick={() => toggleFavorite.mutate({ productId: p._id, isFavorited: isFav })}
                              className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 z-10 ${
                                isFav
                                  ? "bg-[#e91e8c] opacity-100"
                                  : "bg-white/90 opacity-0 group-hover:opacity-100 hover:bg-pink-50"
                              }`}
                              title={isFav ? "Remove from favorites" : "Add to favorites"}
                            >
                              <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-white text-white" : "text-[#ad1457]"}`} />
                            </button>
                          );
                        })()}
                      </div>

                      {/* Info */}
                      <div className="p-3 flex flex-col flex-1">
                        {/* Rating */}
                        <div className="flex items-center gap-1 mb-1.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`w-2.5 h-2.5 ${
                                s <= Math.round(p.averageRating)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-200 fill-gray-200"
                              }`}
                            />
                          ))}
                          {p.reviewCount > 0 && (
                            <span className="text-[10px] text-[#6d1b3b]/40 ml-0.5">({p.reviewCount})</span>
                          )}
                        </div>

                        <Link href={`/product/${p._id}`}>
                          <h3 className="font-playfair text-sm font-bold text-[#2d1a24] line-clamp-1 hover:text-[#e91e8c] transition-colors mb-1">
                            {p.name}
                          </h3>
                        </Link>
                        <p className="text-[11px] text-[#6d1b3b]/50 line-clamp-1 mb-2">{p.shortDescription}</p>

                        {/* Flash sale indicator */}
                        {p.flashSalePrice && (
                          <div className="flex items-center gap-1 mb-1.5">
                            <TrendingUp className="w-3 h-3 text-orange-500" />
                            <span className="text-[10px] text-orange-500 font-semibold">Flash Sale Price</span>
                          </div>
                        )}

                        {/* Price + Cart */}
                        <div className="flex items-center justify-between mt-auto">
                          <div>
                            <span className="font-playfair text-base font-extrabold text-[#e91e8c]">
                              ৳{displayPrice.toLocaleString()}
                            </span>
                            {strikePrice && (
                              <span className="text-[11px] text-[#ad1457]/40 line-through ml-1">
                                ৳{strikePrice.toLocaleString()}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleAddToCart(p)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                              isAdded
                                ? "bg-green-500 scale-110"
                                : "bg-gradient-to-r from-[#e91e8c] to-[#c2185b] hover:scale-110 hover:shadow-lg hover:shadow-[#e91e8c]/30"
                            }`}
                          >
                            {isAdded ? (
                              <span className="text-white text-xs font-bold">✓</span>
                            ) : (
                              <ShoppingBag className="w-4 h-4 text-white" />
                            )}
                          </button>
                        </div>

                        {/* Free shipping tag */}
                        {displayPrice >= 999 && (
                          <div className="mt-2 pt-2 border-t border-[#fce4ec] flex items-center gap-1">
                            <Truck className="w-3 h-3 text-green-500" />
                            <span className="text-[10px] text-green-600 font-semibold">Free Shipping</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Infinite scroll sentinel */}
            <div ref={loadMoreRef} className="mt-8 flex justify-center py-4">
              {isFetchingNextPage && (
                <div className="flex items-center gap-2 text-[#ad1457]">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="text-sm font-semibold">Loading more...</span>
                </div>
              )}
              {!hasNextPage && products.length > 0 && !isLoading && (
                <p className="text-sm text-[#6d1b3b]/40 font-semibold">
                  All {total} products loaded
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />

      {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}
    </div>
  );
}
