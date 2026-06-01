import { getTranslations, setRequestLocale } from "next-intl/server";
import { Mail, MapPin, Phone, AtSign } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { siteConfig } from "@/data/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "de" ? "Kontakt" : "Contact" };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");

  return (
    <>
      <section className="section-padding bg-background-secondary">
        <div className="luxury-container">
          <FadeIn>
            <div className="gold-line mb-6" />
            <h1 className="font-serif text-5xl md:text-6xl">{t("title")}</h1>
            <p className="mt-4 text-lg text-muted">{t("subtitle")}</p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="luxury-container grid gap-12 md:grid-cols-2">
          {[
            {
              icon: Mail,
              label: t("email"),
              value: siteConfig.email,
              href: `mailto:${siteConfig.email}`,
            },
            {
              icon: Phone,
              label: t("phone"),
              value: siteConfig.phoneDisplay,
              href: `tel:${siteConfig.phone.replace(/\s/g, "")}`,
            },
            {
              icon: MapPin,
              label: t("location"),
              value: siteConfig.location,
            },
            {
              icon: AtSign,
              label: t("instagram"),
              value: siteConfig.instagramHandle,
              href: siteConfig.instagram,
            },
          ].map((item, i) => (
            <FadeIn key={item.label} delay={i * 0.1}>
              <div className="border border-border p-8">
                <item.icon className="text-gold" size={24} />
                <p className="mt-4 text-xs uppercase tracking-widest text-muted">
                  {item.label}
                </p>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="mt-2 block font-serif text-xl transition-colors hover:text-gold"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="mt-2 font-serif text-xl">{item.value}</p>
                )}
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
