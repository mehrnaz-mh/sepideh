"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/data/content";
import { AtSign, Mail, Phone } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");
  const legal = useTranslations("legal");

  return (
    <footer className="border-t border-border bg-background-secondary">
      <div className="luxury-container section-padding">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <h3 className="font-serif text-3xl">{siteConfig.name}</h3>
            <p className="mt-4 max-w-md text-muted">{t("tagline")}</p>
            <div className="mt-6 flex flex-col gap-3 text-sm text-muted">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-center gap-2 transition-colors hover:text-gold"
              >
                <Mail size={16} />
                {siteConfig.email}
              </a>
              <a
                href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 transition-colors hover:text-gold"
              >
                <Phone size={16} />
                {siteConfig.phoneDisplay}
              </a>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 transition-colors hover:text-gold"
              >
                <AtSign size={16} />
                {siteConfig.instagramHandle}
              </a>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em]">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/about" className="hover:text-gold">
                  {nav("about")}
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold">
                  {nav("services")}
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="hover:text-gold">
                  {nav("portfolio")}
                </Link>
              </li>
              <li>
                <Link href="/booking" className="hover:text-gold">
                  {nav("booking")}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs uppercase tracking-[0.2em]">
              {t("legal")}
            </h4>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/legal/impressum" className="hover:text-gold">
                  {legal("impressum")}
                </Link>
              </li>
              <li>
                <Link href="/legal/datenschutz" className="hover:text-gold">
                  {legal("privacy")}
                </Link>
              </li>
              <li>
                <Link href="/legal/agb" className="hover:text-gold">
                  {legal("terms")}
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="hover:text-gold">
                  {legal("cookies")}
                </Link>
              </li>
              <li>
                <Link href="/legal/widerruf" className="hover:text-gold">
                  {legal("withdrawal")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted md:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.name}. {t("rights")}.
          </p>
          <p>{siteConfig.location}</p>
        </div>
      </div>
    </footer>
  );
}
