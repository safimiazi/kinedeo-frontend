"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import StaticPageLayout from "@/components/StaticPageLayout";

const FAQS = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 3–5 business days within Bangladesh. Express delivery (1–2 days) is available at checkout for an additional charge.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! Orders above ৳999 qualify for free standard shipping anywhere in Bangladesh.",
      },
      {
        q: "Can I change or cancel my order after placing it?",
        a: "You can cancel or modify your order within 2 hours of placing it. After that, the order is already being processed. Please contact us at hello@kinedeo.com as soon as possible.",
      },
      {
        q: "How do I track my order?",
        a: "Once your order is shipped, you'll receive an SMS with a tracking link. You can also use our Track Order page with your Order ID and phone number.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 7 days of delivery for unused, unopened products in original packaging. Certain items (like opened skincare) are non-returnable for hygiene reasons.",
      },
      {
        q: "How do I initiate a return?",
        a: "Visit our Returns page or email hello@kinedeo.com with your order number and reason for return. We'll guide you through the process.",
      },
      {
        q: "How long does a refund take?",
        a: "Once we receive and inspect the returned item, refunds are processed within 5–7 business days back to your original payment method.",
      },
    ],
  },
  {
    category: "Products",
    items: [
      {
        q: "Are KineDeo products cruelty-free?",
        a: "Absolutely. All KineDeo products are 100% cruelty-free and never tested on animals. We are committed to ethical beauty.",
      },
      {
        q: "Are the products suitable for sensitive skin?",
        a: "Most of our products are dermatologist-tested and formulated for all skin types. Check each product description for specific skin compatibility notes.",
      },
      {
        q: "Do you have an ingredient list for each product?",
        a: "Yes, full ingredient lists are available on each product page. If you have specific allergies, please review them carefully or contact us.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, bKash, Nagad, Rocket, and most major internet banking options — all via SSLCommerz secure gateway.",
      },
      {
        q: "Is my payment information secure?",
        a: "Yes. All payments are processed through SSLCommerz, a PCI-DSS certified payment gateway. We never store your card details.",
      },
    ],
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-pink-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left bg-white hover:bg-pink-50/50 transition-colors"
      >
        <span className="font-semibold text-sm text-[#2d1a24] pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-[#e91e8c] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 bg-white">
          <p className="text-sm text-[#6d1b3b]/70 leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FaqPage() {
  return (
    <StaticPageLayout
      title="Frequently Asked Questions"
      subtitle="Find quick answers to the most common questions about KineDeo."
    >
      <div className="space-y-10">
        {FAQS.map(({ category, items }) => (
          <div key={category}>
            <h2 className="font-playfair text-xl font-bold text-[#2d1a24] mb-4 flex items-center gap-2">
              <span className="w-1 h-6 rounded-full bg-linear-to-b from-[#e91e8c] to-[#c2185b] inline-block" />
              {category}
            </h2>
            <div className="space-y-2">
              {items.map(({ q, a }) => <FaqItem key={q} q={q} a={a} />)}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-linear-to-r from-[#e91e8c]/10 to-pink-50 rounded-2xl p-6 text-center border border-pink-100">
        <p className="font-playfair text-lg font-bold text-[#2d1a24] mb-2">Still have questions?</p>
        <p className="text-sm text-[#6d1b3b]/70 mb-4">Our team is here to help — reach out anytime.</p>
        <a
          href="/contact"
          className="inline-block bg-linear-to-r from-[#e91e8c] to-[#c2185b] text-white px-8 py-3 rounded-full font-semibold text-sm hover:shadow-lg hover:shadow-[#e91e8c]/30 transition-all"
        >
          Contact Us
        </a>
      </div>
    </StaticPageLayout>
  );
}
