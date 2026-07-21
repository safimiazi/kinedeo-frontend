import StaticPageLayout from "@/components/StaticPageLayout";

const POSTS = [
  {
    slug: "skincare-routine-for-bangladeshi-weather",
    category: "Skincare",
    title: "The Perfect Skincare Routine for Bangladesh's Climate",
    excerpt: "Humidity, heat, and pollution — here's how to build a routine that keeps your skin glowing year-round in Bangladesh.",
    readTime: "5 min read",
    date: "Jan 15, 2025",
    emoji: "🌿",
  },
  {
    slug: "cruelty-free-beauty-guide",
    category: "Beauty Tips",
    title: "What Does 'Cruelty-Free' Really Mean?",
    excerpt: "Not all cruelty-free claims are equal. We break down what certifications to look for and why it matters.",
    readTime: "4 min read",
    date: "Jan 8, 2025",
    emoji: "🐰",
  },
  {
    slug: "top-10-makeup-essentials",
    category: "Makeup",
    title: "10 Makeup Essentials Every Beginner Needs",
    excerpt: "Building your makeup collection from scratch? These 10 products are all you need to get started confidently.",
    readTime: "6 min read",
    date: "Dec 28, 2024",
    emoji: "💄",
  },
  {
    slug: "fragrance-guide",
    category: "Fragrance",
    title: "How to Choose a Fragrance That Lasts",
    excerpt: "From top notes to base notes — understanding fragrance families will help you find your signature scent.",
    readTime: "5 min read",
    date: "Dec 18, 2024",
    emoji: "🌸",
  },
  {
    slug: "self-care-sunday-routine",
    category: "Wellness",
    title: "The Ultimate Self-Care Sunday Routine",
    excerpt: "Dedicate one morning a week to your skin, mind, and soul. Here's the step-by-step routine we love.",
    readTime: "7 min read",
    date: "Dec 10, 2024",
    emoji: "✨",
  },
  {
    slug: "gift-ideas-for-her",
    category: "Gift Guides",
    title: "Best Beauty Gift Ideas for Her (2025)",
    excerpt: "From budget-friendly to luxurious — find the perfect beauty gift for the women in your life.",
    readTime: "4 min read",
    date: "Dec 1, 2024",
    emoji: "🎁",
  },
];

export default function BlogPage() {
  return (
    <StaticPageLayout
      title="Beauty Blog"
      subtitle="Tips, guides, and inspiration from the KineDeo beauty team."
    >
      {/* Featured post */}
      <div className="bg-linear-to-r from-[#e91e8c] to-[#c2185b] rounded-2xl p-8 mb-8 text-white">
        <span className="inline-block text-xs font-bold tracking-widest uppercase bg-white/20 px-3 py-1 rounded-full mb-3">
          ✦ Featured
        </span>
        <h2 className="font-playfair text-2xl font-extrabold mb-2 leading-snug">
          {POSTS[0].title}
        </h2>
        <p className="text-white/75 text-sm leading-relaxed mb-4">{POSTS[0].excerpt}</p>
        <div className="flex items-center gap-3 text-white/60 text-xs">
          <span>{POSTS[0].date}</span>
          <span>·</span>
          <span>{POSTS[0].readTime}</span>
        </div>
      </div>

      {/* All posts */}
      <div className="grid sm:grid-cols-2 gap-4">
        {POSTS.slice(1).map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-2xl border border-pink-100 p-5 hover:border-[#e91e8c]/40 hover:shadow-md transition-all group"
          >
            <div className="text-3xl mb-3">{post.emoji}</div>
            <span className="inline-block text-[11px] font-bold text-[#e91e8c] tracking-wide uppercase bg-[#fce4ec] px-2.5 py-0.5 rounded-full mb-2">
              {post.category}
            </span>
            <h3 className="font-playfair font-bold text-[#2d1a24] text-base leading-snug mb-2 group-hover:text-[#e91e8c] transition-colors">
              {post.title}
            </h3>
            <p className="text-sm text-[#6d1b3b]/60 leading-relaxed mb-3 line-clamp-2">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-2 text-[#6d1b3b]/40 text-xs">
              <span>{post.date}</span>
              <span>·</span>
              <span>{post.readTime}</span>
            </div>
          </article>
        ))}
      </div>

      <p className="text-center text-sm text-[#6d1b3b]/40 mt-8">More posts coming soon — follow us on Instagram for the latest!</p>
    </StaticPageLayout>
  );
}
