"use client";

const coupons = [
  { id: 1, code: "PETAL20", discount: "20% off", minOrder: "₹999", used: 1245, limit: 5000, status: "Active", expires: "30 Jun 2026" },
  { id: 2, code: "SUMMER30", discount: "30% off", minOrder: "₹1,499", used: 342, limit: 1000, status: "Active", expires: "15 Jun 2026" },
  { id: 3, code: "NEWUSER", discount: "₹200 off", minOrder: "₹599", used: 2890, limit: null, status: "Active", expires: "No expiry" },
  { id: 4, code: "GLOW15", discount: "15% off", minOrder: "₹799", used: 567, limit: 500, status: "Expired", expires: "25 May 2026" },
  { id: 5, code: "FREESHIP", discount: "Free Delivery", minOrder: "₹499", used: 4521, limit: null, status: "Active", expires: "No expiry" },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Expired: "bg-gray-100 text-gray-600",
  Paused: "bg-yellow-100 text-yellow-700",
};

export default function CouponsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Coupons</h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-1">Manage discount codes and promotions</p>
        </div>
        <button className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all w-fit">
          + Create Coupon
        </button>
      </div>

      {/* Coupons grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className="bg-white rounded-2xl border border-pink-100 p-5 hover:shadow-md hover:shadow-pink-100/50 transition-all relative overflow-hidden"
          >
            {/* Decorative dashed border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#e91e8c] to-[#f48fb1]" />

            <div className="flex items-center justify-between mb-3">
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${statusColors[coupon.status]}`}>
                {coupon.status}
              </span>
              <span className="text-xs text-[#6d1b3b]/40">{coupon.expires}</span>
            </div>

            <div className="bg-pink-50 rounded-xl px-4 py-3 mb-4 text-center border border-dashed border-pink-200">
              <p className="text-lg font-bold text-[#e91e8c] tracking-wider font-mono">{coupon.code}</p>
              <p className="text-sm font-semibold text-[#ad1457] mt-0.5">{coupon.discount}</p>
            </div>

            <div className="space-y-2 text-xs text-[#6d1b3b]/60">
              <div className="flex justify-between">
                <span>Min. order</span>
                <span className="font-medium text-[#2d1a24]">{coupon.minOrder}</span>
              </div>
              <div className="flex justify-between">
                <span>Used</span>
                <span className="font-medium text-[#2d1a24]">
                  {coupon.used.toLocaleString()}{coupon.limit ? ` / ${coupon.limit.toLocaleString()}` : ""}
                </span>
              </div>
              {coupon.limit && (
                <div className="w-full bg-pink-100 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-gradient-to-r from-[#e91e8c] to-[#f48fb1] h-1.5 rounded-full"
                    style={{ width: `${Math.min((coupon.used / coupon.limit) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-4 pt-3 border-t border-pink-50">
              <button className="text-xs text-[#e91e8c] font-semibold hover:text-[#ad1457]">Edit</button>
              <button className="text-xs text-[#6d1b3b]/40 font-medium hover:text-[#6d1b3b]">
                {coupon.status === "Active" ? "Pause" : "Activate"}
              </button>
              <button className="text-xs text-red-400 font-semibold hover:text-red-600 ml-auto">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
