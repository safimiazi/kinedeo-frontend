const testimonials = [
  { name: "Riya S.", text: "The rose serum completely transformed my skin in 2 weeks! My friends keep asking what I'm using.", stars: 5, location: "Mumbai" },
  { name: "Priya M.", text: "Best makeup brand I've ever tried. The lip kit lasts all day without drying my lips!", stars: 5, location: "Delhi" },
  { name: "Anika T.", text: "Packaging is gorgeous, products are incredible. Worth every rupee. Will buy again!", stars: 5, location: "Kolkata" },
];

export default function Testimonials() {
  return (
    <section className="py-20 px-[5%] bg-[#fff8fa]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="font-nunito text-[13px] font-bold text-[#e91e8c] tracking-widest uppercase mb-2.5">
            Reviews
          </div>
          <h2 className="font-playfair text-3xl md:text-[38px] font-extrabold text-[#2d1a24]">
            Loved by Thousands 💕
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="bg-white rounded-2xl p-7 border border-[#fce4ec]">
              <div className="text-xl mb-3.5 text-[#ff9800]">{"★".repeat(t.stars)}</div>
              <p className="font-nunito text-[15px] text-[#2d1a24] leading-relaxed italic mb-5">
                &quot;{t.text}&quot;
              </p>
              <div className="flex items-center gap-3 border-t border-[#fce4ec] pt-4">
                <div className="w-11 h-11 bg-linear-to-br from-[#f48fb1] to-[#e91e8c] rounded-full flex items-center justify-center">
                  <span className="font-playfair text-white font-extrabold text-[15px]">{t.name[0]}</span>
                </div>
                <div>
                  <div className="font-nunito font-bold text-[#2d1a24] text-sm">{t.name}</div>
                  <div className="font-nunito text-xs text-[#ad1457]">📍 {t.location}</div>
                </div>
                <div className="ml-auto">
                  <span className="font-nunito text-[11px] font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase bg-[#fce4ec] text-[#c2185b]">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
