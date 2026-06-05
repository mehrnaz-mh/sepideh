export const siteImages = {
  hero: "/sepide/hero.jpg",
  aboutPreview: "/sepide/AE93EAD2-B5FC-4DB3-8415-9DC5E858E490.JPG",
  aboutPortrait: "/sepide/319CCBDE-E39A-4DE8-8A21-AF4411C61EDE.JPG",
} as const;

export const siteConfig = {
  name: "Sepideh Mihanparast",
  tagline: "Beauty Artist",
  taglineFull: "Luxury Hair & Makeup Hamburg",
  email: "se.mihanparast@yahoo.com",
  phone: "+49 176 567 33300",
  phoneDisplay: "+49 176 567 33300",
  phoneTel: "+4917656733300",
  whatsapp: "+4917656733300",
  whatsappUrl: "https://wa.me/4917656733300",
  instagram: "https://www.instagram.com/beautyartist.sepid",
  instagramHandle: "@beautyartist.sepid",
  street: "Eppendorfer Weg 13",
  postalCode: "20259",
  city: "Hamburg",
  country: "DE",
  countryName: "Germany",
  location: "Hamburg, Germany",
  addressFull: "Eppendorfer Weg 13, 20259 Hamburg",
  googleMapsUrl: "https://maps.google.com/?q=Eppendorfer+Weg+13+20259+Hamburg",
  latitude: 53.5857,
  longitude: 9.9769,
  defaultLocale: "de" as const,
  locales: ["de", "en"] as const,
  steuernummer: "[STEUERNUMMER_PLACEHOLDER]",
  finanzamt: "[FINANZAMT_PLACEHOLDER]",
};

export type Locale = (typeof siteConfig.locales)[number];

export const portfolioCategories = [
  {
    slug: "bridal",
    sortOrder: 1,
    de: { name: "Bridal Styling" },
    en: { name: "Bridal Styling" },
  },
  {
    slug: "cannes-red-carpet",
    sortOrder: 2,
    de: { name: "Cannes Red Carpet" },
    en: { name: "Cannes Red Carpet" },
  },
  {
    slug: "events",
    sortOrder: 3,
    de: { name: "Event Styling" },
    en: { name: "Event Styling" },
  },
  {
    slug: "editorial",
    sortOrder: 4,
    de: { name: "Fashion Editorials" },
    en: { name: "Fashion Editorials" },
  },
  {
    slug: "hairstyles",
    sortOrder: 5,
    de: { name: "Hairstyle Showcase" },
    en: { name: "Hairstyle Showcase" },
  },
  {
    slug: "eastern-bride",
    sortOrder: 6,
    de: { name: "Eastern Bride Project" },
    en: { name: "Eastern Bride Project" },
  },
  {
    slug: "makeup",
    sortOrder: 7,
    de: { name: "Makeup" },
    en: { name: "Makeup" },
  },
  {
    slug: "before-after",
    sortOrder: 8,
    de: { name: "Before & After" },
    en: { name: "Before & After" },
  },
] as const;

export const services = [
  {
    slug: "bridal-hair",
    durationMinutes: 120,
    bufferMinutes: 30,
    sortOrder: 1,
    de: {
      title: "Bridal Hair Styling",
      shortDesc: "Zeitlose Brautfrisuren für Ihren besonderen Tag",
      description:
        "Elegante, langlebige Brautfrisuren — von klassischer Eleganz bis minimalistischem Look. Jedes Styling wird individuell auf Ihre Persönlichkeit und Ihr Kleid abgestimmt.",
    },
    en: {
      title: "Bridal Hair Styling",
      shortDesc: "Timeless bridal hair for your special day",
      description:
        "Elegant, long-lasting bridal hairstyles — from classic elegance to minimalist looks. Each style is tailored to your personality and dress.",
    },
  },
  {
    slug: "bridal-makeup",
    durationMinutes: 90,
    bufferMinutes: 30,
    sortOrder: 2,
    de: {
      title: "Bridal Makeup",
      shortDesc: "Soft Glam & natürliche Braut-Make-up-Looks",
      description:
        "Flawless, camera-ready bridal makeup that enhances your natural beauty. Soft glam techniques for a radiant, unforgettable wedding day look.",
    },
    en: {
      title: "Bridal Makeup",
      shortDesc: "Soft glam & natural bridal makeup looks",
      description:
        "Flawless, camera-ready bridal makeup that enhances your natural beauty. Soft glam techniques for a radiant, unforgettable wedding day look.",
    },
  },
  {
    slug: "hair-styling",
    durationMinutes: 60,
    bufferMinutes: 15,
    sortOrder: 3,
    de: {
      title: "Hair Styling",
      shortDesc: "Updos, Wellen & moderne Frisuren",
      description:
        "Professionelles Haarstyling für jeden Anlass — von eleganten Updos bis zu soft glam Wellen.",
    },
    en: {
      title: "Hair Styling",
      shortDesc: "Updos, waves & modern hairstyles",
      description:
        "Professional hair styling for every occasion — from elegant updos to soft glam waves.",
    },
  },
  {
    slug: "makeup",
    durationMinutes: 60,
    bufferMinutes: 15,
    sortOrder: 4,
    de: {
      title: "Makeup",
      shortDesc: "Natürliche & glamouröse Make-up-Looks",
      description:
        "Clean beauty und Soft Glam Techniken für Events, Fotoshootings und besondere Anlässe.",
    },
    en: {
      title: "Makeup",
      shortDesc: "Natural & glamorous makeup looks",
      description:
        "Clean beauty and soft glam techniques for events, photoshoots, and special occasions.",
    },
  },
  {
    slug: "editorial-styling",
    durationMinutes: 180,
    bufferMinutes: 30,
    sortOrder: 5,
    de: {
      title: "Editorial Styling",
      shortDesc: "Kreative Beauty für Fashion Editorials",
      description:
        "Konzeptgetriebenes Beauty-Styling für Magazine, Kampagnen und kreative Shootings.",
    },
    en: {
      title: "Editorial Styling",
      shortDesc: "Creative beauty for fashion editorials",
      description:
        "Concept-driven beauty styling for magazines, campaigns, and creative shoots.",
    },
  },
  {
    slug: "fashion-styling",
    durationMinutes: 120,
    bufferMinutes: 30,
    sortOrder: 6,
    de: {
      title: "Fashion Styling",
      shortDesc: "Runway & Fashion Show Styling",
      description:
        "Professionelles Styling für Laufstege, Fashion Shows und kreative Projekte.",
    },
    en: {
      title: "Fashion Styling",
      shortDesc: "Runway & fashion show styling",
      description:
        "Professional styling for runways, fashion shows, and creative projects.",
    },
  },
  {
    slug: "red-carpet",
    durationMinutes: 90,
    bufferMinutes: 30,
    sortOrder: 7,
    de: {
      title: "Red Carpet Styling",
      shortDesc: "Elegantes Styling für den roten Teppich",
      description:
        "Raffiniertes Haar- und Make-up-Styling für Red Carpet Events, Festivals und Galas.",
    },
    en: {
      title: "Red Carpet Styling",
      shortDesc: "Elegant styling for the red carpet",
      description:
        "Refined hair and makeup styling for red carpet events, festivals, and galas.",
    },
  },
  {
    slug: "event-styling",
    durationMinutes: 90,
    bufferMinutes: 20,
    sortOrder: 8,
    de: {
      title: "Event Styling",
      shortDesc: "Styling für Events & Galas",
      description:
        "Sophisticated styling für Konzerte, Awards, Galas und besondere Veranstaltungen.",
    },
    en: {
      title: "Event Styling",
      shortDesc: "Styling for events & galas",
      description:
        "Sophisticated styling for concerts, awards, galas, and special events.",
    },
  },
  {
    slug: "hair-extensions",
    durationMinutes: 120,
    bufferMinutes: 15,
    sortOrder: 9,
    de: {
      title: "Hair Extensions",
      shortDesc: "Professionelle Haarverlängerungen",
      description:
        "Natürliche Haarverlängerungen und -verdichtungen für voluminöse, elegante Looks.",
    },
    en: {
      title: "Hair Extensions",
      shortDesc: "Professional hair extensions",
      description:
        "Natural hair extensions and thickening for voluminous, elegant looks.",
    },
  },
  {
    slug: "vip-services",
    durationMinutes: 180,
    bufferMinutes: 30,
    sortOrder: 10,
    de: {
      title: "VIP Services",
      shortDesc: "Exklusives Premium-Styling",
      description:
        "Persönlicher VIP-Service mit individueller Betreuung für besondere Anlässe und Prominente.",
    },
    en: {
      title: "VIP Services",
      shortDesc: "Exclusive premium styling",
      description:
        "Personal VIP service with individual attention for special occasions and celebrities.",
    },
  },
  {
    slug: "consultation",
    durationMinutes: 30,
    bufferMinutes: 10,
    sortOrder: 11,
    de: {
      title: "Consultation",
      shortDesc: "Persönliche Beauty-Beratung",
      description:
        "Individuelle Beratung für Brautlooks, Event-Styling oder Ihr persönliches Beauty-Konzept.",
    },
    en: {
      title: "Consultation",
      shortDesc: "Personal beauty consultation",
      description:
        "Individual consultation for bridal looks, event styling, or your personal beauty concept.",
    },
  },
] as const;

export const portfolioItems = [
  {
    slug: "classic-elegance-bridal",
    categorySlug: "bridal",
    featured: true,
    sortOrder: 1,
    image: "/portfolio/can-01.jpg",
    de: {
      title: "Classic Elegance",
      description:
        "Eine anmutige, zeitlose Brautlook mit soft, polierter Schönheit und raffiniertem Haarstyling.",
      altText: "Klassische elegante Brautfrisur von Sepideh Mihanparast",
    },
    en: {
      title: "Classic Elegance",
      description:
        "A graceful, timeless bridal look with soft, polished beauty and refined hair styling.",
      altText: "Classic elegant bridal hairstyle by Sepideh Mihanparast",
    },
  },
  {
    slug: "minimalist-bridal",
    categorySlug: "bridal",
    featured: true,
    sortOrder: 2,
    image: "/portfolio/can-02.jpg",
    de: {
      title: "Minimalist Look",
      description:
        "Ein clean, frischer und moderner Brautstil mit Fokus auf natürliche Schönheit.",
      altText: "Minimalistischer Brautlook",
    },
    en: {
      title: "Minimalist Look",
      description:
        "A clean, fresh, and modern bridal style focused on natural beauty and subtle enhancement.",
      altText: "Minimalist bridal look",
    },
  },
  {
    slug: "wedding-day-glam",
    categorySlug: "bridal",
    featured: true,
    sortOrder: 3,
    image: "/portfolio/can-03.jpg",
    de: {
      title: "Wedding Day Glam",
      description:
        "Makelloser, zeitloser Brautlook mit Soft Glam Make-up und elegantem Haarstyling.",
      altText: "Wedding Day Glam Brautstyling",
    },
    en: {
      title: "Wedding Day Glam",
      description:
        "A flawless, timeless bridal look with soft glam makeup and elegant, polished hair styling.",
      altText: "Wedding day glam bridal styling",
    },
  },
  {
    slug: "cannes-parinaz-izadyar",
    categorySlug: "cannes-red-carpet",
    featured: true,
    sortOrder: 1,
    image: "/portfolio/can-04.jpg",
    de: {
      title: "Red Carpet — Parinaz Izadyar",
      description:
        "Elegantes Haarstyling für eine iranische Schauspielerin auf dem Cannes Red Carpet.",
      altText: "Cannes Red Carpet Haarstyling Parinaz Izadyar",
    },
    en: {
      title: "Red Carpet — Parinaz Izadyar",
      description:
        "Elegant hair styling for an Iranian actress attending the Cannes red carpet.",
      altText: "Cannes red carpet hair styling Parinaz Izadyar",
    },
  },
  {
    slug: "cannes-soha-niasti",
    categorySlug: "cannes-red-carpet",
    featured: true,
    sortOrder: 2,
    image: "/portfolio/can-05.jpg",
    de: {
      title: "Red Carpet — Soha Niasti",
      description:
        "Poliertes, elegantes Haarstyling für den Cannes Red Carpet.",
      altText: "Cannes Red Carpet Haarstyling Soha Niasti",
    },
    en: {
      title: "Red Carpet — Soha Niasti",
      description:
        "A polished and elegant hair look for the Cannes red carpet.",
      altText: "Cannes red carpet hair styling Soha Niasti",
    },
  },
  {
    slug: "cannes-sasha-ray-wiba",
    categorySlug: "cannes-red-carpet",
    featured: true,
    sortOrder: 3,
    image: "/portfolio/can-06.jpg",
    de: {
      title: "WIBA Awards — Sasha Ray",
      description:
        "Haarstyling für die WIBA Awards während des Cannes Festivals 2025.",
      altText: "WIBA Awards Cannes Sasha Ray",
    },
    en: {
      title: "WIBA Awards — Sasha Ray",
      description:
        "Hair styling for the WIBA Awards during the 2025 Cannes Festival.",
      altText: "WIBA Awards Cannes Sasha Ray",
    },
  },
  {
    slug: "wot-awards-lilly-becker",
    categorySlug: "events",
    featured: true,
    sortOrder: 1,
    image: "/portfolio/can-07.jpg",
    de: {
      title: "WOT Awards — Lilly Becker",
      description:
        "Sophisticated Styling für die Women On Top Awards in Düsseldorf.",
      altText: "Lilly Becker WOT Awards Styling",
    },
    en: {
      title: "WOT Awards — Lilly Becker",
      description:
        "Sophisticated styling for the Women On Top Awards in Düsseldorf.",
      altText: "Lilly Becker WOT Awards styling",
    },
  },
  {
    slug: "concert-ayda-rastgoo",
    categorySlug: "events",
    featured: false,
    sortOrder: 2,
    image: "/portfolio/can-08.jpg",
    de: {
      title: "Concert — Ayda Rastgoo",
      description:
        "Elegantes Styling für eine Pianistin beim Konzert in Hamburg.",
      altText: "Ayda Rastgoo Konzert Styling",
    },
    en: {
      title: "Concert — Ayda Rastgoo",
      description:
        "Elegant styling for a pianist performing at a concert in Hamburg.",
      altText: "Ayda Rastgoo concert styling",
    },
  },
  {
    slug: "concert-heliy0m-zedbazi",
    categorySlug: "events",
    featured: false,
    sortOrder: 3,
    image: "/portfolio/can-09.jpg",
    de: {
      title: "Concert — Heliy0m",
      description:
        "Bold, modernes Styling für die Sängerin von Zedbazi in Hamburg.",
      altText: "Heliy0m Zedbazi Konzert Styling",
    },
    en: {
      title: "Concert — Heliy0m",
      description:
        "Bold, modern styling for the vocalist of Zedbazi in Hamburg.",
      altText: "Heliy0m Zedbazi concert styling",
    },
  },
  {
    slug: "editorial-glam",
    categorySlug: "editorial",
    featured: true,
    sortOrder: 1,
    image: "/portfolio/can-10.png",
    de: {
      title: "Editorial Glam",
      description:
        "Kreatives, konzeptgetriebenes Beauty-Styling für Fashion Editorials.",
      altText: "Editorial Glam Fashion Styling",
    },
    en: {
      title: "Editorial Glam",
      description:
        "Creative, concept-driven beauty styling for fashion editorials.",
      altText: "Editorial glam fashion styling",
    },
  },
  {
    slug: "sleek-ponytail",
    categorySlug: "hairstyles",
    featured: false,
    sortOrder: 1,
    image: "/portfolio/can-11.png",
    de: {
      title: "Sleek Ponytail",
      description: "Polierter High Ponytail mit glänzendem Finish.",
      altText: "Sleek Ponytail Frisur",
    },
    en: {
      title: "Sleek Ponytail",
      description: "Polished high ponytail with a smooth, glossy finish.",
      altText: "Sleek ponytail hairstyle",
    },
  },
  {
    slug: "soft-braided-chignon",
    categorySlug: "hairstyles",
    featured: false,
    sortOrder: 2,
    image: "/portfolio/can-12.jpg",
    de: {
      title: "Soft Braided Chignon",
      description: "Soft braided updo mit voluminöser Krone.",
      altText: "Soft Braided Chignon",
    },
    en: {
      title: "Soft Braided Chignon",
      description: "Soft braided updo featuring a voluminous crown.",
      altText: "Soft braided chignon",
    },
  },
  {
    slug: "structured-updo",
    categorySlug: "hairstyles",
    featured: false,
    sortOrder: 3,
    image: "/portfolio/can-13.png",
    de: {
      title: "Structured Updo",
      description: "Polierter, strukturierter Low Updo mit Perlen-Accessoire.",
      altText: "Structured Updo mit Perlen",
    },
    en: {
      title: "Structured Updo",
      description: "Polished structured low updo with pearl accessory.",
      altText: "Structured updo with pearls",
    },
  },
  {
    slug: "soft-waves-hijab",
    categorySlug: "hairstyles",
    featured: true,
    sortOrder: 4,
    image: "/portfolio/can-14.jpg",
    de: {
      title: "Soft Waves with Hijab",
      description: "Soft, loose Wellen kombiniert mit Hijab für einen modernen Look.",
      altText: "Soft Waves mit Hijab",
    },
    en: {
      title: "Soft Waves with Hijab",
      description: "Soft, loose waves combined with hijab for a chic modern look.",
      altText: "Soft waves with hijab",
    },
  },
  {
    slug: "eastern-bride-achaemenid",
    categorySlug: "eastern-bride",
    featured: true,
    sortOrder: 1,
    image: "/portfolio/can-15.png",
    de: {
      title: "Eastern-Inspired Bridal",
      description:
        "Achaemenid-inspiriertes Brautkonzept, fotografiert in Rom mit internationalem Team.",
      altText: "Eastern Bride Project Achaemenid",
    },
    en: {
      title: "Eastern-Inspired Bridal",
      description:
        "Achaemenid-inspired bridal concept, photographed in Rome with an international team.",
      altText: "Eastern bride project Achaemenid",
    },
  },
  {
    slug: "hollywood-waves",
    categorySlug: "makeup",
    featured: false,
    sortOrder: 1,
    image: "/portfolio/can-16.png",
    de: {
      title: "Hollywood Wave Styling",
      description: "Klassische Hollywood Waves mit elegantem Finish.",
      altText: "Hollywood Wave Styling",
    },
    en: {
      title: "Hollywood Wave Styling",
      description: "Classic Hollywood waves with an elegant finish.",
      altText: "Hollywood wave styling",
    },
  },
  {
    slug: "soft-glam-makeup",
    categorySlug: "makeup",
    featured: true,
    sortOrder: 2,
    image: "/portfolio/can-17.jpg",
    de: {
      title: "Soft Glam Makeup",
      description: "Luminöses Soft Glam Make-up für Events und Brautlooks.",
      altText: "Soft Glam Makeup",
    },
    en: {
      title: "Soft Glam Makeup",
      description: "Luminous soft glam makeup for events and bridal looks.",
      altText: "Soft glam makeup",
    },
  },
] as const;

export const testimonials = [
  {
    clientName: "Linda R.",
    featured: true,
    sortOrder: 1,
    de: { content: "Absolut Traumhaft — Vielen Dank nochmal für die Haare! Es sah absolut traumhaft aus! Wir kommen sehr gerne wieder zu dir!" },
    en: { content: "Absolutely dreamy — Thank you again for the hair! It looked absolutely dreamy! We would love to come back to you!" },
  },
  {
    clientName: "Jennifer S.",
    featured: true,
    sortOrder: 2,
    de: {
      content:
        "Hielt die ganze Nacht — Die Haare waren perfekt und haben bis 3 Uhr gehalten. Es sah wirklich wunderschön aus, und sie haben sich kein bisschen bewegt. Ich habe so viele Komplimente bekommen.",
    },
    en: {
      content:
        "Lasted all night — The hair was perfect and lasted until 3 AM. It looked truly beautiful and didn't move at all. I received so many compliments.",
    },
  },
  {
    clientName: "Dagmar D.",
    featured: true,
    sortOrder: 3,
    de: {
      content:
        "Den ganzen Abend perfekt — Meine und Liens Haare und Make-up haben bis zum Ende der Feier perfekt gehalten. Danke!",
    },
    en: {
      content:
        "Perfect all evening — My and Lien's hair and makeup lasted perfectly until the end of the celebration. Thank you!",
    },
  },
] as const;

export const experienceTimeline = [
  {
    period: "2022 – Present",
    de: {
      title: "Professional Styling",
      description:
        "Professionelle Erfahrung in Modeling-Projekten und Styling für Models, Bräute, Influencer und Künstler.",
    },
    en: {
      title: "Professional Styling",
      description:
        "Professional experience in modeling projects and styling for models, brides, influencers, and artists.",
    },
  },
  {
    period: "2018 – 2022",
    de: {
      title: "Germany — Hair & Makeup",
      description:
        "Professionelles Haarstyling in Deutschland und Makeup-Ausbildung in einem Beauty Salon in Hamburg.",
    },
    en: {
      title: "Germany — Hair & Makeup",
      description:
        "Professional hairstyling in Germany and makeup training at a beauty salon in Hamburg.",
    },
  },
  {
    period: "2013 – 2017",
    de: {
      title: "Tehran — Professional Styling",
      description:
        "Professionelles Styling für Models, Bräute, Influencer und Künstler mit starker Beauty- und Fashion-Erfahrung.",
    },
    en: {
      title: "Tehran — Professional Styling",
      description:
        "Professional styling for models, brides, influencers, and artists with strong beauty and fashion background.",
    },
  },
  {
    period: "2010 – 2013",
    de: {
      title: "Tehran — Foundations",
      description:
        "Updo-Haarstyling und professionelle Flechttechniken in einem Beauty Salon in Tehran.",
    },
    en: {
      title: "Tehran — Foundations",
      description:
        "Updo hairstyling and professional braiding techniques at a beauty salon in Tehran.",
    },
  },
] as const;

export const certifications = [
  {
    year: "2025",
    de: {
      title: "Michelle Academy — Soft Glam & Bridal Makeup",
      description:
        "Zertifikate in Soft Glam Makeup und Bridal Makeup mit Fokus auf luminous skin und camera-ready beauty.",
    },
    en: {
      title: "Michelle Academy — Soft Glam & Bridal Makeup",
      description:
        "Certificates in Soft Glam Makeup and Bridal Makeup, focusing on luminous skin and camera-ready beauty.",
    },
  },
  {
    year: "2024",
    de: {
      title: "Mahsa Imani Academy — Updo & Hair Styling",
      description:
        "Professionelle Updo- und Hair Styling Zertifizierung mit Hollywood Waves und Bridal Techniken.",
    },
    en: {
      title: "Mahsa Imani Academy — Updo & Hair Styling",
      description:
        "Professional updo and hair styling certification with Hollywood waves and bridal techniques.",
    },
  },
  {
    year: "2022",
    de: {
      title: "Elena Noruzi Academy — Makeup",
      description:
        "Professionelle Makeup-Zertifizierung mit Clean Beauty und Soft Glam Techniken.",
    },
    en: {
      title: "Elena Noruzi Academy — Makeup",
      description:
        "Professional makeup certification focused on clean beauty and soft glam techniques.",
    },
  },
  {
    year: "2018",
    de: {
      title: "Bakhshi Academy, Hamburg — Hair Styling",
      description:
        "Professionelle Hair Styling Zertifizierung mit europäischen Techniken und modernen Brautlooks.",
    },
    en: {
      title: "Bakhshi Academy, Hamburg — Hair Styling",
      description:
        "Professional hair styling certification specializing in European techniques and modern bridal looks.",
    },
  },
  {
    year: "2013",
    de: {
      title: "Tehran — Hair Braiding",
      description:
        "Professionelles Zertifikat in natürlichem und synthetischem Haarflechten.",
    },
    en: {
      title: "Tehran — Hair Braiding",
      description:
        "Professional certificate in natural and synthetic hair braiding.",
    },
  },
] as const;

export const aboutBio = {
  de: {
    intro:
      "Hi, ich bin Sepideh Mihanparast, Hairstylistin und Make-up-Artistin. Ich begann meine Karriere in Tehran, Iran, wo ich meine Leidenschaft für Beauty, Kreativität und das Gefühl entdeckte, Menschen strahlend und selbstbewusst zu machen.",
    journey:
      "Seit 2018 setze ich meine professionelle Reise in Deutschland fort und bringe meine Erfahrung, künstlerische Vision und persönliche Note in jedes Styling ein.",
    philosophy:
      "Für mich geht es bei Beauty darum, natürliche Merkmale zu betonen, nicht sie zu verbergen. Ich liebe es, elegante, zeitlose Looks ebenso wie moderne, fashion-forward Styles zu kreieren — immer abgestimmt auf die Persönlichkeit jedes Menschen.",
    highlights:
      "Zusammenarbeit mit bekannten Beauty-Influencern aus Iran, Deutschland und Russland sowie Styling iranischer Schauspielerinnen für den roten Teppich beim Cannes Film Festival.",
  },
  en: {
    intro:
      "Hi, I'm Sepideh Mihanparast, a hairstylist and makeup artist. I began my career in Tehran, Iran, where I discovered my passion for beauty, creativity, and helping people feel confident and radiant.",
    journey:
      "Since 2018, I've continued my professional journey in Germany, bringing my experience, artistic vision, and personal touch to every client I work with.",
    philosophy:
      "For me, beauty is about enhancing natural features, not hiding them. I love creating elegant, timeless looks as well as modern, fashion-forward styles — always tailored to each person's personality and vibe.",
    highlights:
      "Collaborations with well-known beauty influencers from Iran, Germany, and Russia, as well as styling Iranian actresses for red-carpet appearances at the Cannes Film Festival.",
  },
};

export const faqItems = [
  {
    de: {
      question: "Wie weit im Voraus sollte ich buchen?",
      answer:
        "Für Brauttermine empfehle ich eine Buchung 3–6 Monate im Voraus. Für Events und Editorial-Produktionen mindestens 4–8 Wochen.",
    },
    en: {
      question: "How far in advance should I book?",
      answer:
        "For bridal appointments, I recommend booking 3–6 months in advance. For events and editorial projects, at least 4–8 weeks.",
    },
  },
  {
    de: {
      question: "Kommen Sie auch zum Kunden?",
      answer:
        "Ja, ich biete mobile Services in Hamburg und Umgebung an. Für Reisen außerhalb Hamburgs erstelle ich ein individuelles Angebot.",
    },
    en: {
      question: "Do you travel to clients?",
      answer:
        "Yes, I offer mobile services in Hamburg and surrounding areas. For travel outside Hamburg, I provide a custom quote.",
    },
  },
  {
    de: {
      question: "Was passiert nach der Buchungsanfrage?",
      answer:
        "Sie erhalten eine Bestätigungs-E-Mail. Ich prüfe Ihre Anfrage und bestätige den Termin innerhalb von 24–48 Stunden.",
    },
    en: {
      question: "What happens after I submit a booking request?",
      answer:
        "You'll receive a confirmation email. I review your request and confirm the appointment within 24–48 hours.",
    },
  },
  {
    de: {
      question: "Welche Produkte verwenden Sie?",
      answer:
        "Ich arbeite ausschließlich mit Premium-Produkten für langanhaltende, camera-ready Ergebnisse.",
    },
    en: {
      question: "What products do you use?",
      answer:
        "I work exclusively with premium products for long-lasting, camera-ready results.",
    },
  },
] as const;

export const workingHours = [
  { dayOfWeek: "TUESDAY" as const, startTime: "10:00", endTime: "19:00" },
  { dayOfWeek: "WEDNESDAY" as const, startTime: "10:00", endTime: "19:00" },
  { dayOfWeek: "THURSDAY" as const, startTime: "10:00", endTime: "19:00" },
  { dayOfWeek: "FRIDAY" as const, startTime: "10:00", endTime: "19:00" },
  { dayOfWeek: "SATURDAY" as const, startTime: "10:00", endTime: "17:00" },
];

export const blogCategories = [
  { slug: "bridal-beauty", de: { name: "Bridal Beauty" }, en: { name: "Bridal Beauty" } },
  { slug: "hair-care", de: { name: "Hair Care" }, en: { name: "Hair Care" } },
  { slug: "makeup", de: { name: "Makeup" }, en: { name: "Makeup" } },
  { slug: "beauty-trends", de: { name: "Beauty Trends" }, en: { name: "Beauty Trends" } },
  { slug: "fashion", de: { name: "Fashion" }, en: { name: "Fashion" } },
  { slug: "editorial", de: { name: "Editorial" }, en: { name: "Editorial" } },
] as const;
