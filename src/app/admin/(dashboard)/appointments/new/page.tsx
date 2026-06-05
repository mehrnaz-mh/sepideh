import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminFormShell } from "@/components/admin/form-shell";
import {
  CheckboxField,
  FormField,
  FormSection,
  SelectField,
  TextAreaField,
} from "@/components/admin/forms/fields";
import { createAppointment } from "@/actions/appointments";
import { prisma } from "@/lib/prisma";

export default async function NewAppointmentPage() {
  const [clients, services] = await Promise.all([
    prisma.client.findMany({ orderBy: { lastName: "asc" } }),
    prisma.service.findMany({
      include: { translations: true },
      orderBy: { sortOrder: "asc" },
    }),
  ]);

  async function action(formData: FormData) {
    "use server";
    const result = await createAppointment(formData);
    if (!result.success) redirect(`/admin/appointments/new?error=${encodeURIComponent(result.error)}`);
    redirect("/admin/appointments?success=created");
  }

  return (
    <AdminFormShell title="New Appointment" backHref="/admin/appointments" action={action} submitLabel="Create">
      <FormSection title="Appointment Details">
        <SelectField
          label="Client"
          name="clientId"
          required
          options={clients.map((c) => ({
            value: c.id,
            label: `${c.firstName} ${c.lastName} (${c.email})`,
          }))}
        />
        <SelectField
          label="Service"
          name="serviceId"
          required
          options={services.map((s) => ({
            value: s.id,
            label: s.translations.find((t) => t.locale === "de")?.title ?? s.slug,
          }))}
        />
        <FormField label="Start Time" name="startTime" type="datetime-local" required />
        <SelectField
          label="Status"
          name="status"
          defaultValue="PENDING"
          options={[
            { value: "PENDING", label: "Pending" },
            { value: "CONFIRMED", label: "Confirmed" },
            { value: "COMPLETED", label: "Completed" },
            { value: "CANCELLED", label: "Cancelled" },
            { value: "NO_SHOW", label: "No Show" },
          ]}
        />
        <SelectField
          label="Locale"
          name="locale"
          defaultValue="de"
          options={[
            { value: "de", label: "German" },
            { value: "en", label: "English" },
          ]}
        />
        <TextAreaField label="Client Notes" name="notes" />
        <TextAreaField label="Internal Notes" name="internalNotes" />
      </FormSection>
      {clients.length === 0 && (
        <p className="text-sm text-muted">
          No clients yet. <Link href="/admin/clients/new" className="text-gold">Create a client</Link> first.
        </p>
      )}
    </AdminFormShell>
  );
}
