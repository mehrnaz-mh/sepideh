import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge } from "@/components/ui/badge";
import { getAppointments, deleteAppointment, updateAppointmentStatus } from "@/actions/appointments";
import type { AppointmentStatus } from "@prisma/client";

const statusVariant: Record<string, "default" | "success" | "warning" | "danger"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  COMPLETED: "default",
  CANCELLED: "danger",
  NO_SHOW: "danger",
};

export default async function AdminAppointmentsPage() {
  const appointments = await getAppointments();

  return (
    <div>
      <AdminPageHeader
        title="Appointments"
        description="Manage all client appointments"
        createHref="/admin/appointments/new"
        createLabel="New Appointment"
      />

      <div className="overflow-x-auto border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-background-secondary">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Client</th>
              <th className="px-4 py-3 text-left font-medium">Service</th>
              <th className="px-4 py-3 text-left font-medium">Date & Time</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted">
                  No appointments yet
                </td>
              </tr>
            ) : (
              appointments.map((apt) => (
                <tr key={apt.id} className="border-b border-border">
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {apt.client.firstName} {apt.client.lastName}
                    </div>
                    <div className="text-xs text-muted">{apt.client.email}</div>
                  </td>
                  <td className="px-4 py-3">
                    {apt.service.translations.find((t) => t.locale === "de")?.title ??
                      apt.service.translations[0]?.title}
                  </td>
                  <td className="px-4 py-3">{apt.startTime.toLocaleString("de-DE")}</td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[apt.status] ?? "default"}>{apt.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/appointments/${apt.id}/edit`}
                        className="text-xs uppercase tracking-wide text-gold hover:underline"
                      >
                        Edit
                      </Link>
                      <DeleteButton
                        action={deleteAppointment.bind(null, apt.id)}
                        label=""
                        confirmMessage="Delete this appointment?"
                      />
                    </div>
                    <div className="mt-2 flex flex-wrap justify-end gap-1">
                      {(["CONFIRMED", "COMPLETED", "CANCELLED"] as AppointmentStatus[]).map(
                        (status) => (
                          <form
                            key={status}
                            action={async () => {
                              "use server";
                              await updateAppointmentStatus(apt.id, status);
                            }}
                          >
                            <button
                              type="submit"
                              className="border border-border px-2 py-0.5 text-[10px] uppercase hover:border-gold"
                            >
                              {status}
                            </button>
                          </form>
                        ),
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
