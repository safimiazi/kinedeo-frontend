import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://kinedeo.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ─── Standard web crawlers ──────────────────────────────────────────────
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/dashboard/',
          '/account/',
          '/cart/',
          '/checkout/',
          '/api/',
          '/login',
          '/register',
        ],
      },

      // ─── AI Search Crawlers ─────────────────────────────────────────────────
      // These crawlers feed AI search products (ChatGPT, Bing AI, etc.)
      // Allowing them helps kinedeo.com appear in AI-powered search results.

      // OpenAI — ChatGPT Browse & GPT Store
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/account/', '/cart/', '/checkout/', '/api/'],
      },

      // OpenAI — ChatGPT user-agent (browsing plugin)
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/account/', '/cart/', '/checkout/', '/api/'],
      },

      // Anthropic — Claude AI
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/account/', '/cart/', '/checkout/', '/api/'],
      },

      // Google Gemini / Bard
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/account/', '/cart/', '/checkout/', '/api/'],
      },

      // Perplexity AI
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/account/', '/cart/', '/checkout/', '/api/'],
      },

      // Meta AI (Llama)
      {
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/account/', '/cart/', '/checkout/', '/api/'],
      },

      // Microsoft Copilot / Bing AI
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/account/', '/cart/', '/checkout/', '/api/'],
      },

      // Cohere AI
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/account/', '/cart/', '/checkout/', '/api/'],
      },

      // You.com AI search
      {
        userAgent: 'YouBot',
        allow: '/',
        disallow: ['/admin/', '/dashboard/', '/account/', '/cart/', '/checkout/', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
