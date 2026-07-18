/**
 * Home Page — Server Component
 *
 * Rendering: SSR with revalidate 60s
 *  - AnnouncementBar content pre-rendered (SEO + no layout shift)
 *  - HeroSection is already a pure server component
 *  - FlashSale, ProductsSection, cart interactions stay client-side
 *
 * "use client" is removed — this is the server shell.
 * Interactive children import their own "use client" directives.
 */

import type { Metadata } from 'next';
import HeroSection from '@/components/HeroSection';
import FlashSale from '@/components/FlashSale';
import Features from '@/components/Features';
import ProductsSection from '@/components/ProductsSection';
import PromoBanner from '@/components/PromoBanner';
import Testimonials from '@/components/Testimonials';
import NewsletterCTA from '@/components/NewsletterCTA';
import Footer from '@/components/Footer';
import HomeClientShell from '@/components/HomeClientShell';
import { serverGetActiveAnnouncements } from '@/lib/api/server';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'KineDeo — Premium Beauty & Skincare',
  description:
    'Discover luxury beauty products crafted for the modern woman. Shop serums, lip colors, and skincare essentials at KineDeo.',
  openGraph: {
    title: 'KineDeo — Premium Beauty & Skincare',
    description: 'Premium beauty products for the modern woman.',
    type: 'website',
  },
};

export default async function HomePage() {
  const announcements = await serverGetActiveAnnouncements();
  const announcementMessage = announcements
    .map((a) => a.message.trim())
    .filter(Boolean)
    .join(' • ');

  return (
    // HomeClientShell provides cart context (itemCount, CartPanel, Toast)
    // without making the entire page a client component
    <HomeClientShell announcementMessage={announcementMessage}>
      <HeroSection />
      <FlashSale />
      <Features />
      <ProductsSection />
      <PromoBanner />
      <Testimonials />
      <NewsletterCTA />
      <Footer />
    </HomeClientShell>
  );
}
