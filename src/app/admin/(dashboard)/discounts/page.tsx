import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatCalendarDate } from "@/lib/dates";
import { discountToday } from "@/lib/discounts";
import { DiscountsClient } from "./discounts-client";

export default async function AdminDiscountsPage() {
  await requireAdmin();
  const offers = await prisma.discountOffer.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });
  return <DiscountsClient today={discountToday()} offers={offers.map((offer) => ({
    ...offer,
    expiresAt: offer.expiresAt ? formatCalendarDate(offer.expiresAt) : null,
  }))} />;
}
