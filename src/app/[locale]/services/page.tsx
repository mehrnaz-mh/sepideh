import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/motion/fade-in";
import { ServiceListItem } from "@/components/services/service-list-item";
import { Button } from "@/components/ui/button";
import { faqItems, services } from "@/data/content";
import type { Locale } from "@/data/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === "de" ? "Leistungen" : "Services",
  };
}

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

  return (
    <>
      <section className="section-padding bg-background-secondary">
        <div className="luxury-container">
          <FadeIn>
            <div className="gold-line mb-6" />
            <h1 className="font-serif text-5xl md:text-6xl">{t("title")}</h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">{t("subtitle")}</p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="luxury-container">
          <div className="mx-auto max-w-5xl">
            {services.map((service, i) => (
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
            <h2 className="font-serif text-4xl">{t("faqTitle")}</h2>
          </FadeIn>
          <div className="mt-8 space-y-3">
            {faqItems.map((item, i) => (
              <FadeIn key={i} delay={i * 0.05}>
                <details className="group border border-border bg-background px-6 py-5 open:border-gold/30">
                  <summary className="cursor-pointer list-none font-serif text-lg [&::-webkit-details-marker]:hidden">
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
