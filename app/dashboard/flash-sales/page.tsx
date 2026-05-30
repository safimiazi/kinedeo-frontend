"use client";

const flashSales = [
  { id: 1, name: "Summer Glow Sale", discount: "30%", products: 12, startDate: "1 Jun 2026", endDate: "7 Jun 2026", status: "Upcoming", revenue: "—" },
  { id: 2, name: "Weekend Beauty Bash", discount: "50%", products: 8, startDate: "28 May 2026", endDate: "30 May 2026", status: "Active", revenue: "₹1,24,500" },
  { id: 3, name: "Skincare Week", discount: "25%", products: 15, startDate: "20 May 2026", endDate: "26 May 2026", status: "Ended", revenue: "₹2,89,000" },
  { id: 4, name: "New Launch Offer", discount: "20%", products: 5, startDate: "15 May 2026", endDate: "18 May 2026", status: "Ended", revenue: "₹98,400" },
];

const statusColors: Record<string, string> = {
  Active: "bg-green-100 text-green-700",
  Upcoming: "bg-blue-100 text-blue-700",
  Ended: "bg-gray-100 text-gray-600",
};

export default function FlashSalesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Flash Sales</h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-1">Create and manage limited-time offers</p>
        </div>
        <button className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all w-fit">
          + Create Sale
        </button>
      </div>

      {/* Active sale highlight */}
      <div className="bg-gradient-to-r from-[#fce4ec] to-[#f8bbd0] rounded-2xl p-6 border border-pink-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">⚡</span>
              <span className="text-xs font-bold text-[#e91e8c] bg-white/60 px-2 py-0.5 rounded-full">LIVE NOW</span>
            </div>
            <h2 className="text-xl font-bold text-[#2d1a24]">Weekend Beauty Bash</h2>
            <p className="text-sm text-[#6d1b3b]/70 mt-1">50% off on 8 selected products • Ends today</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#ad1457]">₹1,24,500</p>
              <p className="text-xs text-[#6d1b3b]/50">Revenue</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#ad1457]">186</p>
              <p className="text-xs text-[#6d1b3b]/50">Orders</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sales list */}
      <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-pink-50/50 border-b border-pink-100">
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5">Sale Name</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5">Discount</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5 hidden md:table-cell">Duration</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5 hidden sm:table-cell">Products</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5">Revenue</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {flashSales.map((sale) => (
                <tr key={sale.id} className="border-t border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-[#2d1a24]">{sale.name}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#e91e8c]">{sale.discount}</span>
                  </td>
                  <td className="px-6 py-4 text-xs text-[#6d1b3b]/60 hidden md:table-cell">
                    {sale.startDate} — {sale.endDate}
                  </td>
                  <td className="px-6 py-4 text-sm text-[#2d1a24] hidden sm:table-cell">{sale.products}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#ad1457]">{sale.revenue}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[sale.status]}`}>
                      {sale.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
