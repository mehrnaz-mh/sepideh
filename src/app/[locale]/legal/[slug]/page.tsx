import { setRequestLocale } from "next-intl/server";
import { FadeIn } from "@/components/motion/fade-in";
import { siteConfig } from "@/data/content";

const legalContent = {
  impressum: {
    de: {
      title: "Impressum",
      content: `
Angaben gemäß § 5 TMG

${siteConfig.name}
Beauty Artist — Hair & Makeup

${siteConfig.location}

Kontakt:
Telefon: ${siteConfig.phoneDisplay}
E-Mail: ${siteConfig.email}

Berufsbezeichnung: Professionelle Hairstylistin & Make-up-Artistin
Verantwortlich für den Inhalt: ${siteConfig.name}

Hinweis: Bitte ergänzen Sie Ihre vollständige Geschäftsadresse vor dem Launch.
      `.trim(),
    },
    en: {
      title: "Legal Notice",
      content: `
Information pursuant to § 5 TMG (German Telemedia Act)

${siteConfig.name}
Beauty Artist — Hair & Makeup

${siteConfig.location}

Contact:
Phone: ${siteConfig.phoneDisplay}
Email: ${siteConfig.email}

Profession: Professional Hair Stylist & Makeup Artist
Responsible for content: ${siteConfig.name}

Note: Please add your complete business address before launch.
      `.trim(),
    },
  },
  datenschutz: {
    de: {
      title: "Datenschutzerklärung",
      content: `
1. Verantwortlicher
${siteConfig.name}, ${siteConfig.email}

2. Erhebung und Speicherung personenbezogener Daten
Bei der Terminbuchung erheben wir: Name, E-Mail, Telefonnummer (optional), Buchungsdetails.

3. Zweck der Verarbeitung
Terminverwaltung, Kundenkommunikation, Erfüllung vertraglicher Pflichten.

4. Rechtsgrundlage
Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung), Art. 6 Abs. 1 lit. a DSGVO (Einwilligung für Analytics).

5. Speicherdauer
Buchungsdaten werden gemäß gesetzlicher Aufbewahrungsfristen gespeichert.

6. Ihre Rechte
Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch.

7. Cookies & Analytics
Mit Ihrer Einwilligung setzen wir Google Analytics 4 und Microsoft Clarity ein.

Bitte lassen Sie diese Datenschutzerklärung vor dem Launch von einem Anwalt prüfen.
      `.trim(),
    },
    en: {
      title: "Privacy Policy",
      content: `
1. Controller
${siteConfig.name}, ${siteConfig.email}

2. Collection of Personal Data
When booking, we collect: name, email, phone (optional), booking details.

3. Purpose of Processing
Appointment management, customer communication, contractual obligations.

4. Legal Basis
Art. 6(1)(b) GDPR (contract performance), Art. 6(1)(a) GDPR (consent for analytics).

5. Retention
Booking data is stored according to legal retention periods.

6. Your Rights
Access, rectification, erasure, restriction, portability, objection.

7. Cookies & Analytics
With your consent, we use Google Analytics 4 and Microsoft Clarity.

Please have this privacy policy reviewed by a lawyer before launch.
      `.trim(),
    },
  },
  agb: {
    de: {
      title: "Allgemeine Geschäftsbedingungen",
      content: `
1. Geltungsbereich
Diese AGB gelten für alle Beauty-Dienstleistungen von ${siteConfig.name}.

2. Terminvereinbarung
Termine sind verbindlich nach schriftlicher Bestätigung.

3. Stornierung
Stornierungen mindestens 48 Stunden vor dem Termin. Bei späterer Stornierung kann eine Ausfallgebühr anfallen.

4. Preise
Es gelten die zum Buchungszeitpunkt angegebenen Preisbereiche.

5. Haftung
Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt, soweit gesetzlich zulässig.

Bitte lassen Sie diese AGB vor dem Launch von einem Anwalt prüfen.
      `.trim(),
    },
    en: {
      title: "Terms & Conditions",
      content: `
1. Scope
These terms apply to all beauty services provided by ${siteConfig.name}.

2. Appointments
Appointments are binding upon written confirmation.

3. Cancellation
Cancellations at least 48 hours before the appointment. Late cancellations may incur a fee.

4. Prices
Prices listed at the time of booking apply.

5. Liability
Liability is limited to intent and gross negligence where legally permitted.

Please have these terms reviewed by a lawyer before launch.
      `.trim(),
    },
  },
  cookies: {
    de: {
      title: "Cookie-Richtlinie",
      content: `
Diese Website verwendet Cookies.

Notwendige Cookies: Für grundlegende Website-Funktionen.

Analyse-Cookies (optional): Google Analytics 4, Microsoft Clarity — nur mit Ihrer Einwilligung.

Sie können Ihre Einwilligung jederzeit widerrufen.
      `.trim(),
    },
    en: {
      title: "Cookie Policy",
      content: `
This website uses cookies.

Essential cookies: For basic website functionality.

Analytics cookies (optional): Google Analytics 4, Microsoft Clarity — only with your consent.

You may withdraw consent at any time.
      `.trim(),
    },
  },
  widerruf: {
    de: {
      title: "Widerrufsbelehrung",
      content: `
Widerrufsrecht

Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.

Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.

Um Ihr Widerrufsrecht auszuüben, kontaktieren Sie uns unter ${siteConfig.email}.

Bitte lassen Sie diese Widerrufsbelehrung vor dem Launch von einem Anwalt prüfen.
      `.trim(),
    },
    en: {
      title: "Right of Withdrawal",
      content: `
Right of Withdrawal

You have the right to withdraw from this contract within fourteen days without giving any reason.

The withdrawal period is fourteen days from the day of the conclusion of the contract.

To exercise your right of withdrawal, contact us at ${siteConfig.email}.

Please have this withdrawal notice reviewed by a lawyer before launch.
      `.trim(),
    },
  },
} as const;

export function generateStaticParams() {
  return Object.keys(legalContent).flatMap((slug) =>
    ["de", "en"].map((locale) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const page = legalContent[slug as keyof typeof legalContent];
  if (!page) return {};
  const loc = locale as "de" | "en";
  return { title: page[loc].title };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const page = legalContent[slug as keyof typeof legalContent];
  if (!page) return null;

  const loc = locale as "de" | "en";
  const content = page[loc];

  return (
    <section className="section-padding">
      <div className="luxury-container max-w-3xl">
        <FadeIn>
          <h1 className="font-serif text-4xl md:text-5xl">{content.title}</h1>
          <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-line text-muted">
            {content.content}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
