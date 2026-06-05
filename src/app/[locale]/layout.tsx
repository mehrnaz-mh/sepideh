import type { Metadata } from "next";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CookieConsent } from "@/components/legal/cookie-consent";
import { Analytics } from "@/components/analytics";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isDe = locale === "de";

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  return {
    title: {
      default: isDe
        ? "Sepideh Mihanparast — Luxury Hair & Makeup Hamburg"
        : "Sepideh Mihanparast — Luxury Hair & Makeup Hamburg",
      template: "%s | Sepideh Mihanparast",
    },
    description: isDe
      ? "Professionelle Hairstylistin & Makeup-Artist in Hamburg. Braut-Styling, Red Carpet, Editorial & Event Beauty von Sepideh Mihanparast."
      : "Professional hair stylist & makeup artist in Hamburg. Bridal styling, red carpet, editorial & event beauty by Sepideh Mihanparast.",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: {
        de: `${siteUrl}/de`,
        en: `${siteUrl}/en`,
      },
    },
    openGraph: {
      type: "website",
      locale: isDe ? "de_DE" : "en_GB",
      siteName: "Sepideh Mihanparast",
      images: [
        {
          url: `${siteUrl}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: "Sepideh Mihanparast — Luxury Hair & Makeup Hamburg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`${siteUrl}/og-image.jpg`],
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as "de" | "en")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <CookieConsent />
      <Analytics />
    </NextIntlClientProvider>
  );
}
