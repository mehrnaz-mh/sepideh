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
    if (!result.success) redirect(`/admin/settings/availability/${id}/edit?error=1`);
    redirect("/admin/settings");
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
        <FormField label="Start" name="startTime" defaultValue={rule.startTime} required />
        <FormField label="End" name="endTime" defaultValue={rule.endTime} required />
        <CheckboxField label="Active" name="isActive" defaultChecked={rule.isActive} />
      </FormSection>
    </AdminFormShell>
  );
}
