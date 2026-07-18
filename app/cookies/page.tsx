import StaticPageLayout from "@/components/StaticPageLayout";
import { Cookie, BarChart2, Settings, Shield } from "lucide-react";

const LAST_UPDATED = "January 1, 2025";

const COOKIE_TYPES = [
  {
    icon: Shield,
    name: "Essential Cookies",
    required: true,
    desc: "These cookies are necessary for the website to function. They enable core features like cart management, login sessions, and checkout. You cannot opt out of these.",
    examples: ["Session token", "Cart data", "CSRF protection token"],
  },
  {
    icon: BarChart2,
    name: "Analytics Cookies",
    required: false,
    desc: "Help us understand how visitors interact with our website by collecting anonymous data like page views and traffic sources. This helps us improve the site.",
    examples: ["Google Analytics", "Page visit duration", "Traffic source tracking"],
  },
  {
    icon: Settings,
    name: "Preference Cookies",
    required: false,
    desc: "Remember your settings and preferences to give you a better experience on return visits.",
    examples: ["Language preference", "Recently viewed products"],
  },
  {
    icon: Cookie,
    name: "Marketing Cookies",
    required: false,
    desc: "Used to deliver relevant advertisements and track the effectiveness of our marketing campaigns. We do not use aggressive ad tracking.",
    examples: ["Facebook Pixel (if active)", "Retargeting campaigns"],
  },
];

export default function CookiesPage() {
  return (
    <StaticPageLayout
      title="Cookie Policy"
      subtitle={`Last updated: ${LAST_UPDATED}`}
    >
      <div className="space-y-8">
        {/* Intro */}
        <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm text-sm text-[#6d1b3b]/80 leading-relaxed space-y-3">
          <p>
            This Cookie Policy explains what cookies are, how <strong>KineDeo</strong> uses them on{" "}
            <a href="https://kinedeo.com" className="text-[#e91e8c]">kinedeo.com</a>, and your choices regarding cookies.
          </p>
          <p>
            <strong className="text-[#2d1a24]">What are cookies?</strong> Cookies are small text files stored on your device
            when you visit a website. They help the website remember information about your visit, like your cart contents or login status.
          </p>
        </div>

        {/* Cookie types */}
        <div>
          <h2 className="font-playfair text-xl font-bold text-[#2d1a24] mb-4">Types of Cookies We Use</h2>
          <div className="space-y-4">
            {COOKIE_TYPES.map(({ icon: Icon, name, required, desc, examples }) => (
              <div key={name} className="bg-white rounded-2xl border border-pink-100 p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#e91e8c]/20 to-pink-100 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-[#e91e8c]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-playfair font-bold text-[#2d1a24]">{name}</h3>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        required ? "bg-green-100 text-green-700" : "bg-pink-100 text-[#ad1457]"
                      }`}>
                        {required ? "Always Active" : "Optional"}
                      </span>
                    </div>
                    <p className="text-sm text-[#6d1b3b]/70 leading-relaxed mb-3">{desc}</p>
                    <div className="flex flex-wrap gap-2">
                      {examples.map((ex) => (
                        <span key={ex} className="text-[11px] bg-pink-50 text-[#6d1b3b]/60 px-2.5 py-1 rounded-full border border-pink-100">
                          {ex}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Managing cookies */}
        <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
          <h2 className="font-playfair text-xl font-bold text-[#2d1a24] mb-3">Managing Your Cookie Preferences</h2>
          <p className="text-sm text-[#6d1b3b]/70 leading-relaxed mb-4">
            You can control and delete cookies through your browser settings. Note that disabling certain cookies may affect the functionality of our website — for example, your cart may not persist between sessions.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { browser: "Google Chrome", url: "https://support.google.com/chrome/answer/95647" },
              { browser: "Mozilla Firefox", url: "https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" },
              { browser: "Safari", url: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" },
              { browser: "Microsoft Edge", url: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge" },
            ].map(({ browser, url }) => (
              <a
                key={browser}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-xl border border-pink-100 hover:border-[#e91e8c]/40 hover:bg-pink-50/50 transition-all text-sm font-semibold text-[#2d1a24] hover:text-[#e91e8c]"
              >
                <Cookie className="w-4 h-4 text-[#e91e8c]" />
                {browser}
              </a>
            ))}
          </div>
        </div>

        {/* Third party */}
        <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
          <h2 className="font-playfair text-xl font-bold text-[#2d1a24] mb-3">Third-Party Cookies</h2>
          <p className="text-sm text-[#6d1b3b]/70 leading-relaxed">
            Some cookies on our site are set by third-party services such as Google Analytics and SSLCommerz (payment processing).
            These third parties have their own privacy policies, which we encourage you to review:
          </p>
          <ul className="mt-3 space-y-2">
            {[
              { name: "Google Analytics", url: "https://policies.google.com/privacy" },
              { name: "SSLCommerz", url: "https://www.sslcommerz.com/privacy-policy/" },
            ].map(({ name, url }) => (
              <li key={name}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm text-[#e91e8c] hover:underline font-semibold">
                  {name} Privacy Policy →
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="bg-linear-to-r from-[#e91e8c]/10 to-pink-50 rounded-2xl p-6 text-center border border-pink-100">
          <p className="font-playfair text-lg font-bold text-[#2d1a24] mb-2">Questions about cookies?</p>
          <p className="text-sm text-[#6d1b3b]/60 mb-3">We&rsquo;re happy to explain how we use data to improve your experience.</p>
          <a href="mailto:hello@kinedeo.com" className="text-[#e91e8c] font-semibold hover:underline text-sm">
            hello@kinedeo.com
          </a>
        </div>
      </div>
    </StaticPageLayout>
  );
}
