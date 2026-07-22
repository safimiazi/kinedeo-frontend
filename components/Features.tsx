/**
 * Features — Server Component
 *
 * Pure static content — no hooks, no state, no browser APIs.
 * Renders on the server → zero JS sent to the client for this section.
 */

import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Lock,
  Gift,
  CheckCircle,
  Sparkles,
} from 'lucide-react';

const features = [
  { icon: Truck, title: 'Free Delivery', desc: 'On orders above ৳999' },
  { icon: ShieldCheck, title: '100% Authentic', desc: 'Dermatologist tested' },
  { icon: RotateCcw, title: 'Easy Returns', desc: '7-day hassle-free returns' },
  { icon: Lock, title: 'Secure Payment', desc: '256-bit SSL encrypted' },
  { icon: Gift, title: 'Gift Wrapping', desc: 'Free on every order' },
];

export default function Features() {
  return (
    <section className="relative py-16 md:block hidden bg-linear-to-b from-[#fff8fa] to-white overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none" aria-hidden>
        <div className="absolute top-20 left-10 w-40 h-40 bg-linear-to-r from-pink-200/20 to-rose-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-linear-to-l from-purple-200/10 to-pink-200/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-linear-to-r from-[#e91e8c]/10 to-[#c2185b]/10 rounded-full px-4 py-1.5 mb-4">
            <Sparkles className="w-4 h-4 text-[#e91e8c]" />
            <span className="font-nunito text-xs font-bold text-[#c2185b] tracking-wider uppercase">
              Why Choose Us
            </span>
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl font-extrabold text-[#2d1a24]">
            What Makes Us{' '}
            <span className="bg-linear-to-r from-[#e91e8c] to-[#c2185b] bg-clip-text text-transparent">
              Different
            </span>
          </h2>
          <p className="font-nunito text-sm text-[#6d1b3b]/60 mt-2 max-w-md mx-auto">
            Experience the Kine Deo difference with every purchase
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 relative z-10">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative bg-white rounded-2xl px-4 py-6 sm:px-6 sm:py-7 border border-[#fce4ec] text-center hover:-translate-y-2 hover:shadow-xl hover:shadow-[#e91e8c]/15 transition-all duration-300 overflow-hidden flex flex-col items-center justify-center min-h-[160px]"
            >
              {/* Background Gradient on Hover */}
              <div className="absolute inset-0 bg-linear-to-br from-pink-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="relative mb-4">
                <div className="w-14 h-14 mx-auto rounded-xl bg-linear-to-br from-pink-100 to-rose-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-[#e91e8c] group-hover:text-[#c2185b] transition-colors" />
                </div>
                <div className="absolute inset-0 w-14 h-14 mx-auto rounded-xl border-2 border-[#e91e8c]/20 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" />
              </div>

              <div className="font-playfair text-[15px] font-bold text-[#2d1a24] mb-1.5 group-hover:text-[#e91e8c] transition-colors">
                {feature.title}
              </div>
              <div className="font-nunito text-xs text-[#ad1457] font-medium group-hover:text-[#6d1b3b] transition-colors">
                {feature.desc}
              </div>

              <div className="absolute -bottom-8 -right-8 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <CheckCircle className="w-12 h-12 text-[#e91e8c]/10" />
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-2 shadow-md border border-pink-100">
            <ShieldCheck className="w-4 h-4 text-green-500" />
            <span className="font-nunito text-xs text-[#6d1b3b]">
              Trusted by 5,000+ happy customers
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
