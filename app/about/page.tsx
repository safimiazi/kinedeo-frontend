import Link from "next/link";
import { Flower2, Heart, Shield, Leaf, Star } from "lucide-react";
import StaticPageLayout from "@/components/StaticPageLayout";

const VALUES = [
  { icon: Heart, title: "Made with Love", desc: "Every product is crafted with care, keeping real women and their skin in mind." },
  { icon: Shield, title: "Cruelty-Free", desc: "We never test on animals. Full stop. Every KineDeo product is 100% cruelty-free." },
  { icon: Leaf, title: "Clean Ingredients", desc: "No parabens, no sulfates, no nasties. Just honest, effective beauty formulas." },
  { icon: Star, title: "Dermatologist Tested", desc: "Formulated and tested by dermatologists for all skin types, including sensitive skin." },
];

export default function AboutPage() {
  return (
    <StaticPageLayout title="About KineDeo" subtitle="Luxury beauty, made for every woman in Bangladesh.">
      {/* Hero story */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e91e8c] to-[#c2185b] flex items-center justify-center">
            <Flower2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-playfair text-2xl font-extrabold text-[#2d1a24]">Our Story</h2>
            <p className="text-xs text-[#6d1b3b]/50">Founded with a dream, built with passion</p>
          </div>
        </div>
        <div className="space-y-4 text-sm text-[#6d1b3b]/80 leading-relaxed">
          <p>
            KineDeo was born from a simple belief — that every woman in Bangladesh deserves access to
            premium beauty products that actually work, without breaking the bank or compromising on values.
          </p>
          <p>
            We started as a small team with big dreams, curating the finest cruelty-free beauty formulations
            and bringing them directly to your doorstep. Today, KineDeo is more than a brand — it&apos;s a
            community of beauty lovers who believe in looking good and feeling confident.
          </p>
          <p>
            Our products are dermatologist-tested, made with clean ingredients, and designed for the modern
            Bangladeshi woman — whether you&apos;re heading to work, a wedding, or just having a self-care Sunday.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-8">
        <h2 className="font-playfair text-2xl font-bold text-[#2d1a24] mb-5 text-center">What We Stand For</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl border border-pink-100 p-5 hover:border-[#e91e8c]/40 hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e8c]/20 to-pink-100 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-[#e91e8c]" />
              </div>
              <h3 className="font-playfair font-bold text-[#2d1a24] mb-1">{title}</h3>
              <p className="text-sm text-[#6d1b3b]/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mission */}
      <div className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] rounded-2xl p-8 text-white text-center mb-8">
        <p className="font-nunito text-xs font-bold tracking-widest uppercase mb-3 opacity-80">Our Mission</p>
        <p className="font-playfair text-2xl font-extrabold leading-snug max-w-xl mx-auto">
          &ldquo;To make premium, ethical beauty accessible to every woman in Bangladesh.&rdquo;
        </p>
      </div>

      {/* CTA */}
      <div className="text-center">
        <Link
          href="/products"
          className="inline-block bg-gradient-to-r from-[#e91e8c] to-[#c2185b] text-white px-10 py-3.5 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all"
        >
          Shop the Collection
        </Link>
      </div>
    </StaticPageLayout>
  );
}
