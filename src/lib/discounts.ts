/** Offers remain valid through their expiry date in the business's time zone. */
export function discountToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const part = (type: string) => parts.find((item) => item.type === type)!.value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function discountStatus(
  offer: { isActive: boolean; expiresAt: string | null },
  today: string,
): "active" | "inactive" | "discountExpired" {
  if (offer.expiresAt && offer.expiresAt < today) return "discountExpired";
  return offer.isActive ? "active" : "inactive";
}

export type DiscountFormValues = {
  id: string;
  brandName: string;
  logoUrl: string | null;
  discountLabel: string | null;
  code: string;
  url: string;
  offerDe: string;
  offerEn: string;
  expiresAt: string | null;
  isActive: boolean;
  sortOrder: number;
  clickCount: number;
};

export type DiscountActionState = { error?: string };
