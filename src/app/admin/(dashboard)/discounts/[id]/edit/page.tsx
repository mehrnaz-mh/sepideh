import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { formatCalendarDate } from "@/lib/dates";
import { DiscountForm } from "../../discount-form";

export default async function EditDiscountPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const offer = await prisma.discountOffer.findUnique({ where: { id } });
  if (!offer) notFound();
  return <DiscountForm offer={{ ...offer, expiresAt: offer.expiresAt ? formatCalendarDate(offer.expiresAt) : null }} />;
}
