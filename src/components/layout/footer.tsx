"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/data/content";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

function InstagramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const legal = useTranslations("legal");

  return (
    <footer className="border-t border-border bg-background-secondary">
      <div className="luxury-container pt-8 md:pt-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {/* Col 1 — Brand + Contact */}
          <div>
            <h3 className="text-2xl">{siteConfig.name}</h3>
            <p className="mt-2 text-sm text-muted">{t("tagline")}</p>
            <div className="mt-5 flex flex-col gap-2.5 text-sm text-muted">
              <a href={siteConfig.googleMapsUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-2 transition-colors hover:text-gold">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                <span>{siteConfig.street}, {siteConfig.postalCode} {siteConfig.city}</span>
              </a>
              <a href={`tel:${siteConfig.phoneTel}`}
                className="flex items-center gap-2 transition-colors hover:text-gold">
                <Phone size={14} />
                {siteConfig.phoneDisplay}
              </a>
              <a href={siteConfig.whatsappUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-gold">
                <WhatsAppIcon size={14} />
                WhatsApp
              </a>
              <a href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 transition-colors hover:text-gold">
                <Mail size={14} />
                {siteConfig.email}
              </a>
              <a href={siteConfig.instagram} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-gold">
                <InstagramIcon size={14} />
                {siteConfig.instagramHandle}
              </a>
            </div>
          </div>

          {/* Col 2 — Navigation */}
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em]">Navigation</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/about" className="hover:text-gold">{nav("about")}</Link></li>
              <li><Link href="/services" className="hover:text-gold">{nav("services")}</Link></li>
              <li><Link href="/portfolio" className="hover:text-gold">{nav("portfolio")}</Link></li>
              <li><Link href="/booking" className="hover:text-gold">{nav("booking")}</Link></li>
              <li><Link href="/contact" className="hover:text-gold">{nav("contact")}</Link></li>
            </ul>
          </div>

          {/* Col 3 — Legal */}
          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em]">{t("legal")}</h4>
            <ul className="space-y-2 text-sm text-muted">
              <li><Link href="/legal/impressum" className="hover:text-gold">{legal("impressum")}</Link></li>
              <li><Link href="/legal/datenschutz" className="hover:text-gold">{legal("privacy")}</Link></li>
              <li><Link href="/legal/agb" className="hover:text-gold">{legal("terms")}</Link></li>
              <li><Link href="/legal/cookies" className="hover:text-gold">{legal("cookies")}</Link></li>
              <li><Link href="/legal/widerruf" className="hover:text-gold">{legal("withdrawal")}</Link></li>
            </ul>
          </div>

        </div>

        {/* Copyright bar */}
        <div className="mt-6 border-t border-border py-4 text-xs text-muted">
          <p>© {new Date().getFullYear()} {siteConfig.name}. {t("rights")}.</p>
        </div>
      </div>
    </footer>
  );
}
