import { siteConfig } from "@/data/content";

interface JsonLdProps {
  data: Record<string, unknown> | Record<string, unknown>[];
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

function siteUrl() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

export function localBusinessSchema(locale: string) {
  const url = siteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `${siteConfig.name} — Luxury Hair & Makeup`,
    description:
      locale === "de"
        ? "Professionelle Hairstylistin und Make-up-Artistin in Hamburg"
        : "Professional hair stylist and makeup artist in Hamburg",
    url: `${url}/${locale}`,
    telephone: siteConfig.phoneTel,
    email: siteConfig.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.street,
      postalCode: siteConfig.postalCode,
      addressLocality: siteConfig.city,
      addressCountry: siteConfig.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: siteConfig.latitude,
      longitude: siteConfig.longitude,
    },
    image: `${url}/og-image.jpg`,
    priceRange: "€€",
    sameAs: [siteConfig.instagram],
  };
}

export function personSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    jobTitle:
      locale === "de"
        ? "Professionelle Hairstylistin & Make-up-Artistin"
        : "Professional Hair Stylist & Makeup Artist",
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.street,
      postalCode: siteConfig.postalCode,
      addressLocality: siteConfig.city,
      addressCountry: siteConfig.country,
    },
    sameAs: [siteConfig.instagram],
  };
}

export function faqSchema(
  items: { question: string; answer: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
