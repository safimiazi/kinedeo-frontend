"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from "lucide-react";
import StaticPageLayout from "@/components/StaticPageLayout";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (field: string, val: string) => setForm((p) => ({ ...p, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submit — replace with real API call if needed
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <StaticPageLayout
      title="Contact Us"
      subtitle="We'd love to hear from you. Reach out and we'll get back to you within 24 hours."
    >
      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact info */}
        <div className="space-y-6">
          <div>
            <h2 className="font-playfair text-xl font-bold text-[#2d1a24] mb-4">Get in Touch</h2>
            <p className="text-sm text-[#6d1b3b]/70 leading-relaxed">
              Whether you have a question about your order, a product, or just want to say hi — our team is happy to help.
            </p>
          </div>

          {[
            { icon: Mail, title: "Email", value: "hello@kinedeo.com", href: "mailto:hello@kinedeo.com" },
            { icon: Phone, title: "Phone / WhatsApp", value: "+880 1XXX-XXXXXX", href: "tel:+8801XXXXXXXXX" },
            { icon: MapPin, title: "Location", value: "Dhaka, Bangladesh", href: "https://maps.google.com" },
            { icon: Clock, title: "Support Hours", value: "Sat – Thu, 9 AM – 8 PM", href: null },
          ].map(({ icon: Icon, title, value, href }) => (
            <div key={title} className="flex items-start gap-4 p-4 bg-white rounded-xl border border-pink-100 hover:border-[#e91e8c]/30 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#e91e8c]/20 to-pink-100 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-[#e91e8c]" />
              </div>
              <div>
                <p className="font-semibold text-xs text-[#6d1b3b]/50 uppercase tracking-wide mb-0.5">{title}</p>
                {href ? (
                  <a href={href} className="text-sm font-semibold text-[#2d1a24] hover:text-[#e91e8c] transition-colors">
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-semibold text-[#2d1a24]">{value}</p>
                )}
              </div>
            </div>
          ))}

          {/* Social / WhatsApp CTA */}
          <a
            href="https://wa.me/8801XXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 w-full p-4 bg-green-50 rounded-xl border border-green-200 hover:border-green-400 transition-colors group"
          >
            <MessageCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-sm text-green-800">Chat on WhatsApp</p>
              <p className="text-xs text-green-600">Usually replies within 1 hour</p>
            </div>
          </a>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-pink-100 p-6 shadow-sm">
          {submitted ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Send className="w-7 h-7 text-green-600" />
              </div>
              <h3 className="font-playfair text-xl font-bold text-[#2d1a24] mb-2">Message Sent!</h3>
              <p className="text-sm text-[#6d1b3b]/60">We'll get back to you within 24 hours.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-playfair text-lg font-bold text-[#2d1a24] mb-2">Send a Message</h3>
              {[
                { field: "name", label: "Full Name *", placeholder: "Your name", type: "text" },
                { field: "email", label: "Email *", placeholder: "your@email.com", type: "email" },
                { field: "subject", label: "Subject *", placeholder: "How can we help?", type: "text" },
              ].map(({ field, label, placeholder, type }) => (
                <div key={field}>
                  <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">{label}</label>
                  <input
                    type={type}
                    required
                    value={form[field as keyof typeof form]}
                    onChange={(e) => update(field, e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[#2d1a24]/70 mb-1">Message *</label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Tell us more..."
                  className="w-full px-4 py-3 rounded-xl border border-pink-200 text-sm text-[#2d1a24] outline-none focus:border-[#e91e8c] transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white py-3 rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </StaticPageLayout>
  );
}
