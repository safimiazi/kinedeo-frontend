"use client";

interface NewsletterCTAProps {
  emailInput: string;
  setEmailInput: (v: string) => void;
  onSubscribe: () => void;
}

export default function NewsletterCTA({ emailInput, setEmailInput, onSubscribe }: NewsletterCTAProps) {
  return (
    <section className="bg-linear-to-br from-[#fce4ec] via-[#f8bbd0] to-[#fce4ec] py-20 px-[5%]">
      <div className="max-w-[600px] mx-auto text-center">
        <div className="text-5xl mb-5">🌸</div>
        <h2 className="font-playfair text-3xl md:text-4xl font-extrabold text-[#2d1a24] mb-3.5">
          Join the Petal Club
        </h2>
        <p className="font-nunito text-[#6d1b3b] text-base mb-8 leading-relaxed">
          Subscribe for exclusive deals, beauty tips, and early access to new launches. Get ₹200 off your first order!
        </p>
        <div className="flex gap-3 max-w-[440px] mx-auto flex-wrap">
          <input
            type="email"
            placeholder="Enter your email address..."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            className="font-nunito px-5 py-3.5 border-2 border-[#fce4ec] rounded-full text-sm outline-none flex-1 min-w-[200px] bg-white/90 focus:border-[#e91e8c] transition-colors"
          />
          <button
            className="bg-linear-to-br from-[#e91e8c] to-[#c2185b] text-white border-none px-7 py-3.5 rounded-full cursor-pointer font-nunito font-bold text-sm tracking-wide whitespace-nowrap hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e91e8c]/35 transition-all"
            onClick={onSubscribe}
          >
            Subscribe ✨
          </button>
        </div>
        <p className="font-nunito text-xs text-[#ad1457] mt-4">
          🔒 No spam, ever. Unsubscribe anytime.
        </p>
      </div>
    </section>
  );
}
