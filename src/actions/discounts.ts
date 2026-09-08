"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin, logAudit, parseFormBoolean } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { parseCalendarDate } from "@/lib/dates";
import type { DiscountActionState } from "@/lib/discounts";
import { discountOfferSchema } from "@/validations/discounts";

function revalidateDiscounts() {
  revalidatePath("/admin/discounts");
  revalidatePath("/de/discounts");
  revalidatePath("/en/discounts");
}

export async function saveDiscountOffer(
  id: string | null,
  _previousState: DiscountActionState,
  formData: FormData,
): Promise<DiscountActionState> {
  const session = await requireAdmin();
  if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
    return { error: "discountForbidden" };
  }

  const parsed = discountOfferSchema.safeParse({
    ...Object.fromEntries(formData),
    isActive: parseFormBoolean(formData.get("isActive")),
  });
  if (!parsed.success) {
    const message = parsed.error.issues[0]?.message;
    return { error: message?.startsWith("discount") ? message : "discountInvalidData" };
  }
  const { expiresAt, ...fields } = parsed.data;
  const data = {
    ...fields,
    expiresAt: expiresAt ? parseCalendarDate(expiresAt) : null,
    descriptionDe: null,
    descriptionEn: null,
  };

  try {
    const offer = id
      ? await prisma.discountOffer.update({ where: { id }, data })
      : await prisma.discountOffer.create({ data });
    await logAudit(session.user.id, id ? "UPDATE" : "CREATE", "DiscountOffer", offer.id);
  } catch {
    return { error: "discountSaveFailed" };
  }

  revalidateDiscounts();
  redirect(`/admin/discounts?success=${id ? "updated" : "created"}`);
}

export async function deleteDiscountOffer(
  id: string,
): Promise<DiscountActionState> {
  const session = await requireAdmin();
  if (!["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(session.user.role)) {
    return { error: "discountForbidden" };
  }
  try {
    await prisma.discountOffer.delete({ where: { id } });
    await logAudit(session.user.id, "DELETE", "DiscountOffer", id);
  } catch {
    return { error: "discountDeleteFailed" };
  }
  revalidateDiscounts();
  return {};
}
