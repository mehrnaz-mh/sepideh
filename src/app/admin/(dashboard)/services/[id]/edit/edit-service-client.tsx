"use client";

import { AdminFormShell } from "@/components/admin/form-shell";
import { CheckboxField, FormField, FormSection, TextAreaField } from "@/components/admin/forms/fields";
import { useAdminLang } from "@/components/admin/lang-context";
import { updateServiceAction } from "./edit-service-actions";

type Trans = { locale: string; title?: string; shortDesc?: string | null; description?: string | null };

export function EditServiceClient({
  id,
  service,
}: {
  id: string;
  service: {
    slug: string;
    sortOrder: number;
    durationMinutes: number;
    bufferMinutes: number;
    isActive: boolean;
    translations: Trans[];
  };
}) {
  const { t } = useAdminLang();
  const de = service.translations.find((tr) => tr.locale === "de");
  const en = service.translations.find((tr) => tr.locale === "en");

  const action = updateServiceAction.bind(null, id);

  return (
    <AdminFormShell titleKey="editService" backHref="/admin/services" action={action}>
      <FormSection title={t("serviceDetails")}>
        <FormField label={t("slug")} name="slug" defaultValue={service.slug} required />
        <FormField label={t("sortOrder")} name="sortOrder" type="number" defaultValue={service.sortOrder} />
        <FormField label={t("durationMinutes")} name="durationMinutes" type="number" defaultValue={service.durationMinutes} required />
        <FormField label={t("bufferMinutes")} name="bufferMinutes" type="number" defaultValue={service.bufferMinutes} />
        <CheckboxField label={t("active")} name="isActive" defaultChecked={service.isActive} />
      </FormSection>
      <FormSection title={t("germanContent")}>
        <FormField label={t("titleDe")} name="titleDe" defaultValue={de?.title} required />
        <FormField label={t("shortDescDe")} name="shortDescDe" defaultValue={de?.shortDesc ?? ""} />
        <div className="md:col-span-2">
          <TextAreaField label={t("descriptionDe")} name="descriptionDe" defaultValue={de?.description ?? ""} required />
        </div>
      </FormSection>
      <FormSection title={t("englishContent")}>
        <FormField label={t("titleEn")} name="titleEn" defaultValue={en?.title} required />
        <FormField label={t("shortDescEn")} name="shortDescEn" defaultValue={en?.shortDesc ?? ""} />
        <div className="md:col-span-2">
          <TextAreaField label={t("descriptionEn")} name="descriptionEn" defaultValue={en?.description ?? ""} required />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
