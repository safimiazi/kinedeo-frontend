import StaticPageLayout from "@/components/StaticPageLayout";
import { TrendingUp, Gift, Users, BadgePercent, CheckCircle2 } from "lucide-react";

const STEPS = [
  { step: "1", title: "Apply", desc: "Fill in the form below with your name, social handle, and audience size." },
  { step: "2", title: "Get Approved", desc: "We review your application within 48 hours and send your unique affiliate link." },
  { step: "3", title: "Share & Earn", desc: "Promote KineDeo on your channels. You earn a commission on every sale through your link." },
  { step: "4", title: "Get Paid", desc: "Monthly payouts via bKash or bank transfer once your balance reaches ৳500." },
];

export default function AffiliatesPage() {
  return (
    <StaticPageLayout
      title="Affiliate Program"
      subtitle="Love KineDeo? Earn while you share. Join our affiliate family and get rewarded."
    >
      {/* Benefits */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {[
          { icon: BadgePercent, title: "Up to 10% Commission", desc: "Earn 5–10% on every sale made through your unique referral link. Higher commission for top performers." },
          { icon: Gift, title: "Free Products", desc: "Active affiliates receive free products to review and feature on their channels every month." },
          { icon: Users, title: "Exclusive Community", desc: "Join our private affiliate WhatsApp group for early access, tips, and brand news." },
          { icon: TrendingUp, title: "Real-Time Dashboard", desc: "Track your clicks, conversions, and earnings in real time (coming soon)." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl border border-pink-100 p-5 hover:border-[#e91e8c]/40 hover:shadow-sm transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#e91e8c]/20 to-pink-100 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-[#e91e8c]" />
            </div>
            <h3 className="font-playfair font-bold text-[#2d1a24] mb-1">{title}</h3>
            <p className="text-sm text-[#6d1b3b]/60 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 mb-8">
        <h2 className="font-playfair text-xl font-bold text-[#2d1a24] mb-5">How It Works</h2>
        <div className="space-y-4">
          {STEPS.map(({ step, title, desc }) => (
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
      </div>

      {/* Who qualifies */}
      <div className="bg-white rounded-2xl border border-pink-100 p-6 mb-8">
        <h2 className="font-playfair text-xl font-bold text-[#2d1a24] mb-4">Who Can Apply?</h2>
        <ul className="space-y-2">
          {[
            "Beauty bloggers, vloggers, or content creators",
            "Instagram / TikTok / YouTube influencers (any follower count welcome)",
            "Beauty shop owners or resellers",
            "Anyone with a genuine love for beauty and an audience",
          ].map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-[#6d1b3b]/70">
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Apply CTA */}
      <div className="bg-gradient-to-r from-[#e91e8c] to-[#c2185b] rounded-2xl p-8 text-white text-center">
        <p className="font-playfair text-2xl font-extrabold mb-2">Ready to Join?</p>
        <p className="text-white/75 text-sm mb-5">Send us a message and let&apos;s get started.</p>
        <a
          href="mailto:affiliates@kinedeo.com?subject=Affiliate Application"
          className="inline-block bg-white text-[#e91e8c] px-8 py-3 rounded-full font-bold text-sm hover:shadow-xl transition-all"
        >
          Apply via Email
        </a>
        <p className="text-white/50 text-xs mt-3">affiliates@kinedeo.com</p>
      </div>
    </StaticPageLayout>
  );
}
