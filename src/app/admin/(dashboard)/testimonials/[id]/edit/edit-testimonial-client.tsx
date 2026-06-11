"use client";

import { AdminFormShell } from "@/components/admin/form-shell";
import { CheckboxField, FormField, FormSection, SelectField, TextAreaField } from "@/components/admin/forms/fields";
import { useAdminLang } from "@/components/admin/lang-context";
import { updateTestimonialAction } from "./edit-testimonial-actions";

type Trans = { locale: string; content?: string | null };

export function EditTestimonialClient({
  id,
  item,
}: {
  id: string;
  item: {
    clientName: string;
    eventType: string | null;
    type: string;
    rating: number | null;
    sortOrder: number;
    featured: boolean;
    translations: Trans[];
  };
}) {
  const { t, lang } = useAdminLang();
  const isRtl = lang === "fa";
  const de = item.translations.find((tr) => tr.locale === "de");
  const en = item.translations.find((tr) => tr.locale === "en");

  const typeOptions = [
    { value: "TEXT",  label: isRtl ? "متن"    : "Text" },
    { value: "PHOTO", label: isRtl ? "عکس"    : "Photo" },
    { value: "VIDEO", label: isRtl ? "ویدیو"  : "Video" },
  ];

  const action = updateTestimonialAction.bind(null, id);

  return (
    <AdminFormShell titleKey="editTestimonial" backHref="/admin/testimonials" action={action}>
      <FormSection title={t("testimonial")}>
        <FormField label={t("clientName")} name="clientName" defaultValue={item.clientName} required />
        <FormField label={t("eventType")} name="eventType" defaultValue={item.eventType ?? ""} />
        <SelectField label={t("type")} name="type" defaultValue={item.type} options={typeOptions} />
        <FormField label={t("rating")} name="rating" type="number" defaultValue={item.rating ?? ""} min="1" max="5" />
        <FormField label={t("sortOrder")} name="sortOrder" type="number" defaultValue={item.sortOrder} />
        <CheckboxField label={t("featured")} name="featured" defaultChecked={item.featured} />
        <div className="md:col-span-2">
          <TextAreaField label={t("contentDe")} name="contentDe" defaultValue={de?.content ?? ""} required />
        </div>
        <div className="md:col-span-2">
          <TextAreaField label={t("contentEn")} name="contentEn" defaultValue={en?.content ?? ""} required />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
