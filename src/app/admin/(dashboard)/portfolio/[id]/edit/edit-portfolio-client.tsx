"use client";

import { AdminFormShell } from "@/components/admin/form-shell";
import { CheckboxField, FormField, FormSection, SelectField, TextAreaField } from "@/components/admin/forms/fields";
import { PortfolioImageUpload } from "@/components/admin/portfolio-image-upload";
import { useAdminLang } from "@/components/admin/lang-context";
import { updatePortfolioAction } from "./edit-portfolio-actions";

type Trans = { locale: string; title?: string; altText?: string | null; description?: string | null };
type Category = { id: string; slug: string; translations: { name: string }[] };
type Service = { id: string; slug: string; translations: { title: string }[] };

export function EditPortfolioClient({
  id,
  item,
  categories,
  services,
}: {
  id: string;
  item: {
    slug: string;
    categoryId: string;
    serviceId: string | null;
    sortOrder: number;
    featured: boolean;
    mediaFiles: { url: string }[];
    translations: Trans[];
  };
  categories: Category[];
  services: Service[];
}) {
  const { t } = useAdminLang();
  const de = item.translations.find((tr) => tr.locale === "de");
  const en = item.translations.find((tr) => tr.locale === "en");

  const action = updatePortfolioAction.bind(null, id);

  return (
    <AdminFormShell titleKey="editPortfolioItem" backHref="/admin/portfolio" action={action}>
      <FormSection title={t("itemDetails")}>
        <FormField label={t("slug")} name="slug" defaultValue={item.slug} required />
        <SelectField label={t("category")} name="categoryId" defaultValue={item.categoryId} required
          options={categories.map((c) => ({ value: c.id, label: c.translations[0]?.name ?? c.slug }))} />
        <SelectField label={t("linkedService")} name="serviceId" defaultValue={item.serviceId ?? ""}
          options={[{ value: "", label: t("none") }, ...services.map((s) => ({ value: s.id, label: s.translations[0]?.title ?? s.slug }))]} />
        <div className="md:col-span-2">
          <PortfolioImageUpload defaultValue={item.mediaFiles[0]?.url ?? ""} />
        </div>
        <FormField label={t("sortOrder")} name="sortOrder" type="number" defaultValue={item.sortOrder} />
        <CheckboxField label={t("featured")} name="featured" defaultChecked={item.featured} />
      </FormSection>
      <FormSection title={t("german")}>
        <FormField label={t("titleDe")} name="titleDe" defaultValue={de?.title} required />
        <FormField label={t("altTextDe")} name="altTextDe" defaultValue={de?.altText ?? ""} />
        <div className="md:col-span-2">
          <TextAreaField label={t("descriptionDe")} name="descriptionDe" defaultValue={de?.description ?? ""} />
        </div>
      </FormSection>
      <FormSection title={t("english")}>
        <FormField label={t("titleEn")} name="titleEn" defaultValue={en?.title} required />
        <FormField label={t("altTextEn")} name="altTextEn" defaultValue={en?.altText ?? ""} />
        <div className="md:col-span-2">
          <TextAreaField label={t("descriptionEn")} name="descriptionEn" defaultValue={en?.description ?? ""} />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
