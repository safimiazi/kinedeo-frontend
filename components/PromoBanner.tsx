export default function PromoBanner() {
  return (
    <section className="bg-linear-to-br from-[#2d1a24] to-[#6d1b3b] py-20 px-[5%]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 flex-wrap">
        <div>
          <div className="font-nunito text-[#f48fb1] text-[13px] font-bold tracking-widest uppercase mb-3">
            ✨ Limited Edition
          </div>
          <h2 className="font-playfair text-3xl md:text-[42px] font-extrabold text-white leading-tight mb-4">
            The Rosé Luxe<br />Gift Set 🎀
          </h2>
          <p className="font-nunito text-[#f8bbd0] text-base max-w-[420px] leading-relaxed mb-7">
            The perfect gift — 6 bestselling products beautifully curated in a rose gold box. Limited stock!
          </p>
          <div className="flex gap-4 items-center flex-wrap">
            <button className="bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white border-none px-8 py-3.5 rounded-full cursor-pointer font-nunito font-bold text-base tracking-wide hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all">
              Shop Gift Set
            </button>
            <div>
              <span className="font-playfair text-[26px] font-extrabold text-[#f48fb1]">৳3,499</span>
              <span className="font-nunito text-sm text-[#ad1457] line-through ml-2">৳5,999</span>
            </div>
          </div>
        </div>
        <div className="text-[120px] drop-shadow-[0_16px_48px_rgba(233,30,140,0.4)] animate-float">
          🎀
        </div>
      </div>
    </section>
  );
}
