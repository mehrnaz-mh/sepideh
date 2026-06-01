import { setRequestLocale } from "next-intl/server";
import { PortfolioGallery } from "@/app/[locale]/portfolio/portfolio-gallery";
import {
  getPublicPortfolioCategories,
  getPublicPortfolioItems,
} from "@/lib/portfolio-public";

export const revalidate = 60;

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [items, categories] = await Promise.all([
    getPublicPortfolioItems(),
    getPublicPortfolioCategories(),
  ]);

  return <PortfolioGallery items={items} categories={categories} />;
}
