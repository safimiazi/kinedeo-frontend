/**
 * Products Page — Server Component shell
 *
 * Rendering: SSR with revalidate 60s
 *  - First 12 products + all categories pre-rendered on server
 *  - Instant page paint — no spinner on first load
 *  - Search / sort / filter / infinite scroll stay client-side
 */

import type { Metadata } from 'next';
import { serverGetProducts, serverGetCategories } from '@/lib/api/server';
import ProductsPageClient from './products-page-client';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'All Products | KineDeo',
  description:
    'Browse our full collection of premium beauty and skincare products. Shop serums, lip colors, and more.',
  openGraph: {
    title: 'All Products | KineDeo',
    description: 'Premium beauty & skincare products for the modern woman.',
  },
};

export default async function ProductsPage() {
  const [initialData, categories] = await Promise.all([
    serverGetProducts({ limit: 12, sortBy: 'createdAt', sortOrder: 'desc' }),
    serverGetCategories(),
  ]);

  return (
    <ProductsPageClient
      initialProducts={initialData.products}
      initialTotal={initialData.total}
      categories={categories}
    />
  );
}
