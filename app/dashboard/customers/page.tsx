"use client";

const customers = [
  { id: 1, name: "Priya Sharma", email: "priya@email.com", orders: 12, spent: "₹18,450", joined: "Jan 2026", avatar: "PS" },
  { id: 2, name: "Ananya Gupta", email: "ananya@email.com", orders: 8, spent: "₹12,890", joined: "Feb 2026", avatar: "AG" },
  { id: 3, name: "Meera Patel", email: "meera@email.com", orders: 15, spent: "₹24,320", joined: "Dec 2025", avatar: "MP" },
  { id: 4, name: "Riya Singh", email: "riya@email.com", orders: 6, spent: "₹8,970", joined: "Mar 2026", avatar: "RS" },
  { id: 5, name: "Kavya Nair", email: "kavya@email.com", orders: 22, spent: "₹35,600", joined: "Nov 2025", avatar: "KN" },
  { id: 6, name: "Diya Reddy", email: "diya@email.com", orders: 4, spent: "₹5,490", joined: "Apr 2026", avatar: "DR" },
  { id: 7, name: "Isha Verma", email: "isha@email.com", orders: 9, spent: "₹14,230", joined: "Jan 2026", avatar: "IV" },
  { id: 8, name: "Neha Joshi", email: "neha@email.com", orders: 3, spent: "₹4,120", joined: "May 2026", avatar: "NJ" },
];

export default function CustomersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Customers</h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-1">{customers.length} registered customers</p>
        </div>
        <button className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all w-fit">
          Export List
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-pink-100">
          <p className="text-xs text-[#6d1b3b]/50 mb-1">Total Customers</p>
          <p className="text-2xl font-bold text-[#2d1a24]">3,421</p>
          <p className="text-xs text-green-600 font-medium mt-1">+124 this month</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-pink-100">
          <p className="text-xs text-[#6d1b3b]/50 mb-1">Avg. Order Value</p>
          <p className="text-2xl font-bold text-[#2d1a24]">₹1,890</p>
          <p className="text-xs text-green-600 font-medium mt-1">+8% from last month</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-pink-100">
          <p className="text-xs text-[#6d1b3b]/50 mb-1">Repeat Rate</p>
          <p className="text-2xl font-bold text-[#2d1a24]">68%</p>
          <p className="text-xs text-green-600 font-medium mt-1">+5% from last month</p>
        </div>
      </div>

      {/* Customers list */}
      <div className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-pink-50/50 border-b border-pink-100">
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5">Customer</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5 hidden md:table-cell">Joined</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5">Orders</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5">Total Spent</th>
                <th className="text-left text-xs font-semibold text-[#6d1b3b]/70 px-6 py-3.5">Action</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-t border-pink-50 hover:bg-pink-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f48fb1] to-[#e91e8c] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {customer.avatar}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#2d1a24]">{customer.name}</p>
                        <p className="text-xs text-[#6d1b3b]/50">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6d1b3b]/60 hidden md:table-cell">{customer.joined}</td>
                  <td className="px-6 py-4 text-sm font-medium text-[#2d1a24]">{customer.orders}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#ad1457]">{customer.spent}</td>
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
