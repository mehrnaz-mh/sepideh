import "server-only";
import { prisma } from "@/lib/prisma";
import { services as fallbackServices } from "@/data/content";

export type PublicService = (typeof fallbackServices)[number] & {
  // Admin-chosen icon key (see service-icons.tsx). Optional: static fallback
  // entries don't have one, in which case the icon is derived from the slug.
  icon?: string | null;
};

// `fallbackServices` is a readonly tuple; expose it as a plain array so it is
// assignable to the PublicService[] return type.
const fallbackList: PublicService[] = fallbackServices.map((s) => ({ ...s }));

/**
 * Reads services from the database and maps them into the same shape the
 * public site already expects (the `content.ts` `services` array), so the
 * pages that consumed the static data can use this with minimal changes.
 *
 * Admin edits write to the DB, so this keeps the public site in sync. If the
 * DB is empty or unreachable, we fall back to the static content so the site
 * never renders an empty services list.
 */
export async function getPublicServices(): Promise<PublicService[]> {
  let rows;
  try {
    rows = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
      include: { translations: true },
    });
  } catch {
    return fallbackList;
  }

  if (rows.length === 0) {
    return fallbackList;
  }

  return rows.map((service) => {
    const de = service.translations.find((t) => t.locale === "de");
    const en = service.translations.find((t) => t.locale === "en");
    // Fall back to the static entry per-field so a missing translation never
    // surfaces as an empty title on the public site.
    const staticEntry = fallbackServices.find((s) => s.slug === service.slug);

    return {
      slug: service.slug,
      durationMinutes: service.durationMinutes,
      bufferMinutes: service.bufferMinutes,
      sortOrder: service.sortOrder,
      icon: service.icon,
      de: {
        title: de?.title ?? staticEntry?.de.title ?? service.slug,
        shortDesc: de?.shortDesc ?? staticEntry?.de.shortDesc ?? "",
        description: de?.description ?? staticEntry?.de.description ?? "",
      },
      en: {
        title: en?.title ?? staticEntry?.en.title ?? service.slug,
        shortDesc: en?.shortDesc ?? staticEntry?.en.shortDesc ?? "",
        description: en?.description ?? staticEntry?.en.description ?? "",
      },
    } as PublicService;
  });
}
