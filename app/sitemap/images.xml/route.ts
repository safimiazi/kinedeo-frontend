const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://kinedeo.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kinedeo.com/api';

interface Product {
  _id: string;
  name: string;
  images: string[];
  updatedAt: string;
}

interface PaginatedProducts {
  products: Product[];
  total: number;
  totalPages: number;
}

async function fetchAllProducts(): Promise<Product[]> {
  const all: Product[] = [];
  let page = 1;
  const limit = 100;

  try {
    while (true) {
      const res = await fetch(`${API_URL}/products?page=${page}&limit=${limit}`, {
        next: { revalidate: 3600 },
      });
      if (!res.ok) break;

      const data: PaginatedProducts = await res.json();
      all.push(...data.products);

      if (page >= data.totalPages) break;
      page++;
    }
  } catch {
    // Silent fail
  }

  return all;
}

export async function GET() {
  const products = await fetchAllProducts();

  // Build image sitemap — each product URL can have multiple images
  const urls = products
    .filter((p) => p.images && p.images.length > 0)
    .map((p) => {
      const lastmod = new Date(p.updatedAt).toISOString().split('T')[0];
      const images = p.images
        .slice(0, 10) // Google supports up to 1000, but 10 per page is practical
        .map(
          (imgUrl) => `
    <image:image>
      <image:loc>${imgUrl}</image:loc>
      <image:title>${escapeXml(p.name)}</image:title>
    </image:image>`,
        )
        .join('');

      return `
  <url>
    <loc>${SITE_URL}/product/${p._id}</loc>
    <lastmod>${lastmod}</lastmod>${images}
  </url>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
