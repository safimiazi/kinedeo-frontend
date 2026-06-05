// "use client";

// import { useState } from "react";

// export default function SettingsPage() {
//   const [storeName, setStoreName] = useState("Petal Beauty");
//   const [email, setEmail] = useState("admin@petalbeauty.com");
//   const [currency, setCurrency] = useState("INR");
//   const [freeShipping, setFreeShipping] = useState("999");

//   return (
//     <div className="space-y-6 max-w-3xl">
//       <div>
//         <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Settings</h1>
//         <p className="text-sm text-[#6d1b3b]/60 mt-1">Manage your store configuration</p>
//       </div>

//       {/* General settings */}
//       <div className="bg-white rounded-2xl border border-pink-100 p-6">
//         <h2 className="text-lg font-bold text-[#2d1a24] mb-5">General</h2>
//         <div className="space-y-5">
//           <div>
//             <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Store Name</label>
//             <input
//               type="text"
//               value={storeName}
//               onChange={(e) => setStoreName(e.target.value)}
//               className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Contact Email</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
//             />
//           </div>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Currency</label>
//               <select
//                 value={currency}
//                 onChange={(e) => setCurrency(e.target.value)}
//                 className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all bg-white"
//               >
//                 <option value="INR">৳ INR (Indian Rupee)</option>
//                 <option value="USD">$ USD (US Dollar)</option>
//                 <option value="EUR">€ EUR (Euro)</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-[#2d1a24] mb-1.5">Free Shipping Above</label>
//               <input
//                 type="text"
//                 value={freeShipping}
//                 onChange={(e) => setFreeShipping(e.target.value)}
//                 className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Notifications */}
//       <div className="bg-white rounded-2xl border border-pink-100 p-6">
//         <h2 className="text-lg font-bold text-[#2d1a24] mb-5">Notifications</h2>
//         <div className="space-y-4">
//           {[
//             { label: "New order notifications", desc: "Get notified when a new order is placed", default: true },
//             { label: "Low stock alerts", desc: "Alert when product stock falls below 10", default: true },
//             { label: "Review notifications", desc: "Get notified for new customer reviews", default: false },
//             { label: "Weekly report email", desc: "Receive weekly sales summary via email", default: true },
//           ].map((item, i) => (
//             <div key={i} className="flex items-center justify-between py-2">
//               <div>
//                 <p className="text-sm font-medium text-[#2d1a24]">{item.label}</p>
//                 <p className="text-xs text-[#6d1b3b]/50">{item.desc}</p>
//               </div>
//               <label className="relative inline-flex items-center cursor-pointer">
//                 <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
//                 <div className="w-10 h-5 bg-pink-100 peer-focus:ring-2 peer-focus:ring-[#e91e8c]/20 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e91e8c]"></div>
//               </label>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Save button */}
//       <div className="flex justify-end">
//         <button className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all">
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// }
"use client";

import { useState } from "react";
import { 
  Settings, 
  Store, 
  Mail, 
  DollarSign, 
  Truck, 
  Bell, 
  ShoppingBag, 
  AlertTriangle, 
  Star, 
  BarChart3,
  Save,
  CheckCircle,
  Globe,
  Shield,
  Clock
} from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [storeName, setStoreName] = useState("Petal Beauty");
  const [email, setEmail] = useState("admin@petalbeauty.com");
  const [currency, setCurrency] = useState("INR");
  const [freeShipping, setFreeShipping] = useState("999");

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#e91e8c]" />
          Settings
        </h1>
        <p className="text-sm text-[#6d1b3b]/60 mt-1 flex items-center gap-1">
          <Shield className="w-3 h-3" />
          Manage your store configuration and preferences
        </p>
      </div>

      {/* General settings */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
            <Store className="w-4 h-4 text-[#e91e8c]" />
          </div>
          <h2 className="text-lg font-bold text-[#2d1a24]">General Settings</h2>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#2d1a24] mb-1.5 flex items-center gap-1">
              <Store className="w-4 h-4 text-[#ad1457]/60" />
              Store Name
            </label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
              placeholder="Enter store name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#2d1a24] mb-1.5 flex items-center gap-1">
              <Mail className="w-4 h-4 text-[#ad1457]/60" />
              Contact Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
              placeholder="admin@example.com"
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2d1a24] mb-1.5 flex items-center gap-1">
                <Globe className="w-4 h-4 text-[#ad1457]/60" />
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all bg-white"
              >
                <option value="INR">🇮🇳 INR (Indian Rupee)</option>
                <option value="USD">🇺🇸 USD (US Dollar)</option>
                <option value="EUR">🇪🇺 EUR (Euro)</option>
                <option value="GBP">🇬🇧 GBP (British Pound)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2d1a24] mb-1.5 flex items-center gap-1">
                <Truck className="w-4 h-4 text-[#ad1457]/60" />
                Free Shipping Above (৳)
              </label>
              <input
                type="number"
                value={freeShipping}
                onChange={(e) => setFreeShipping(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] focus:ring-2 focus:ring-[#e91e8c]/10 transition-all"
                placeholder="e.g. 999"
              />
              <p className="text-[10px] text-[#6d1b3b]/40 mt-1">
                Orders above this amount get free shipping
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
            <Bell className="w-4 h-4 text-[#e91e8c]" />
          </div>
          <h2 className="text-lg font-bold text-[#2d1a24]">Notification Preferences</h2>
        </div>
        
        <div className="space-y-4">
          {[
            { 
              id: "orders",
              label: "New order notifications", 
              desc: "Get notified when a new order is placed", 
              icon: ShoppingBag,
              default: true 
            },
            { 
              id: "stock",
              label: "Low stock alerts", 
              desc: "Alert when product stock falls below 10", 
              icon: AlertTriangle,
              default: true 
            },
            { 
              id: "reviews",
              label: "Review notifications", 
              desc: "Get notified for new customer reviews", 
              icon: Star,
              default: false 
            },
            { 
              id: "reports",
              label: "Weekly report email", 
              desc: "Receive weekly sales summary via email", 
              icon: BarChart3,
              default: true 
            },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between py-2 hover:bg-pink-50/50 px-3 -mx-3 rounded-lg transition-colors">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center shrink-0 mt-0.5">
                  <item.icon className="w-4 h-4 text-[#ad1457]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#2d1a24]">{item.label}</p>
                  <p className="text-xs text-[#6d1b3b]/50">{item.desc}</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                <div className="w-11 h-6 bg-pink-100 peer-focus:ring-2 peer-focus:ring-[#e91e8c]/20 rounded-full peer peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e91e8c]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Store Information */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 hover:shadow-md transition-all">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-100 to-pink-50 flex items-center justify-center">
            <Clock className="w-4 h-4 text-[#e91e8c]" />
          </div>
          <h2 className="text-lg font-bold text-[#2d1a24]">Store Information</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-pink-50/50 to-transparent rounded-xl p-4 border border-pink-100">
            <p className="text-xs text-[#6d1b3b]/50 mb-1">Store Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <p className="text-sm font-semibold text-[#2d1a24]">Active</p>
            </div>
          </div>
          <div className="bg-gradient-to-br from-pink-50/50 to-transparent rounded-xl p-4 border border-pink-100">
            <p className="text-xs text-[#6d1b3b]/50 mb-1">Last Updated</p>
            <p className="text-sm font-semibold text-[#2d1a24]">Today, 10:30 AM</p>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex justify-end sticky bottom-4">
        <button 
          onClick={handleSave}
          className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-8 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all flex items-center gap-2 group"
        >
          <Save className="w-4 h-4 group-hover:scale-110 transition-transform" />
          Save Changes
        </button>
      </div>
    </div>
  );
}