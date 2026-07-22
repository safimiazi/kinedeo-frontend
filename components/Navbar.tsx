"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Heart,
  ShoppingBag,
  User,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useFavorites, useCategories } from "@/lib/hooks";

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
}

export default function Navbar({ cartCount, onCartOpen }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const { data: favoritesData } = useFavorites();
  const wishlistCount = favoritesData?.favorites?.length ?? 0;
  const { data: categories } = useCategories();

  // Close menus on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Close mobile menu on route change / resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setUserMenuOpen(false);
  };

  return (
    <>
      <nav className="bg-white/95 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* ── Logo ── */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              {/* <Image
                src="/short_logo.webp"
                alt="KineDeo logo"
                width={36}
                height={36}
                className="group-hover:scale-105 transition-transform duration-300"
                priority
              /> */}
              <span className="font-playfair text-lg sm:text-xl font-extrabold text-[#e91e8c] tracking-tight">Kine</span>
              <span className="font-playfair text-lg sm:text-xl font-normal text-[#ad1457]">Deo</span>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link
                href="/products"
                className="font-nunito font-semibold text-sm text-[#6d1b3b] hover:text-[#e91e8c] transition-colors tracking-wide relative group"
              >
                Shop
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-linear-to-r from-[#e91e8c] to-[#c2185b] group-hover:w-full transition-all duration-300" />
              </Link>
              {(categories || []).map((cat) => (
                <Link
                  key={cat._id}
                  href={`/category/${cat.slug}`}
                  className="font-nunito font-semibold text-sm text-[#6d1b3b] hover:text-[#e91e8c] transition-colors tracking-wide relative group"
                >
                  {cat.name}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-linear-to-r from-[#e91e8c] to-[#c2185b] group-hover:w-full transition-all duration-300" />
                </Link>
              ))}
              <Link
                href="/about"
                className="font-nunito font-semibold text-sm text-[#6d1b3b] hover:text-[#e91e8c] transition-colors tracking-wide relative group"
              >
                About
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-linear-to-r from-[#e91e8c] to-[#c2185b] group-hover:w-full transition-all duration-300" />
              </Link>
            </div>

            {/* ── Right Actions ── */}
            <div className="flex items-center gap-1 sm:gap-2">

              {/* Search — hidden on smallest screens */}
              <button className="hidden sm:flex p-2 rounded-full hover:bg-pink-50 transition-colors group">
                <Search className="w-5 h-5 text-[#ad1457] group-hover:text-[#e91e8c] transition-colors" />
              </button>

              {/* Wishlist */}
              <Link href="/wishlist" className="hidden sm:flex relative p-2 rounded-full hover:bg-pink-50 transition-colors group">
                <Heart className="w-5 h-5 text-[#ad1457] group-hover:text-[#e91e8c] transition-colors" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#e91e8c] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 99 ? "99+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <button
                onClick={onCartOpen}
                className="relative flex items-center gap-1.5 bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white px-3 sm:px-4 py-2 rounded-full font-nunito font-bold text-xs sm:text-[13px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all duration-300"
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Cart</span>
                {cartCount > 0 && (
                  <span className="bg-white text-[#e91e8c] text-[10px] font-extrabold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </button>

              {/* Auth — desktop: avatar with dropdown, mobile: handled in menu */}
              {isAuthenticated ? (
                <div ref={userMenuRef} className="relative hidden md:block">
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="w-9 h-9 rounded-full bg-linear-to-br from-[#f48fb1] to-[#e91e8c] flex items-center justify-center text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
                  >
                    {user?.name?.charAt(0)?.toUpperCase() ?? <User className="w-4 h-4" />}
                  </button>

                  {userMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-pink-100 shadow-xl z-50 animate-fade-in">
                      <div className="p-3 border-b border-pink-50">
                        <p className="text-sm font-semibold text-[#2d1a24] truncate">{user?.name}</p>
                        <p className="text-xs text-[#6d1b3b]/50 mt-0.5 truncate">
                          {user?.phone ? `+880 ${user.phone}` : user?.email}
                        </p>
                      </div>
                      <div className="p-2 space-y-1">
                        <Link
                          href="/account"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#6d1b3b] hover:bg-pink-50 rounded-lg transition-colors"
                        >
                          <User className="w-4 h-4 text-[#e91e8c]" />
                          My Account
                        </Link>
                        {(user?.role === "admin" || user?.role === "super-admin") && (
                          <Link
                            href="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#6d1b3b] hover:bg-pink-50 rounded-lg transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-[#e91e8c]" />
                            Dashboard
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="hidden md:inline-block font-nunito font-semibold text-sm text-[#ad1457] hover:text-[#e91e8c] transition-colors px-1"
                >
                  Login
                </Link>
              )}

              {/* Hamburger — mobile only */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="md:hidden p-2 rounded-full hover:bg-pink-50 transition-colors"
                aria-label={menuOpen ? "Close menu" : "Open menu"}
              >
                {menuOpen ? (
                  <X className="w-5 h-5 text-[#ad1457]" />
                ) : (
                  <Menu className="w-5 h-5 text-[#ad1457]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer ── */}
      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Slide-in panel */}
      <div
        ref={menuRef}
        className={`fixed top-0 right-0 h-full w-70 max-w-[85vw] bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-pink-100 bg-linear-to-r from-[#e91e8c]/5 to-white">
          <div className="flex items-center gap-2">
            <Image
              src="/short_logo.webp"
              alt="KineDeo logo"
              width={28}
              height={28}
              className="shrink-0"
            />
            <span className="font-playfair text-base font-extrabold text-[#e91e8c]">Kine</span>
            <span className="font-playfair text-base font-normal text-[#ad1457]">Deo</span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            className="p-1.5 rounded-full hover:bg-pink-100 transition-colors"
          >
            <X className="w-4 h-4 text-[#ad1457]" />
          </button>
        </div>

        {/* User info (if logged in) */}
        {isAuthenticated && (
          <div className="px-5 py-4 border-b border-pink-50 bg-pink-50/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#f48fb1] to-[#e91e8c] flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#2d1a24] truncate">{user?.name}</p>
                <p className="text-xs text-[#6d1b3b]/50 truncate">
                  {user?.phone ? `+880 ${user.phone}` : user?.email}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Nav links */}
        <div className="flex-1 overflow-y-auto py-3">
          <div className="px-3 space-y-1">
            <Link
              href="/products"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#2d1a24] hover:bg-pink-50 hover:text-[#e91e8c] transition-colors"
            >
              Shop
              <ChevronRight className="w-4 h-4 text-[#ad1457]/40" />
            </Link>
            {(categories || []).map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#2d1a24] hover:bg-pink-50 hover:text-[#e91e8c] transition-colors"
              >
                {cat.name}
                <ChevronRight className="w-4 h-4 text-[#ad1457]/40" />
              </Link>
            ))}
            <Link
              href="/about"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-[#2d1a24] hover:bg-pink-50 hover:text-[#e91e8c] transition-colors"
            >
              About
              <ChevronRight className="w-4 h-4 text-[#ad1457]/40" />
            </Link>
          </div>

          <div className="mx-3 my-3 border-t border-pink-100" />

          {/* Search & Wishlist in mobile menu */}
          <div className="px-3 space-y-1">
            <button
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#2d1a24] hover:bg-pink-50 transition-colors"
            >
              <Search className="w-4 h-4 text-[#ad1457]" />
              Search
            </button>
            <Link
              href="/wishlist"
              onClick={() => setMenuOpen(false)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#2d1a24] hover:bg-pink-50 transition-colors"
            >
              <Heart className="w-4 h-4 text-[#ad1457]" />
              Wishlist
              {wishlistCount > 0 && (
                <span className="ml-auto bg-[#e91e8c] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount > 99 ? "99+" : wishlistCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => { setMenuOpen(false); onCartOpen(); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#2d1a24] hover:bg-pink-50 transition-colors"
            >
              <ShoppingBag className="w-4 h-4 text-[#ad1457]" />
              Cart
              {cartCount > 0 && (
                <span className="ml-auto bg-[#e91e8c] text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Auth links */}
          <div className="mx-3 my-3 border-t border-pink-100" />
          <div className="px-3 space-y-1">
            {isAuthenticated ? (
              <>
                <Link
                  href="/account"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#2d1a24] hover:bg-pink-50 transition-colors"
                >
                  <User className="w-4 h-4 text-[#e91e8c]" />
                  My Account
                </Link>
                {(user?.role === "admin" || user?.role === "super-admin") && (
                  <Link
                    href="/dashboard"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#2d1a24] hover:bg-pink-50 transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4 text-[#e91e8c]" />
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#e91e8c] hover:bg-pink-50 transition-colors"
              >
                <User className="w-4 h-4" />
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.15s ease-out;
        }
      `}</style>
    </>
  );
}
