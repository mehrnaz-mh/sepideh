import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/motion/fade-in";
import type { Locale } from "@/data/content";
import {
  getPublicPortfolioCategories,
  getPublicPortfolioItemBySlug,
  getPublicPortfolioItems,
} from "@/lib/portfolio-public";
import { prisma } from "@/lib/prisma";
import { portfolioItems as staticPortfolioItems, siteConfig } from "@/data/content";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const items = await prisma.portfolioItem.findMany({
      where: { publishedAt: { not: null } },
      select: { slug: true },
    });
    return items.flatMap((item) =>
      siteConfig.locales.map((locale) => ({ locale, slug: item.slug })),
    );
  } catch {
    return staticPortfolioItems.flatMap((item) =>
      siteConfig.locales.map((locale) => ({ locale, slug: item.slug })),
    );
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const item = await getPublicPortfolioItemBySlug(slug);
  if (!item) return {};
  const loc = locale as Locale;
  return {
    title: item[loc].title,
    description: item[loc].description,
  };
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const item = await getPublicPortfolioItemBySlug(slug);
  if (!item) notFound();

  const loc = locale as Locale;
  const categories = await getPublicPortfolioCategories();
  const category = categories.find((c) => c.slug === item.categorySlug);

  return (
    <>
      <section className="section-padding">
        <div className="luxury-container">
          <FadeIn>
            <Link href="/portfolio" className="text-sm text-muted hover:text-gold">
              ← Portfolio
            </Link>
            {category && (
              <p className="mt-4 text-xs uppercase tracking-widest text-gold">
                {category[loc].name}
              </p>
            )}
            <h1 className="mt-4 font-serif text-5xl">{item[loc].title}</h1>
            <p className="mt-6 max-w-2xl text-lg text-muted">{item[loc].description}</p>
          </FadeIn>
          <FadeIn delay={0.2} className="mt-12">
            <div className="relative mx-auto max-w-4xl overflow-hidden">
              <Image
                src={item.image}
                alt={item[loc].altText}
                width={1200}
                height={1600}
                className="w-full object-cover"
                priority
                unoptimized={item.image.startsWith("http")}
              />
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
