// "use client";

// const stats = [
//   { label: "Total Revenue", value: "৳4,52,890", change: "+12.5%", up: true, icon: "💰" },
//   { label: "Orders", value: "1,284", change: "+8.2%", up: true, icon: "📦" },
//   { label: "Customers", value: "3,421", change: "+15.3%", up: true, icon: "👥" },
//   { label: "Products", value: "86", change: "+3", up: true, icon: "🛍️" },
// ];

// const recentOrders = [
//   { id: "#ORD-2841", customer: "Priya Sharma", items: 3, total: "৳3,299", status: "Delivered", date: "Today" },
//   { id: "#ORD-2840", customer: "Ananya Gupta", items: 1, total: "৳1,599", status: "Shipped", date: "Today" },
//   { id: "#ORD-2839", customer: "Meera Patel", items: 2, total: "৳2,198", status: "Processing", date: "Yesterday" },
//   { id: "#ORD-2838", customer: "Riya Singh", items: 4, total: "৳5,496", status: "Delivered", date: "Yesterday" },
//   { id: "#ORD-2837", customer: "Kavya Nair", items: 1, total: "৳899", status: "Pending", date: "2 days ago" },
// ];

// const topProducts = [
//   { name: "Silk Rose Serum", sold: 342, revenue: "৳4,44,558", emoji: "🌹" },
//   { name: "Velvet Lip Kit", sold: 287, revenue: "৳2,57,913", emoji: "💄" },
//   { name: "Glow Radiance Cream", sold: 198, revenue: "৳3,16,602", emoji: "✨" },
//   { name: "Pearl Perfume", sold: 156, revenue: "৳3,89,844", emoji: "🌸" },
//   { name: "Hair Glow Serum", sold: 234, revenue: "৳2,33,766", emoji: "💆‍♀️" },
// ];

// const statusColors: Record<string, string> = {
//   Delivered: "bg-green-100 text-green-700",
//   Shipped: "bg-blue-100 text-blue-700",
//   Processing: "bg-yellow-100 text-yellow-700",
//   Pending: "bg-gray-100 text-gray-600",
// };

// export default function DashboardOverview() {
//   return (
//     <div className="space-y-6">
//       {/* Page header */}
//       <div>
//         <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Dashboard</h1>
//         <p className="text-sm text-[#6d1b3b]/60 mt-1">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
//       </div>

//       {/* Stats grid */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {stats.map((stat) => (
//           <div
//             key={stat.label}
//             className="bg-white rounded-2xl p-5 border border-pink-100 hover:shadow-md hover:shadow-pink-100/50 transition-all"
//           >
//             <div className="flex items-center justify-between mb-3">
//               <span className="text-2xl">{stat.icon}</span>
//               <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
//                 stat.up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
//               }`}>
//                 {stat.change}
//               </span>
//             </div>
//             <p className="text-2xl font-bold text-[#2d1a24]">{stat.value}</p>
//             <p className="text-xs text-[#6d1b3b]/60 mt-1">{stat.label}</p>
//           </div>
//         ))}
//       </div>

//       {/* Charts / Content area */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Revenue chart placeholder */}
//         <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-pink-100">
//           <div className="flex items-center justify-between mb-6">
//             <h2 className="text-lg font-bold text-[#2d1a24]">Revenue Overview</h2>
//             <select className="text-xs bg-pink-50 border border-pink-200 rounded-lg px-3 py-1.5 text-[#ad1457] font-medium outline-none">
//               <option>Last 7 days</option>
//               <option>Last 30 days</option>
//               <option>Last 3 months</option>
//             </select>
//           </div>
//           {/* Chart placeholder - visual bars */}
//           <div className="flex items-end gap-3 h-48">
//             {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
//               <div key={i} className="flex-1 flex flex-col items-center gap-2">
//                 <div
//                   className="w-full bg-gradient-to-t from-[#e91e8c] to-[#f48fb1] rounded-t-lg transition-all hover:opacity-80"
//                   style={{ height: `${h}%` }}
//                 />
//                 <span className="text-[10px] text-[#6d1b3b]/50 font-medium">
//                   {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
//                 </span>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Top products */}
//         <div className="bg-white rounded-2xl p-6 border border-pink-100">
//           <h2 className="text-lg font-bold text-[#2d1a24] mb-4">Top Products</h2>
//           <div className="space-y-3">
//             {topProducts.map((product, i) => (
//               <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-pink-50 transition-colors">
//                 <span className="text-xl">{product.emoji}</span>
//                 <div className="flex-1 min-w-0">
//                   <p className="text-sm font-semibold text-[#2d1a24] truncate">{product.name}</p>
//                   <p className="text-xs text-[#6d1b3b]/50">{product.sold} sold</p>
//                 </div>
//                 <span className="text-sm font-bold text-[#ad1457]">{product.revenue}</span>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Recent orders */}
//       <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
//         <div className="flex items-center justify-between p-6 pb-4">
//           <h2 className="text-lg font-bold text-[#2d1a24]">Recent Orders</h2>
//           <button className="text-xs font-semibold text-[#e91e8c] hover:text-[#ad1457] transition-colors">
//             View All →
//           </button>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="w-full">
//             <thead>
//               <tr className="border-t border-pink-100 bg-pink-50/50">
//                 <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3">Order ID</th>
//                 <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3">Customer</th>
//                 <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3 hidden sm:table-cell">Items</th>
//                 <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3">Total</th>
//                 <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3">Status</th>
//                 <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3 hidden md:table-cell">Date</th>
//               </tr>
//             </thead>
//             <tbody>
//               {recentOrders.map((order) => (
//                 <tr key={order.id} className="border-t border-pink-50 hover:bg-pink-50/30 transition-colors">
//                   <td className="px-6 py-3.5 text-sm font-semibold text-[#ad1457]">{order.id}</td>
//                   <td className="px-6 py-3.5 text-sm text-[#2d1a24]">{order.customer}</td>
//                   <td className="px-6 py-3.5 text-sm text-[#6d1b3b]/60 hidden sm:table-cell">{order.items}</td>
//                   <td className="px-6 py-3.5 text-sm font-semibold text-[#2d1a24]">{order.total}</td>
//                   <td className="px-6 py-3.5">
//                     <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
//                       {order.status}
//                     </span>
//                   </td>
//                   <td className="px-6 py-3.5 text-sm text-[#6d1b3b]/50 hidden md:table-cell">{order.date}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { IndianRupee, Package, Users, ShoppingBag, TrendingUp, TrendingDown, Rose, Sparkles, Flower2, User, ChevronRight, SparklesIcon } from "lucide-react";
import { apiRequest } from "@/lib/api/client";
import { ordersApi } from "@/lib/api/orders";
import { productsApi } from "@/lib/api/products";

const fallbackStats = {
  revenue: 452890,
  orders: 1284,
  customers: 3421,
  products: 86,
};

const fallbackRecentOrders = [
  { id: "#ORD-2841", customer: "Priya Sharma", items: 3, total: "৳3,299", status: "Delivered", date: "Today" },
  { id: "#ORD-2840", customer: "Ananya Gupta", items: 1, total: "৳1,599", status: "Shipped", date: "Today" },
  { id: "#ORD-2839", customer: "Meera Patel", items: 2, total: "৳2,198", status: "Processing", date: "Yesterday" },
  { id: "#ORD-2838", customer: "Riya Singh", items: 4, total: "৳5,496", status: "Delivered", date: "Yesterday" },
  { id: "#ORD-2837", customer: "Kavya Nair", items: 1, total: "৳899", status: "Pending", date: "2 days ago" },
];

const fallbackTopProducts = [
  { name: "Silk Rose Serum", sold: 342, revenue: "৳4,44,558", icon: Rose },
  { name: "Velvet Lip Kit", sold: 287, revenue: "৳2,57,913", icon: SparklesIcon },
  { name: "Glow Radiance Cream", sold: 198, revenue: "৳3,16,602", icon: Sparkles },
  { name: "Pearl Perfume", sold: 156, revenue: "৳3,89,844", icon: Flower2 },
  { name: "Hair Glow Serum", sold: 234, revenue: "৳2,33,766", icon: User },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Pending: "bg-gray-100 text-gray-600",
  Confirmed: "bg-blue-100 text-blue-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function DashboardOverview() {
  const { data: orderStatsData } = useQuery({
    queryKey: ["dashboard", "orders-stats"],
    queryFn: () => ordersApi.getStats(),
    staleTime: 1000 * 60,
    retry: 1,
  });

  const { data: customersStatsData } = useQuery({
    queryKey: ["dashboard", "customers-stats"],
    queryFn: () => apiRequest<{ total: number; active: number; newThisMonth: number }>("/customers/stats"),
    staleTime: 1000 * 60,
    retry: 1,
  });

  const { data: productsData } = useQuery({
    queryKey: ["dashboard", "products-count"],
    queryFn: () => productsApi.getAll({ page: 1, limit: 1 }),
    staleTime: 1000 * 60,
    retry: 1,
  });

  const { data: topProductsData } = useQuery({
    queryKey: ["dashboard", "top-products"],
    queryFn: () => productsApi.getAll({ page: 1, limit: 5, sortBy: 'salesCount', sortOrder: 'desc' }),
    staleTime: 1000 * 60,
    retry: 1,
  });

  const { data: recentOrdersData } = useQuery({
    queryKey: ["dashboard", "recent-orders"],
    queryFn: () => ordersApi.getAll({ page: 1, limit: 5 }),
    staleTime: 1000 * 30,
    retry: 1,
  });

  const revenue = orderStatsData?.revenue ?? fallbackStats.revenue;
  const totalOrders = orderStatsData?.total ?? fallbackStats.orders;
  const totalCustomers = customersStatsData?.total ?? fallbackStats.customers;
  const totalProducts = productsData?.total ?? fallbackStats.products;

  const topProducts = useMemo(() => {
    if (!topProductsData?.products?.length) {
      return fallbackTopProducts;
    }

    return topProductsData.products.map((product) => ({
      name: product.name,
      sold: product.salesCount ?? 0,
      revenue: `৳${Math.round((product.flashSalePrice || product.basePrice) * (product.salesCount || 0)).toLocaleString()}`,
      icon: Rose,
    }));
  }, [topProductsData]);

  const stats = useMemo(
    () => [
      { label: "Total Revenue", value: `৳${revenue.toLocaleString()}`, change: "+12.5%", up: true, icon: IndianRupee },
      { label: "Orders", value: totalOrders.toString(), change: "+8.2%", up: true, icon: Package },
      { label: "Customers", value: totalCustomers.toString(), change: "+15.3%", up: true, icon: Users },
      { label: "Products", value: totalProducts.toString(), change: "+3", up: true, icon: ShoppingBag },
    ],
    [revenue, totalOrders, totalCustomers, totalProducts],
  );

  const recentOrders = useMemo(() => {
    if (!recentOrdersData) {
      return fallbackRecentOrders;
    }

    return recentOrdersData.orders.slice(0, 5).map((order) => ({
      id: order.orderNumber,
      customer: order.shippingAddress.name,
      items: order.items.length,
      total: `৳${order.total.toLocaleString()}`,
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      date: new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    }));
  }, [recentOrdersData]);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Dashboard</h1>
        <p className="text-sm text-[#6d1b3b]/60 mt-1">Welcome back! Here&apos;s what&apos;s happening with your store.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-2xl p-5 border border-pink-100 hover:shadow-md hover:shadow-pink-100/50 transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <stat.icon className="w-6 h-6 text-[#ad1457]" />
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                stat.up ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-[#2d1a24]">{stat.value}</p>
            <p className="text-xs text-[#6d1b3b]/60 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts / Content area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-pink-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-[#2d1a24]">Revenue Overview</h2>
            <select className="text-xs bg-pink-50 border border-pink-200 rounded-lg px-3 py-1.5 text-[#ad1457] font-medium outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 3 months</option>
            </select>
          </div>
          {/* Chart placeholder - visual bars */}
          <div className="flex items-end gap-3 h-48">
            {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className="w-full bg-linear-to-t from-[#e91e8c] to-[#f48fb1] rounded-t-lg transition-all hover:opacity-80"
                  style={{ height: `${h}%` }}
                />
                <span className="text-[10px] text-[#6d1b3b]/50 font-medium">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl p-6 border border-pink-100">
          <h2 className="text-lg font-bold text-[#2d1a24] mb-4">Top Products</h2>
          <div className="space-y-3">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-pink-50 transition-colors">
                <product.icon className="w-5 h-5 text-[#ad1457]" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#2d1a24] truncate">{product.name}</p>
                  <p className="text-xs text-[#6d1b3b]/50">{product.sold} sold</p>
                </div>
                <span className="text-sm font-bold text-[#ad1457]">{product.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4">
          <h2 className="text-lg font-bold text-[#2d1a24]">Recent Orders</h2>
          <button className="text-xs font-semibold text-[#e91e8c] hover:text-[#ad1457] transition-colors flex items-center gap-1">
            View All <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-t border-pink-100 bg-pink-50/50">
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3">Order ID</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3">Customer</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3 hidden sm:table-cell">Items</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3">Total</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3 hidden md:table-cell">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-t border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="px-6 py-3.5 text-sm font-semibold text-[#ad1457]">{order.id}</td>
                  <td className="px-6 py-3.5 text-sm text-[#2d1a24]">{order.customer}</td>
                  <td className="px-6 py-3.5 text-sm text-[#6d1b3b]/60 hidden sm:table-cell">{order.items}</td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-[#2d1a24]">{order.total}</td>
                  <td className="px-6 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-[#6d1b3b]/50 hidden md:table-cell">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}