import {
  Sparkles,
  Star,
  Scissors,
  Wand2,
  Camera,
  Drama,
  Crown,
  CalendarHeart,
  Gem,
  MessageSquare,
  Waves,
  type LucideIcon,
} from "lucide-react";

/**
 * Catalog of icons an admin can choose from for a service. The key is what we
 * store in `Service.icon`; the component is what we render.
 */
export const SERVICE_ICONS: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  star: Star,
  scissors: Scissors,
  wand: Wand2,
  camera: Camera,
  drama: Drama,
  crown: Crown,
  calendar: CalendarHeart,
  gem: Gem,
  message: MessageSquare,
  waves: Waves,
};

export type ServiceIconKey = keyof typeof SERVICE_ICONS;

/** Human-friendly labels for the dashboard dropdown. */
export const SERVICE_ICON_LABELS: Record<string, string> = {
  sparkles: "Sparkles",
  star: "Star",
  scissors: "Scissors",
  wand: "Wand",
  camera: "Camera",
  drama: "Drama / Masks",
  crown: "Crown",
  calendar: "Calendar Heart",
  gem: "Gem",
  message: "Message",
  waves: "Waves",
};

/**
 * Default icon key per known slug — used when a service has no explicit icon
 * chosen, so the existing curated services keep their current icons.
 */
const DEFAULT_ICON_BY_SLUG: Record<string, ServiceIconKey> = {
  "bridal-hair": "sparkles",
  "bridal-makeup": "star",
  "hair-styling": "scissors",
  makeup: "wand",
  "editorial-styling": "camera",
  "fashion-styling": "drama",
  "red-carpet": "crown",
  "event-styling": "calendar",
  "hair-extensions": "waves",
  "vip-services": "gem",
  consultation: "message",
};

/**
 * Resolve the icon component for a service. Precedence:
 *   1. the admin-chosen icon (if valid)
 *   2. the default mapped from the slug
 *   3. a generic fallback (Sparkles)
 */
export function getServiceIcon(
  slug: string,
  icon?: string | null,
): LucideIcon {
  if (icon && SERVICE_ICONS[icon]) return SERVICE_ICONS[icon];
  const bySlug = DEFAULT_ICON_BY_SLUG[slug];
  if (bySlug) return SERVICE_ICONS[bySlug];
  return Sparkles;
}
