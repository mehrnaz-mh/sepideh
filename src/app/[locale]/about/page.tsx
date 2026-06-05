import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeIn } from "@/components/motion/fade-in";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import {
  aboutBio,
  certifications,
  experienceTimeline,
  siteConfig,
  siteImages,
} from "@/data/content";
import type { Locale } from "@/data/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isDe = locale === "de";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: isDe ? "Über mich" : "About Me",
    description: isDe
      ? "Erfahren Sie mehr über Sepideh Mihanparast — Hairstylistin und Makeup-Artist in Hamburg mit über 15 Jahren Erfahrung."
      : "Learn about Sepideh Mihanparast — hair stylist and makeup artist in Hamburg, with over 15 years of experience.",
    alternates: { canonical: `${siteUrl}/${locale}/about` },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("about");
  const loc = locale as Locale;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `${siteUrl}/${locale}` },
          { name: t("title"), url: `${siteUrl}/${locale}/about` },
        ])}
      />

      <section className="section-padding-hero bg-background-secondary">
        <div className="luxury-container">
          <FadeIn>
            <div className="gold-line mb-6" />
            <h1 className="text-5xl md:text-6xl">{t("title")}</h1>
            <p className="mt-4 text-lg text-muted">{t("subtitle")}</p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="luxury-container grid items-start gap-16 lg:grid-cols-2">
          <FadeIn>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[5px] bg-background-secondary">
              <Image
                src={siteImages.aboutPortrait}
                alt={siteConfig.name}
                fill
                className="object-cover object-[52%_28%]"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </FadeIn>
          <div className="space-y-6">
            <FadeIn>
              <p className="text-lg leading-relaxed">{aboutBio[loc].intro}</p>
            </FadeIn>
            <FadeIn delay={0.1}>
              <p className="leading-relaxed text-muted">{aboutBio[loc].journey}</p>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="leading-relaxed text-muted">{aboutBio[loc].philosophy}</p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="border-l-2 border-gold pl-6">
                <h3 className="text-xl">{t("highlightsTitle")}</h3>
                <p className="mt-2 text-muted">{aboutBio[loc].highlights}</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="pt-14 pb-0 md:pt-20 bg-background-secondary">
        <div className="luxury-container">
          <FadeIn>
            <h2 className="text-4xl">{t("timelineTitle")}</h2>
          </FadeIn>
          <div className="mt-12 space-y-8">
            {experienceTimeline.map((item, i) => (
              <FadeIn key={item.period} delay={i * 0.08}>
                <div className={`grid gap-4 border-b pb-8 md:grid-cols-[200px_1fr] ${i < experienceTimeline.length - 1 ? "border-border" : "border-transparent"}`}>
                  <span className="text-sm uppercase tracking-widest text-gold">
                    {item.period}
                  </span>
                  <div>
                    <h3 className="text-2xl">{item[loc].title}</h3>
                    <p className="mt-2 text-muted">{item[loc].description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="luxury-container">
          <FadeIn>
            <h2 className="text-4xl">{t("certificationsTitle")}</h2>
          </FadeIn>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {certifications.map((cert, i) => (
              <FadeIn key={cert.year + cert[loc].title} delay={i * 0.08}>
                <div className="border border-border p-8">
                  <span className="text-xs uppercase tracking-widest text-gold">
                    {cert.year}
                  </span>
                  <h3 className="mt-3 text-xl">{cert[loc].title}</h3>
                  <p className="mt-3 text-sm text-muted">{cert[loc].description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
