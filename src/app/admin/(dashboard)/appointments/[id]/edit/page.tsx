import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { AdminFormShell } from "@/components/admin/form-shell";
import {
  FormField,
  FormSection,
  SelectField,
  TextAreaField,
} from "@/components/admin/forms/fields";
import { getAppointment, updateAppointment } from "@/actions/appointments";
import { prisma } from "@/lib/prisma";

export default async function EditAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appointment = await getAppointment(id);
  if (!appointment) notFound();

  const [clients, services] = await Promise.all([
    prisma.client.findMany({ orderBy: { lastName: "asc" } }),
    prisma.service.findMany({ include: { translations: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  const startLocal = new Date(appointment.startTime.getTime() - appointment.startTime.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  async function action(formData: FormData) {
    "use server";
    const result = await updateAppointment(id, formData);
    if (!result.success) redirect(`/admin/appointments/${id}/edit?error=${encodeURIComponent(result.error)}`);
    redirect("/admin/appointments?success=updated");
  }

  return (
    <AdminFormShell title="Edit Appointment" backHref="/admin/appointments" action={action}>
      <FormSection title="Appointment Details">
        <SelectField
          label="Client"
          name="clientId"
          defaultValue={appointment.clientId}
          required
          options={clients.map((c) => ({
            value: c.id,
            label: `${c.firstName} ${c.lastName}`,
          }))}
        />
        <SelectField
          label="Service"
          name="serviceId"
          defaultValue={appointment.serviceId}
          required
          options={services.map((s) => ({
            value: s.id,
            label: s.translations[0]?.title ?? s.slug,
          }))}
        />
        <FormField label="Start Time" name="startTime" type="datetime-local" defaultValue={startLocal} required />
        <SelectField
          label="Status"
          name="status"
          defaultValue={appointment.status}
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
          defaultValue={appointment.locale}
          options={[
            { value: "de", label: "German" },
            { value: "en", label: "English" },
          ]}
        />
        <TextAreaField label="Client Notes" name="notes" defaultValue={appointment.notes ?? ""} />
        <TextAreaField label="Internal Notes" name="internalNotes" defaultValue={appointment.internalNotes ?? ""} />
      </FormSection>
    </AdminFormShell>
  );
}
