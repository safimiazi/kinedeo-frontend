import StaticPageLayout from "@/components/StaticPageLayout";

const SKINCARE_TABLE = [
  ["Travel / Mini", "15–30ml", "2–4 weeks"],
  ["Standard", "50–75ml", "2–3 months"],
  ["Full Size", "100–150ml", "3–6 months"],
  ["Value / Jumbo", "200ml+", "6–12 months"],
];

const FOUNDATION_TABLE = [
  ["Mini / Sample", "5–10ml", "Trial use"],
  ["Standard Bottle", "30ml", "2–3 months daily use"],
  ["Full Size", "40–50ml", "3–4 months daily use"],
];

export default function SizeGuidePage() {
  return (
    <StaticPageLayout
      title="Size Guide"
      subtitle="Not sure which size to pick? This guide helps you choose the right amount for your routine."
    >
      <div className="space-y-10">
        {/* Intro */}
        <div className="bg-gradient-to-r from-[#e91e8c]/10 to-pink-50 rounded-2xl p-6 border border-pink-100">
          <p className="text-sm text-[#6d1b3b]/80 leading-relaxed">
            Product sizes at KineDeo are measured in <strong>milliliters (ml)</strong> for liquids and <strong>grams (g)</strong> for solids.
            Use the tables below to estimate how long a product will last based on your usage frequency.
          </p>
        </div>

        {/* Skincare */}
        <section className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-pink-100 bg-pink-50/50">
            <h2 className="font-playfair text-lg font-bold text-[#2d1a24]">Skincare (Serums, Moisturisers, Toners)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pink-100">
                  {["Size Type", "Volume", "Approx. Duration"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-bold text-[#e91e8c] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {SKINCARE_TABLE.map(([type, vol, dur], i) => (
                  <tr key={type} className={i % 2 === 0 ? "bg-pink-50/30" : ""}>
                    <td className="px-6 py-3 font-semibold text-[#2d1a24]">{type}</td>
                    <td className="px-6 py-3 text-[#6d1b3b]/70">{vol}</td>
                    <td className="px-6 py-3 text-[#6d1b3b]/70">{dur}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Foundation / Base */}
        <section className="bg-white rounded-2xl border border-pink-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-pink-100 bg-pink-50/50">
            <h2 className="font-playfair text-lg font-bold text-[#2d1a24]">Foundation & Base Makeup</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-pink-100">
                  {["Size Type", "Volume", "Best For"].map((h) => (
                    <th key={h} className="px-6 py-3 text-left text-xs font-bold text-[#e91e8c] uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FOUNDATION_TABLE.map(([type, vol, best], i) => (
                  <tr key={type} className={i % 2 === 0 ? "bg-pink-50/30" : ""}>
                    <td className="px-6 py-3 font-semibold text-[#2d1a24]">{type}</td>
                    <td className="px-6 py-3 text-[#6d1b3b]/70">{vol}</td>
                    <td className="px-6 py-3 text-[#6d1b3b]/70">{best}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Tips */}
        <section className="bg-white rounded-2xl border border-pink-100 p-6">
          <h2 className="font-playfair text-xl font-bold text-[#2d1a24] mb-4">💡 Tips for Choosing the Right Size</h2>
          <ul className="space-y-3">
            {[
              "First time trying a product? Go for the Travel or Mini size to test it before committing.",
              "If it's already a favourite, the Full Size or Value pack offers better value for money.",
              "For gift sets, Standard sizes are ideal — thoughtful without being overwhelming.",
              "Serums and actives are highly concentrated — a little goes a long way even in a 30ml bottle.",
            ].map((tip) => (
              <li key={tip} className="flex items-start gap-3 text-sm text-[#6d1b3b]/70">
                <span className="w-5 h-5 rounded-full bg-[#e91e8c]/10 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e91e8c]" />
                </span>
                {tip}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </StaticPageLayout>
  );
}
