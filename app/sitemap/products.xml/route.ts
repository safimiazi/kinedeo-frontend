const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://kinedeo.com';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.kinedeo.com/api';

interface Product {
  _id: string;
  name: string;
  updatedAt: string;
  images: string[];
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
        next: { revalidate: 3600 }, // Cache 1 hour
      });

      if (!res.ok) break;

      const data: PaginatedProducts = await res.json();
      all.push(...data.products);

      if (page >= data.totalPages) break;
      page++;
    }
  } catch {
    // Return empty on error — sitemap won't fail the build
  }

  return all;
}

export async function GET() {
  const products = await fetchAllProducts();

  const urls = products
    .map((p) => {
      const lastmod = new Date(p.updatedAt).toISOString().split('T')[0];
      return `
  <url>
    <loc>${SITE_URL}/product/${p._id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
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
