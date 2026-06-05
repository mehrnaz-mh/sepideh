export const siteConfig = {
  name: "Sepideh Mihanparast",
  tagline: "Beauty Artist",
  taglineFull: "Luxury Hair & Makeup Hamburg",

  // Contact
  email: "se.mihanparast@yahoo.com",
  phone: "+49 176 567 33300",
  phoneDisplay: "+49 176 567 33300",
  phoneTel: "+4917656733300",
  whatsapp: "+4917656733300",
  whatsappUrl: "https://wa.me/4917656733300",
  instagram: "https://www.instagram.com/beautyartist.sepid",
  instagramHandle: "@beautyartist.sepid",

  // Address
  street: "Eppendorfer Weg 13",
  postalCode: "20259",
  city: "Hamburg",
  country: "DE",
  countryName: "Germany",
  addressFull: "Eppendorfer Weg 13, 20259 Hamburg",
  googleMapsUrl:
    "https://maps.google.com/?q=Eppendorfer+Weg+13+20259+Hamburg",

  // Geo
  latitude: 53.5857,
  longitude: 9.9769,

  // Site
  defaultLocale: "de" as const,
  locales: ["de", "en"] as const,

  // Legal — fill in with real values before launch
  steuernummer: "[STEUERNUMMER_PLACEHOLDER]",
  finanzamt: "[FINANZAMT_PLACEHOLDER]",
} as const;

export type Locale = (typeof siteConfig.locales)[number];

export function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ).replace(/\/$/, "");
}

export const whatsappButton = {
  de: "WhatsApp schreiben",
  en: "Message on WhatsApp",
} as const;
