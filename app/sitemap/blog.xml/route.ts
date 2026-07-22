const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://kinedeo.com';
const now = new Date().toISOString().split('T')[0];

// Blog listing page is always included.
// When individual blog posts are added, fetch them from the API here.
const BLOG_URLS = [
  { url: `${SITE_URL}/blog`, lastmod: now, changefreq: 'daily', priority: '0.7' },
];

export async function GET() {
  const urls = BLOG_URLS.map(
    ({ url, lastmod, changefreq, priority }) => `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`,
  ).join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
