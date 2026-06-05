import React from "react";
import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Crown, Wand2, Scissors, Sparkles, Camera, Star, Drama, Waves, Gem } from "lucide-react";
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
  siteImages,
  testimonials,
} from "@/data/content";
import { getPublicPortfolioItems } from "@/lib/portfolio-public";
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

  const faqData = faqItems.map((item) => ({
    question: item[loc].question,
    answer: item[loc].answer,
  }));

  return (
    <>
      <JsonLd data={[localBusinessSchema(locale), personSchema(locale), faqSchema(faqData)]} />

      {/* Hero — mobile: image then copy; lg+: 50/50 split */}
      <section className="flex flex-col bg-background-secondary lg:grid lg:min-h-[calc(100svh-5rem)] lg:grid-cols-2 overflow-hidden">
        <div className="relative order-1 aspect-[3/4] w-full sm:aspect-[4/5] lg:order-2 lg:aspect-auto lg:min-h-[calc(100svh-5rem)]">
          <Image
            src={siteImages.hero}
            alt="Sepideh Mihanparast Beauty Artist"
            fill
            priority
            className="object-cover object-[42%_22%] sm:object-[40%_20%] lg:object-[38%_center]"
            sizes="(max-width: 1023px) 100vw, 50vw"
          />
          {/* Fade left edge — extends past column boundary */}
          <div className="absolute inset-y-0 -left-16 w-1/2 bg-gradient-to-r from-background-secondary from-30% to-transparent" />
        </div>

        <div className="order-2 flex flex-col justify-center px-6 py-12 sm:px-10 sm:py-14 lg:order-1 lg:px-12 lg:py-16 xl:px-16 xl:py-20 2xl:px-20">
          <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-md xl:max-w-lg">
            <FadeIn>
              <p className="text-xs uppercase tracking-[0.4em] text-gold">
                {siteConfig.tagline}
              </p>
            </FadeIn>
            <TextReveal
              as="h1"
              className="mt-5 text-[2.5rem] leading-[1.08] sm:text-5xl lg:mt-6 lg:text-[3.25rem] xl:text-6xl"
            >
              {t("heroTitle")}
            </TextReveal>
            <FadeIn delay={0.2}>
              <p className="mt-5 text-xs font-medium uppercase tracking-[0.22em] text-foreground sm:text-sm lg:mt-6 lg:text-base lg:tracking-[0.25em]">
                <span className="block">{t("heroSubtitleLine1")}</span>
                <span className="block">{t("heroSubtitleLine2")}</span>
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <p className="mt-5 max-w-sm text-base leading-relaxed text-foreground/90 sm:text-lg lg:mt-6">
                <span className="block">{t("heroDescriptionLine1")}</span>
                <span className="block">{t("heroDescriptionLine2")}</span>
              </p>
            </FadeIn>
            <FadeIn delay={0.4} className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:gap-4">
              <Button asChild variant="gold" className="w-full sm:w-auto">
                <Link href="/booking">{tc("bookNow")}</Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
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
            <div className="relative aspect-[4/5] overflow-hidden rounded-[5px] bg-background-secondary">
              <Image
                src={siteImages.aboutPreview}
                alt={siteConfig.name}
                fill
                className="object-cover object-[50%_22%]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeIn>
          <div>
            <FadeIn>
              <div className="gold-line mb-6" />
              <h2 className="text-4xl md:text-5xl">{t("aboutPreviewTitle")}</h2>
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
            <h2 className="text-4xl md:text-5xl">{t("servicesTitle")}</h2>
          </FadeIn>
          {(() => {
            const serviceIcons: Record<string, React.ReactNode> = {
              "bridal-hair": <Crown size={20} className="text-gold shrink-0" />,
              "bridal-makeup": <Wand2 size={20} className="text-gold shrink-0" />,
              "hair-styling": <Scissors size={20} className="text-gold shrink-0" />,
              "makeup": <Sparkles size={20} className="text-gold shrink-0" />,
              "editorial-styling": <Camera size={20} className="text-gold shrink-0" />,
              "fashion-styling": <Star size={20} className="text-gold shrink-0" />,
              "red-carpet": <Drama size={20} className="text-gold shrink-0" />,
              "event-styling": <Gem size={20} className="text-gold shrink-0" />,
              "hair-extensions": <Waves size={20} className="text-gold shrink-0" />,
            };
            return (
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredServices.map((service, i) => (
              <FadeIn key={service.slug} delay={i * 0.08}>
                <Link
                  href={`/services/${service.slug}`}
                  className="group block border border-border bg-background p-8 transition-all duration-300 hover:border-gold rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {serviceIcons[service.slug] ?? <Sparkles size={20} className="text-gold shrink-0" />}
                    <h3 className="text-2xl transition-colors group-hover:text-gold">
                      {service[loc].title}
                    </h3>
                  </div>
                  <p className="mt-3 text-sm text-muted">{service[loc].shortDesc}</p>
                </Link>
              </FadeIn>
            ))}
          </div>
            );
          })()}
          <FadeIn className="mt-12 text-center">
            <Button asChild variant="outline">
              <Link href="/services">
                {loc === "de" ? "Alle 11 Leistungen ansehen →" : "View All 11 Services →"}
              </Link>
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
              <h2 className="text-4xl md:text-5xl">{t("portfolioTitle")}</h2>
            </div>
            <Button asChild variant="link" className="hidden md:inline-flex">
              <Link href="/portfolio">{tc("viewAll")}</Link>
            </Button>
          </FadeIn>
          <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
            {featuredPortfolio.map((item, i) => (
              <FadeIn key={item.slug} delay={i * 0.05} className="mb-4 break-inside-avoid">
                <Link href="/portfolio" className="group relative block overflow-hidden rounded-lg">
                  <Image
                    src={item.image}
                    alt={item[loc].altText}
                    width={600}
                    height={800}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-xl text-white">{item[loc].title}</span>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="luxury-container">
          <FadeIn className="text-center">
            <div className="gold-line mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl">{t("testimonialsTitle")}</h2>
          </FadeIn>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {testimonials.map((item, i) => (
              <FadeIn key={item.clientName} delay={i * 0.1}>
                <div className="border border-border p-8 rounded-lg">
                  <Quote className="text-gold" size={24} />
                  <p className="mt-4 leading-relaxed text-muted">{item[loc].content}</p>
                  <p className="mt-6 text-lg">— {item.clientName}</p>
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
            <h2 className="text-4xl md:text-5xl">{t("instagramTitle")}</h2>
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
            <h2 className="text-4xl md:text-5xl">{t("faqTitle")}</h2>
          </FadeIn>
          <div className="mt-12 space-y-6">
            {faqItems.map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <details className="group border border-border bg-background p-6 rounded-lg">
                  <summary className="cursor-pointer list-none text-lg">
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
            <h2 className="text-4xl md:text-5xl">{t("ctaTitle")}</h2>
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

