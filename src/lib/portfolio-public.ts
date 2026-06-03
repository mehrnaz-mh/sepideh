import { prisma } from "@/lib/prisma";
import {
  portfolioCategories as staticCategories,
  portfolioItems as staticItems,
  siteImages,
} from "@/data/content";
import type { Locale } from "@/data/content";

export type PublicPortfolioItem = {
  slug: string;
  categorySlug: string;
  featured: boolean;
  sortOrder: number;
  image: string;
  de: {
    title: string;
    description: string;
    altText: string;
  };
  en: {
    title: string;
    description: string;
    altText: string;
  };
};

export type PublicPortfolioCategory = {
  slug: string;
  sortOrder: number;
  de: { name: string };
  en: { name: string };
};

function mapItem(
  item: Awaited<ReturnType<typeof fetchPublishedItems>>[number],
): PublicPortfolioItem {
  const de = item.translations.find((t) => t.locale === "de");
  const en = item.translations.find((t) => t.locale === "en");

  return {
    slug: item.slug,
    categorySlug: item.category.slug,
    featured: item.featured,
    sortOrder: item.sortOrder,
    image: item.mediaFiles[0]?.url ?? siteImages.hero,
    de: {
      title: de?.title ?? item.slug,
      description: de?.description ?? "",
      altText: de?.altText ?? de?.title ?? item.slug,
    },
    en: {
      title: en?.title ?? item.slug,
      description: en?.description ?? "",
      altText: en?.altText ?? en?.title ?? item.slug,
    },
  };
}

function mapCategory(
  cat: Awaited<ReturnType<typeof fetchCategories>>[number],
): PublicPortfolioCategory {
  const de = cat.translations.find((t) => t.locale === "de");
  const en = cat.translations.find((t) => t.locale === "en");

  return {
    slug: cat.slug,
    sortOrder: cat.sortOrder,
    de: { name: de?.name ?? cat.slug },
    en: { name: en?.name ?? cat.slug },
  };
}

async function fetchPublishedItems() {
  return prisma.portfolioItem.findMany({
    where: { publishedAt: { not: null } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    include: {
      translations: true,
      category: true,
      mediaFiles: true,
    },
  });
}

async function fetchCategories() {
  return prisma.portfolioCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { translations: true },
  });
}

export async function getPublicPortfolioItems(): Promise<PublicPortfolioItem[]> {
  try {
    const items = await fetchPublishedItems();
    if (items.length > 0) return items.map(mapItem);
  } catch {
    // DB unavailable (e.g. during offline build)
  }

  return staticItems.map((item) => ({
    slug: item.slug,
    categorySlug: item.categorySlug,
    featured: item.featured,
    sortOrder: item.sortOrder,
    image: item.image,
    de: { ...item.de },
    en: { ...item.en },
  }));
}

export async function getPublicPortfolioCategories(): Promise<PublicPortfolioCategory[]> {
  try {
    const categories = await fetchCategories();
    if (categories.length > 0) return categories.map(mapCategory);
  } catch {
    // fallback below
  }

  return staticCategories.map((cat) => ({
    slug: cat.slug,
    sortOrder: cat.sortOrder,
    de: { name: cat.de.name },
    en: { name: cat.en.name },
  }));
}

export async function getPublicPortfolioItemBySlug(
  slug: string,
): Promise<PublicPortfolioItem | null> {
  try {
    const item = await prisma.portfolioItem.findFirst({
      where: { slug, publishedAt: { not: null } },
      include: {
        translations: true,
        category: true,
        mediaFiles: true,
      },
    });
    if (item) return mapItem(item);
  } catch {
    // fallback below
  }

  const fallback = staticItems.find((p) => p.slug === slug);
  if (!fallback) return null;

  return {
    slug: fallback.slug,
    categorySlug: fallback.categorySlug,
    featured: fallback.featured,
    sortOrder: fallback.sortOrder,
    image: fallback.image,
    de: { ...fallback.de },
    en: { ...fallback.en },
  };
}

export function portfolioItemLocale(
  item: PublicPortfolioItem,
  locale: Locale,
) {
  return item[locale];
}
