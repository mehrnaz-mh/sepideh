"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdmin,
  logAudit,
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { mediaSchema } from "@/validations/admin";

export async function getMediaFiles() {
  await requireAdmin();
  return prisma.mediaFile.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getMediaFile(id: string) {
  await requireAdmin();
  return prisma.mediaFile.findUnique({ where: { id } });
}

export async function createMediaFile(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const session = await requireAdmin();
  const parsed = mediaSchema.safeParse({
    url: formData.get("url"),
    altText: formData.get("altText") || undefined,
    folder: formData.get("folder") || "uploads",
    publicId: formData.get("publicId") || undefined,
    cloudinaryId: formData.get("cloudinaryId") || undefined,
    secureUrl: formData.get("secureUrl") || undefined,
    format: formData.get("format") || undefined,
    width: formData.get("width") || undefined,
    height: formData.get("height") || undefined,
    bytes: formData.get("bytes") || undefined,
  });
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const url = parsed.data.url;
  const media = await prisma.mediaFile.create({
    data: {
      cloudinaryId: parsed.data.cloudinaryId ?? url,
      url,
      secureUrl: parsed.data.secureUrl ?? url,
      publicId: parsed.data.publicId ?? url,
      altText: parsed.data.altText,
      folder: parsed.data.folder,
      format: parsed.data.format,
      width: parsed.data.width,
      height: parsed.data.height,
      bytes: parsed.data.bytes,
    },
  });

  await logAudit(session.user.id, "CREATE", "MediaFile", media.id);
  revalidatePath("/admin/media");
  revalidatePath("/admin/gallery");
  return actionSuccess({ id: media.id });
}

export async function updateMediaFile(id: string, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = mediaSchema.safeParse({
    url: formData.get("url"),
    altText: formData.get("altText") || undefined,
    folder: formData.get("folder") || undefined,
    publicId: formData.get("publicId") || undefined,
    cloudinaryId: formData.get("cloudinaryId") || undefined,
    secureUrl: formData.get("secureUrl") || undefined,
    format: formData.get("format") || undefined,
    width: formData.get("width") || undefined,
    height: formData.get("height") || undefined,
    bytes: formData.get("bytes") || undefined,
  });
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const url = parsed.data.url;
  await prisma.mediaFile.update({
    where: { id },
    data: {
      cloudinaryId: parsed.data.cloudinaryId ?? url,
      url,
      secureUrl: parsed.data.secureUrl ?? url,
      publicId: parsed.data.publicId ?? url,
      altText: parsed.data.altText,
      folder: parsed.data.folder,
      format: parsed.data.format,
      width: parsed.data.width,
      height: parsed.data.height,
      bytes: parsed.data.bytes,
    },
  });

  await logAudit(session.user.id, "UPDATE", "MediaFile", id);
  revalidatePath("/admin/media");
  return actionSuccess();
}

export async function deleteMediaFile(id: string): Promise<void> {
  const session = await requireAdmin();
  await prisma.mediaFile.delete({ where: { id } });
  await logAudit(session.user.id, "DELETE", "MediaFile", id);
  revalidatePath("/admin/media");
  revalidatePath("/admin/gallery");
}
