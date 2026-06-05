import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeIn } from "@/components/motion/fade-in";
import { MapPin, MessageCircle } from "lucide-react";
import { siteConfig } from "@/data/content";
import { BookingClient } from "./booking-dynamic";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: locale === "de" ? "Termin buchen" : "Book an Appointment",
    description:
      locale === "de"
        ? "Termin buchen bei Sepideh Mihanparast in Hamburg — Braut-Hair, Make-up, Red Carpet Styling."
        : "Book your appointment with Sepideh Mihanparast in Hamburg. Bridal hair, makeup, red carpet styling.",
    alternates: {
      canonical: `${siteUrl}/${locale}/booking`,
      languages: {
        de: `${siteUrl}/de/booking`,
        en: `${siteUrl}/en/booking`,
      },
    },
    openGraph: {
      title: locale === "de" ? "Termin buchen — Sepideh Mihanparast" : "Book an Appointment — Sepideh Mihanparast",
      description: locale === "de"
        ? "Jetzt Termin online buchen."
        : "Book your beauty appointment online.",
      url: `${siteUrl}/${locale}/booking`,
    },
  };
}


export default async function BookingPageWrapper({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("booking");

  return (
    <>
      <section className="section-padding-hero bg-background-secondary">
        <div className="luxury-container max-w-3xl">
          <FadeIn>
            <div className="gold-line mb-6" />
            <h1 className="text-5xl">{t("title")}</h1>
            <p className="mt-4 text-muted">{t("subtitle")}</p>
          </FadeIn>

          <div className="mt-6 border border-border bg-background p-5">
            <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:gap-8">
              <a
                href={siteConfig.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted hover:text-gold transition-colors"
              >
                <MapPin size={14} className="shrink-0 text-gold" />
                <span>Studio: {siteConfig.addressFull}</span>
              </a>
              <a
                href={siteConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted hover:text-gold transition-colors"
              >
                <MessageCircle size={14} className="shrink-0 text-gold" />
                <span>
                  {locale === "de"
                    ? "Für Terminreservierungen können Sie das Formular unten nutzen oder uns direkt per WhatsApp schreiben."
                    : "To book an appointment, use the form below or message us directly on WhatsApp."}
                </span>
              </a>
            </div>
          </div>

          <BookingClient />
        </div>
      </section>
    </>
  );
}
