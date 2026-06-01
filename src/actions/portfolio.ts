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
import { portfolioCategorySchema, portfolioItemSchema } from "@/validations/admin";

async function upsertPortfolioMedia(imageUrl: string, altText?: string) {
  return prisma.mediaFile.upsert({
    where: { cloudinaryId: imageUrl },
    update: {
      url: imageUrl,
      secureUrl: imageUrl,
      altText,
    },
    create: {
      cloudinaryId: imageUrl,
      url: imageUrl,
      secureUrl: imageUrl,
      publicId: imageUrl,
      altText,
      folder: "portfolio",
    },
  });
}

export async function getPortfolioCategories() {
  await requireAdmin();
  return prisma.portfolioCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { translations: true, _count: { select: { items: true } } },
  });
}

export async function getPortfolioItems() {
  await requireAdmin();
  return prisma.portfolioItem.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      translations: true,
      category: { include: { translations: true } },
      mediaFiles: true,
    },
  });
}

export async function getPortfolioItem(id: string) {
  await requireAdmin();
  return prisma.portfolioItem.findUnique({
    where: { id },
    include: { translations: true, mediaFiles: true, category: true },
  });
}

export async function createPortfolioCategory(formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = portfolioCategorySchema.safeParse({
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
    nameDe: formData.get("nameDe"),
    nameEn: formData.get("nameEn"),
  });
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const cat = await prisma.portfolioCategory.create({
    data: { slug: parsed.data.slug, sortOrder: parsed.data.sortOrder },
  });

  await prisma.portfolioCategoryTranslation.createMany({
    data: [
      { categoryId: cat.id, locale: "de", name: parsed.data.nameDe },
      { categoryId: cat.id, locale: "en", name: parsed.data.nameEn },
    ],
  });

  await logAudit(session.user.id, "CREATE", "PortfolioCategory", cat.id);
  revalidatePath("/admin/portfolio");
  return actionSuccess();
}

export async function deletePortfolioCategory(id: string): Promise<void> {
  const session = await requireAdmin();
  const count = await prisma.portfolioItem.count({ where: { categoryId: id } });
  if (count > 0) throw new Error("Category has portfolio items");

  await prisma.portfolioCategory.delete({ where: { id } });
  await logAudit(session.user.id, "DELETE", "PortfolioCategory", id);
  revalidatePath("/admin/portfolio");
}

export async function createPortfolioItem(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const session = await requireAdmin();
  const parsed = portfolioItemSchema.safeParse({
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId"),
    serviceId: formData.get("serviceId") || undefined,
    featured: parseFormBoolean(formData.get("featured")),
    sortOrder: formData.get("sortOrder"),
    imageUrl: formData.get("imageUrl"),
    titleDe: formData.get("titleDe"),
    titleEn: formData.get("titleEn"),
    descriptionDe: formData.get("descriptionDe") || undefined,
    descriptionEn: formData.get("descriptionEn") || undefined,
    altTextDe: formData.get("altTextDe") || undefined,
    altTextEn: formData.get("altTextEn") || undefined,
  });
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const media = await upsertPortfolioMedia(
    parsed.data.imageUrl,
    parsed.data.altTextDe,
  );

  const item = await prisma.portfolioItem.create({
    data: {
      slug: parsed.data.slug,
      categoryId: parsed.data.categoryId,
      serviceId: parsed.data.serviceId || null,
      featured: parsed.data.featured ?? false,
      sortOrder: parsed.data.sortOrder,
      publishedAt: new Date(),
      mediaFiles: { connect: { id: media.id } },
    },
  });

  await prisma.portfolioItemTranslation.createMany({
    data: [
      {
        itemId: item.id,
        locale: "de",
        title: parsed.data.titleDe,
        description: parsed.data.descriptionDe,
        altText: parsed.data.altTextDe,
      },
      {
        itemId: item.id,
        locale: "en",
        title: parsed.data.titleEn,
        description: parsed.data.descriptionEn,
        altText: parsed.data.altTextEn,
      },
    ],
  });

  await logAudit(session.user.id, "CREATE", "PortfolioItem", item.id);
  revalidatePath("/admin/portfolio");
  revalidatePath("/de/portfolio");
  revalidatePath("/en/portfolio");
  revalidatePath(`/de/portfolio/${parsed.data.slug}`);
  revalidatePath(`/en/portfolio/${parsed.data.slug}`);
  revalidatePath("/de");
  revalidatePath("/en");
  return actionSuccess({ id: item.id });
}

export async function updatePortfolioItem(id: string, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = portfolioItemSchema.safeParse({
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId"),
    serviceId: formData.get("serviceId") || undefined,
    featured: parseFormBoolean(formData.get("featured")),
    sortOrder: formData.get("sortOrder"),
    imageUrl: formData.get("imageUrl"),
    titleDe: formData.get("titleDe"),
    titleEn: formData.get("titleEn"),
    descriptionDe: formData.get("descriptionDe") || undefined,
    descriptionEn: formData.get("descriptionEn") || undefined,
    altTextDe: formData.get("altTextDe") || undefined,
    altTextEn: formData.get("altTextEn") || undefined,
  });
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const media = await upsertPortfolioMedia(
    parsed.data.imageUrl,
    parsed.data.altTextDe,
  );

  await prisma.portfolioItem.update({
    where: { id },
    data: {
      slug: parsed.data.slug,
      categoryId: parsed.data.categoryId,
      serviceId: parsed.data.serviceId || null,
      featured: parsed.data.featured ?? false,
      sortOrder: parsed.data.sortOrder,
      mediaFiles: { set: [{ id: media.id }] },
    },
  });

  for (const [locale, title, description, altText] of [
    ["de", parsed.data.titleDe, parsed.data.descriptionDe, parsed.data.altTextDe],
    ["en", parsed.data.titleEn, parsed.data.descriptionEn, parsed.data.altTextEn],
  ] as const) {
    await prisma.portfolioItemTranslation.upsert({
      where: { itemId_locale: { itemId: id, locale } },
      update: { title, description, altText },
      create: { itemId: id, locale, title, description, altText },
    });
  }

  await logAudit(session.user.id, "UPDATE", "PortfolioItem", id);
  revalidatePath("/admin/portfolio");
  revalidatePath("/de/portfolio");
  revalidatePath("/en/portfolio");
  revalidatePath(`/de/portfolio/${parsed.data.slug}`);
  revalidatePath(`/en/portfolio/${parsed.data.slug}`);
  revalidatePath("/de");
  revalidatePath("/en");
  return actionSuccess();
}

export async function deletePortfolioItem(id: string): Promise<void> {
  const session = await requireAdmin();
  await prisma.portfolioItem.delete({ where: { id } });
  await logAudit(session.user.id, "DELETE", "PortfolioItem", id);
  revalidatePath("/admin/portfolio");
  revalidatePath("/de/portfolio");
  revalidatePath("/en/portfolio");
  revalidatePath("/de");
  revalidatePath("/en");
}
