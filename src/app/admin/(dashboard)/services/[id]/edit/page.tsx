import { notFound, redirect } from "next/navigation";
import { AdminFormShell } from "@/components/admin/form-shell";
import {
  CheckboxField,
  FormField,
  FormSection,
  TextAreaField,
} from "@/components/admin/forms/fields";
import { getService, updateService } from "@/actions/services";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getService(id);
  if (!service) notFound();

  const de = service.translations.find((t) => t.locale === "de");
  const en = service.translations.find((t) => t.locale === "en");

  async function action(formData: FormData) {
    "use server";
    const result = await updateService(id, formData);
    if (!result.success) redirect(`/admin/services/${id}/edit?error=${encodeURIComponent(result.error)}`);
    redirect("/admin/services");
  }

  return (
    <AdminFormShell title="Edit Service" backHref="/admin/services" action={action}>
      <FormSection title="Service Details">
        <FormField label="Slug" name="slug" defaultValue={service.slug} required />
        <FormField label="Sort Order" name="sortOrder" type="number" defaultValue={service.sortOrder} />
        <FormField label="Duration (minutes)" name="durationMinutes" type="number" defaultValue={service.durationMinutes} required />
        <FormField label="Buffer (minutes)" name="bufferMinutes" type="number" defaultValue={service.bufferMinutes} />
        <CheckboxField label="Active" name="isActive" defaultChecked={service.isActive} />
      </FormSection>
      <FormSection title="German Content">
        <FormField label="Title (DE)" name="titleDe" defaultValue={de?.title} required />
        <FormField label="Short Description (DE)" name="shortDescDe" defaultValue={de?.shortDesc ?? ""} />
        <div className="md:col-span-2">
          <TextAreaField label="Description (DE)" name="descriptionDe" defaultValue={de?.description} required />
        </div>
      </FormSection>
      <FormSection title="English Content">
        <FormField label="Title (EN)" name="titleEn" defaultValue={en?.title} required />
        <FormField label="Short Description (EN)" name="shortDescEn" defaultValue={en?.shortDesc ?? ""} />
        <div className="md:col-span-2">
          <TextAreaField label="Description (EN)" name="descriptionEn" defaultValue={en?.description} required />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
