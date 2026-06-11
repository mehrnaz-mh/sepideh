"use client";

import { AdminFormShell } from "@/components/admin/form-shell";
import { FormField, FormSection, SelectField, TextAreaField } from "@/components/admin/forms/fields";
import { useAdminLang } from "@/components/admin/lang-context";
import { updateAppointmentAction } from "./edit-appointment-actions";

type Client = { id: string; firstName: string; lastName: string };
type Service = { id: string; slug: string; translations: { title: string }[] };

export function EditAppointmentClient({
  id,
  appointment,
  clients,
  services,
  startLocal,
}: {
  id: string;
  appointment: { clientId: string; serviceId: string; status: string; locale: string; notes: string | null; internalNotes: string | null };
  clients: Client[];
  services: Service[];
  startLocal: string;
}) {
  const { t, lang } = useAdminLang();
  const isRtl = lang === "fa";

  const statusOptions = [
    { value: "PENDING",   label: isRtl ? "در انتظار"    : "Pending" },
    { value: "CONFIRMED", label: isRtl ? "تأیید شده"    : "Confirmed" },
    { value: "COMPLETED", label: isRtl ? "انجام شده"    : "Completed" },
    { value: "CANCELLED", label: isRtl ? "لغو شده"      : "Cancelled" },
    { value: "NO_SHOW",   label: isRtl ? "حاضر نشده"   : "No Show" },
  ];

  const localeOptions = [
    { value: "de", label: isRtl ? "آلمانی" : "German" },
    { value: "en", label: isRtl ? "انگلیسی" : "English" },
  ];

  const action = updateAppointmentAction.bind(null, id);

  return (
    <AdminFormShell titleKey="editAppointment" backHref="/admin/appointments" action={action}>
      <FormSection title={t("appointmentDetails")}>
        <SelectField label={t("service")} name="serviceId" defaultValue={appointment.serviceId} required
          options={services.map((s) => ({ value: s.id, label: s.translations[0]?.title ?? s.slug }))} />
        <SelectField label={t("client")} name="clientId" defaultValue={appointment.clientId} required
          options={clients.map((c) => ({ value: c.id, label: `${c.firstName} ${c.lastName}` }))} />
        <SelectField label={t("status")} name="status" defaultValue={appointment.status} options={statusOptions} />
        <FormField label={t("startTime")} name="startTime" type="datetime-local" defaultValue={startLocal} required />
        <TextAreaField label={t("clientNotes")} name="notes" defaultValue={appointment.notes ?? ""} />
        <SelectField label={t("locale")} name="locale" defaultValue={appointment.locale} options={localeOptions} />
        <div className="md:col-span-2">
          <TextAreaField label={t("internalNotes")} name="internalNotes" defaultValue={appointment.internalNotes ?? ""} />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
