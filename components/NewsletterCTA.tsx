"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { newsletterApi } from "@/lib/api/newsletter";

export default function NewsletterCTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const subscribe = useMutation({
    mutationFn: (email: string) => newsletterApi.subscribe(email, "homepage"),
    onSuccess: () => {
      setSubmitted(true);
      setEmail("");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return;
    subscribe.mutate(trimmed);
  };

  return (
    <section className="bg-linear-to-br from-[#fce4ec] via-[#f8bbd0] to-[#fce4ec] py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-5xl mb-5">🌸</div>
        <h2 className="font-playfair text-3xl md:text-4xl font-extrabold text-[#2d1a24] mb-3.5">
          Join the Petal Club
        </h2>
        <p className="font-nunito text-[#6d1b3b] text-base mb-8 leading-relaxed">
          Subscribe for exclusive deals, beauty tips, and early access to new launches. Get ৳200 off your first order!
        </p>

        {submitted ? (
          <div className="bg-white/80 rounded-2xl px-8 py-6 inline-block shadow-sm">
            <div className="text-3xl mb-2">🎉</div>
            <p className="font-nunito font-bold text-[#2d1a24] text-lg">
              {subscribe.data?.alreadySubscribed
                ? "You're already in the club!"
                : "Welcome to the Petal Club!"}
            </p>
            <p className="font-nunito text-[#6d1b3b]/70 text-sm mt-1">
              {subscribe.data?.alreadySubscribed
                ? "We already have your email. Stay tuned for updates 🌸"
                : "Check your inbox for your ৳200 welcome discount."}
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex gap-3 max-w-[440px] mx-auto flex-wrap"
            noValidate
          >
            <input
              type="email"
              placeholder="Enter your email address..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={subscribe.isPending}
              className="font-nunito px-5 py-3.5 border-2 border-[#fce4ec] rounded-full text-sm outline-none flex-1 min-w-[200px] bg-white/90 focus:border-[#e91e8c] transition-colors disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={subscribe.isPending || !email.trim()}
              className="bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white border-none px-7 py-3.5 rounded-full cursor-pointer font-nunito font-bold text-sm tracking-wide whitespace-nowrap hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {subscribe.isPending ? "Subscribing..." : "Subscribe ✨"}
            </button>
          </form>
        )}

        {subscribe.isError && (
          <p className="font-nunito text-xs text-red-500 mt-3">
            Something went wrong. Please try again.
          </p>
        )}

        {!submitted && (
          <p className="font-nunito text-xs text-[#ad1457] mt-4">
            🔒 No spam, ever. Unsubscribe anytime.
          </p>
        )}
      </div>
      </div>
    </section>
  );
}
