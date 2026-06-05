import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { siteConfig } from "@/data/content";

function InstagramIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    title: locale === "de" ? "Kontakt" : "Contact",
    description:
      locale === "de"
        ? "Kontaktieren Sie Sepideh Mihanparast — Hairstylistin & Makeup-Artist in Hamburg. Termin buchen oder direkt schreiben."
        : "Contact Sepideh Mihanparast — hair stylist & makeup artist in Hamburg. Book your appointment or get in touch.",
    alternates: { canonical: `${siteUrl}/${locale}/contact` },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const isDe = locale === "de";

  const contactItems = [
    {
      icon: Mail,
      label: t("email"),
      value: siteConfig.email,
      href: `mailto:${siteConfig.email}`,
      external: false,
    },
    {
      icon: Phone,
      label: t("phone"),
      value: siteConfig.phoneDisplay,
      href: `tel:${siteConfig.phoneTel}`,
      external: false,
    },
    {
      icon: MapPin,
      label: t("location"),
      value: siteConfig.addressFull,
      href: siteConfig.googleMapsUrl,
      external: true,
    },
    {
      icon: InstagramIcon,
      label: "Instagram",
      value: siteConfig.instagramHandle,
      href: siteConfig.instagram,
      external: true,
    },
  ];

  return (
    <>
      <section className="section-padding-hero bg-background-secondary">
        <div className="luxury-container">
          <FadeIn>
            <div className="gold-line mb-6" />
            <h1 className="text-5xl md:text-6xl">{t("title")}</h1>
            <p className="mt-4 text-lg text-muted">{t("subtitle")}</p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="luxury-container">
          {/* WhatsApp CTA */}
          <FadeIn>
            <a
              href={siteConfig.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-12 flex items-center gap-4 border border-border bg-background-secondary p-6 transition-colors hover:border-gold group rounded-lg"
            >
              <span className="text-gold">
                <WhatsAppIcon size={32} />
              </span>
              <div>
                <p className="text-xl group-hover:text-gold transition-colors">
                  {isDe ? "WhatsApp schreiben" : "Message on WhatsApp"}
                </p>
                <p className="mt-1 text-sm text-muted">{siteConfig.phoneDisplay}</p>
              </div>
            </a>
          </FadeIn>

          <div className="grid gap-8 md:grid-cols-2">
            {contactItems.map((item, i) => (
              <FadeIn key={item.label} delay={i * 0.1}>
                <div className="border border-border p-8 rounded-lg">
                  <item.icon className="text-gold" size={24} />
                  <p className="mt-4 text-xs uppercase tracking-widest text-muted">
                    {item.label}
                  </p>
                  <a
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="mt-2 block text-xl transition-colors hover:text-gold"
                  >
                    {item.value}
                  </a>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
