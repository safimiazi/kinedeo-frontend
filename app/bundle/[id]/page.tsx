"use client";

import { use } from "react";
import Link from "next/link";
import { ShoppingBag, Package, ArrowLeft, Star, Tag, CheckCircle, Truck } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartPanel from "@/components/CartPanel";
import { useCart } from "@/lib/cart-context";
import { useBundle } from "@/lib/hooks";
import { useState } from "react";
import type { BundleProduct } from "@/lib/api/types";

export default function BundlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: bundle, isLoading, isError } = useBundle(id);
  const { addItem, itemCount } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddAllToCart = () => {
    if (!bundle) return;
    const count = bundle.productIds.length;
    // Distribute bundle price proportionally by each product's basePrice
    const totalBasePrice = bundle.productIds.reduce((sum, p) => sum + p.basePrice, 0);

    bundle.productIds.forEach((p: BundleProduct) => {
      const variant = p.variants?.[0];
      // Proportional price: (product basePrice / total basePrice) * bundlePrice
      const proportionalPrice = totalBasePrice > 0
        ? Math.round((p.basePrice / totalBasePrice) * bundle.bundlePrice)
        : Math.round(bundle.bundlePrice / count);

      addItem({
        productId: p._id,
        variantId: variant?._id,
        name: p.name,
        image: p.images?.[0] ?? "",
        price: proportionalPrice,
        originalPrice: p.basePrice, // show original for strike-through
        sku: variant?.sku,
        isBundleItem: true,
        bundleId: bundle._id,
      });
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#fff0f5] font-nunito">
      <Navbar cartCount={itemCount} onCartOpen={() => setCartOpen(true)} />

      {isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          <div className="h-8 w-48 bg-pink-100 rounded-lg animate-pulse" />
          <div className="h-64 bg-pink-50 rounded-2xl animate-pulse" />
        </div>
      )}

      {isError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <Package className="w-16 h-16 mx-auto mb-4 text-[#ad1457]/30" />
          <h2 className="font-playfair text-2xl font-bold text-[#2d1a24] mb-2">Bundle not found</h2>
          <Link href="/products" className="text-sm text-[#e91e8c] font-semibold hover:underline">
            Browse Products →
          </Link>
        </div>
      )}

      {bundle && (
        <>
          {/* Hero */}
          <div className="bg-linear-to-br from-[#2d1a24] to-[#6d1b3b] text-white py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm font-semibold mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Home
              </Link>

              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div>
                  {bundle.badge && (
                    <span className="inline-block font-nunito text-[11px] font-extrabold text-[#f48fb1] tracking-widest uppercase mb-3">
                      ✨ {bundle.badge}
                    </span>
                  )}
                  <h1 className="font-playfair text-3xl md:text-4xl font-extrabold mb-3">
                    {bundle.name} {bundle.emoji ?? ""}
                  </h1>
                  <p className="text-[#f8bbd0] text-base max-w-lg leading-relaxed mb-6">
                    {bundle.description}
                  </p>
                  <div className="flex items-center gap-4 flex-wrap">
                    <button
                      onClick={handleAddAllToCart}
                      className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-base tracking-wide transition-all ${
                        added
                          ? "bg-green-500 text-white"
                          : "bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35"
                      }`}
                    >
                      {added ? (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          Added to Cart!
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          Add Bundle to Cart
                        </>
                      )}
                    </button>
                    <div className="flex items-baseline gap-2">
                      <span className="font-playfair text-3xl font-extrabold text-[#f48fb1]">
                        ৳{bundle.bundlePrice.toLocaleString()}
                      </span>
                      {bundle.originalPrice && bundle.originalPrice > bundle.bundlePrice && (
                        <span className="text-sm text-[#ad1457] line-through">
                          ৳{bundle.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-8xl drop-shadow-[0_16px_48px_rgba(233,30,140,0.4)] select-none hidden md:block">
                  {bundle.emoji ?? "🎀"}
                </div>
              </div>
            </div>
          </div>

          {/* Products in bundle */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="font-playfair text-2xl font-bold text-[#2d1a24] mb-2">
              What&apos;s in this bundle
            </h2>
            <p className="text-sm text-[#6d1b3b]/60 mb-8">
              {bundle.productIds.length} carefully selected products
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {bundle.productIds.map((p: BundleProduct) => (
                <div
                  key={p._id}
                  className="group bg-white rounded-2xl border border-[#fce4ec] hover:border-[#e91e8c] overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-[#e91e8c]/10"
                >
                  <Link href={`/product/${p._id}`} className="block relative aspect-square bg-gradient-to-br from-pink-50 to-rose-50 overflow-hidden">
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
                    {p.badge && (
                      <span className="absolute top-2 left-2 bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        {p.badge}
                      </span>
                    )}
                  </Link>

                  <div className="p-4">
                    {p.averageRating !== undefined && (
                      <div className="flex items-center gap-1 mb-1.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-2.5 h-2.5 ${
                              s <= Math.round(p.averageRating ?? 0)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-200 fill-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    <Link href={`/product/${p._id}`}>
                      <h3 className="font-playfair text-sm font-bold text-[#2d1a24] line-clamp-1 hover:text-[#e91e8c] transition-colors mb-1">
                        {p.name}
                      </h3>
                    </Link>
                    <p className="text-[11px] text-[#6d1b3b]/50 line-clamp-2 mb-2">
                      {p.shortDescription}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="font-playfair text-base font-extrabold text-[#e91e8c]">
                          ৳{p.basePrice.toLocaleString()}
                        </span>
                        {p.originalPrice && p.originalPrice > p.basePrice && (
                          <span className="text-[11px] text-[#ad1457]/40 line-through">
                            ৳{p.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <Tag className="w-4 h-4 text-[#ad1457]/30" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Savings callout */}
            {bundle.originalPrice && bundle.originalPrice > bundle.bundlePrice && (
              <div className="mt-10 bg-gradient-to-r from-[#fce4ec] to-white rounded-2xl border border-pink-200 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-playfair text-lg font-bold text-[#2d1a24]">
                    You save ৳{(bundle.originalPrice - bundle.bundlePrice).toLocaleString()}
                  </p>
                  <p className="text-sm text-[#6d1b3b]/60 mt-0.5">
                    Compared to buying each product individually
                  </p>
                  {bundle.bundlePrice >= 999 && (
                    <div className="flex items-center gap-1 mt-2">
                      <Truck className="w-3.5 h-3.5 text-green-500" />
                      <span className="text-xs text-green-600 font-semibold">Free Shipping included</span>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleAddAllToCart}
                  className={`shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-all ${
                    added
                      ? "bg-green-500 text-white"
                      : "bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white hover:shadow-lg hover:shadow-[#e91e8c]/30 hover:-translate-y-0.5"
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {added ? "Added!" : "Add Bundle to Cart"}
                </button>
              </div>
            )}
          </div>
        </>
      )}

      <Footer />
      {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}
    </div>
  );
}
