const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://kinedeo.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kinedeo.com/api';

interface Category {
  _id: string;
  slug: string;
  updatedAt?: string;
  isActive: boolean;
}

async function fetchCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/categories`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export async function GET() {
  const categories = await fetchCategories();
  const active = categories.filter((c) => c.isActive);
  const now = new Date().toISOString().split('T')[0];

  const urls = active
    .map((c) => {
      const lastmod = c.updatedAt ? new Date(c.updatedAt).toISOString().split('T')[0] : now;
      return `
  <url>
    <loc>${SITE_URL}/category/${c.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join('');

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
