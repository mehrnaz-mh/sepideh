"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { useAdminLang } from "@/components/admin/lang-context";
import {
  CheckboxField,
  FormField,
  SelectField,
  TextAreaField,
} from "@/components/admin/forms/fields";
import { deleteTestimonial } from "@/actions/testimonials";
import { createAction } from "./testimonials-actions";

type Testimonial = {
  id: string;
  clientName: string;
  featured: boolean;
  translations: { locale: string; content: string }[];
};

export function TestimonialsClient({ testimonials }: { testimonials: Testimonial[] }) {
  const { t, lang } = useAdminLang();

  return (
    <div className="space-y-10">
      <AdminPageHeader titleKey="testimonialsTitle" descriptionKey="testimonialsDesc" />

      <form action={createAction} className="space-y-6 border border-border bg-background p-6 rounded-sm">
        <h2 className="text-xl">{t("addTestimonial")}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label={t("clientName")} name="clientName" required />
          <FormField label={t("eventType")} name="eventType" placeholder="Wedding, Gala..." />
          <SelectField
            label="Type"
            name="type"
            defaultValue="TEXT"
            options={[
              { value: "TEXT", label: "Text" },
              { value: "PHOTO", label: "Photo" },
              { value: "VIDEO", label: "Video" },
            ]}
          />
          <FormField label={t("rating")} name="rating" type="number" min="1" max="5" />
          <FormField label={t("sortOrder")} name="sortOrder" type="number" defaultValue={0} />
          <CheckboxField label={t("featuredLabel")} name="featured" />
          <div className="md:col-span-2">
            <TextAreaField label={t("contentDe")} name="contentDe" required />
          </div>
          <div className="md:col-span-2">
            <TextAreaField label={t("contentEn")} name="contentEn" required />
          </div>
        </div>
        <SubmitButton labelKey="addTestimonial" />
      </form>

      <div className="grid gap-4 md:grid-cols-2">
        {testimonials.map((item) => {
          const content = item.translations.find((tr) => tr.locale === "de")?.content;
          return (
            <div key={item.id} className="border border-border bg-background p-5 rounded-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-base font-medium">— {item.clientName}</p>
                  {item.featured && (
                    <span className="text-xs uppercase text-gold">{t("featuredLabel")}</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Link href={`/admin/testimonials/${item.id}/edit`} className="text-muted hover:text-gold transition-colors leading-none" title="Edit">
                    <Pencil size={16} />
                  </Link>
                  <DeleteButton action={deleteTestimonial.bind(null, item.id)} label="" />
                </div>
              </div>
              <p className="mt-3 text-sm text-muted line-clamp-4">{content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
