"use client";

const categories = [
  { id: 1, name: "Skincare", products: 28, icon: "🧴", color: "from-pink-100 to-rose-100", revenue: "₹8,45,000" },
  { id: 2, name: "Makeup", products: 34, icon: "💄", color: "from-purple-100 to-pink-100", revenue: "₹6,72,000" },
  { id: 3, name: "Fragrance", products: 12, icon: "🌸", color: "from-rose-100 to-orange-100", revenue: "₹4,89,000" },
  { id: 4, name: "Haircare", products: 8, icon: "💆‍♀️", color: "from-blue-100 to-purple-100", revenue: "₹2,34,000" },
  { id: 5, name: "Body Care", products: 4, icon: "🛁", color: "from-green-100 to-teal-100", revenue: "₹1,12,000" },
];

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2d1a24] font-playfair">Categories</h1>
          <p className="text-sm text-[#6d1b3b]/60 mt-1">Organize your products into categories</p>
        </div>
        <button className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-pink-200 transition-all w-fit">
          + Add Category
        </button>
      </div>

      {/* Categories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-pink-100 p-6 hover:shadow-md hover:shadow-pink-100/50 transition-all group"
          >
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-2xl mb-4`}>
              {cat.icon}
            </div>
            <h3 className="text-lg font-bold text-[#2d1a24] mb-1">{cat.name}</h3>
            <p className="text-sm text-[#6d1b3b]/50 mb-4">{cat.products} products</p>
            <div className="flex items-center justify-between pt-4 border-t border-pink-50">
              <span className="text-sm font-semibold text-[#ad1457]">{cat.revenue}</span>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-xs text-[#e91e8c] font-semibold hover:text-[#ad1457]">Edit</button>
                <button className="text-xs text-red-400 font-semibold hover:text-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
