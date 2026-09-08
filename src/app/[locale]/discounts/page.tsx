import type { Metadata } from "next";
import { connection } from "next/server";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { TicketPercent } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { discountToday } from "@/lib/discounts";
import { formatCalendarDate, parseCalendarDate } from "@/lib/dates";
import { DiscountCard } from "./discount-card";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "discounts" });
  return {
    title: t("title"),
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/discounts`,
      languages: { de: "/de/discounts", en: "/en/discounts" },
    },
  };
}

export default async function DiscountsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  await connection();
  const t = await getTranslations("discounts");
  const offers = await prisma.discountOffer.findMany({
    where: {
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gte: parseCalendarDate(discountToday()) } }],
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <>
      <section className="section-padding-hero bg-background-secondary">
        <div className="luxury-container">
          <div className="gold-line mb-6" />
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-muted">{t("eyebrow")}</p>
          <h1 className="text-4xl sm:text-5xl">{t("title")}</h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted">{t("subtitle")}</p>
        </div>
      </section>
      <section className="section-padding">
        <div className="luxury-container">
          <p className="mx-auto mb-8 max-w-7xl text-sm text-muted">
            {t("checkoutHint")}
          </p>
          {offers.length ? (
            <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {offers.map((offer) => (
                <DiscountCard key={offer.id} offer={{
                  id: offer.id,
                  brandName: offer.brandName,
                  logoUrl: offer.logoUrl,
                  discountLabel: offer.discountLabel,
                  code: offer.code,
                  url: offer.url,
                  title: locale === "de" ? offer.offerDe : offer.offerEn,
                  expiresAt: offer.expiresAt ? formatCalendarDate(offer.expiresAt) : null,
                }} />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-border px-6 py-16 text-center">
              <TicketPercent size={36} strokeWidth={1} className="mx-auto mb-5 text-muted" />
              <h2 className="text-2xl">{t("emptyTitle")}</h2>
              <p className="mx-auto mt-3 max-w-lg text-muted">{t("emptyDescription")}</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
