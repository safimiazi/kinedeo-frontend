import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,

  /**
   * API proxy — makes frontend and backend appear on the same origin in dev.
   *
   * Why this matters for cookies:
   *   - HttpOnly cookies with SameSite restrictions are only sent when the
   *     request origin matches the cookie's domain.
   *   - Without a proxy, localhost:3000 → localhost:4000 is cross-origin, so
   *     the browser won't send the refresh token cookie on /auth/refresh calls.
   *   - With this rewrite, the browser calls localhost:3000/api/* which Next.js
   *     forwards server-side to localhost:4000/api/*.  The cookie is set on :3000
   *     and sent automatically on every credentialed request to :3000.
   *
   * In production the frontend and backend share the same domain, so no proxy
   * is needed — rewrites only apply when NEXT_PUBLIC_API_URL is not set or
   * points to localhost.
   */
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    // In production (NEXT_PUBLIC_API_URL points to real backend),
    // skip the proxy — browser calls backend directly.
    if (apiUrl && !apiUrl.includes('localhost')) {
      return [];
    }

    // In development, proxy /api/* to localhost:4000/api/*
    const backendUrl =
      apiUrl?.replace("/api", "") || "http://localhost:4000";

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
