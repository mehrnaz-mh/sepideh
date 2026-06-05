import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/motion/fade-in";
import { ServiceListItem } from "@/components/services/service-list-item";
import { Button } from "@/components/ui/button";
import { faqItems, services, siteConfig } from "@/data/content";
import type { Locale } from "@/data/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: locale === "de" ? "Leistungen" : "Services",
    description:
      locale === "de"
        ? "Alle Beauty-Leistungen von Sepideh Mihanparast in Hamburg — Braut-Styling, Make-up, Editorial, Red Carpet & VIP Pakete."
        : "Discover all beauty services by Sepideh Mihanparast in Hamburg — bridal hair, makeup, editorial styling, red carpet & VIP packages.",
    alternates: { canonical: `${siteUrl}/${locale}/services` },
  };
}

const serviceGroups = {
  de: [
    {
      title: "Bridal",
      slugs: ["bridal-hair", "bridal-makeup"],
      featured: true,
    },
    {
      title: "Hair & Makeup",
      slugs: ["hair-styling", "makeup", "hair-extensions"],
      featured: false,
    },
    {
      title: "Special Events",
      slugs: ["red-carpet", "event-styling", "fashion-styling", "editorial-styling"],
      featured: false,
    },
    {
      title: "Weitere Leistungen",
      slugs: ["vip-services", "consultation"],
      featured: false,
    },
  ],
  en: [
    {
      title: "Bridal",
      slugs: ["bridal-hair", "bridal-makeup"],
      featured: true,
    },
    {
      title: "Hair & Makeup",
      slugs: ["hair-styling", "makeup", "hair-extensions"],
      featured: false,
    },
    {
      title: "Special Events",
      slugs: ["red-carpet", "event-styling", "fashion-styling", "editorial-styling"],
      featured: false,
    },
    {
      title: "Other",
      slugs: ["vip-services", "consultation"],
      featured: false,
    },
  ],
} as const;

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("services");
  const tc = await getTranslations("common");
  const loc = locale as Locale;
  const groups = serviceGroups[loc];

  return (
    <>
      <section className="section-padding-hero bg-background-secondary">
        <div className="luxury-container">
          <FadeIn>
            <div className="gold-line mb-6" />
            <h1 className="text-5xl md:text-6xl">{t("title")}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{t("subtitle")}</p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="luxury-container">
          <div className="mx-auto max-w-5xl space-y-16">
            {groups.map((group) => {
              const groupServices = services.filter((s) =>
                (group.slugs as readonly string[]).includes(s.slug),
              );
              return (
                <div key={group.title}>
                  <FadeIn>
                    <div className={`mb-2 flex items-center gap-4 ${group.featured ? "text-gold" : ""}`}>
                      <div className={`h-px flex-1 ${group.featured ? "bg-gold" : "bg-border"}`} />
                      <h2 className={`text-xs uppercase tracking-[0.25em] ${group.featured ? "text-gold font-semibold" : "text-muted"}`}>
                        {group.title}
                      </h2>
                      <div className={`h-px flex-1 ${group.featured ? "bg-gold" : "bg-border"}`} />
                    </div>
                  </FadeIn>

                  {(group.slugs as readonly string[]).includes("vip-services") ? (
                    <>
                      {groupServices.filter((s) => (s.slug as string) !== "vip-services").map((service, i) => (
                        <FadeIn key={service.slug} delay={i * 0.04}>
                          <ServiceListItem
                            service={service}
                            locale={loc}
                            index={i}
                            learnMoreLabel={tc("learnMore")}
                            bookLabel={tc("bookNow")}
                            minutesLabel={tc("minutes")}
                          />
                        </FadeIn>
                      ))}
                      {/* VIP special block */}
                      <FadeIn>
                        <div className="border border-border bg-background-secondary py-10 px-6 mt-4">
                          <p className="text-2xl">VIP Services</p>
                          <p className="mt-2 text-muted">
                            {loc === "de"
                              ? "Für VIP-Buchungen kontaktieren Sie uns bitte direkt."
                              : "For VIP bookings, please contact us directly."}
                          </p>
                          <div className="mt-4 flex flex-wrap gap-4 text-sm">
                            <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-gold">
                              WhatsApp
                            </a>
                            <a href={`mailto:${siteConfig.email}`} className="underline hover:text-gold">
                              {siteConfig.email}
                            </a>
                          </div>
                        </div>
                      </FadeIn>
                    </>
                  ) : (
                    groupServices.map((service, i) => (
                      <FadeIn key={service.slug} delay={i * 0.04}>
                        <ServiceListItem
                          service={service}
                          locale={loc}
                          index={i}
                          learnMoreLabel={tc("learnMore")}
                          bookLabel={tc("bookNow")}
                          minutesLabel={tc("minutes")}
                        />
                      </FadeIn>
                    ))
                  )}
                </div>
              );
            })}
          </div>

          <FadeIn className="mx-auto mt-20 max-w-5xl border-t border-border pt-16 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-muted">
              {t("ctaHint")}
            </p>
            <Button asChild variant="gold" className="mt-8">
              <Link href="/booking">{tc("bookNow")}</Link>
            </Button>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding bg-background-secondary">
        <div className="luxury-container max-w-3xl">
          <FadeIn>
            <h2 className="text-4xl">{t("faqTitle")}</h2>
          </FadeIn>
          <div className="mt-8 space-y-3">
            {faqItems.map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <details className="group border border-border bg-background px-6 py-5 open:border-gold/30">
                  <summary className="cursor-pointer list-none text-lg [&::-webkit-details-marker]:hidden">
                    <span className="flex items-center justify-between gap-4">
                      {item[loc].question}
                      <span className="text-gold transition-transform group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-4 border-t border-border pt-4 text-muted">
                    {item[loc].answer}
                  </p>
                </details>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
