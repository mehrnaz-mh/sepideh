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
import { blogCategorySchema, blogPostSchema } from "@/validations/admin";

export async function getBlogCategories() {
  await requireAdmin();
  return prisma.blogCategory.findMany({
    orderBy: { sortOrder: "asc" },
    include: { translations: true, _count: { select: { posts: true } } },
  });
}

export async function getBlogPosts() {
  await requireAdmin();
  return prisma.blogPost.findMany({
    orderBy: { updatedAt: "desc" },
    include: { translations: true, category: { include: { translations: true } }, tags: true },
  });
}

export async function getBlogPost(id: string) {
  await requireAdmin();
  return prisma.blogPost.findUnique({
    where: { id },
    include: { translations: true, tags: true, category: true },
  });
}

export async function createBlogCategory(formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = blogCategorySchema.safeParse({
    slug: formData.get("slug"),
    sortOrder: formData.get("sortOrder"),
    nameDe: formData.get("nameDe"),
    nameEn: formData.get("nameEn"),
  });
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const cat = await prisma.blogCategory.create({
    data: { slug: parsed.data.slug, sortOrder: parsed.data.sortOrder },
  });

  await prisma.blogCategoryTranslation.createMany({
    data: [
      { categoryId: cat.id, locale: "de", name: parsed.data.nameDe },
      { categoryId: cat.id, locale: "en", name: parsed.data.nameEn },
    ],
  });

  await logAudit(session.user.id, "CREATE", "BlogCategory", cat.id);
  revalidatePath("/admin/blog");
  return actionSuccess();
}

export async function deleteBlogCategory(id: string): Promise<void> {
  const session = await requireAdmin();
  await prisma.blogCategory.delete({ where: { id } });
  await logAudit(session.user.id, "DELETE", "BlogCategory", id);
  revalidatePath("/admin/blog");
}

export async function createBlogPost(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const session = await requireAdmin();
  const parsed = blogPostSchema.safeParse({
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId") || undefined,
    status: formData.get("status") || "DRAFT",
    featured: parseFormBoolean(formData.get("featured")),
    titleDe: formData.get("titleDe"),
    titleEn: formData.get("titleEn"),
    excerptDe: formData.get("excerptDe") || undefined,
    excerptEn: formData.get("excerptEn") || undefined,
    contentDe: formData.get("contentDe"),
    contentEn: formData.get("contentEn"),
    tags: formData.get("tags") || undefined,
  });
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const {
    titleDe,
    titleEn,
    excerptDe,
    excerptEn,
    contentDe,
    contentEn,
    tags,
    categoryId,
    status,
    featured,
    slug,
  } = parsed.data;

  const post = await prisma.blogPost.create({
    data: {
      slug,
      categoryId: categoryId || null,
      authorId: session.user.id,
      status,
      featured: featured ?? false,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  await prisma.blogPostTranslation.createMany({
    data: [
      { postId: post.id, locale: "de", title: titleDe, excerpt: excerptDe, content: contentDe },
      { postId: post.id, locale: "en", title: titleEn, excerpt: excerptEn, content: contentEn },
    ],
  });

  if (tags) {
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    await prisma.blogPostTag.createMany({
      data: tagList.map((tag) => ({ postId: post.id, tag })),
    });
  }

  await logAudit(session.user.id, "CREATE", "BlogPost", post.id);
  revalidatePath("/admin/blog");
  revalidatePath("/de/blog");
  revalidatePath("/en/blog");
  return actionSuccess({ id: post.id });
}

export async function updateBlogPost(id: string, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = blogPostSchema.safeParse({
    slug: formData.get("slug"),
    categoryId: formData.get("categoryId") || undefined,
    status: formData.get("status"),
    featured: parseFormBoolean(formData.get("featured")),
    titleDe: formData.get("titleDe"),
    titleEn: formData.get("titleEn"),
    excerptDe: formData.get("excerptDe") || undefined,
    excerptEn: formData.get("excerptEn") || undefined,
    contentDe: formData.get("contentDe"),
    contentEn: formData.get("contentEn"),
    tags: formData.get("tags") || undefined,
  });
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  const {
    titleDe,
    titleEn,
    excerptDe,
    excerptEn,
    contentDe,
    contentEn,
    tags,
    categoryId,
    status,
    featured,
    slug,
  } = parsed.data;

  await prisma.blogPost.update({
    where: { id },
    data: {
      slug,
      categoryId: categoryId || null,
      status,
      featured: featured ?? false,
      publishedAt:
        status === "PUBLISHED" && !existing?.publishedAt ? new Date() : existing?.publishedAt,
    },
  });

  for (const [locale, title, excerpt, content] of [
    ["de", titleDe, excerptDe, contentDe],
    ["en", titleEn, excerptEn, contentEn],
  ] as const) {
    await prisma.blogPostTranslation.upsert({
      where: { postId_locale: { postId: id, locale } },
      update: { title, excerpt, content },
      create: { postId: id, locale, title, excerpt, content },
    });
  }

  await prisma.blogPostTag.deleteMany({ where: { postId: id } });
  if (tags) {
    const tagList = tags.split(",").map((t) => t.trim()).filter(Boolean);
    await prisma.blogPostTag.createMany({
      data: tagList.map((tag) => ({ postId: id, tag })),
    });
  }

  await logAudit(session.user.id, "UPDATE", "BlogPost", id);
  revalidatePath("/admin/blog");
  revalidatePath("/de/blog");
  revalidatePath("/en/blog");
  return actionSuccess();
}

export async function deleteBlogPost(id: string): Promise<void> {
  const session = await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  await logAudit(session.user.id, "DELETE", "BlogPost", id);
  revalidatePath("/admin/blog");
}
