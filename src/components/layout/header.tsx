"use client";

import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
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

const menuEase = [0.22, 1, 0.36, 1] as const;
const menuTransition = { duration: 0.55, ease: menuEase };

export function Header() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="luxury-container flex h-20 items-center justify-between">
        <Link href="/" className="group flex flex-col" onClick={() => setMobileOpen(false)}>
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
          className={cn(
            "flex h-10 w-10 items-center justify-center border transition-colors lg:hidden",
            mobileOpen
              ? "border-gold text-foreground"
              : "border-transparent text-foreground hover:border-gold/60",
          )}
          onClick={() => setMobileOpen((open) => !open)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? <X size={22} strokeWidth={1.5} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <MobileMenu
            locale={locale}
            pathname={pathname}
            shouldReduceMotion={shouldReduceMotion}
            onClose={() => setMobileOpen(false)}
            t={t}
          />
        )}
      </AnimatePresence>
    </header>
  );
}

function MobileMenu({
  locale,
  pathname,
  shouldReduceMotion,
  onClose,
  t,
}: {
  locale: string;
  pathname: string;
  shouldReduceMotion: boolean | null;
  onClose: () => void;
  t: ReturnType<typeof useTranslations<"nav">>;
}) {
  const instant = shouldReduceMotion === true;
  const backdropTransition = instant ? { duration: 0 } : menuTransition;
  const panelTransition = instant ? { duration: 0 } : menuTransition;

  return (
    <div className="lg:hidden">
      <motion.button
        type="button"
        className="fixed inset-0 z-40 cursor-default bg-foreground/35 backdrop-blur-[2px]"
        aria-hidden
        tabIndex={-1}
        initial={{ opacity: instant ? 1 : 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={backdropTransition}
        onClick={onClose}
      />

      <motion.div
        className="fixed inset-x-0 top-20 z-40 max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-border/80 bg-background shadow-[0_24px_48px_-12px_rgba(0,0,0,0.12)]"
        initial={instant ? false : { opacity: 0, y: "-100%" }}
        animate={{ opacity: 1, y: 0 }}
        exit={instant ? undefined : { opacity: 0, y: "-100%" }}
        transition={panelTransition}
      >
        <nav className="luxury-container flex flex-col gap-5 py-8 pb-10">
          {navItems.map((item, index) => (
            <motion.div
              key={item.key}
              initial={instant ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={instant ? undefined : { opacity: 0, y: 8 }}
              transition={{
                duration: instant ? 0 : 0.45,
                delay: instant ? 0 : 0.08 + index * 0.05,
                ease: menuEase,
              }}
            >
              <Link
                href={item.href}
                onClick={onClose}
                className={cn(
                  "block text-sm uppercase tracking-[0.2em] transition-colors hover:text-gold",
                  pathname === item.href ? "text-gold" : "text-foreground",
                )}
              >
                {t(item.key)}
              </Link>
            </motion.div>
          ))}

          <motion.div
            initial={instant ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={instant ? undefined : { opacity: 0, y: 8 }}
            transition={{
              duration: instant ? 0 : 0.45,
              delay: instant ? 0 : 0.45,
              ease: menuEase,
            }}
          >
            <LocaleSwitcher currentLocale={locale} onNavigate={onClose} />
          </motion.div>

          <motion.div
            initial={instant ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={instant ? undefined : { opacity: 0, y: 12 }}
            transition={{
              duration: instant ? 0 : 0.5,
              delay: instant ? 0 : 0.52,
              ease: menuEase,
            }}
            className="pt-2"
          >
            <Button asChild variant="gold" className="w-full">
              <Link href="/booking" onClick={onClose}>
                {t("booking")}
              </Link>
            </Button>
          </motion.div>
        </nav>
      </motion.div>
    </div>
  );
}

function LocaleSwitcher({
  currentLocale,
  onNavigate,
}: {
  currentLocale: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex items-center gap-2 text-xs uppercase tracking-widest">
      {siteConfig.locales.map((locale) => (
        <Link
          key={locale}
          href="/"
          locale={locale}
          onClick={onNavigate}
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
