"use client";

import { AdminFormShell } from "@/components/admin/form-shell";
import {
  CheckboxField,
  FormField,
  FormSection,
  SelectField,
  TextAreaField,
} from "@/components/admin/forms/fields";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { useAdminLang } from "@/components/admin/lang-context";
import { updateBlogPostAction } from "./edit-blog-actions";

type Category = {
  id: string;
  slug: string;
  translations: { locale: string; name: string }[];
};

type Post = {
  id: string;
  slug: string;
  status: string;
  featured: boolean;
  categoryId: string | null;
  tags: { tag: string }[];
  translations: {
    locale: string;
    title: string;
    excerpt?: string | null;
    content?: string;
  }[];
};

export function EditBlogClient({
  post,
  categories,
  featuredImageUrl,
}: {
  post: Post;
  categories: Category[];
  featuredImageUrl?: string;
}) {
  const { t } = useAdminLang();

  const de = post.translations.find((tr) => tr.locale === "de");
  const en = post.translations.find((tr) => tr.locale === "en");

  const statusOptions = [
    { value: "DRAFT", label: t("draft") },
    { value: "PUBLISHED", label: t("published") },
    { value: "ARCHIVED", label: t("archived") },
  ];

  const action = updateBlogPostAction.bind(null, post.id);

  return (
    <AdminFormShell titleKey="editBlogPost" backHref="/admin/blog" action={action}>
      <div className="border border-border bg-background p-6">
        <ImageUploadField
          name="featuredImageUrl"
          label={t("coverImage")}
          folder="blog"
          defaultValue={featuredImageUrl ?? ""}
        />
      </div>
      <FormSection title={t("postSettings")}>
        <FormField label={t("slug")} name="slug" defaultValue={post.slug} required />
        <SelectField
          label={t("category")}
          name="categoryId"
          defaultValue={post.categoryId ?? ""}
          options={[
            { value: "", label: t("none") },
            ...categories.map((c) => ({
              value: c.id,
              label: c.translations[0]?.name ?? c.slug,
            })),
          ]}
        />
        <SelectField
          label={t("status") ?? "Status"}
          name="status"
          defaultValue={post.status}
          options={statusOptions}
        />
        <FormField
          label={t("tagsHint")}
          name="tags"
          defaultValue={post.tags.map((tg) => tg.tag).join(", ")}
        />
        <CheckboxField label={t("featured")} name="featured" defaultChecked={post.featured} />
      </FormSection>
      <FormSection title={t("german")}>
        <FormField label={t("titleDe")} name="titleDe" defaultValue={de?.title} required />
        <FormField label={t("excerptDe")} name="excerptDe" defaultValue={de?.excerpt ?? ""} />
        <div className="md:col-span-2">
          <TextAreaField label={t("contentDe")} name="contentDe" defaultValue={de?.content} required rows={8} />
        </div>
      </FormSection>
      <FormSection title={t("english")}>
        <FormField label={t("titleEn")} name="titleEn" defaultValue={en?.title} required />
        <FormField label={t("excerptEn")} name="excerptEn" defaultValue={en?.excerpt ?? ""} />
        <div className="md:col-span-2">
          <TextAreaField label={t("contentEn")} name="contentEn" defaultValue={en?.content} required rows={8} />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
