import Link from "next/link";
import { RefreshCcw, CheckCircle2, XCircle, Clock, Package, Mail } from "lucide-react";
import StaticPageLayout from "@/components/StaticPageLayout";

export default function ReturnsPage() {
  return (
    <StaticPageLayout
      title="Returns & Refunds"
      subtitle="We want you to love every KineDeo product. If something isn't right, we'll make it right."
    >
      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { icon: Clock, label: "Return Window", value: "7 Days" },
          { icon: RefreshCcw, label: "Refund Time", value: "5–7 Days" },
          { icon: Package, label: "Condition", value: "Unopened" },
          { icon: CheckCircle2, label: "Process", value: "Easy & Fast" },
        ].map(({ icon: Icon, label, value }) => (
          <div key={label} className="bg-white rounded-2xl border border-pink-100 p-4 text-center">
            <Icon className="w-6 h-6 text-[#e91e8c] mx-auto mb-2" />
            <p className="text-lg font-playfair font-extrabold text-[#2d1a24]">{value}</p>
            <p className="text-[11px] text-[#6d1b3b]/50 font-semibold mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-8">
        {/* Eligible */}
        <section className="bg-white rounded-2xl border border-pink-100 p-6">
          <h2 className="font-playfair text-xl font-bold text-[#2d1a24] mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" /> Eligible for Return
          </h2>
          <ul className="space-y-2">
            {[
              "Unused, unopened products in original packaging",
              "Item received damaged or defective",
              "Wrong item delivered",
              "Return requested within 7 days of delivery",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#6d1b3b]/80">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Not eligible */}
        <section className="bg-white rounded-2xl border border-pink-100 p-6">
          <h2 className="font-playfair text-xl font-bold text-[#2d1a24] mb-4 flex items-center gap-2">
            <XCircle className="w-5 h-5 text-red-400" /> Not Eligible for Return
          </h2>
          <ul className="space-y-2">
            {[
              "Opened or used skincare / makeup products (hygiene reasons)",
              "Products without original packaging",
              "Items returned after 7 days of delivery",
              "Sale or discounted items (unless defective)",
              "Gift sets that have been opened",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-[#6d1b3b]/80">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Steps */}
        <section className="bg-white rounded-2xl border border-pink-100 p-6">
          <h2 className="font-playfair text-xl font-bold text-[#2d1a24] mb-5">How to Return</h2>
          <div className="space-y-4">
            {[
              { step: "1", title: "Contact Us", desc: "Email hello@kinedeo.com with your Order ID and reason for return within 7 days of delivery." },
              { step: "2", title: "Get Approval", desc: "Our team will review your request and send a return approval within 24 hours." },
              { step: "3", title: "Ship It Back", desc: "Pack the item securely in its original packaging and send it to our address. Shipping cost for returns is covered by us for defective items." },
              { step: "4", title: "Receive Refund", desc: "Once received and inspected, your refund will be processed within 5–7 business days." },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e91e8c] to-[#c2185b] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {step}
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#2d1a24]">{title}</p>
                  <p className="text-sm text-[#6d1b3b]/60 mt-0.5 leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-[#e91e8c]/10 to-pink-50 rounded-2xl p-6 text-center border border-pink-100">
          <Mail className="w-8 h-8 text-[#e91e8c] mx-auto mb-3" />
          <p className="font-playfair text-lg font-bold text-[#2d1a24] mb-1">Need to start a return?</p>
          <p className="text-sm text-[#6d1b3b]/60 mb-4">Reach out and we&apos;ll take care of everything.</p>
          <Link
            href="/contact"
            className="inline-block bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-8 py-3 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </StaticPageLayout>
  );
}
