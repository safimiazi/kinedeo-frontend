"use client";

import { useState } from "react";

const orders = [
  { id: "#ORD-2841", customer: "Priya Sharma", email: "priya@email.com", items: 3, total: "₹3,299", status: "Delivered", date: "30 May 2026", payment: "Paid" },
  { id: "#ORD-2840", customer: "Ananya Gupta", email: "ananya@email.com", items: 1, total: "₹1,599", status: "Shipped", date: "30 May 2026", payment: "Paid" },
  { id: "#ORD-2839", customer: "Meera Patel", email: "meera@email.com", items: 2, total: "₹2,198", status: "Processing", date: "29 May 2026", payment: "Paid" },
  { id: "#ORD-2838", customer: "Riya Singh", email: "riya@email.com", items: 4, total: "₹5,496", status: "Delivered", date: "29 May 2026", payment: "Paid" },
  { id: "#ORD-2837", customer: "Kavya Nair", email: "kavya@email.com", items: 1, total: "₹899", status: "Pending", date: "28 May 2026", payment: "Unpaid" },
  { id: "#ORD-2836", customer: "Diya Reddy", email: "diya@email.com", items: 2, total: "₹2,498", status: "Delivered", date: "28 May 2026", payment: "Paid" },
  { id: "#ORD-2835", customer: "Isha Verma", email: "isha@email.com", items: 3, total: "₹4,197", status: "Cancelled", date: "27 May 2026", payment: "Refunded" },
  { id: "#ORD-2834", customer: "Neha Joshi", email: "neha@email.com", items: 1, total: "₹2,499", status: "Shipped", date: "27 May 2026", payment: "Paid" },
];

const statusColors: Record<string, string> = {
  Delivered: "bg-green-100 text-green-700",
  Shipped: "bg-blue-100 text-blue-700",
  Processing: "bg-yellow-100 text-yellow-700",
  Pending: "bg-gray-100 text-gray-600",
  Cancelled: "bg-red-100 text-red-700",
};

const paymentColors: Record<string, string> = {
  Paid: "text-green-600",
  Unpaid: "text-yellow-600",
  Refunded: "text-red-600",
};

const filters = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredOrders = activeFilter === "All"
    ? orders
    : orders.filter((o) => o.status === activeFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Orders</h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-1">Manage and track all customer orders</p>
        </div>
        <button className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all w-fit">
          Export Orders
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeFilter === f
                ? "bg-[#e91e8c] text-white shadow-md shadow-pink-200"
                : "bg-white text-[#6d1b3b] border border-pink-200 hover:bg-pink-50"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-pink-50/50 border-b border-pink-100">
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5">Order</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5">Customer</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5 hidden md:table-cell">Date</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5">Total</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5 hidden sm:table-cell">Payment</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5">Status</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-[#ad1457]">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#2d1a24]">{order.customer}</p>
                    <p className="text-xs text-[#6d1b3b]/50">{order.email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6d1b3b]/60 hidden md:table-cell">{order.date}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#2d1a24]">{order.total}</td>
                  <td className={`px-6 py-4 text-xs font-semibold hidden sm:table-cell ${paymentColors[order.payment]}`}>
                    {order.payment}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-xs text-[#e91e8c] font-semibold hover:text-[#ad1457] transition-colors">
                      View
                    </button>
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
