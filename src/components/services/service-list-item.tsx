import React from "react";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/data/content";
import { ArrowRight, Crown, Wand2, Scissors, Sparkles, Camera, Star, Drama, Waves, Gem, MessageSquare } from "lucide-react";

const serviceIcons: Record<string, React.ReactNode> = {
  "bridal-hair": <Crown size={24} className="text-gold" />,
  "bridal-makeup": <Wand2 size={24} className="text-gold" />,
  "hair-styling": <Scissors size={24} className="text-gold" />,
  "makeup": <Sparkles size={24} className="text-gold" />,
  "editorial-styling": <Camera size={24} className="text-gold" />,
  "fashion-styling": <Star size={24} className="text-gold" />,
  "red-carpet": <Drama size={24} className="text-gold" />,
  "event-styling": <Gem size={24} className="text-gold" />,
  "hair-extensions": <Waves size={24} className="text-gold" />,
  "vip-services": <Gem size={24} className="text-gold" />,
  "consultation": <MessageSquare size={24} className="text-gold" />,
};

type ServiceItem = (typeof import("@/data/content").services)[number];

export function ServiceListItem({
  service,
  locale,
  index,
  learnMoreLabel,
  bookLabel,
  minutesLabel,
}: {
  service: ServiceItem;
  locale: Locale;
  index: number;
  learnMoreLabel: string;
  bookLabel: string;
  minutesLabel: string;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      id={service.slug}
      className="group relative scroll-mt-28 border-b border-border py-8 last:border-b-0 last:pb-0 md:py-10"
    >
      <div className="grid gap-8 md:grid-cols-[3.5rem_1fr] md:gap-10 lg:grid-cols-[4rem_1fr_auto] lg:gap-12">
        <span
          className="text-3xl text-gold/30 transition-colors group-hover:text-gold/60 md:text-4xl"
          aria-hidden
        >
          {number}
        </span>

        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-5">
            <h2 className="text-3xl leading-tight md:text-4xl">
              <Link
                href={`/services/${service.slug}`}
                className="inline-flex items-center gap-3 transition-colors hover:text-gold"
              >
                {serviceIcons[service.slug] ?? <Sparkles size={24} className="text-gold shrink-0" />}
                {service[locale].title}
              </Link>
            </h2>
          </div>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted md:text-lg">
            {service[locale].shortDesc}
          </p>

          <p className="mt-4 hidden max-w-3xl text-sm leading-relaxed text-muted/90 lg:block">
            {service[locale].description}
          </p>
        </div>

        <div className="flex flex-row flex-wrap items-center gap-6 md:col-span-2 md:col-start-2 lg:col-span-1 lg:col-start-3 lg:flex-col lg:items-end lg:justify-center lg:gap-4 lg:pt-1">
          <Link
            href={`/services/${service.slug}`}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:text-gold"
          >
            {learnMoreLabel}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={`/booking?service=${service.slug}`}
            className="inline-flex items-center justify-center border border-foreground px-6 py-3 text-xs uppercase tracking-[0.2em] transition-colors hover:border-gold hover:bg-gold hover:text-white rounded-lg"
          >
            {bookLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
