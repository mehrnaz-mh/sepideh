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
import { serviceSchema } from "@/validations/admin";

export async function getServices() {
  await requireAdmin();
  return prisma.service.findMany({
    orderBy: { sortOrder: "asc" },
    include: { translations: true },
  });
}

export async function getService(id: string) {
  await requireAdmin();
  return prisma.service.findUnique({
    where: { id },
    include: { translations: true },
  });
}

function parseServiceForm(formData: FormData) {
  return serviceSchema.safeParse({
    slug: formData.get("slug"),
    durationMinutes: formData.get("durationMinutes"),
    bufferMinutes: formData.get("bufferMinutes"),
    isActive: parseFormBoolean(formData.get("isActive")),
    sortOrder: formData.get("sortOrder"),
    titleDe: formData.get("titleDe"),
    titleEn: formData.get("titleEn"),
    descriptionDe: formData.get("descriptionDe"),
    descriptionEn: formData.get("descriptionEn"),
    shortDescDe: formData.get("shortDescDe") || undefined,
    shortDescEn: formData.get("shortDescEn") || undefined,
  });
}

async function upsertTranslations(
  serviceId: string,
  data: {
    titleDe: string;
    titleEn: string;
    descriptionDe: string;
    descriptionEn: string;
    shortDescDe?: string;
    shortDescEn?: string;
  },
) {
  await prisma.serviceTranslation.upsert({
    where: { serviceId_locale: { serviceId, locale: "de" } },
    update: {
      title: data.titleDe,
      description: data.descriptionDe,
      shortDesc: data.shortDescDe,
    },
    create: {
      serviceId,
      locale: "de",
      title: data.titleDe,
      description: data.descriptionDe,
      shortDesc: data.shortDescDe,
    },
  });
  await prisma.serviceTranslation.upsert({
    where: { serviceId_locale: { serviceId, locale: "en" } },
    update: {
      title: data.titleEn,
      description: data.descriptionEn,
      shortDesc: data.shortDescEn,
    },
    create: {
      serviceId,
      locale: "en",
      title: data.titleEn,
      description: data.descriptionEn,
      shortDesc: data.shortDescEn,
    },
  });
}

export async function createService(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const session = await requireAdmin();
  const parsed = parseServiceForm(formData);
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const { titleDe, titleEn, descriptionDe, descriptionEn, shortDescDe, shortDescEn, ...serviceData } =
    parsed.data;

  const service = await prisma.service.create({ data: serviceData });
  await upsertTranslations(service.id, {
    titleDe,
    titleEn,
    descriptionDe,
    descriptionEn,
    shortDescDe,
    shortDescEn,
  });

  await logAudit(session.user.id, "CREATE", "Service", service.id);
  revalidatePath("/admin/services");
  revalidatePath("/de/services");
  revalidatePath("/en/services");
  return actionSuccess({ id: service.id });
}

export async function updateService(id: string, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = parseServiceForm(formData);
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const { titleDe, titleEn, descriptionDe, descriptionEn, shortDescDe, shortDescEn, ...serviceData } =
    parsed.data;

  await prisma.service.update({ where: { id }, data: serviceData });
  await upsertTranslations(id, {
    titleDe,
    titleEn,
    descriptionDe,
    descriptionEn,
    shortDescDe,
    shortDescEn,
  });

  await logAudit(session.user.id, "UPDATE", "Service", id);
  revalidatePath("/admin/services");
  revalidatePath("/de/services");
  revalidatePath("/en/services");
  return actionSuccess();
}

export async function deleteService(id: string): Promise<void> {
  const session = await requireAdmin();
  const count = await prisma.appointment.count({ where: { serviceId: id } });
  if (count > 0) throw new Error("Cannot delete service with existing appointments");

  await prisma.service.delete({ where: { id } });
  await logAudit(session.user.id, "DELETE", "Service", id);
  revalidatePath("/admin/services");
}
