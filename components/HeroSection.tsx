export default function HeroSection() {
  return (
    <section className="bg-linear-to-br from-[#fff0f5] via-[#fce4ec] to-[#f8bbd0] py-20 px-[5%]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        {/* Left Content */}
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 bg-[#e91e8c]/10 border border-[#e91e8c]/20 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-[#e91e8c] rounded-full inline-block animate-pulse-dot" />
            <span className="font-nunito text-xs font-bold text-[#c2185b] tracking-wider uppercase">
              New Collection 2024
            </span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-[60px] leading-[1.15] text-[#2d1a24] font-extrabold mb-5">
            Glow Like<br />
            <span className="text-[#e91e8c]">Never Before</span> 🌹
          </h1>
          <p className="font-nunito text-[17px] text-[#6d1b3b] leading-relaxed mb-9 max-w-[480px]">
            Discover luxury beauty crafted for the modern woman. From silky serums to bold lip colors — your perfect look awaits.
          </p>
          <div className="flex gap-3.5 flex-wrap">
            <button className="bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white border-none px-9 py-3.5 rounded-full cursor-pointer font-nunito font-bold text-base tracking-wide hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all">
              Shop Now ✨
            </button>
            <button className="bg-transparent border-2 border-[#e91e8c] text-[#e91e8c] px-7 py-3 rounded-full cursor-pointer font-nunito font-bold text-[15px] hover:bg-[#e91e8c] hover:text-white transition-all">
              View Lookbook
            </button>
          </div>
          <div className="flex gap-8 mt-10">
            {[["50K+", "Happy Customers"], ["4.9★", "Average Rating"], ["100%", "Natural Ingredients"]].map(([val, lbl]) => (
              <div key={lbl}>
                <div className="font-playfair text-[22px] font-extrabold text-[#e91e8c]">{val}</div>
                <div className="font-nunito text-xs text-[#ad1457] font-semibold">{lbl}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Visual */}
        <div className="flex-1 min-w-0 flex justify-center relative">
          <div className="w-70 h-70 md:w-85 md:h-85 bg-linear-to-br from-[#f48fb1] to-[#e91e8c] rounded-[60%_40%_60%_40%/50%_60%_40%_50%] flex items-center justify-center text-[100px] md:text-[120px] animate-float">
            🌸
          </div>
          <div className="absolute top-5 right-5 bg-white rounded-2xl px-4 py-3 shadow-lg shadow-[#e91e8c]/20 border border-[#fce4ec]">
            <div className="font-nunito text-[11px] text-[#ad1457] font-bold">⭐ Just Reviewed</div>
            <div className="font-nunito text-[13px] font-bold text-[#2d1a24] mt-0.5">&quot;Absolutely love it!&quot;</div>
            <div className="font-nunito text-[11px] text-[#ad1457]">— Priya M. ❤️</div>
          </div>
          <div className="absolute bottom-8 left-0 bg-white rounded-2xl px-4 py-3 shadow-lg shadow-[#e91e8c]/20 border border-[#fce4ec]">
            <div className="font-nunito text-xs text-[#6d1b3b] font-semibold">🔥 Selling Fast!</div>
            <div className="font-nunito text-[13px] font-extrabold text-[#e91e8c]">Rose Serum</div>
            <div className="font-nunito text-[11px] text-[#ad1457]">Only 8 left in stock</div>
          </div>
        </div>
      </div>
    </section>
  );
}
