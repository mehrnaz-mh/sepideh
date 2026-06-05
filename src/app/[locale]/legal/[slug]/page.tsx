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
${siteConfig.street}
${siteConfig.postalCode} ${siteConfig.city}
${siteConfig.countryName}

Kontakt:
Telefon: ${siteConfig.phoneDisplay}
E-Mail: ${siteConfig.email}

Berufsbezeichnung: Professionelle Hairstylistin & Make-up-Artistin
Verantwortlich für den Inhalt: ${siteConfig.name}

Steuernummer: ${siteConfig.steuernummer}
Zuständiges Finanzamt: ${siteConfig.finanzamt}
      `.trim(),
    },
    en: {
      title: "Legal Notice",
      content: `
Information pursuant to § 5 TMG (German Telemedia Act)

${siteConfig.name}
Beauty Artist — Hair & Makeup
${siteConfig.street}
${siteConfig.postalCode} ${siteConfig.city}
${siteConfig.countryName}

Contact:
Phone: ${siteConfig.phoneDisplay}
Email: ${siteConfig.email}

Profession: Professional Hair Stylist & Makeup Artist
Responsible for content: ${siteConfig.name}

Tax number: ${siteConfig.steuernummer}
Responsible tax office: ${siteConfig.finanzamt}
      `.trim(),
    },
  },
  datenschutz: {
    de: {
      title: "Datenschutzerklärung",
      content: `
1. Verantwortlicher
${siteConfig.name}
${siteConfig.street}, ${siteConfig.postalCode} ${siteConfig.city}
E-Mail: ${siteConfig.email}

2. Erhebung und Speicherung personenbezogener Daten
Bei der Terminbuchung erheben wir: Name, E-Mail, Telefonnummer, Buchungsdetails.
Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung).

3. Zweck der Verarbeitung
Terminverwaltung, Kundenkommunikation, Erfüllung vertraglicher Pflichten.

4. Speicherdauer
Buchungsdaten werden gemäß gesetzlicher Aufbewahrungsfristen gespeichert.

5. Hosting & E-Mail-Versand
Diese Website wird gehostet von Vercel Inc., 340 Pine Street, Suite 701,
San Francisco, California 94104, USA. Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO.
Datenschutzerklärung Vercel: https://vercel.com/legal/privacy-policy

Für den E-Mail-Versand nutzen wir Resend (Resend Inc., USA).
Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO.
Datenschutzerklärung Resend: https://resend.com/legal/privacy-policy

6. Cookies
Wir verwenden ausschließlich technisch notwendige Cookies für die Website-Funktionalität.

7. Ihre Rechte
Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
Datenübertragbarkeit und Widerspruch. Wenden Sie sich dazu an: ${siteConfig.email}
      `.trim(),
    },
    en: {
      title: "Privacy Policy",
      content: `
1. Controller
${siteConfig.name}
${siteConfig.street}, ${siteConfig.postalCode} ${siteConfig.city}
Email: ${siteConfig.email}

2. Collection of Personal Data
When booking, we collect: name, email, phone number, booking details.
Legal basis: Art. 6(1)(b) GDPR (contract performance).

3. Purpose of Processing
Appointment management, customer communication, contractual obligations.

4. Retention
Booking data is stored according to legal retention periods.

5. Hosting & Email Delivery
This website is hosted by Vercel Inc., 340 Pine Street, Suite 701,
San Francisco, California 94104, USA. Legal basis: Art. 6(1)(f) GDPR.
Vercel privacy policy: https://vercel.com/legal/privacy-policy

For email delivery we use Resend (Resend Inc., USA).
Legal basis: Art. 6(1)(b) GDPR.
Resend privacy policy: https://resend.com/legal/privacy-policy

6. Cookies
We use only technically necessary cookies for website functionality.

7. Your Rights
You have the right to access, rectification, erasure, restriction, portability and objection.
Contact us at: ${siteConfig.email}
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
Terminanfragen werden nach Eingang vom Studio geprüft und bestätigt.
Ein Termin gilt erst nach ausdrücklicher Bestätigung durch das Studio als verbindlich.

3. Terminbuchung & Bestätigung
Bei Nichtantritt eines bestätigten Termins ohne vorherige Absprache behalten
wir uns vor, eine Ausfallgebühr zu erheben.

4. Preise
Es gelten die zum Buchungszeitpunkt angegebenen Preisbereiche.

5. Haftung
Die Haftung ist auf Vorsatz und grobe Fahrlässigkeit beschränkt, soweit gesetzlich zulässig.
      `.trim(),
    },
    en: {
      title: "Terms & Conditions",
      content: `
1. Scope
These terms apply to all beauty services provided by ${siteConfig.name}.

2. Appointments
Appointment requests are reviewed and confirmed by the studio upon receipt.
An appointment is only binding after explicit confirmation by the studio.

3. Appointment Booking & Confirmation
In case of no-show without prior notice, we reserve the right to charge a cancellation fee.

4. Prices
Prices listed at the time of booking apply.

5. Liability
Liability is limited to intent and gross negligence where legally permitted.
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
      `.trim(),
    },
    en: {
      title: "Right of Withdrawal",
      content: `
Right of Withdrawal

You have the right to withdraw from this contract within fourteen days without giving any reason.

The withdrawal period is fourteen days from the day of the conclusion of the contract.

To exercise your right of withdrawal, contact us at ${siteConfig.email}.
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
    <section className="section-padding-hero">
      <div className="luxury-container max-w-3xl">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl">{content.title}</h1>
          <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-line text-muted">
            {content.content}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
