"use client";

const reviews = [
  { id: 1, customer: "Priya M.", product: "Silk Rose Serum", rating: 5, comment: "Absolutely love it! My skin feels so smooth and radiant.", date: "Today", avatar: "PM" },
  { id: 2, customer: "Ananya G.", product: "Velvet Lip Kit", rating: 4, comment: "Great colors but slightly drying after 6 hours.", date: "Today", avatar: "AG" },
  { id: 3, customer: "Meera P.", product: "Glow Radiance Cream", rating: 5, comment: "Best moisturizer I've ever used. Worth every penny!", date: "Yesterday", avatar: "MP" },
  { id: 4, customer: "Riya S.", product: "Pearl Perfume", rating: 5, comment: "The fragrance lasts all day. So many compliments!", date: "Yesterday", avatar: "RS" },
  { id: 5, customer: "Kavya N.", product: "Hair Glow Serum", rating: 3, comment: "Good but expected more volume. Shine is nice though.", date: "2 days ago", avatar: "KN" },
  { id: 6, customer: "Diya R.", product: "Collagen Face Mask", rating: 5, comment: "My weekly self-care essential. Skin looks plump after!", date: "3 days ago", avatar: "DR" },
];

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Reviews</h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-1">Monitor customer feedback and ratings</p>
        </div>
      </div>

      {/* Rating overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-pink-100 text-center">
          <p className="text-3xl font-bold text-[#2d1a24]">4.8</p>
          <p className="text-yellow-500 text-sm mt-1">★★★★★</p>
          <p className="text-xs text-[#6d1b3b]/50 mt-1">Average Rating</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-pink-100 text-center">
          <p className="text-3xl font-bold text-[#2d1a24]">2,847</p>
          <p className="text-xs text-[#6d1b3b]/50 mt-2">Total Reviews</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-pink-100 text-center">
          <p className="text-3xl font-bold text-green-600">92%</p>
          <p className="text-xs text-[#6d1b3b]/50 mt-2">Positive</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-pink-100 text-center">
          <p className="text-3xl font-bold text-[#2d1a24]">24</p>
          <p className="text-xs text-[#6d1b3b]/50 mt-2">Pending Reply</p>
        </div>
      </div>

      {/* Reviews list */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="bg-white rounded-2xl border border-pink-100 p-5 hover:shadow-sm transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#f48fb1] to-[#e91e8c] flex items-center justify-center text-white text-xs font-bold shrink-0">
                {review.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <div>
                    <span className="text-sm font-bold text-[#2d1a24]">{review.customer}</span>
                    <span className="text-xs text-[#6d1b3b]/50 ml-2">on {review.product}</span>
                  </div>
                  <span className="text-xs text-[#6d1b3b]/40">{review.date}</span>
                </div>
                <div className="text-yellow-500 text-xs mt-1">
                  {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
                </div>
                <p className="text-sm text-[#2d1a24]/80 mt-2">{review.comment}</p>
                <div className="flex gap-3 mt-3">
                  <button className="text-xs text-[#e91e8c] font-semibold hover:text-[#ad1457] transition-colors">
                    Reply
                  </button>
                  <button className="text-xs text-[#6d1b3b]/40 font-medium hover:text-[#6d1b3b] transition-colors">
                    Hide
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
