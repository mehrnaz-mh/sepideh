"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/data/content";

const navItems = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/blog", key: "blog" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="luxury-container flex h-20 items-center justify-between">
        <Link href="/" className="group flex flex-col">
          <span className="font-serif text-xl tracking-wide md:text-2xl">
            {siteConfig.name.split(" ")[0]}
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted transition-colors group-hover:text-gold">
            Beauty Artist
          </span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className={cn(
                "text-xs uppercase tracking-[0.15em] transition-colors hover:text-gold",
                pathname === item.href ? "text-gold" : "text-foreground",
              )}
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LocaleSwitcher currentLocale={locale} />
          <Button asChild variant="gold" size="sm">
            <Link href="/booking">{t("booking")}</Link>
          </Button>
        </div>

        <button
          type="button"
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-border bg-background lg:hidden">
          <nav className="luxury-container flex flex-col gap-4 py-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm uppercase tracking-[0.15em]"
              >
                {t(item.key)}
              </Link>
            ))}
            <LocaleSwitcher currentLocale={locale} />
            <Button asChild variant="gold">
              <Link href="/booking" onClick={() => setMobileOpen(false)}>
                {t("booking")}
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

function LocaleSwitcher({ currentLocale }: { currentLocale: string }) {
  return (
    <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
      {siteConfig.locales.map((locale) => (
        <Link
          key={locale}
          href="/"
          locale={locale}
          className={cn(
            "transition-colors hover:text-gold",
            currentLocale === locale ? "text-gold" : "text-muted",
          )}
        >
          {locale}
        </Link>
      ))}
    </div>
  );
}
