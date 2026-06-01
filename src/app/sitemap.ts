import type { MetadataRoute } from "next";
import { siteConfig, services } from "@/data/content";
import { getPublicPortfolioItems } from "@/lib/portfolio-public";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const staticPages = ["", "/about", "/services", "/portfolio", "/booking", "/contact", "/blog"];
  const legalPages = ["/legal/impressum", "/legal/datenschutz", "/legal/agb", "/legal/cookies", "/legal/widerruf"];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of siteConfig.locales) {
    for (const page of [...staticPages, ...legalPages]) {
      entries.push({
        url: `${baseUrl}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            siteConfig.locales.map((l) => [l, `${baseUrl}/${l}${page}`]),
          ),
        },
      });
    }

    for (const service of services) {
      entries.push({
        url: `${baseUrl}/${locale}/services/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }

  }

  try {
    const portfolioItems = await getPublicPortfolioItems();
    for (const item of portfolioItems) {
      for (const locale of siteConfig.locales) {
        entries.push({
          url: `${baseUrl}/${locale}/portfolio/${item.slug}`,
          lastModified: new Date(),
          changeFrequency: "monthly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // portfolio URLs omitted if DB unavailable
  }

  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
    });
    for (const post of posts) {
      for (const locale of siteConfig.locales) {
        entries.push({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: post.updatedAt,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // DB not available during build
  }

  return entries;
}
