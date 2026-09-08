import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { discountToday } from "@/lib/discounts";
import { parseCalendarDate } from "@/lib/dates";
import { discountUrlSchema } from "@/validations/discounts";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const offer = await prisma.discountOffer.findFirst({
    where: {
      id,
      isActive: true,
      OR: [{ expiresAt: null }, { expiresAt: { gte: parseCalendarDate(discountToday()) } }],
    },
    select: { url: true },
  });

  if (!offer || !discountUrlSchema.safeParse(offer.url).success) {
    return Response.json({ error: "Offer not found" }, { status: 404 });
  }

  await prisma.discountOffer.update({
    where: { id },
    data: { clickCount: { increment: 1 } },
  });

  return NextResponse.redirect(offer.url, {
    status: 302,
    headers: { "Cache-Control": "no-store" },
  });
}
