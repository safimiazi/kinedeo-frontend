import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-linear-to-br from-[#fff0f5] via-[#fce4ec] to-[#f8bbd0] min-h-screen flex items-center py-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 bg-[#e91e8c]/10 border border-[#e91e8c]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-[#e91e8c] rounded-full inline-block animate-pulse-dot" />
            <span className="font-nunito text-xs font-bold text-[#c2185b] tracking-wider uppercase">
              New Arrivals 2026
            </span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-[60px] leading-[1.15] text-[#2d1a24] font-extrabold mb-5">
            Shop the Best<br />
            <span className="text-[#e91e8c]">Deals Online</span> 🛍️
          </h1>
          <p className="font-nunito text-[17px] text-[#6d1b3b] leading-relaxed mb-9 max-w-120">
            Discover top-quality products across every category — delivered fast, priced right, and trusted by thousands of happy customers.
          </p>
          <div className="flex gap-3.5 flex-wrap">
            <Link
              href="/products"
              className="bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white border-none px-9 py-3.5 rounded-full font-nunito font-bold text-base tracking-wide hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all inline-block"
            >
              Shop Now ✨
            </Link>
            <Link
              href="/products"
              className="bg-transparent border-2 border-[#e91e8c] text-[#e91e8c] px-7 py-3 rounded-full font-nunito font-bold text-[15px] hover:bg-[#e91e8c] hover:text-white transition-all inline-block"
            >
              Browse All Products
            </Link>
          </div>
          <div className="flex gap-8 mt-10">
            {[["5K+", "Happy Customers"], ["4.9★", "Average Rating"], ["100%", "Authentic Products"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="font-playfair text-[22px] font-extrabold text-[#e91e8c]">{val}</div>
                <div className="font-nunito text-xs text-[#ad1457] font-semibold">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Visual */}
        <div className="flex-1 min-w-0 flex justify-center relative">
          <div className="w-70 h-70 md:w-85 md:h-85 rounded-[60%_40%_60%_40%/50%_60%_40%_50%] overflow-hidden animate-float shadow-xl shadow-[#e91e8c]/20 relative">
            <Image
              src="/minoxidil-hero.webp"
              alt="KineDeo featured product"
              fill
              sizes="(max-width: 768px) 280px, 340px"
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute top-5 right-5 hidden md:block bg-white rounded-2xl px-4 py-3 shadow-lg shadow-[#e91e8c]/20 border border-[#fce4ec]">
            <div className="font-nunito text-[11px] text-[#ad1457] font-bold">⭐ Just Reviewed</div>
            <div className="font-nunito text-[13px] font-bold text-[#2d1a24] mt-0.5">&quot;Absolutely love it!&quot;</div>
            <div className="font-nunito text-[11px] text-[#ad1457]">— Verified Buyer ❤️</div>
          </div>
          <div className="absolute bottom-8 left-0 hidden md:block bg-white rounded-2xl px-4 py-3 shadow-lg shadow-[#e91e8c]/20 border border-[#fce4ec]">
            <div className="font-nunito text-xs text-[#6d1b3b] font-semibold">🔥 Selling Fast!</div>
            <div className="font-nunito text-[13px] font-extrabold text-[#e91e8c]">Minoxidil</div>
            <div className="font-nunito text-[11px] text-[#ad1457]">Only 8 left in stock</div>
          </div>
        </div>
      </div>
    </section>
  );
}
