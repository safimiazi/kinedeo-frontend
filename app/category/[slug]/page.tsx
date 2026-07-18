/**
 * Category Page — Server Component
 *
 * Rendering: ISR (Incremental Static Regeneration)
 *  - generateStaticParams → builds all category pages at deploy time
 *  - revalidate: 3600 → rebuilds in background every 1 hour
 *  - First product batch pre-rendered server-side for instant LCP
 *  - Filter / infinite scroll stays client-side via CategoryProductsClient
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  serverGetCategories,
  serverGetCategoryBySlug,
  serverGetProducts,
} from '@/lib/api/server';
import CategoryProductsClient from './category-products-client';

interface Props {
  params: Promise<{ slug: string }>;
}

// Re-validate every hour
export const revalidate = 3600;

// ─── SEO Metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await serverGetCategoryBySlug(slug);

  if (!category) {
    return { title: 'Category Not Found | KineDeo' };
  }

  const description =
    category.description ||
    `Browse ${category.name} products on KineDeo. Premium quality beauty products.`;

  return {
    title: `${category.name} | KineDeo`,
    description,
    openGraph: {
      title: `${category.name} | KineDeo`,
      description,
      images: category.image ? [{ url: category.image, alt: category.name }] : [],
    },
  };
}

// Pre-build all active category pages at deploy time
export async function generateStaticParams() {
  try {
    const categories = await serverGetCategories();
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  // Fetch category + sibling categories in parallel
  const [category, allCategories] = await Promise.all([
    serverGetCategoryBySlug(slug),
    serverGetCategories(),
  ]);

  if (!category) {
    notFound();
  }

  // Prefetch first page of products server-side
  const initialProducts = await serverGetProducts({
    categoryId: category._id,
    limit: 12,
  });

  return (
    <CategoryProductsClient
      category={category}
      allCategories={allCategories}
      initialProducts={initialProducts.products}
      initialTotal={initialProducts.total}
    />
  );
}
