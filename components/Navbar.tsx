"use client";

interface NavbarProps {
  wishlistCount: number;
  cartCount: number;
  onCartOpen: () => void;
}

export default function Navbar({ wishlistCount, cartCount, onCartOpen }: NavbarProps) {
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
        </div>
      </div>
    </nav>
  );
}
