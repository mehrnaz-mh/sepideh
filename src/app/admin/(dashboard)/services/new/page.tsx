import { redirect } from "next/navigation";
import { AdminFormShell } from "@/components/admin/form-shell";
import {
  CheckboxField,
  FormField,
  FormSection,
  SelectField,
  TextAreaField,
} from "@/components/admin/forms/fields";
import { createService } from "@/actions/services";
import { SERVICE_ICON_LABELS } from "@/lib/service-icons";

const iconOptions = [
  { value: "", label: "—" },
  ...Object.entries(SERVICE_ICON_LABELS).map(([value, label]) => ({ value, label })),
];

export default function NewServicePage() {
  async function action(formData: FormData) {
    "use server";
    const result = await createService(formData);
    if (!result.success) redirect(`/admin/services/new?error=${encodeURIComponent(result.error)}`);
    redirect("/admin/services?success=created");
  }

  return (
    <AdminFormShell title="New Service" backHref="/admin/services" action={action} submitLabel="Create">
      <FormSection title="Service Details">
        <FormField label="Slug" name="slug" required placeholder="bridal-makeup" />
        <FormField label="Sort Order" name="sortOrder" type="number" defaultValue={0} />
        <FormField label="Duration (minutes)" name="durationMinutes" type="number" defaultValue={60} required />
        <FormField label="Buffer (minutes)" name="bufferMinutes" type="number" defaultValue={15} />
        <SelectField label="Icon" name="icon" options={iconOptions} />
        <CheckboxField label="Active" name="isActive" defaultChecked />
      </FormSection>
      <FormSection title="German Content">
        <FormField label="Title (DE)" name="titleDe" required />
        <FormField label="Short Description (DE)" name="shortDescDe" />
        <div className="md:col-span-2">
          <TextAreaField label="Description (DE)" name="descriptionDe" required />
        </div>
      </FormSection>
      <FormSection title="English Content">
        <FormField label="Title (EN)" name="titleEn" required />
        <FormField label="Short Description (EN)" name="shortDescEn" />
        <div className="md:col-span-2">
          <TextAreaField label="Description (EN)" name="descriptionEn" required />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
