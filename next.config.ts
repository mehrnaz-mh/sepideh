import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.178.101"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "4mb",
    },
  },
  async headers() {
    const baseHeaders = [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];

    // Long-lived immutable caching of static assets is only safe in
    // production, where filenames are content-hashed. In dev, Turbopack serves
    // assets at stable paths without hashes, so an immutable Cache-Control
    // makes the browser hold onto stale JS/CSS bundles forever — which causes
    // hydration mismatches after edits. So only apply it in production.
    if (process.env.NODE_ENV === "production") {
      baseHeaders.push(
        {
          source: "/:path*\\.:ext(jpg|jpeg|png|webp|avif|svg|ico|gif)",
          headers: [
            { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          ],
        },
        {
          source: "/_next/static/:path*",
          headers: [
            { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
          ],
        },
      );
    }

    return baseHeaders;
  },
};

export default withNextIntl(nextConfig);
