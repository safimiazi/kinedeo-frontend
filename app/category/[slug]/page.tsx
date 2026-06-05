"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Loader2,
  Package,
  ShoppingBag,
  Star,
  Truck,
  TrendingUp,
  Tag,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartPanel from "@/components/CartPanel";
import { useCart } from "@/lib/cart-context";
import { useCategories, useFavorites, useToggleFavorite } from "@/lib/hooks";
import { useInfiniteProducts } from "@/lib/hooks/use-products";
import type { Product } from "@/lib/api/types";

interface Props {
  params: Promise<{ slug: string }>;
}

export default function CategoryPage({ params }: Props) {
  const { slug } = use(params);
  const { addItem, itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const { data: favoritesData } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const favorites = favoritesData?.favorites ?? [];

  // Find the category by slug
  const { data: categories } = useCategories();
  const category = categories?.find((c) => c.slug === slug);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteProducts({
    limit: 12,
    categoryId: category?._id,
  });

  const products = data?.pages.flatMap((p) => p.products) ?? [];
  const total = data?.pages[0]?.total ?? 0;

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

  // Loading state — categories not yet fetched
  const categoriesLoading = !categories;

  return (
    <div className="min-h-screen bg-[#fff0f5] font-nunito">
      <Navbar cartCount={itemCount} onCartOpen={() => setCartOpen(true)} />

      {/* Hero Banner */}
      <div className="relative bg-gradient-to-r from-[#e91e8c] via-[#c2185b] to-[#ad1457] text-white overflow-hidden">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 w-48 h-48 rounded-full bg-white/5" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-semibold mb-5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All Products
          </Link>

          <div className="flex items-start gap-4">
            {/* Category icon / image */}
            {category?.image ? (
              <img
                src={category.image}
                alt={category.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-white/30 shadow-lg shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                <Tag className="w-7 h-7 text-white" />
              </div>
            )}

            <div>
              <div className="inline-block font-nunito text-[11px] font-extrabold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full mb-2">
                Category
              </div>
              <h1 className="font-playfair text-3xl md:text-5xl font-extrabold leading-tight">
                {categoriesLoading ? (
                  <span className="inline-block w-48 h-10 bg-white/20 rounded-xl animate-pulse" />
                ) : category ? (
                  category.name
                ) : (
                  slug.charAt(0).toUpperCase() + slug.slice(1)
                )}
              </h1>
              {category?.description && (
                <p className="text-white/75 text-sm mt-2 max-w-lg">{category.description}</p>
              )}
              <p className="text-white/60 text-sm mt-1.5 font-semibold">
                {isLoading ? "Loading products..." : `${total} products`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Other categories quick nav */}
      {categories && categories.length > 1 && (
        <div className="bg-white border-b border-pink-100 sticky top-16 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
              <Link
                href="/products"
                className="shrink-0 font-nunito font-semibold text-xs px-4 py-2 rounded-full transition-all text-[#6d1b3b] hover:bg-pink-50 hover:text-[#e91e8c]"
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  className={`shrink-0 font-nunito font-semibold text-xs px-4 py-2 rounded-full transition-all ${
                    cat.slug === slug
                      ? "bg-[#e91e8c] text-white shadow-sm shadow-[#e91e8c]/30"
                      : "text-[#6d1b3b] hover:bg-pink-50 hover:text-[#e91e8c]"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category not found */}
        {!categoriesLoading && !category && (
          <div className="text-center py-24">
            <Package className="w-16 h-16 mx-auto mb-4 text-[#ad1457]/20" />
            <h2 className="font-playfair text-2xl font-bold text-[#2d1a24] mb-2">Category not found</h2>
            <p className="text-sm text-[#6d1b3b]/60 mb-6">
              The category &ldquo;{slug}&rdquo; doesn&apos;t exist or has been removed.
            </p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-8 py-3 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Loading skeleton */}
        {(isLoading || (categoriesLoading)) && (
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
        {!isLoading && !isError && category && products.length === 0 && (
          <div className="text-center py-24">
            <Package className="w-16 h-16 mx-auto mb-4 text-[#ad1457]/20" />
            <h3 className="font-playfair text-xl font-bold text-[#2d1a24] mb-2">No products yet</h3>
            <p className="text-sm text-[#6d1b3b]/60 mb-6">
              We haven&apos;t added products to {category.name} yet. Check back soon!
            </p>
            <Link
              href="/products"
              className="inline-block bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-8 py-3 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* Products Grid */}
        {!isLoading && !isError && products.length > 0 && (
          <>
            <p className="text-sm text-[#6d1b3b]/50 font-semibold mb-4">{total} products found</p>
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
                const isFav = favorites.includes(p._id);

                return (
                  <div
                    key={p._id}
                    className="group relative bg-white rounded-2xl border border-[#fce4ec] hover:border-[#e91e8c] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#e91e8c]/10 flex flex-col"
                  >
                    {/* Image */}
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

                      {/* Wishlist button */}
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
          </>
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

      <Footer />
      {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}
    </div>
  );
}
