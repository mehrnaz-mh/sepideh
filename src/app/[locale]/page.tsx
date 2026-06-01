import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/motion/fade-in";
import { TextReveal } from "@/components/motion/text-reveal";
import {
  JsonLd,
  localBusinessSchema,
  personSchema,
  faqSchema,
} from "@/components/seo/json-ld";
import {
  aboutBio,
  faqItems,
  services,
  siteConfig,
  testimonials,
} from "@/data/content";
import { getPublicPortfolioItems } from "@/lib/portfolio-public";
import type { PublicPortfolioItem } from "@/lib/portfolio-public";
import type { Locale } from "@/data/content";
import { ArrowRight, Quote } from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");
  const loc = locale as Locale;

  const portfolioItems = await getPublicPortfolioItems();
  const featuredPortfolio = portfolioItems.filter((p) => p.featured).slice(0, 6);
  const featuredServices = services.slice(0, 6);
  const bridalItems = portfolioItems.filter((p) => p.categorySlug === "bridal");
  const cannesItems = portfolioItems.filter(
    (p) => p.categorySlug === "cannes-red-carpet",
  );
  const editorialItems = portfolioItems.filter(
    (p) => p.categorySlug === "editorial",
  );

  const faqData = faqItems.map((item) => ({
    question: item[loc].question,
    answer: item[loc].answer,
  }));

  return (
    <>
      <JsonLd data={[localBusinessSchema(locale), personSchema(locale), faqSchema(faqData)]} />

      {/* Hero */}
      <section className="relative min-h-[90vh] overflow-hidden bg-background-secondary md:min-h-[calc(100svh-5rem)]">
        <div className="absolute inset-0">
          <Image
            src="/portfolio/img-000.png"
            alt="Sepideh Mihanparast Beauty Artist"
            fill
            priority
            className="object-cover object-[48%_30%] opacity-90 md:object-[54%_28%] lg:object-[56%_26%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/75 via-45% to-transparent md:from-background/95 md:via-background/60 md:via-[42%] md:to-transparent" />
        </div>
        <div className="luxury-container relative flex min-h-[90vh] flex-col justify-center py-24 md:min-h-[calc(100svh-5rem)] md:py-20">
          <div className="relative z-10 max-w-xs sm:max-w-sm md:max-w-md">
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.4em] text-gold">
                {siteConfig.tagline}
              </p>
            </FadeIn>
            <TextReveal as="h1" className="mt-6 font-serif text-4xl leading-[1.1] md:text-5xl lg:text-6xl">
              {t("heroTitle")}
            </TextReveal>
            <FadeIn delay={0.2}>
              <p className="mt-4 text-sm font-medium uppercase tracking-[0.25em] text-foreground md:text-base lg:text-lg [text-shadow:0_1px_24px_rgba(255,255,255,0.85)]">
                <span className="block">{t("heroSubtitleLine1")}</span>
                <span className="block">{t("heroSubtitleLine2")}</span>
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="mt-6 text-lg text-foreground/85 [text-shadow:0_1px_24px_rgba(255,255,255,0.85)]">
                <span className="block">{t("heroDescriptionLine1")}</span>
                <span className="block">{t("heroDescriptionLine2")}</span>
              </p>
            </FadeIn>
            <FadeIn delay={0.4} className="mt-10 flex flex-wrap gap-4">
              <Button asChild variant="gold">
                <Link href="/booking">{tc("bookNow")}</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/portfolio">{tc("viewPortfolio")}</Link>
              </Button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="section-padding">
        <div className="luxury-container grid items-center gap-16 lg:grid-cols-2">
          <FadeIn>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src="/portfolio/img-001.png"
                alt={siteConfig.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </FadeIn>
          <div>
            <FadeIn>
              <div className="gold-line mb-6" />
              <h2 className="font-serif text-4xl md:text-5xl">{t("aboutPreviewTitle")}</h2>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="mt-6 text-lg leading-relaxed text-muted">
                {aboutBio[loc].intro}
              </p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="mt-4 leading-relaxed text-muted">{aboutBio[loc].philosophy}</p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <Button asChild variant="link" className="mt-8">
                <Link href="/about" className="inline-flex items-center gap-2">
                  {tc("learnMore")} <ArrowRight size={16} />
                </Link>
              </Button>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="section-padding bg-background-secondary">
        <div className="luxury-container">
          <FadeIn className="text-center">
            <div className="gold-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl">{t("servicesTitle")}</h2>
          </FadeIn>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service, i) => (
              <FadeIn key={service.slug} delay={i * 0.08}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block border border-border bg-background p-8 transition-all duration-300 hover:border-gold"
                >
                  <h3 className="font-serif text-2xl transition-colors group-hover:text-gold">
                    {service[loc].title}
                  </h3>
                  <p className="mt-3 text-sm text-muted">{service[loc].shortDesc}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
          <FadeIn className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/services">{tc("viewAll")}</Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* Featured Portfolio */}
      <section className="section-padding">
        <div className="luxury-container">
          <FadeIn className="flex items-end justify-between">
            <div>
              <div className="gold-line mb-6" />
              <h2 className="font-serif text-4xl md:text-5xl">{t("portfolioTitle")}</h2>
            </div>
            <Button asChild variant="link" className="hidden md:inline-flex">
              <Link href="/portfolio">{tc("viewAll")}</Link>
            </Button>
          </FadeIn>
          <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {featuredPortfolio.map((item, i) => (
              <FadeIn key={item.slug} delay={i * 0.05} className="mb-4 break-inside-avoid">
                <Link href={`/portfolio/${item.slug}`} className="group relative block overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item[loc].altText}
                    width={600}
                    height={800}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="font-serif text-xl text-white">{item[loc].title}</span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Bridal Showcase */}
      <ShowcaseSection
        title={t("bridalTitle")}
        items={bridalItems}
        locale={loc}
        bgClass="bg-background-secondary"
      />

      {/* Cannes */}
      <ShowcaseSection title={t("cannesTitle")} items={cannesItems} locale={loc} />

      {/* Editorial */}
      <ShowcaseSection
        title={t("editorialTitle")}
        items={editorialItems}
        locale={loc}
        bgClass="bg-background-secondary"
      />

      {/* Testimonials */}
      <section className="section-padding">
        <div className="luxury-container">
          <FadeIn className="text-center">
            <div className="gold-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl">{t("testimonialsTitle")}</h2>
          </FadeIn>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((item, i) => (
              <FadeIn key={item.clientName} delay={i * 0.1}>
                <div className="border border-border p-8">
                  <Quote className="text-gold" size={24} />
                  <p className="mt-4 leading-relaxed text-muted">{item[loc].content}</p>
                  <p className="mt-6 font-serif text-lg">— {item.clientName}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="section-padding bg-foreground text-background">
        <div className="luxury-container text-center">
          <FadeIn>
            <h2 className="font-serif text-4xl md:text-5xl">{t("instagramTitle")}</h2>
            <p className="mt-4 text-background/70">{siteConfig.instagramHandle}</p>
            <Button asChild variant="outline" className="mt-8 border-background text-background hover:bg-background hover:text-foreground">
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer">
                Follow on Instagram
              </a>
            </Button>
          </FadeIn>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-background-secondary">
        <div className="luxury-container max-w-3xl">
          <FadeIn className="text-center">
            <div className="gold-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl">{t("faqTitle")}</h2>
          </FadeIn>
          <div className="mt-12 space-y-6">
            {faqItems.map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <details className="group border border-border bg-background p-6">
                  <summary className="cursor-pointer list-none font-serif text-lg">
                    {item[loc].question}
                  </summary>
                  <p className="mt-4 text-muted">{item[loc].answer}</p>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="section-padding">
        <div className="luxury-container text-center">
          <FadeIn>
            <div className="gold-line mx-auto mb-6" />
            <h2 className="font-serif text-4xl md:text-5xl">{t("ctaTitle")}</h2>
            <p className="mx-auto mt-4 max-w-xl text-muted">{t("ctaDescription")}</p>
            <Button asChild variant="gold" className="mt-10">
              <Link href="/booking">{tc("bookNow")}</Link>
            </Button>
          </FadeIn>
        </div>
      </section>
    </>
  );
}

function ShowcaseSection({
  title,
  items,
  locale,
  bgClass = "",
}: {
  title: string;
  items: PublicPortfolioItem[];
  locale: Locale;
  bgClass?: string;
}) {
  if (items.length === 0) return null;

  return (
    <section className={`section-padding ${bgClass}`}>
      <div className="luxury-container">
        <FadeIn>
          <div className="gold-line mb-6" />
          <h2 className="font-serif text-4xl md:text-5xl">{title}</h2>
        </FadeIn>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.slice(0, 3).map((item, i) => (
            <FadeIn key={item.slug} delay={i * 0.1}>
              <Link href={`/portfolio/${item.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item[locale].altText}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="mt-4 font-serif text-xl">{item[locale].title}</h3>
                <p className="mt-2 text-sm text-muted line-clamp-2">
                  {item[locale].description}
                </p>
              </Link>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
