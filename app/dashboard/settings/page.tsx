"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("Petal Beauty");
  const [email, setEmail] = useState("admin@petalbeauty.com");
  const [currency, setCurrency] = useState("INR");
  const [freeShipping, setFreeShipping] = useState("999");

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Settings</h1>
        <p className="text-sm text-[#6d1b3b]/60 mt-1">Manage your store configuration</p>
      </div>

      {/* General settings */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6">
        <h2 className="text-lg font-bold text-[#2d1a24] mb-5">General</h2>
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Contact Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all bg-white"
              >
                <option value="INR">₹ INR (Indian Rupee)</option>
                <option value="USD">$ USD (US Dollar)</option>
                <option value="EUR">€ EUR (Euro)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Free Shipping Above</label>
              <input
                type="text"
                value={freeShipping}
                onChange={(e) => setFreeShipping(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6">
        <h2 className="text-lg font-bold text-[#2d1a24] mb-5">Notifications</h2>
        <div className="space-y-4">
          {[
            { label: "New order notifications", desc: "Get notified when a new order is placed", default: true },
            { label: "Low stock alerts", desc: "Alert when product stock falls below 10", default: true },
            { label: "Review notifications", desc: "Get notified for new customer reviews", default: false },
            { label: "Weekly report email", desc: "Receive weekly sales summary via email", default: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-[#2d1a24]">{item.label}</p>
                <p className="text-xs text-[#6d1b3b]/50">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                <div className="w-10 h-5 bg-pink-100 peer-focus:ring-2 peer-focus:ring-[#e91e8c]/20 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e91e8c]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end">
        <button className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all">
          Save Changes
        </button>
      </div>
    </div>
  );
}
