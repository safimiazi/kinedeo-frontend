"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

interface NavbarProps {
  wishlistCount: number;
  cartCount: number;
  onCartOpen: () => void;
}

export default function Navbar({ wishlistCount, cartCount, onCartOpen }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-pink-100 sticky top-0 z-50 px-[5%]">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-17">
        <div className="flex items-center gap-2">
          <span className="text-3xl">🌸</span>
          <span className="font-playfair text-[22px] font-extrabold text-[#e91e8c] -tracking-wide">Petal</span>
          <span className="font-playfair text-[22px] font-normal text-[#ad1457]">Beauty</span>
        </div>
        <div className="hidden md:flex items-center gap-7">
          {["Shop", "Skincare", "Makeup", "About"].map((l) => (
            <span key={l} className="font-nunito font-semibold text-sm text-[#6d1b3b] cursor-pointer hover:text-[#e91e8c] transition-colors tracking-wide">
              {l}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#ad1457] font-nunito font-semibold cursor-pointer">🔍</span>
          <span className="text-sm text-[#ad1457] font-nunito font-semibold cursor-pointer">
            ♡ {wishlistCount > 0 ? wishlistCount : ""}
          </span>
          <button
            className="bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white border-none px-5 py-2 rounded-full cursor-pointer font-nunito font-bold text-[13px] tracking-wide hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all"
            onClick={onCartOpen}
          >
            🛍️ Cart {cartCount > 0 && (
              <span className="bg-white/25 rounded-full px-2 py-0.5 ml-1">{cartCount}</span>
            )}
          </button>

          {/* Auth button */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f48fb1] to-[#e91e8c] flex items-center justify-center text-white text-xs font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </button>
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-pink-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-3 border-b border-pink-50">
                  <p className="text-sm font-semibold text-[#2d1a24] truncate">{user?.name}</p>
                  <p className="text-xs text-[#6d1b3b]/50 truncate">{user?.phone ? `+880 ${user.phone}` : user?.email}</p>
                </div>
                <div className="p-2">
                  {(user?.role === "admin" || user?.role === "super-admin") && (
                    <Link
                      href="/dashboard"
                      className="block px-3 py-2 text-xs font-medium text-[#6d1b3b] hover:bg-pink-50 rounded-lg transition-colors"
                    >
                      📊 Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => logout()}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    🚪 Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="font-nunito font-semibold text-sm text-[#ad1457] hover:text-[#e91e8c] transition-colors"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
