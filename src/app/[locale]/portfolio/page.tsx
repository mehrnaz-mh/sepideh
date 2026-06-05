import { setRequestLocale } from "next-intl/server";
import { PortfolioGallery } from "@/app/[locale]/portfolio/portfolio-gallery";
import {
  getPublicPortfolioCategories,
  getPublicPortfolioItems,
} from "@/lib/portfolio-public";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: "Portfolio | Sepideh Mihanparast",
    description:
      locale === "de"
        ? "Portfolio von Sepideh Mihanparast — Braut, Cannes Red Carpet, Editorial und Fashion Projekte."
        : "Browse the portfolio of Sepideh Mihanparast — bridal, Cannes red carpet, editorial and fashion projects.",
    alternates: { canonical: `${siteUrl}/${locale}/portfolio` },
  };
}

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
