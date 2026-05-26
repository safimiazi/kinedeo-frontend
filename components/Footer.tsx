export default function Footer() {
  const links: [string, string[]][] = [
    ["Shop", ["Skincare", "Makeup", "Fragrance", "Haircare", "Gift Sets"]],
    ["Help", ["Track Order", "Returns", "Size Guide", "FAQ", "Contact Us"]],
    ["Company", ["About Us", "Blog", "Careers", "Press", "Affiliates"]],
  ];

  return (
    <footer className="bg-[#2d1a24] pt-12 pb-6 px-[5%]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-10">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌸</span>
              <span className="font-playfair text-xl font-extrabold text-[#f48fb1]">Petal Beauty</span>
            </div>
            <p className="font-nunito text-[#f8bbd0] text-[13px] leading-relaxed">
              Luxury beauty for every woman. Cruelty-free, dermatologist tested, made with love.
            </p>
          </div>
          {links.map(([title, items]) => (
            <div key={title}>
              <div className="font-nunito text-[#f48fb1] font-bold text-[13px] tracking-wider uppercase mb-4">
                {title}
              </div>
              {items.map((l) => (
                <div key={l} className="font-nunito text-[#f8bbd0] text-[13px] mb-2.5 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                  {l}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between gap-3">
          <div className="font-nunito text-[#ad1457] text-xs">
            © 2024 Petal Beauty. All rights reserved.
          </div>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Cookies"].map((l) => (
              <span key={l} className="font-nunito text-[#ad1457] text-xs cursor-pointer hover:text-[#f48fb1] transition-colors">
                {l}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
