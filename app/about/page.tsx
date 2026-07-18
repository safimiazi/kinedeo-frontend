import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Flower2, Heart, Shield, Leaf, Star, Target, Package, Zap, Code2 } from "lucide-react";
import StaticPageLayout from "@/components/StaticPageLayout";

export const metadata: Metadata = {
  title: "About KineDeo | Our Story & Mission",
  description:
    "KineDeo is Bangladesh's emerging e-commerce platform for genuine products. Founded by Shafi Miazi with a vision to become the top e-commerce platform by 2030.",
};

const VALUES = [
  {
    icon: Heart,
    title: "100% Genuine Products",
    desc: "Every product on KineDeo is verified authentic. We have zero tolerance for counterfeit goods — what you see is exactly what you get.",
  },
  {
    icon: Shield,
    title: "Buyer Protection",
    desc: "Shop with confidence. Every order is covered by our buyer protection policy — if something's wrong, we make it right.",
  },
  {
    icon: Leaf,
    title: "All Categories",
    desc: "From beauty & skincare to electronics, fashion, health, home goods, and more — every category, one trusted platform.",
  },
  {
    icon: Star,
    title: "Customer First",
    desc: "We obsess over the customer experience. Fast delivery, easy returns, and real human support — always.",
  },
];

export default function AboutPage() {
  return (
    <StaticPageLayout
      title="About KineDeo"
      subtitle="Bangladesh's platform for genuine products — built for everyone."
    >
      {/* Vision 2030 Banner */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#e91e8c]/20 to-pink-100 flex items-center justify-center">
            <Target className="w-4 h-4 text-[#e91e8c]" />
          </div>
          <span className="font-nunito text-xs font-extrabold tracking-widest uppercase text-[#e91e8c]">
            Vision 2030
          </span>
        </div>
        <p className="font-playfair text-2xl sm:text-3xl font-extrabold text-[#2d1a24] leading-snug mb-3">
          Bangladesh&apos;s #1 E-Commerce Platform by 2030
        </p>
        <p className="text-sm text-[#6d1b3b]/70 leading-relaxed max-w-2xl">
          We&apos;re building more than a store. KineDeo is on a mission to become the most trusted
          online shopping destination in Bangladesh — where every product is genuine, every price is
          fair, and every customer is protected.
        </p>
      </div>

      {/* Our Story */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#e91e8c] to-[#c2185b] flex items-center justify-center">
            <Flower2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-playfair text-2xl font-extrabold text-[#2d1a24]">Our Story</h2>
            <p className="text-xs text-[#6d1b3b]/50">Founded with purpose, built with precision</p>
          </div>
        </div>
        <div className="space-y-4 text-sm text-[#6d1b3b]/80 leading-relaxed">
          <p>
            KineDeo was born from a straightforward frustration — Bangladesh deserves a trustworthy
            online marketplace. A place where customers don&apos;t have to worry about receiving fake
            products, inflated prices, or disappearing sellers.
          </p>
          <p>
            We started with beauty and skincare — a category plagued by counterfeits — and built
            strict authenticity verification into every product listing from day one. As we grew,
            so did our vision: to create a single platform where every category of genuine product
            is available, delivered reliably, and backed by real support.
          </p>
          <p>
            Today, KineDeo serves customers across Bangladesh, and we&apos;re just getting started.
            By 2030, we intend to be the platform Bangladeshis trust most for online shopping —
            across every category, every budget, every corner of the country.
          </p>
        </div>
      </div>

      {/* What Makes Us Different */}
      <div className="mb-8">
        <h2 className="font-playfair text-2xl font-bold text-[#2d1a24] mb-2 text-center">
          What Makes Us Different
        </h2>
        <p className="text-center text-sm text-[#6d1b3b]/60 mb-6">
          We&apos;re not just another marketplace — we&apos;re building trust.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="bg-white rounded-2xl border border-pink-100 p-5 hover:border-[#e91e8c]/40 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#e91e8c]/20 to-pink-100 flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-[#e91e8c]" />
              </div>
              <h3 className="font-playfair font-bold text-[#2d1a24] mb-1">{title}</h3>
              <p className="text-sm text-[#6d1b3b]/60 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Product Categories */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 sm:p-8 mb-8 shadow-sm">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#e91e8c]/20 to-pink-100 flex items-center justify-center">
            <Package className="w-5 h-5 text-[#e91e8c]" />
          </div>
          <h2 className="font-playfair text-xl font-extrabold text-[#2d1a24]">
            Everything in One Place
          </h2>
        </div>
        <p className="text-sm text-[#6d1b3b]/70 mb-4 leading-relaxed">
          KineDeo carries — or will carry — genuine products from every major category:
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            "Beauty & Skincare",
            "Health & Wellness",
            "Fashion & Apparel",
            "Electronics",
            "Home & Living",
            "Food & Grocery",
            "Sports & Fitness",
            "Baby & Kids",
            "Books & Stationery",
          ].map((cat) => (
            <div
              key={cat}
              className="flex items-center gap-2 bg-pink-50 rounded-xl px-3 py-2.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#e91e8c] shrink-0" />
              <span className="text-xs font-semibold text-[#2d1a24]">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Founder Section */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 sm:p-8 mb-8 shadow-sm">
        {/* Section label */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#e91e8c]/20 to-pink-100 flex items-center justify-center">
            <Code2 className="w-5 h-5 text-[#e91e8c]" />
          </div>
          <div>
            <h2 className="font-playfair text-xl font-extrabold text-[#2d1a24]">The Visionary Core</h2>
            <p className="text-xs text-[#6d1b3b]/50">The person behind KineDeo</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
          {/* Photo */}
          <div className="shrink-0 flex flex-col items-center gap-3">
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden border-2 border-pink-100 shadow-md shadow-[#e91e8c]/10">
              <Image
                src="/founder-image.webp"
                alt="Shafi Miazi — Founder & Software Engineer, KineDeo"
                fill
                sizes="144px"
                className="object-cover object-top"
                priority
              />
            </div>
            <div className="text-center">
              <p className="font-playfair text-base font-extrabold text-[#2d1a24]">Shafi Miazi</p>
              <p className="text-[11px] font-bold text-[#e91e8c] tracking-wide uppercase">
                Founder &amp; Software Engineer
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="flex-1">
            <div className="space-y-3 text-sm text-[#6d1b3b]/80 leading-relaxed">
              <p>
                KineDeo was founded by <strong className="text-[#2d1a24]">Shafi Miazi</strong>, a
                Computer Science engineer with a passion for building systems that solve real
                problems. What began as a focused effort to bring genuine beauty products to
                Bangladeshi customers has evolved into a much larger ambition.
              </p>
              <p>
                Shafi engineered KineDeo&apos;s platform from the ground up — designing the
                architecture, authentication systems, product catalogue, order management, and
                delivery integrations that power every transaction. His belief is simple:
                technology should make commerce more trustworthy, not less.
              </p>
              <p>
                The goal for 2030 is clear — make KineDeo the platform Bangladeshis reach for
                first when they want to buy anything online, knowing every product is real, every
                price is honest, and every order is protected.
              </p>
            </div>

            {/* Stats row */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[
                { value: "2024", label: "Founded" },
                { value: "2030", label: "Target" },
                { value: "#1", label: "Goal" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="bg-pink-50 border border-pink-100 rounded-xl px-3 py-3 text-center"
                >
                  <p className="font-playfair text-xl font-extrabold text-[#e91e8c]">{s.value}</p>
                  <p className="text-[10px] text-[#6d1b3b]/50 font-semibold uppercase tracking-wider mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tech callout */}
        <div className="mt-6 bg-[#fff0f5] border border-pink-100 rounded-xl px-4 py-3 flex items-start gap-3">
          <Zap className="w-4 h-4 text-[#e91e8c] mt-0.5 shrink-0" />
          <p className="text-xs text-[#6d1b3b]/70 leading-relaxed">
            <strong className="text-[#2d1a24]">Built with modern technology</strong> — KineDeo
            runs on a high-performance stack designed for scale, with real-time inventory,
            secure payments, and intelligent delivery routing built in from day one.
          </p>
        </div>
      </div>

      {/* Mission Statement */}
      <div className="bg-linear-to-r from-[#e91e8c] to-[#c2185b] rounded-2xl p-8 text-white text-center mb-8">
        <p className="font-nunito text-xs font-bold tracking-widest uppercase mb-3 opacity-80">
          Our Mission
        </p>
        <p className="font-playfair text-2xl font-extrabold leading-snug max-w-2xl mx-auto">
          &ldquo;To build Bangladesh&apos;s most trusted e-commerce platform — where every product is
          genuine, every customer is protected, and online shopping just works.&rdquo;
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/products"
          className="inline-block bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white px-10 py-3.5 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all text-center"
        >
          Shop Now
        </Link>
        <Link
          href="/contact"
          className="inline-block border-2 border-[#e91e8c] text-[#e91e8c] px-10 py-3.5 rounded-full font-semibold text-sm hover:bg-[#e91e8c] hover:text-white transition-all text-center"
        >
          Contact Us
        </Link>
      </div>
    </StaticPageLayout>
  );
}
