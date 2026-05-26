export default function Features() {
  const features = [
    ["🚚", "Free Delivery", "On orders above ₹999"],
    ["💯", "100% Authentic", "Dermatologist tested"],
    ["↩️", "Easy Returns", "7-day hassle-free returns"],
    ["🔒", "Secure Payment", "256-bit SSL encrypted"],
    ["🎁", "Gift Wrapping", "Free on every order"],
  ];

  return (
    <section className="py-16 px-[5%] bg-[#fff8fa]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {features.map(([icon, title, desc]) => (
          <div key={title} className="bg-white rounded-2xl px-6 py-7 border border-[#fce4ec] text-center hover:-translate-y-1 hover:shadow-lg hover:shadow-[#e91e8c]/10 transition-all">
            <div className="text-[32px] mb-3">{icon}</div>
            <div className="font-playfair text-[15px] font-bold text-[#2d1a24] mb-1.5">{title}</div>
            <div className="font-nunito text-xs text-[#ad1457] font-medium">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
