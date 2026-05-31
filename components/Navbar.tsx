// "use client";

// import Link from "next/link";
// import { useAuth } from "@/lib/auth-context";

// interface NavbarProps {
//   wishlistCount: number;
//   cartCount: number;
//   onCartOpen: () => void;
// }

// export default function Navbar({ wishlistCount, cartCount, onCartOpen }: NavbarProps) {
//   const { user, isAuthenticated, logout } = useAuth();

//   return (
//     <nav className="bg-white border-b border-pink-100 sticky top-0 z-50 px-[5%]">
//       <div className="max-w-7xl mx-auto flex items-center justify-between h-17">
//         <div className="flex items-center gap-2">
//           <span className="text-3xl">🌸</span>
//           <span className="font-playfair text-[22px] font-extrabold text-[#e91e8c] -tracking-wide">Petal</span>
//           <span className="font-playfair text-[22px] font-normal text-[#ad1457]">Beauty</span>
//         </div>
//         <div className="hidden md:flex items-center gap-7">
//           {["Shop", "Skincare", "Makeup", "About"].map((l) => (
//             <span key={l} className="font-nunito font-semibold text-sm text-[#6d1b3b] cursor-pointer hover:text-[#e91e8c] transition-colors tracking-wide">
//               {l}
//             </span>
//           ))}
//         </div>
//         <div className="flex items-center gap-4">
//           <span className="text-sm text-[#ad1457] font-nunito font-semibold cursor-pointer">🔍</span>
//           <span className="text-sm text-[#ad1457] font-nunito font-semibold cursor-pointer">
//             ♡ {wishlistCount > 0 ? wishlistCount : ""}
//           </span>
//           <button
//             className="bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white border-none px-5 py-2 rounded-full cursor-pointer font-nunito font-bold text-[13px] tracking-wide hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all"
//             onClick={onCartOpen}
//           >
//             🛍️ Cart {cartCount > 0 && (
//               <span className="bg-white/25 rounded-full px-2 py-0.5 ml-1">{cartCount}</span>
//             )}
//           </button>

//           {/* Auth button */}
//           {isAuthenticated ? (
//             <div className="relative group">
//               <button className="w-8 h-8 rounded-full bg-gradient-to-br from-[#f48fb1] to-[#e91e8c] flex items-center justify-center text-white text-xs font-bold">
//                 {user?.name?.charAt(0)?.toUpperCase() || "U"}
//               </button>
//               <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-pink-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
//                 <div className="p-3 border-b border-pink-50">
//                   <p className="text-sm font-semibold text-[#2d1a24] truncate">{user?.name}</p>
//                   <p className="text-xs text-[#6d1b3b]/50 truncate">{user?.phone ? `+880 ${user.phone}` : user?.email}</p>
//                 </div>
//                 <div className="p-2">
//                   {(user?.role === "admin" || user?.role === "super-admin") && (
//                     <Link
//                       href="/dashboard"
//                       className="block px-3 py-2 text-xs font-medium text-[#6d1b3b] hover:bg-pink-50 rounded-lg transition-colors"
//                     >
//                       📊 Dashboard
//                     </Link>
//                   )}
//                   <button
//                     onClick={() => logout()}
//                     className="w-full text-left px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                   >
//                     🚪 Logout
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <Link
//               href="/login"
//               className="font-nunito font-semibold text-sm text-[#ad1457] hover:text-[#e91e8c] transition-colors"
//             >
//               Login
//             </Link>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }
"use client";

import Link from "next/link";
import { 
  Flower2, 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  LogOut, 
  LayoutDashboard,
  ChevronDown
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

interface NavbarProps {
  wishlistCount: number;
  cartCount: number;
  onCartOpen: () => void;
}

export default function Navbar({ wishlistCount, cartCount, onCartOpen }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-pink-100 sticky top-0 z-50 px-[5%] shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Logo */}
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="relative">
            <Flower2 className="w-7 h-7 text-[#e91e8c] group-hover:scale-110 transition-transform duration-300" />
            <div className="absolute inset-0 bg-[#e91e8c]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="font-playfair text-xl font-extrabold text-[#e91e8c] tracking-tight">Petal</span>
          <span className="font-playfair text-xl font-normal text-[#ad1457]">Beauty</span>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          {["Shop", "Skincare", "Makeup", "About"].map((l) => (
            <span 
              key={l} 
              className="font-nunito font-semibold text-sm text-[#6d1b3b] cursor-pointer hover:text-[#e91e8c] transition-all duration-200 hover:scale-105 tracking-wide relative group"
            >
              {l}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#e91e8c] to-[#c2185b] group-hover:w-full transition-all duration-300" />
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <button className="p-2 rounded-full hover:bg-pink-50 transition-all duration-200 group">
            <Search className="w-5 h-5 text-[#ad1457] group-hover:text-[#e91e8c] group-hover:scale-110 transition-all" />
          </button>

          {/* Wishlist */}
          <button className="relative p-2 rounded-full hover:bg-pink-50 transition-all duration-200 group">
            <Heart className="w-5 h-5 text-[#ad1457] group-hover:text-[#e91e8c] group-hover:scale-110 transition-all" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#e91e8c] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            className="relative bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white border-none px-5 py-2 rounded-full font-nunito font-bold text-[13px] tracking-wide hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all duration-300 flex items-center gap-2"
            onClick={onCartOpen}
          >
            <ShoppingBag className="w-4 h-4" />
            Cart
            {cartCount > 0 && (
              <span className="bg-white/25 rounded-full px-2 py-0.5 text-xs ml-1">
                {cartCount}
              </span>
            )}
          </button>

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="relative group">
              <button className="w-9 h-9 rounded-full bg-gradient-to-br from-[#f48fb1] to-[#e91e8c] flex items-center justify-center text-white text-sm font-bold shadow-md hover:shadow-lg transition-all duration-200">
                {user?.name?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-pink-100 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-3 border-b border-pink-50">
                  <p className="text-sm font-semibold text-[#2d1a24] truncate flex items-center gap-2">
                    <User className="w-4 h-4 text-[#e91e8c]" />
                    {user?.name}
                  </p>
                  <p className="text-xs text-[#6d1b3b]/50 mt-1">
                    {user?.phone ? `+880 ${user.phone}` : user?.email}
                  </p>
                </div>
                <div className="p-2 space-y-1">
                  {(user?.role === "admin" || user?.role === "super-admin") && (
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#6d1b3b] hover:bg-pink-50 rounded-lg transition-colors group"
                    >
                      <LayoutDashboard className="w-4 h-4 group-hover:text-[#e91e8c]" />
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => logout()}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors group"
                  >
                    <LogOut className="w-4 h-4 group-hover:scale-105 transition-transform" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="font-nunito font-semibold text-sm text-[#ad1457] hover:text-[#e91e8c] transition-colors hover:scale-105 inline-block"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}