
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Zap, 
  Star, 
  Ticket, 
  Settings,
  Flower2,
  Search,
  Bell,
  LogOut,
  Menu,
  Store,
  Mail,
  Gift,
  Truck
} from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import { useAuth } from "@/lib/auth-context";

const menuItems = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: Package },
  { label: "Products", href: "/dashboard/products", icon: ShoppingBag },
  { label: "Customers", href: "/dashboard/customers", icon: Users },
  { label: "Categories", href: "/dashboard/categories", icon: Tag },
  { label: "Flash Sales", href: "/dashboard/flash-sales", icon: Zap },
  { label: "Reviews", href: "/dashboard/reviews", icon: Star },
  { label: "Coupons", href: "/dashboard/coupons", icon: Ticket },
  { label: "Announcements", href: "/dashboard/announcements", icon: Bell },
  { label: "Subscribers", href: "/dashboard/subscribers", icon: Mail },
  { label: "Bundles", href: "/dashboard/bundles", icon: Gift },
  { label: "Shipping", href: "/dashboard/settings/shipping", icon: Truck },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/admin/login";
  };

  return (
    <ProtectedRoute allowedRoles={["admin", "super-admin"]} redirectTo="/admin/login">
    <div className="flex h-screen bg-[#fdf2f8] font-nunito overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-pink-100 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-2 px-6 h-16 border-b border-pink-100">
          <Flower2 className="w-6 h-6 text-[#e91e8c]" />
          <span className="font-playfair text-lg font-extrabold text-[#e91e8c]">Kinedeo</span>
          <span className="font-playfair text-lg font-normal text-[#ad1457]">Admin</span>
        </div>

        <nav className="p-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-linear-to-r from-[#fce4ec] to-[#f8bbd0] text-[#ad1457] shadow-sm"
                    : "text-[#6d1b3b] hover:bg-pink-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-pink-100">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-[#e91e8c] to-[#c2185b] flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#2d1a24] truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-[#6d1b3b]/60 truncate">{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full mt-2 px-4 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors text-left flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-pink-100 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-pink-50 text-[#ad1457]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden lg:flex items-center gap-3 bg-pink-50 rounded-xl px-4 py-2 w-80">
            <Search className="w-4 h-4 text-[#ad1457]/50" />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent border-none outline-none text-sm text-[#2d1a24] placeholder:text-[#ad1457]/40 w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-lg hover:bg-pink-50 text-[#ad1457] transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[#e91e8c] rounded-full"></span>
            </button>
            <Link
              href="/"
              className="text-xs font-medium text-[#ad1457] hover:text-[#e91e8c] transition-colors flex items-center gap-1"
            >
              View Store <Store className="w-3 h-3" />
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
    </ProtectedRoute>
  );
}