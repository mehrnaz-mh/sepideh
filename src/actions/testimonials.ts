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
import { testimonialSchema } from "@/validations/admin";

export async function getTestimonials() {
  await requireAdmin();
  return prisma.testimonial.findMany({
    orderBy: { sortOrder: "asc" },
    include: { translations: true },
  });
}

export async function getTestimonial(id: string) {
  await requireAdmin();
  return prisma.testimonial.findUnique({
    where: { id },
    include: { translations: true },
  });
}

function parseTestimonialForm(formData: FormData) {
  const rating = formData.get("rating");
  return testimonialSchema.safeParse({
    clientName: formData.get("clientName"),
    type: formData.get("type") || "TEXT",
    rating: rating ? Number(rating) : undefined,
    featured: parseFormBoolean(formData.get("featured")),
    sortOrder: formData.get("sortOrder"),
    eventType: formData.get("eventType") || undefined,
    contentDe: formData.get("contentDe"),
    contentEn: formData.get("contentEn"),
  });
}

export async function createTestimonial(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const session = await requireAdmin();
  const parsed = parseTestimonialForm(formData);
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const { contentDe, contentEn, ...data } = parsed.data;
  const testimonial = await prisma.testimonial.create({
    data: { ...data, publishedAt: new Date() },
  });

  await prisma.testimonialTranslation.createMany({
    data: [
      { testimonialId: testimonial.id, locale: "de", content: contentDe },
      { testimonialId: testimonial.id, locale: "en", content: contentEn },
    ],
  });

  await logAudit(session.user.id, "CREATE", "Testimonial", testimonial.id);
  revalidatePath("/admin/testimonials");
  return actionSuccess({ id: testimonial.id });
}

export async function updateTestimonial(id: string, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = parseTestimonialForm(formData);
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const { contentDe, contentEn, ...data } = parsed.data;
  await prisma.testimonial.update({ where: { id }, data });

  await prisma.testimonialTranslation.upsert({
    where: { testimonialId_locale: { testimonialId: id, locale: "de" } },
    update: { content: contentDe },
    create: { testimonialId: id, locale: "de", content: contentDe },
  });
  await prisma.testimonialTranslation.upsert({
    where: { testimonialId_locale: { testimonialId: id, locale: "en" } },
    update: { content: contentEn },
    create: { testimonialId: id, locale: "en", content: contentEn },
  });

  await logAudit(session.user.id, "UPDATE", "Testimonial", id);
  revalidatePath("/admin/testimonials");
  return actionSuccess();
}

export async function deleteTestimonial(id: string): Promise<void> {
  const session = await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  await logAudit(session.user.id, "DELETE", "Testimonial", id);
  revalidatePath("/admin/testimonials");
}
