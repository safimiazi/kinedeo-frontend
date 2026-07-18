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
        <div className="mt-10 pt-8 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: Mail, text: "hello@kinedeo.com", href: "mailto:hello@kinedeo.com" },
            { icon: Phone, text: "01956-867166", href: "tel:+8801956867166" },
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
          {/* WhatsApp */}
          <a
            href="https://wa.me/8801956867166"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 text-[#f8bbd0]/60 hover:text-green-400 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-green-400 shrink-0" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
            <span className="font-nunito text-[13px]">WhatsApp</span>
          </a>
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
