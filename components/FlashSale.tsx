  "use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Zap, Package, ShoppingBag } from "lucide-react";
import { useActiveFlashSales } from "@/lib/hooks/use-products";
import { useCart } from "@/lib/cart-context";

function useCountdown(endTime: string | null) {
  const calcLeft = () => {
    if (!endTime) return null;
    const diff = new Date(endTime).getTime() - Date.now();
    if (diff <= 0) return { h: 0, m: 0, s: 0, expired: true };
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { h, m, s, expired: false };
  };

  const [left, setLeft] = useState(calcLeft);

  useEffect(() => {
    if (!endTime) return;
    const t = setInterval(() => setLeft(calcLeft()), 1000);
    return () => clearInterval(t);
  }, [endTime]);

  return left;
}

export default function FlashSale() {
  const { data: flashSales, isLoading } = useActiveFlashSales();
  const { addItem } = useCart();

  // Pick the first active flash sale
  const sale = flashSales?.[0] ?? null;
  const countdown = useCountdown(sale?.endTime ?? null);

  // Don't render anything while loading or if no active flash sale
  if (isLoading || !sale || !countdown || countdown.expired) return null;

  const pad = (n: number) => String(n).padStart(2, "0");

  // Collect product IDs from the sale to show items
  const saleProducts = sale.products.slice(0, 4);

  return (
    <section className="bg-gradient-to-br from-[#c2185b] via-[#e91e8c] to-[#ad1457] py-10 px-[5%] overflow-hidden relative">
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span className="font-nunito text-white/80 text-[13px] font-bold tracking-widest uppercase">
                Flash Sale
              </span>
            </div>
            <h2 className="font-playfair text-white text-2xl md:text-[28px] font-extrabold">
              {sale.name}
            </h2>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3">
            <span className="font-nunito text-white/70 text-[13px] font-semibold">Ends in:</span>
            {(["h", "m", "s"] as const).map((lbl, i) => {
              const val = [countdown.h, countdown.m, countdown.s][i];
              return (
                <div
                  key={lbl}
                  className="bg-white rounded-xl px-4 py-3 min-w-[56px] text-center shadow-md shadow-black/10"
                >
                  <div className="font-playfair text-[26px] font-extrabold text-[#e91e8c] leading-none">
                    {pad(val)}
                  </div>
                  <div className="font-nunito text-[10px] text-[#ad1457] font-bold uppercase tracking-wider mt-0.5">
                    {lbl}
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/products"
            className="bg-white text-[#e91e8c] px-7 py-3 rounded-full font-nunito font-bold text-[14px] tracking-wide hover:-translate-y-0.5 hover:shadow-lg transition-all whitespace-nowrap"
          >
            Grab Deals →
          </Link>
        </div>

        {/* Sale product cards */}
        {saleProducts.length > 0 && (
          <FlashSaleProducts saleProducts={saleProducts} onAddToCart={addItem} />
        )}
      </div>
    </section>
  );
}

// Sub-component: fetches product details for each sale item
import { useProducts } from "@/lib/hooks/use-products";
import type { FlashSaleProduct } from "@/lib/api/types";

function FlashSaleProducts({
  saleProducts,
  onAddToCart,
}: {
  saleProducts: FlashSaleProduct[];
  onAddToCart: ReturnType<typeof useCart>["addItem"];
}) {
  // Fetch all products in one call — we'll filter client-side
  // We use a broad fetch and match by productId
  const { data } = useProducts({ limit: 50 });
  const [addedId, setAddedId] = useState<string | null>(null);

  const allProducts = data?.products ?? [];

  const enriched = saleProducts
    .map((sp) => {
      const product = allProducts.find((p) => p._id === sp.productId);
      if (!product) return null;
      const discount = Math.round((1 - sp.salePrice / sp.originalPrice) * 100);
      return { product, salePrice: sp.salePrice, originalPrice: sp.originalPrice, discount };
    })
    .filter(Boolean) as {
    product: NonNullable<ReturnType<typeof useProducts>["data"]>["products"][number];
    salePrice: number;
    originalPrice: number;
    discount: number;
  }[];

  if (enriched.length === 0) return null;

  const handleAdd = (item: (typeof enriched)[number]) => {
    const variant = item.product.variants?.[0];
    onAddToCart({
      productId: item.product._id,
      variantId: variant?._id,
      name: item.product.name,
      image: item.product.images?.[0] || "",
      price: item.salePrice,
      originalPrice: item.originalPrice,
      sku: variant?.sku,
    });
    setAddedId(item.product._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {enriched.map((item) => (
        <div
          key={item.product._id}
          className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 border border-white/20 hover:bg-white/20 transition-all group"
        >
          <Link href={`/product/${item.product._id}`}>
            <div className="aspect-square rounded-xl overflow-hidden bg-white/10 mb-3 relative">
              {item.product.images?.[0] ? (
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-10 h-10 text-white/40" />
                </div>
              )}
              <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                -{item.discount}%
              </span>
            </div>
          </Link>

          <Link href={`/product/${item.product._id}`}>
            <p className="font-nunito font-bold text-white text-sm line-clamp-1 mb-1 hover:text-yellow-200 transition-colors">
              {item.product.name}
            </p>
          </Link>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-playfair font-extrabold text-white text-base">
                ৳{item.salePrice.toLocaleString()}
              </span>
              <span className="text-white/50 text-xs line-through ml-1">
                ৳{item.originalPrice.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => handleAdd(item)}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                addedId === item.product._id
                  ? "bg-green-400 scale-110"
                  : "bg-white/20 hover:bg-white hover:text-[#e91e8c] hover:scale-110"
              }`}
            >
              {addedId === item.product._id ? (
                <span className="text-white text-xs font-bold">✓</span>
              ) : (
                <ShoppingBag className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
