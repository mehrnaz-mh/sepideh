import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { faqItems, services } from "@/data/content";
import { getPublicPortfolioItems } from "@/lib/portfolio-public";
import type { Locale } from "@/data/content";

export function generateStaticParams() {
  return services.flatMap((service) =>
    ["de", "en"].map((locale) => ({ locale, slug: service.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  const loc = locale as Locale;
  return {
    title: service[loc].title,
    description: service[loc].shortDesc,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const loc = locale as Locale;
  const tc = await getTranslations("common");
  const t = await getTranslations("services");
  const portfolioItems = await getPublicPortfolioItems();
  const relatedPortfolio = portfolioItems.slice(0, 3);

  return (
    <>
      <section className="section-padding bg-background-secondary">
        <div className="luxury-container">
          <FadeIn>
            <Link href="/services" className="text-sm text-muted transition-colors hover:text-gold">
              ← {t("title")}
            </Link>
            <h1 className="mt-8 font-serif text-5xl md:text-6xl">
              {service[loc].title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted">{service[loc].shortDesc}</p>
            <p className="mt-4 text-xs uppercase tracking-[0.22em] text-muted">
              <span className="text-gold">{service.durationMinutes}</span> {tc("minutes")}
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="luxury-container mx-auto max-w-3xl">
          <FadeIn>
            <p className="text-lg leading-relaxed text-foreground/90">
              {service[loc].description}
            </p>
            <div className="mt-12 flex flex-col gap-4 border-t border-border pt-12 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">{t("detailCtaHint")}</p>
              <Button asChild variant="gold" className="shrink-0">
                <Link href={`/booking?service=${service.slug}`}>{tc("bookNow")}</Link>
              </Button>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-background-secondary">
        <div className="luxury-container">
          <FadeIn>
            <h2 className="font-serif text-3xl">{t("faqTitle")}</h2>
          </FadeIn>
          <div className="mt-8 grid gap-3 md:grid-cols-2">
            {faqItems.slice(0, 4).map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <div className="h-full border border-border bg-background p-6">
                  <h3 className="font-serif text-lg">{item[loc].question}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {item[loc].answer}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {relatedPortfolio.length > 0 && (
        <section className="section-padding">
          <div className="luxury-container">
            <FadeIn>
              <h2 className="font-serif text-3xl">{t("galleryTitle")}</h2>
            </FadeIn>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {relatedPortfolio.map((item, i) => (
                <FadeIn key={item.slug} delay={i * 0.08}>
                  <Link
                    href={`/portfolio/${item.slug}`}
                    className="group relative block aspect-[3/4] overflow-hidden"
                  >
                    <Image
                      src={item.image}
                      alt={item[loc].altText}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="33vw"
                      unoptimized={item.image.startsWith("http")}
                    />
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
