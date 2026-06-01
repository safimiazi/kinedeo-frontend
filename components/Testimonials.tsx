"use client";

import { useEffect, useState } from "react";
import { Star, BadgeCheck } from "lucide-react";
import { apiRequest } from "@/lib/api/client";
import type { FeaturedReview } from "@/lib/api/types";

export default function Testimonials() {
  const [reviews, setReviews] = useState<FeaturedReview[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    apiRequest<FeaturedReview[]>("/reviews/featured?limit=6", { auth: false })
      .then((data) => { if (mounted) setReviews(data); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoaded(true); });
    return () => { mounted = false; };
  }, []);

  // Don't render until loaded, and hide if no reviews
  if (!loaded || reviews.length === 0) return null;

  return (
    <section className="py-20 px-[5%] bg-[#fff8fa]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-block font-nunito text-[11px] font-extrabold text-[#e91e8c] tracking-[0.25em] uppercase mb-3 px-4 py-1.5 rounded-full bg-[#fce4ec] border border-[#f48fb1]/40">
            ✦ Customer Reviews
          </span>
          <h2 className="font-playfair text-3xl md:text-[38px] font-extrabold text-[#2d1a24] mt-3">
            Loved by Thousands 💕
          </h2>
          <p className="font-nunito text-[#6d1b3b]/60 text-sm mt-2">
            Real reviews from real customers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ReviewCard({ review }: { review: FeaturedReview }) {
  const name = review.userId?.name || "Customer";
  const initial = name.charAt(0).toUpperCase();
  const productName = review.productId?.name;
  const productImage = review.productId?.images?.[0];

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#fce4ec] hover:shadow-lg hover:shadow-[#e91e8c]/8 hover:border-[#e91e8c]/30 transition-all duration-300 flex flex-col">
      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-3">
        {[1, 2, 3, 4, 5].map((s) => (
          <Star
            key={s}
            className={`w-4 h-4 ${
              s <= review.rating
                ? "text-yellow-400 fill-yellow-400"
                : "text-gray-200 fill-gray-200"
            }`}
          />
        ))}
      </div>

      {/* Title */}
      {review.title && (
        <p className="font-playfair font-bold text-[#2d1a24] text-sm mb-2">{review.title}</p>
      )}

      {/* Comment */}
      <p className="font-nunito text-[14px] text-[#2d1a24]/80 leading-relaxed italic flex-1 mb-4">
        &quot;{review.comment}&quot;
      </p>

      {/* Product tag */}
      {productName && (
        <div className="flex items-center gap-2 mb-4 px-3 py-2 bg-pink-50 rounded-xl border border-pink-100">
          {productImage ? (
            <img src={productImage} alt={productName} className="w-8 h-8 rounded-lg object-cover shrink-0" />
          ) : null}
          <span className="font-nunito text-[11px] text-[#ad1457] font-semibold truncate">
            {productName}
          </span>
        </div>
      )}

      {/* Author */}
      <div className="flex items-center gap-3 border-t border-[#fce4ec] pt-4">
        <div className="w-10 h-10 bg-gradient-to-br from-[#f48fb1] to-[#e91e8c] rounded-full flex items-center justify-center shrink-0">
          <span className="font-playfair text-white font-extrabold text-sm">{initial}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-nunito font-bold text-[#2d1a24] text-sm truncate">{name}</div>
          <div className="font-nunito text-xs text-[#ad1457]/60">
            {new Date(review.createdAt).toLocaleDateString("en-BD", { month: "short", year: "numeric" })}
          </div>
        </div>
        {review.isVerifiedPurchase && (
          <div className="flex items-center gap-1 shrink-0">
            <BadgeCheck className="w-4 h-4 text-green-500" />
            <span className="font-nunito text-[10px] font-bold text-green-600">Verified</span>
          </div>
        )}
      </div>
    </div>
  );
}
