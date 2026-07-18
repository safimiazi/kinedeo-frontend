import StaticPageLayout from "@/components/StaticPageLayout";
import { Download, Mail } from "lucide-react";

const MENTIONS = [
  { outlet: "The Daily Star", title: "KineDeo is redefining clean beauty in Bangladesh", date: "Jan 2025", tag: "Feature" },
  { outlet: "Prothom Alo", title: "দেশীয় সৌন্দর্য ব্র্যান্ড KineDeo-র যাত্রা", date: "Dec 2024", tag: "Interview" },
  { outlet: "Dhaka Tribune", title: "Cruelty-free beauty startups on the rise", date: "Nov 2024", tag: "Industry" },
  { outlet: "The Business Standard", title: "E-commerce beauty brands see record growth in 2024", date: "Oct 2024", tag: "Report" },
];

const KIT_ITEMS = [
  "High-resolution brand logos (PNG + SVG)",
  "Product photography (web & print ready)",
  "Brand colour palette and typography guide",
  "Founder bio and company background",
  "Press release archive",
];

export default function PressPage() {
  return (
    <StaticPageLayout
      title="Press & Media"
      subtitle="KineDeo in the news. For press inquiries, download our media kit or reach out directly."
    >
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Founded", value: "2023" },
          { label: "Products", value: "50+" },
          { label: "Happy Customers", value: "10,000+" },
          { label: "Orders Delivered", value: "25,000+" },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-pink-100 p-4 text-center">
            <p className="font-playfair text-2xl font-extrabold text-[#e91e8c]">{value}</p>
            <p className="text-xs text-[#6d1b3b]/50 font-semibold mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Press mentions */}
      <div className="mb-10">
        <h2 className="font-playfair text-2xl font-bold text-[#2d1a24] mb-5">As Featured In</h2>
        <div className="space-y-3">
          {MENTIONS.map((item) => (
            <div key={item.title} className="bg-white rounded-2xl border border-pink-100 p-5 flex items-start justify-between gap-4 hover:border-[#e91e8c]/30 transition-colors">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-sm text-[#2d1a24]">{item.outlet}</span>
                  <span className="text-[11px] font-bold text-[#e91e8c] bg-[#fce4ec] px-2 py-0.5 rounded-full">{item.tag}</span>
                </div>
                <p className="text-sm text-[#6d1b3b]/70 leading-relaxed">{item.title}</p>
              </div>
              <span className="text-xs text-[#6d1b3b]/40 shrink-0">{item.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Media kit */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-[#e91e8c]/20 to-pink-100 flex items-center justify-center shrink-0">
            <Download className="w-6 h-6 text-[#e91e8c]" />
          </div>
          <div className="flex-1">
            <h2 className="font-playfair text-xl font-bold text-[#2d1a24] mb-1">Media Kit</h2>
            <p className="text-sm text-[#6d1b3b]/60 mb-4">Everything you need to cover or feature KineDeo.</p>
            <ul className="space-y-1.5 mb-5">
              {KIT_ITEMS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-[#6d1b3b]/70">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#e91e8c]" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href="mailto:press@kinedeo.com?subject=Media Kit Request"
              className="inline-flex items-center gap-2 bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all"
            >
              <Download className="w-4 h-4" /> Request Media Kit
            </a>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="bg-linear-to-r from-[#e91e8c]/10 to-pink-50 rounded-2xl p-6 text-center border border-pink-100">
        <Mail className="w-8 h-8 text-[#e91e8c] mx-auto mb-3" />
        <p className="font-playfair text-lg font-bold text-[#2d1a24] mb-1">Press Inquiries</p>
        <p className="text-sm text-[#6d1b3b]/60 mb-3">For interviews, features, or brand partnerships:</p>
        <a href="mailto:press@kinedeo.com" className="text-[#e91e8c] font-semibold hover:underline text-sm">
          press@kinedeo.com
        </a>
      </div>
    </StaticPageLayout>
  );
}
