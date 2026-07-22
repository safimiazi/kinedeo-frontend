import type { Metadata } from "next";
import { Playfair_Display, Nunito } from "next/font/google";
import "./globals.css";
import { Providers } from "@/lib/providers";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { Toaster } from "react-hot-toast";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? 'https://kinedeo.com'
  ),
  title: {
    default: 'KineDeo — Premium Beauty & Skincare',
    template: '%s | KineDeo',
  },
  description:
    'Discover luxury beauty and skincare crafted for the modern woman. Shop premium cosmetics, serums, and wellness products at KineDeo.',
  keywords: [
    'beauty',
    'skincare',
    'cosmetics',
    'luxury beauty',
    'premium skincare',
    'KineDeo',
    'makeup',
    'serum',
    'wellness',
  ],
  authors: [{ name: 'KineDeo', url: 'https://kinedeo.com' }],
  creator: 'KineDeo',
  publisher: 'KineDeo',
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [{ url: '/favicon.png', type: 'image/png' }],
  },
  openGraph: {
    siteName: 'KineDeo',
    type: 'website',
    locale: 'en_US',
    url: 'https://kinedeo.com',
    title: 'KineDeo — Premium Beauty & Skincare',
    description:
      'Discover luxury beauty and skincare crafted for the modern woman. Shop premium cosmetics, serums, and wellness products.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'KineDeo — Premium Beauty & Skincare',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KineDeo — Premium Beauty & Skincare',
    description:
      'Discover luxury beauty and skincare crafted for the modern woman.',
    images: ['/opengraph-image.png'],
    creator: '@kinedeo',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${nunito.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <Providers>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </Providers>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#fff",
              color: "#2d1a24",
              border: "1px solid #fce4ec",
              borderRadius: "14px",
              padding: "12px 16px",
              fontSize: "14px",
              fontFamily: "var(--font-nunito)",
              boxShadow: "0 8px 24px rgba(233,30,140,0.12)",
            },
            success: {
              iconTheme: { primary: "#e91e8c", secondary: "#fff" },
              style: {
                border: "1px solid #f8bbd0",
                background: "#fff0f5",
              },
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
              style: {
                border: "1px solid #fecaca",
                background: "#fff5f5",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
