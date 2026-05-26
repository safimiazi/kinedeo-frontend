"use client";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge: string;
  emoji: string;
  desc: string;
}

interface ProductsSectionProps {
  products: Product[];
  categories: string[];
  activeCategory: string;
  setActiveCategory: (c: string) => void;
  wishlist: number[];
  toggleWishlist: (id: number) => void;
  addToCart: (p: Product) => void;
}

export default function ProductsSection({
  products,
  categories,
  activeCategory,
  setActiveCategory,
  wishlist,
  toggleWishlist,
  addToCart,
}: ProductsSectionProps) {
  const filtered = activeCategory === "All" ? products : products.filter((p) => p.category === activeCategory);

  return (
    <section className="py-16 px-[5%] bg-[#fff0f5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="font-nunito text-[13px] font-bold text-[#e91e8c] tracking-widest uppercase mb-2.5">
            Our Products
          </div>
          <h2 className="font-playfair text-3xl md:text-[40px] font-extrabold text-[#2d1a24] mb-4">
            Shop by Category
          </h2>
          <p className="font-nunito text-[#6d1b3b] text-base max-w-[520px] mx-auto">
            Handpicked bestsellers loved by thousands of customers across India
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2.5 justify-center mb-10 flex-wrap">
          {categories.map((c) => (
            <button
              key={c}
              className={`font-nunito font-bold text-[13px] px-5 py-2 rounded-full cursor-pointer transition-all border-2 tracking-wide ${
                activeCategory === c
                  ? "bg-[#e91e8c] text-white border-[#e91e8c]"
                  : "bg-white text-[#ad1457] border-[#fce4ec] hover:border-[#e91e8c] hover:text-[#e91e8c]"
              }`}
              onClick={() => setActiveCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((p) => {
            const discount = Math.round((1 - p.price / p.originalPrice) * 100);
            const inWishlist = wishlist.includes(p.id);
            return (
              <div key={p.id} className="bg-white rounded-2xl overflow-hidden border border-[#fce4ec] hover:-translate-y-1.5 hover:shadow-xl hover:shadow-[#e91e8c]/15 hover:border-[#e91e8c] transition-all cursor-pointer">
                {/* Product Image */}
                <div className="bg-linear-to-br from-[#fce4ec] to-[#f8bbd0] h-50 flex items-center justify-center relative p-5">
                  <span className="text-7xl">{p.emoji}</span>
                  <div className="absolute top-3 left-3">
                    <span className="font-nunito text-[11px] font-extrabold px-2.5 py-1 rounded-full tracking-wider uppercase bg-[#e91e8c] text-white">
                      {p.badge}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <button
                      className="bg-transparent border-none cursor-pointer text-xl leading-none p-1 hover:scale-125 transition-transform"
                      onClick={() => toggleWishlist(p.id)}
                      aria-label="Wishlist"
                    >
                      {inWishlist ? "❤️" : "🤍"}
                    </button>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-[#c2185b] text-white rounded-lg px-2 py-0.5">
                    <span className="font-nunito text-[11px] font-extrabold">-{discount}%</span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 pt-5 pb-4.5">
                  <div className="font-nunito text-[11px] text-[#e91e8c] font-bold tracking-wider uppercase mb-1">
                    {p.category}
                  </div>
                  <div className="font-playfair text-[17px] font-bold text-[#2d1a24] mb-1.5">
                    {p.name}
                  </div>
                  <div className="font-nunito text-xs text-[#6d1b3b] mb-3 leading-relaxed">
                    {p.desc}
                  </div>
                  <div className="flex items-center gap-1.5 mb-3.5">
                    <span className="text-[#ff9800] text-[13px]">{"★".repeat(Math.floor(p.rating))}</span>
                    <span className="font-nunito text-xs font-bold text-[#2d1a24]">{p.rating}</span>
                    <span className="font-nunito text-[11px] text-[#ad1457]">({p.reviews.toLocaleString()})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-playfair text-xl font-extrabold text-[#e91e8c]">₹{p.price.toLocaleString()}</span>
                      <span className="font-nunito text-[13px] text-[#ad1457] line-through ml-2">₹{p.originalPrice.toLocaleString()}</span>
                    </div>
                    <button
                      className="bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white border-none px-4 py-2 rounded-full cursor-pointer font-nunito font-bold text-[13px] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all"
                      onClick={() => addToCart(p)}
                    >
                      Add +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button className="bg-transparent border-2 border-[#e91e8c] text-[#e91e8c] px-10 py-3.5 rounded-full cursor-pointer font-nunito font-bold text-[15px] hover:bg-[#e91e8c] hover:text-white transition-all">
            View All Products →
          </button>
        </div>
      </div>
    </section>
  );
}
