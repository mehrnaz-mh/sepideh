"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Badge } from "@/components/ui/badge";
import { FormField } from "@/components/admin/forms/fields";
import { useAdminLang } from "@/components/admin/lang-context";
import { createCategoryAction, deleteBlogCategory, deleteBlogPost } from "./blog-actions";

type Category = {
  id: string;
  slug: string;
  translations: { locale: string; name: string }[];
  _count: { posts: number };
};

type Post = {
  id: string;
  slug: string;
  status: string;
  featured: boolean;
  translations: { locale: string; title: string }[];
};

export function BlogClient({
  categories,
  posts,
}: {
  categories: Category[];
  posts: Post[];
}) {
  const { t, lang } = useAdminLang();
  const isRtl = lang === "fa";
  const align = isRtl ? "text-right" : "text-left";

  const statusLabel: Record<string, string> = isRtl
    ? { PUBLISHED: "منتشر شده", DRAFT: "پیش‌نویس", ARCHIVED: "بایگانی" }
    : { PUBLISHED: "Published", DRAFT: "Draft", ARCHIVED: "Archived" };

  return (
    <div className="space-y-12">
      <AdminPageHeader
        titleKey="blog"
        descriptionKey="blogDesc"
        createHref="/admin/blog/new"
        createLabelKey="newPost"
      />

      <section>
        <h2 className="text-2xl mb-4">{t("categories")}</h2>
        <form action={createCategoryAction} className="border border-border bg-background p-6 rounded-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormField label={t("slug")} name="slug" required />
            <FormField label={t("sortOrder")} name="sortOrder" type="number" defaultValue={0} />
            <FormField label={t("nameDe")} name="nameDe" required />
            <FormField label={t("nameEn")} name="nameEn" required />
          </div>
          <div className="mt-4 flex justify-end">
            <SubmitButton labelKey="addCategory" />
          </div>
        </form>
        <div className="mt-4 space-y-2">
          {categories.map((cat) => {
            const name = cat.translations.find((tr) => tr.locale === "de")?.name ?? cat.slug;
            const postCount = cat._count.posts;
            return (
              <div
                key={cat.id}
                className="flex items-center justify-between border border-border bg-background px-4 py-3 rounded-sm"
              >
                <span className="text-sm" dir="ltr">{name} · {postCount} {isRtl ? "مطلب" : "posts"}</span>
                <DeleteButton
                  action={deleteBlogCategory.bind(null, cat.id)}
                  label=""
                  confirmMessage={
                    postCount > 0
                      ? `Delete "${name}" and all ${postCount} post(s)?`
                      : `Delete category "${name}"?`
                  }
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-2xl mb-4">{t("posts")}</h2>
        <div className="mt-4 space-y-3">
          {posts.map((post) => {
            const title = post.translations.find((tr) => tr.locale === "de")?.title ?? post.slug;
            return (
              <div
                key={post.id}
                className="flex items-center justify-between border border-border bg-background p-4 rounded-sm"
              >
                <div className={align}>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-medium">{title}</h3>
                    <Badge variant={post.status === "PUBLISHED" ? "success" : "warning"}>
                      {statusLabel[post.status] ?? post.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted">{post.slug}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="text-muted hover:text-gold transition-colors leading-none"
                    title={t("edit")}
                  >
                    <Pencil size={16} />
                  </Link>
                  <DeleteButton action={deleteBlogPost.bind(null, post.id)} label="" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
