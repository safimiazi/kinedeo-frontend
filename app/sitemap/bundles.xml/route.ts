const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://kinedeo.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kinedeo.com/api';

interface Bundle {
  _id: string;
  name: string;
  isActive: boolean;
  updatedAt: string;
}

async function fetchBundles(): Promise<Bundle[]> {
  try {
    // Use the active bundle endpoint — public, no auth needed
    const res = await fetch(`${API_URL}/bundles/active`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Active endpoint returns single bundle or null
    return data ? [data] : [];
  } catch {
    return [];
  }
}

export async function GET() {
  const bundles = await fetchBundles();
  const now = new Date().toISOString().split('T')[0];

  const urls = bundles
    .map((b) => {
      const lastmod = b.updatedAt ? new Date(b.updatedAt).toISOString().split('T')[0] : now;
      return `
  <url>
    <loc>${SITE_URL}/bundle/${b._id}</loc>
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
