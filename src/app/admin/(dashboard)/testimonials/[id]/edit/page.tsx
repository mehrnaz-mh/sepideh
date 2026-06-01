import { notFound, redirect } from "next/navigation";
import { AdminFormShell } from "@/components/admin/form-shell";
import {
  CheckboxField,
  FormField,
  FormSection,
  SelectField,
  TextAreaField,
} from "@/components/admin/forms/fields";
import { getTestimonial, updateTestimonial } from "@/actions/testimonials";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getTestimonial(id);
  if (!item) notFound();

  const de = item.translations.find((t) => t.locale === "de");
  const en = item.translations.find((t) => t.locale === "en");

  async function action(formData: FormData) {
    "use server";
    const result = await updateTestimonial(id, formData);
    if (!result.success) redirect(`/admin/testimonials/${id}/edit?error=1`);
    redirect("/admin/testimonials");
  }

  return (
    <AdminFormShell title="Edit Testimonial" backHref="/admin/testimonials" action={action}>
      <FormSection title="Testimonial">
        <FormField label="Client Name" name="clientName" defaultValue={item.clientName} required />
        <FormField label="Event Type" name="eventType" defaultValue={item.eventType ?? ""} />
        <SelectField
          label="Type"
          name="type"
          defaultValue={item.type}
          options={[
            { value: "TEXT", label: "Text" },
            { value: "PHOTO", label: "Photo" },
            { value: "VIDEO", label: "Video" },
          ]}
        />
        <FormField label="Rating" name="rating" type="number" defaultValue={item.rating ?? ""} min="1" max="5" />
        <FormField label="Sort Order" name="sortOrder" type="number" defaultValue={item.sortOrder} />
        <CheckboxField label="Featured" name="featured" defaultChecked={item.featured} />
        <div className="md:col-span-2">
          <TextAreaField label="Content (DE)" name="contentDe" defaultValue={de?.content} required />
        </div>
        <div className="md:col-span-2">
          <TextAreaField label="Content (EN)" name="contentEn" defaultValue={en?.content} required />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
