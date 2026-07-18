"use client";

import Link from "next/link";
import { Heart, Package, ShoppingBag, Trash2, ArrowLeft, Star, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartPanel from "@/components/CartPanel";
import { useCart } from "@/lib/cart-context";
import { useFavorites, useToggleFavorite } from "@/lib/hooks";
import { useProducts } from "@/lib/hooks";
import { useState, useMemo } from "react";
import type { Product } from "@/lib/api/types";

export default function WishlistPage() {
  const { addItem, itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);

  const { data: favoritesData, isLoading: favLoading } = useFavorites();
  const toggleFavorite = useToggleFavorite();
  const favorites = favoritesData?.favorites ?? [];

  // Fetch all products — we'll filter client-side by favorites
  // This avoids N individual product fetches
  const { data: productsData, isLoading: productsLoading } = useProducts({
    limit: 100,
  });

  const allProducts = productsData?.products ?? [];

  const wishlistProducts = useMemo(
    () => allProducts.filter((p) => favorites.includes(p._id)),
    [allProducts, favorites]
  );

  const isLoading = favLoading || productsLoading;

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

      {/* Hero */}
      <div className="bg-linear-to-r from-[#e91e8c] via-[#c2185b] to-[#ad1457] text-white py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-sm font-semibold mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 fill-white text-white" />
            <div>
              <h1 className="font-playfair text-3xl md:text-4xl font-extrabold">My Wishlist</h1>
              <p className="text-white/70 text-sm mt-0.5">
                {favorites.length} {favorites.length === 1 ? "item" : "items"} saved
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Loading */}
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
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

        {/* Not logged in */}
        {!isLoading && !favoritesData && (
          <div className="text-center py-24">
            <Heart className="w-16 h-16 mx-auto mb-4 text-[#ad1457]/20" />
            <h2 className="font-playfair text-2xl font-bold text-[#2d1a24] mb-2">Login to see your wishlist</h2>
            <p className="text-sm text-[#6d1b3b]/60 mb-6">Save your favorite products and access them anytime.</p>
            <Link
              href="/login"
              className="inline-block bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white px-8 py-3 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all"
            >
              Login / Register
            </Link>
          </div>
        )}

        {/* Empty wishlist */}
        {!isLoading && favoritesData && wishlistProducts.length === 0 && (
          <div className="text-center py-24">
            <Heart className="w-16 h-16 mx-auto mb-4 text-[#ad1457]/20" />
            <h2 className="font-playfair text-2xl font-bold text-[#2d1a24] mb-2">Your wishlist is empty</h2>
            <p className="text-sm text-[#6d1b3b]/60 mb-6">
              Browse our products and click the heart icon to save your favorites.
            </p>
            <Link
              href="/products"
              className="inline-block bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white px-8 py-3 rounded-full font-bold text-sm hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all"
            >
              Browse Products
            </Link>
          </div>
        )}

        {/* Wishlist grid */}
        {!isLoading && wishlistProducts.length > 0 && (
          <>
            {/* Add all to cart */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-[#6d1b3b]/60 font-semibold">
                {wishlistProducts.length} saved {wishlistProducts.length === 1 ? "product" : "products"}
              </p>
              <button
                onClick={() => wishlistProducts.forEach((p) => handleAddToCart(p))}
                className="flex items-center gap-2 bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-full text-sm font-bold hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                Add All to Cart
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistProducts.map((p) => {
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
                    {/* Remove from wishlist */}
                    <button
                      onClick={() => toggleFavorite.mutate({ productId: p._id, isFavorited: true })}
                      className="absolute top-2 right-2 z-10 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:scale-110"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    </button>

                    {/* Image */}
                    <Link href={`/product/${p._id}`} className="block relative aspect-square bg-linear-to-br from-pink-50 to-rose-50 overflow-hidden">
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

                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1.5 pointer-events-none">
                        {p.flashSalePrice && (
                          <span className="bg-orange-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            FLASH SALE
                          </span>
                        )}
                        {p.badge && !p.flashSalePrice && (
                          <span className="bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            {p.badge}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="bg-[#c2185b] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                            -{discount}%
                          </span>
                        )}
                      </div>

                      {/* Favorited indicator */}
                      <div className="absolute bottom-2 right-2 pointer-events-none">
                        <Heart className="w-4 h-4 fill-[#e91e8c] text-[#e91e8c] drop-shadow" />
                      </div>
                    </Link>

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
                              : "bg-linear-to-r from-[#e91e8c] to-[#c2185b] hover:scale-110 hover:shadow-lg hover:shadow-[#e91e8c]/30"
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
      </div>

      <Footer />
      {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}
    </div>
  );
}
