"use client";

import Link from "next/link";
import { Flower2, Mail, Phone, MapPin } from "lucide-react";

// Brand social icons — lucide-react doesn't include Instagram/Facebook/YouTube
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
      <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none" />
    </svg>
  );
}

const SHOP_LINKS = [
  { label: "Skincare", href: "/category/skincare" },
  { label: "Makeup", href: "/category/makeup" },
  { label: "Fragrance", href: "/category/fragrance" },
  { label: "Haircare", href: "/category/haircare" },
  { label: "All Products", href: "/products" },
];

const HELP_LINKS = [
  { label: "Track Order", href: "/track-order" },
  { label: "Returns & Refunds", href: "/returns" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact Us", href: "/contact" },
];

const COMPANY_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Careers", href: "/careers" },
  { label: "Press", href: "/press" },
  { label: "Affiliates", href: "/affiliates" },
];

const SOCIAL_LINKS = [
  { Icon: InstagramIcon, href: "https://instagram.com/kinedeo", label: "Instagram" },
  { Icon: FacebookIcon, href: "https://www.facebook.com/profile.php?id=61590716335589", label: "Facebook" },
  { Icon: YoutubeIcon, href: "https://youtube.com/@kinedeo", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a0d16] text-white">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Flower2 className="w-6 h-6 text-[#e91e8c] group-hover:scale-110 transition-transform" />
              <span className="font-playfair text-xl font-extrabold text-[#f48fb1]">Kine</span>
              <span className="font-playfair text-xl font-normal text-[#e91e8c]">Deo</span>
            </Link>
            <p className="font-nunito text-[#f8bbd0]/70 text-[13px] leading-relaxed mb-5">
              Luxury beauty for every woman. Cruelty-free, dermatologist tested, made with love in Bangladesh.
            </p>

            {/* Social links */}
            <div className="flex gap-3">
              {SOCIAL_LINKS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 hover:bg-[#e91e8c] flex items-center justify-center transition-all duration-200 hover:scale-110"
                >
                  <Icon className="w-4 h-4 text-[#f48fb1]" />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <p className="font-nunito text-[#e91e8c] font-bold text-[12px] tracking-[0.15em] uppercase mb-4">Shop</p>
            <ul className="space-y-2.5">
              {SHOP_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-nunito text-[#f8bbd0]/70 text-[13px] hover:text-[#e91e8c] transition-colors inline-block hover:translate-x-1 transition-transform duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="font-nunito text-[#e91e8c] font-bold text-[12px] tracking-[0.15em] uppercase mb-4">Help</p>
            <ul className="space-y-2.5">
              {HELP_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-nunito text-[#f8bbd0]/70 text-[13px] hover:text-[#e91e8c] transition-colors inline-block hover:translate-x-1 transition-transform duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="font-nunito text-[#e91e8c] font-bold text-[12px] tracking-[0.15em] uppercase mb-4">Company</p>
            <ul className="space-y-2.5">
              {COMPANY_LINKS.map(({ label, href }) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="font-nunito text-[#f8bbd0]/70 text-[13px] hover:text-[#e91e8c] transition-colors inline-block hover:translate-x-1 transition-transform duration-200"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Contact strip */}
        <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: Mail, text: "hello@kinedeo.com", href: "mailto:hello@kinedeo.com" },
            { icon: Phone, text: "+880 1XXX-XXXXXX", href: "tel:+8801XXXXXXXXX" },
            { icon: MapPin, text: "Dhaka, Bangladesh", href: "/contact" },
          ].map(({ icon: Icon, text, href }) => (
            <a
              key={text}
              href={href}
              className="flex items-center gap-2.5 text-[#f8bbd0]/60 hover:text-[#e91e8c] transition-colors"
            >
              <Icon className="w-4 h-4 text-[#e91e8c] shrink-0" />
              <span className="font-nunito text-[13px]">{text}</span>
            </a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-nunito text-[#f8bbd0]/40 text-xs">
            © {new Date().getFullYear()} KineDeo.com — All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {[
              { label: "Privacy Policy", href: "/privacy" },
              { label: "Terms of Service", href: "/terms" },
              { label: "Cookie Policy", href: "/cookies" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                className="font-nunito text-[#f8bbd0]/40 text-xs hover:text-[#e91e8c] transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
