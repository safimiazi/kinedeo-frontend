import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://kinedeo.com';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/sitemap/static.xml`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/sitemap/products.xml`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/sitemap/categories.xml`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/sitemap/bundles.xml`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/sitemap/blog.xml`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/sitemap/images.xml`,
      lastModified: new Date(),
    },
  ];
}
