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
import { createBlogPostAction } from "./new-blog-actions";

type Category = {
  id: string;
  slug: string;
  translations: { locale: string; name: string }[];
};

export function NewBlogClient({ categories }: { categories: Category[] }) {
  const { t } = useAdminLang();

  const statusOptions = [
    { value: "DRAFT", label: t("draft") },
    { value: "PUBLISHED", label: t("published") },
    { value: "ARCHIVED", label: t("archived") },
  ];

  return (
    <AdminFormShell titleKey="newBlogPost" backHref="/admin/blog" action={createBlogPostAction}>
      <div className="border border-border bg-background p-6">
        <ImageUploadField
          name="featuredImageUrl"
          label={t("coverImage")}
          folder="blog"
        />
      </div>
      <FormSection title={t("postSettings")}>
        <FormField label={t("slug")} name="slug" required />
        <SelectField
          label={t("category")}
          name="categoryId"
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
          defaultValue="DRAFT"
          options={statusOptions}
        />
        <FormField label={t("tagsHint")} name="tags" />
        <CheckboxField label={t("featured")} name="featured" />
      </FormSection>
      <FormSection title={t("german")}>
        <FormField label={t("titleDe")} name="titleDe" required />
        <FormField label={t("excerptDe")} name="excerptDe" />
        <div className="md:col-span-2">
          <TextAreaField label={t("contentDe")} name="contentDe" required rows={8} />
        </div>
      </FormSection>
      <FormSection title={t("english")}>
        <FormField label={t("titleEn")} name="titleEn" required />
        <FormField label={t("excerptEn")} name="excerptEn" />
        <div className="md:col-span-2">
          <TextAreaField label={t("contentEn")} name="contentEn" required rows={8} />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
