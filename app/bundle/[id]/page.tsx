/**
 * Bundle Detail Page — Server Component
 *
 * Rendering: ISR with revalidate 300s (5 min)
 *  - Bundle data (name, products, price) pre-rendered server-side → Google sees it
 *  - generateMetadata provides OG tags for social sharing
 *  - generateStaticParams pre-builds all active bundles at deploy time
 *  - Interactive parts (add-to-cart) stay client-side via BundleDetailClient
 */

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { serverGetBundle, serverGetAllBundles } from '@/lib/api/server';
import BundleDetailClient from './bundle-detail-client';

interface Props {
  params: Promise<{ id: string }>;
}

export const revalidate = 300;

// ─── SEO Metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const bundle = await serverGetBundle(id);

  if (!bundle) {
    return { title: 'Bundle Not Found | KineDeo' };
  }

  const description =
    bundle.description ||
    `Get the ${bundle.name} bundle at KineDeo. Save ৳${
      bundle.originalPrice ? (bundle.originalPrice - bundle.bundlePrice).toLocaleString() : ''
    } on this curated beauty set.`;

  const image = bundle.productIds?.[0]?.images?.[0];

  return {
    title: `${bundle.name} | KineDeo`,
    description,
    openGraph: {
      title: `${bundle.name} | KineDeo`,
      description,
      images: image ? [{ url: image, width: 800, height: 800, alt: bundle.name }] : [],
      type: 'website',
    },
    other: {
      'product:price:amount': String(bundle.bundlePrice),
      'product:price:currency': 'BDT',
    },
  };
}

// Pre-build all active bundle pages at deploy time
export async function generateStaticParams() {
  try {
    const bundles = await serverGetAllBundles();
    return bundles
      .filter((b) => b.isActive)
      .map((b) => ({ id: b._id }));
  } catch {
    return [];
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function BundlePage({ params }: Props) {
  const { id } = await params;
  const bundle = await serverGetBundle(id);

  if (!bundle) {
    notFound();
  }

  return <BundleDetailClient bundle={bundle} />;
}
