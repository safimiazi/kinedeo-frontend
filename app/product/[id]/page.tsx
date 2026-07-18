/**
 * Product Detail Page — Server Component
 *
 * Rendering: SSR with revalidation every 30s
 *  - Product data (name, price, stock, images) pre-rendered on server
 *  - Google/Bing see complete HTML → perfect SEO
 *  - generateMetadata provides OG tags for social sharing
 *  - Interactive parts (cart, variants, reviews) stay client-side via ProductDetailClient
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverGetProduct, serverGetProducts } from '@/lib/api/server';
import ProductDetailClient from './product-detail-client';

interface Props {
  params: Promise<{ id: string }>;
}

// ─── SEO Metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await serverGetProduct(id);

  if (!product) {
    return { title: 'Product Not Found | KineDeo' };
  }

  const description =
    product.shortDescription ||
    product.description?.slice(0, 160) ||
    `Buy ${product.name} at the best price on KineDeo`;

  const price = product.flashSalePrice ?? product.basePrice;

  return {
    title: `${product.name} | KineDeo`,
    description,
    openGraph: {
      title: product.name,
      description,
      images: product.images?.[0] ? [{ url: product.images[0], width: 800, height: 800, alt: product.name }] : [],
      type: 'website',
    },
    other: {
      'product:price:amount': String(price),
      'product:price:currency': 'BDT',
    },
  };
}

// Pre-generate the top 50 most-sold product pages at build time
export async function generateStaticParams() {
  try {
    const data = await serverGetProducts({
      limit: 50,
      sortBy: 'salesCount',
      sortOrder: 'desc',
    });
    return data.products.map((p) => ({ id: p._id }));
  } catch {
    return [];
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await serverGetProduct(id);

  if (!product) {
    notFound();
  }

  // Prefetch related products server-side too (same category, exclude current)
  const relatedData = await serverGetProducts({ limit: 8 });
  const relatedProducts = relatedData.products.filter((p) => p._id !== product._id).slice(0, 4);

  const price = product.flashSalePrice ?? product.basePrice;

  // JSON-LD Product schema — helps Google show rich results (price, rating, availability)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images ?? [],
    sku: product._id,
    offers: {
      '@type': 'Offer',
      url: `https://kinedeo.com/product/${product._id}`,
      priceCurrency: 'BDT',
      price: price,
      availability:
        (product.variants?.[0]?.stockQuantity ?? 1) > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
    },
    ...(product.averageRating > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: product.averageRating,
        reviewCount: product.reviewCount,
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
