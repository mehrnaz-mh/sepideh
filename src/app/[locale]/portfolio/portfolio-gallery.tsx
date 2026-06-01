"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/motion/fade-in";
import type { Locale } from "@/data/content";
import type {
  PublicPortfolioCategory,
  PublicPortfolioItem,
} from "@/lib/portfolio-public";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";

export function PortfolioGallery({
  items,
  categories,
}: {
  items: PublicPortfolioItem[];
  categories: PublicPortfolioCategory[];
}) {
  const t = useTranslations("portfolio");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [lightbox, setLightbox] = useState<PublicPortfolioItem | null>(null);
  const [visibleCount, setVisibleCount] = useState(9);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        activeCategory === "all" || item.categorySlug === activeCategory;
      const text = `${item[locale].title} ${item[locale].description}`.toLowerCase();
      const matchesSearch = !search || text.includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search, locale, items]);

  const visible = filtered.slice(0, visibleCount);

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
        <div className="luxury-container">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              <FilterButton
                active={activeCategory === "all"}
                onClick={() => setActiveCategory("all")}
                label={tc("all")}
              />
              {categories.map((cat) => (
                <FilterButton
                  key={cat.slug}
                  active={activeCategory === cat.slug}
                  onClick={() => setActiveCategory(cat.slug)}
                  label={cat[locale].name}
                />
              ))}
            </div>
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <Input
                placeholder={t("searchPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="mt-16 text-center text-muted">{t("noResults")}</p>
          ) : (
            <>
              <div className="mt-12 columns-1 gap-4 sm:columns-2 lg:columns-3">
                {visible.map((item, i) => (
                  <FadeIn key={item.slug} delay={(i % 6) * 0.05} className="mb-4 break-inside-avoid">
                    <button
                      type="button"
                      onClick={() => setLightbox(item)}
                      className="group relative block w-full overflow-hidden text-left"
                    >
                      <Image
                        src={item.image}
                        alt={item[locale].altText}
                        width={600}
                        height={800}
                        className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                        unoptimized={item.image.startsWith("http")}
                      />
                      <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="font-serif text-lg text-white">
                          {item[locale].title}
                        </span>
                      </div>
                    </button>
                  </FadeIn>
                ))}
              </div>

              {visibleCount < filtered.length && (
                <div className="mt-12 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((c) => c + 9)}
                    className="border border-foreground px-8 py-3 text-xs uppercase tracking-widest transition-colors hover:bg-foreground hover:text-background"
                  >
                    Load More
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal
        >
          <button
            type="button"
            className="absolute right-6 top-6 text-white"
            onClick={() => setLightbox(null)}
            aria-label="Close"
          >
            <X size={32} />
          </button>
          <div
            className="max-h-[90vh] max-w-5xl overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightbox.image}
              alt={lightbox[locale].altText}
              width={1200}
              height={1600}
              className="max-h-[70vh] w-auto object-contain"
              unoptimized={lightbox.image.startsWith("http")}
            />
            <div className="mt-4 text-white">
              <h2 className="font-serif text-2xl">{lightbox[locale].title}</h2>
              <p className="mt-2 text-white/70">{lightbox[locale].description}</p>
              <Link
                href={`/portfolio/${lightbox.slug}`}
                className="mt-4 inline-block text-gold-accent"
                onClick={() => setLightbox(null)}
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FilterButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
        active
          ? "bg-foreground text-background"
          : "border border-border text-muted hover:border-gold hover:text-gold"
      }`}
    >
      {label}
    </button>
  );
}
