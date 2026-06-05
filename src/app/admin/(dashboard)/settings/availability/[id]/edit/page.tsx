import { notFound, redirect } from "next/navigation";
import { AdminFormShell } from "@/components/admin/form-shell";
import {
  CheckboxField,
  FormField,
  FormSection,
  SelectField,
} from "@/components/admin/forms/fields";
import { prisma } from "@/lib/prisma";
import { updateAvailabilityRule } from "@/actions/settings";

export default async function EditAvailabilityRulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rule = await prisma.availabilityRule.findUnique({ where: { id } });
  if (!rule) notFound();

  async function action(formData: FormData) {
    "use server";
    const result = await updateAvailabilityRule(id, formData);
    if (!result.success) redirect(`/admin/settings/availability/${id}/edit?error=time_format`);
    redirect("/admin/settings?success=updated");
  }

  return (
    <AdminFormShell title="Edit Working Hours" backHref="/admin/settings" action={action}>
      <FormSection title="Availability Rule">
        <SelectField
          label="Day"
          name="dayOfWeek"
          defaultValue={rule.dayOfWeek}
          required
          options={[
            "MONDAY",
            "TUESDAY",
            "WEDNESDAY",
            "THURSDAY",
            "FRIDAY",
            "SATURDAY",
            "SUNDAY",
          ].map((d) => ({ value: d, label: d }))}
        />
        <FormField label="Start Time" name="startTime" defaultValue={rule.startTime} required placeholder="10:00" hint='Format: HH:MM — e.g. "10:00"' />
        <FormField label="End Time" name="endTime" defaultValue={rule.endTime} required placeholder="19:00" hint='Format: HH:MM — e.g. "18:00"' />
        <CheckboxField label="Active" name="isActive" defaultChecked={rule.isActive} />
      </FormSection>
    </AdminFormShell>
  );
}
