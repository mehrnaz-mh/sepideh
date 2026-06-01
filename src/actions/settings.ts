"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdmin,
  logAudit,
  actionError,
  actionSuccess,
  parseFormBoolean,
  type ActionResult,
} from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { availabilityRuleSchema, blockedDateSchema, settingsSchema } from "@/validations/admin";
import { parseCalendarDate } from "@/lib/dates";

export async function getAvailabilityRules() {
  await requireAdmin();
  return prisma.availabilityRule.findMany({ orderBy: { dayOfWeek: "asc" } });
}

export async function getBlockedDates() {
  await requireAdmin();
  return prisma.blockedDate.findMany({ orderBy: { date: "desc" } });
}

export async function getSettings() {
  await requireAdmin();
  const setting = await prisma.setting.findUnique({ where: { key: "site" } });
  return setting?.value as Record<string, string> | null;
}

export async function createAvailabilityRule(formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = availabilityRuleSchema.safeParse({
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    isActive: parseFormBoolean(formData.get("isActive")),
  });
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const rule = await prisma.availabilityRule.create({ data: parsed.data });
  await logAudit(session.user.id, "CREATE", "AvailabilityRule", rule.id);
  revalidatePath("/admin/settings");
  return actionSuccess();
}

export async function updateAvailabilityRule(id: string, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = availabilityRuleSchema.safeParse({
    dayOfWeek: formData.get("dayOfWeek"),
    startTime: formData.get("startTime"),
    endTime: formData.get("endTime"),
    isActive: parseFormBoolean(formData.get("isActive")),
  });
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  await prisma.availabilityRule.update({ where: { id }, data: parsed.data });
  await logAudit(session.user.id, "UPDATE", "AvailabilityRule", id);
  revalidatePath("/admin/settings");
  return actionSuccess();
}

export async function deleteAvailabilityRule(id: string): Promise<void> {
  const session = await requireAdmin();
  await prisma.availabilityRule.delete({ where: { id } });
  await logAudit(session.user.id, "DELETE", "AvailabilityRule", id);
  revalidatePath("/admin/settings");
}

export async function createBlockedDate(formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = blockedDateSchema.safeParse({
    date: formData.get("date"),
    reason: formData.get("reason") || undefined,
    allDay: parseFormBoolean(formData.get("allDay")),
    startTime: formData.get("startTime") || undefined,
    endTime: formData.get("endTime") || undefined,
  });
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const blocked = await prisma.blockedDate.create({
    data: {
      date: parseCalendarDate(parsed.data.date),
      reason: parsed.data.reason,
      allDay: parsed.data.allDay ?? true,
      startTime: parsed.data.startTime,
      endTime: parsed.data.endTime,
    },
  });

  await logAudit(session.user.id, "CREATE", "BlockedDate", blocked.id);
  revalidatePath("/admin/settings");
  return actionSuccess();
}

export async function deleteBlockedDate(id: string): Promise<void> {
  const session = await requireAdmin();
  await prisma.blockedDate.delete({ where: { id } });
  await logAudit(session.user.id, "DELETE", "BlockedDate", id);
  revalidatePath("/admin/settings");
}

export async function updateSettings(formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = settingsSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    instagram: formData.get("instagram") || "",
    location: formData.get("location"),
  });
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  await prisma.setting.upsert({
    where: { key: "site" },
    update: { value: parsed.data },
    create: { key: "site", value: parsed.data },
  });

  await logAudit(session.user.id, "UPDATE", "Setting", "site");
  revalidatePath("/admin/settings");
  return actionSuccess();
}
