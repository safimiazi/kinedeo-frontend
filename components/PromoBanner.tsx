"use client";

import Link from "next/link";
import { useActiveBundle } from "@/lib/hooks";

export default function PromoBanner() {
  const { data: bundle, isLoading } = useActiveBundle();

  // Nothing active — render nothing (don't break page layout)
  if (isLoading || !bundle) return null;

  const discount = bundle.originalPrice && bundle.originalPrice > bundle.bundlePrice
    ? Math.round((1 - bundle.bundlePrice / bundle.originalPrice) * 100)
    : 0;

  return (
    <section className="bg-linear-to-br from-[#2d1a24] to-[#6d1b3b] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10 flex-wrap">
        <div>
          {bundle.badge && (
            <div className="font-nunito text-[#f48fb1] text-[13px] font-bold tracking-widest uppercase mb-3">
              ✨ {bundle.badge}
            </div>
          )}
          <h2 className="font-playfair text-3xl md:text-[42px] font-extrabold text-white leading-tight mb-4">
            {bundle.name} {bundle.emoji ?? ""}
          </h2>
          <p className="font-nunito text-[#f8bbd0] text-base max-w-105 leading-relaxed mb-7">
            {bundle.description}
          </p>
          <div className="flex gap-4 items-center flex-wrap">
            <Link
              href={`/bundle/${bundle._id}`}
              className="bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white px-8 py-3.5 rounded-full font-nunito font-bold text-base tracking-wide hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all inline-block"
            >
              Shop Gift Set
            </Link>
            <div className="flex items-baseline gap-2">
              <span className="font-playfair text-[26px] font-extrabold text-[#f48fb1]">
                ৳{bundle.bundlePrice.toLocaleString()}
              </span>
              {bundle.originalPrice && bundle.originalPrice > bundle.bundlePrice && (
                <>
                  <span className="font-nunito text-sm text-[#ad1457] line-through">
                    ৳{bundle.originalPrice.toLocaleString()}
                  </span>
                  {discount > 0 && (
                    <span className="font-nunito text-xs font-bold text-[#e91e8c] bg-[#e91e8c]/10 px-2 py-0.5 rounded-full">
                      -{discount}% OFF
                    </span>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Product count hint */}
          {bundle.productIds?.length > 0 && (
            <p className="font-nunito text-xs text-[#f48fb1]/60 mt-4">
              Includes {bundle.productIds.length} products
            </p>
          )}
        </div>

        <div className="text-[120px] drop-shadow-[0_16px_48px_rgba(233,30,140,0.4)] animate-float select-none">
          {bundle.emoji ?? "🎀"}
        </div>
      </div>
    </section>
  );
}
