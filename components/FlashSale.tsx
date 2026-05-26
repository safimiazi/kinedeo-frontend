"use client";

interface FlashSaleProps {
  timeLeft: { h: number; m: number; s: number };
}

export default function FlashSale({ timeLeft }: FlashSaleProps) {
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="bg-linear-to-br from-[#c2185b] via-[#e91e8c] to-[#ad1457] py-9 px-[5%]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 flex-wrap">
        <div>
          <div className="font-nunito text-white/80 text-[13px] font-bold tracking-widest uppercase mb-1.5">
            ⚡ Flash Sale
          </div>
          <div className="font-playfair text-white text-2xl md:text-[28px] font-extrabold">
            Upto 50% OFF — Today Only!
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="font-nunito text-white/80 text-[13px] font-semibold mr-1">Ends in:</div>
          {[["h", timeLeft.h], ["m", timeLeft.m], ["s", timeLeft.s]].map(([lbl, val]) => (
            <div key={lbl as string} className="bg-white rounded-xl px-5 py-3.5 min-w-16 text-center shadow-md shadow-[#e91e8c]/10">
              <div className="font-playfair text-[26px] font-extrabold text-[#e91e8c] leading-none">
                {pad(val as number)}
              </div>
              <div className="font-nunito text-[10px] text-[#ad1457] font-bold uppercase tracking-wider mt-0.5">
                {lbl as string}
              </div>
            </div>
          ))}
        </div>
        <button className="bg-white text-[#e91e8c] border-none px-7 py-3 rounded-full cursor-pointer font-nunito font-bold text-[15px] tracking-wide hover:-translate-y-0.5 hover:shadow-lg transition-all">
          Grab Deals →
        </button>
      </div>
    </section>
  );
}
