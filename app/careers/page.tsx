import StaticPageLayout from "@/components/StaticPageLayout";
import { Heart, Zap, Users, Briefcase, Mail } from "lucide-react";

export default function CareersPage() {
  return (
    <StaticPageLayout
      title="Careers at KineDeo"
      subtitle="Join our team and help redefine beauty in Bangladesh."
    >
      {/* Culture */}
      <div className="grid sm:grid-cols-2 gap-4 mb-10">
        {[
          { icon: Heart, title: "Passion-Driven", desc: "We love what we do and it shows in every product, every post, and every customer interaction." },
          { icon: Zap, title: "Fast-Growing", desc: "KineDeo is scaling quickly. Join early and grow with us — your impact will be real and visible." },
          { icon: Users, title: "Inclusive Team", desc: "Diverse backgrounds, fresh perspectives. Everyone's voice matters here." },
          { icon: Briefcase, title: "Flexible Work", desc: "We believe in work that fits your life. Remote-friendly, outcome-focused culture." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="bg-white rounded-2xl border border-pink-100 p-5">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#e91e8c]/20 to-pink-100 flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-[#e91e8c]" />
            </div>
            <h3 className="font-playfair font-bold text-[#2d1a24] mb-1">{title}</h3>
            <p className="text-sm text-[#6d1b3b]/60 leading-relaxed">{desc}</p>
          </div>
        ))}
      </div>

      {/* No openings */}
      <div className="bg-white rounded-2xl border border-pink-100 p-8 text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-[#e91e8c]/20 to-pink-100 flex items-center justify-center mx-auto mb-4">
          <Briefcase className="w-7 h-7 text-[#e91e8c]" />
        </div>
        <h2 className="font-playfair text-xl font-bold text-[#2d1a24] mb-2">No Open Positions Right Now</h2>
        <p className="text-sm text-[#6d1b3b]/60 leading-relaxed max-w-md mx-auto">
          We don&apos;t have any active openings at the moment, but we&apos;re always interested in meeting talented people.
          Send us your CV and we&apos;ll be in touch when something opens up.
        </p>
      </div>

      {/* Open application */}
      <div className="bg-linear-to-r from-[#e91e8c] to-[#c2185b] rounded-2xl p-8 text-white text-center">
        <Mail className="w-8 h-8 mx-auto mb-3 opacity-90" />
        <p className="font-playfair text-2xl font-extrabold mb-2">Send an Open Application</p>
        <p className="text-white/75 text-sm mb-5 max-w-sm mx-auto">
          Tell us who you are and what you&apos;re great at. We&apos;ll keep your CV on file for future roles.
        </p>
        <a
          href="mailto:careers@kinedeo.com?subject=Open Application - KineDeo"
          className="inline-block bg-white text-[#e91e8c] px-8 py-3 rounded-full font-bold text-sm hover:shadow-xl transition-all"
        >
          Send Your CV
        </a>
        <p className="text-white/50 text-xs mt-3">careers@kinedeo.com</p>
      </div>
    </StaticPageLayout>
  );
}
