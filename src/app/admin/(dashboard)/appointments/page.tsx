import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  getAppointments,
  deleteAppointment,
  confirmAppointment,
  rejectAppointment,
} from "@/actions/appointments";
import { DeleteButton } from "@/components/admin/delete-button";
import type { AppointmentStatus } from "@prisma/client";

const statusVariant: Record<string, "default" | "success" | "warning" | "danger"> = {
  PENDING: "warning",
  CONFIRMED: "success",
  COMPLETED: "default",
  CANCELLED: "danger",
  NO_SHOW: "danger",
};

const statusLabel: Record<string, string> = {
  PENDING: "Ausstehend",
  CONFIRMED: "Bestätigt",
  COMPLETED: "Abgeschlossen",
  CANCELLED: "Storniert",
  NO_SHOW: "Nicht erschienen",
};

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter } = await searchParams;
  const activeFilter = (filter as AppointmentStatus | "ALL" | undefined) ?? "ALL";
  const allAppointments = await getAppointments();

  const appointments =
    activeFilter === "ALL"
      ? allAppointments
      : allAppointments.filter((a) => a.status === activeFilter);

  const tabs: Array<{ key: string; label: string }> = [
    { key: "ALL", label: "Alle" },
    { key: "PENDING", label: "Ausstehend" },
    { key: "CONFIRMED", label: "Bestätigt" },
    { key: "COMPLETED", label: "Abgeschlossen" },
    { key: "CANCELLED", label: "Storniert" },
  ];

  async function confirmAction(formData: FormData) {
    "use server";
    const id = String(formData.get("appointmentId"));
    await confirmAppointment(id);
  }

  async function rejectAction(formData: FormData) {
    "use server";
    const id = String(formData.get("appointmentId"));
    const reason = formData.get("rejectionReason") as string | null;
    await rejectAppointment(id, reason || undefined);
  }

  return (
    <div>
      <AdminPageHeader
        title="Termine"
        description="Alle Buchungsanfragen und Termine verwalten"
        createHref="/admin/appointments/new"
        createLabel="Neuer Termin"
      />

      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const count =
            tab.key === "ALL"
              ? allAppointments.length
              : allAppointments.filter((a) => a.status === tab.key).length;
          return (
            <Link
              key={tab.key}
              href={tab.key === "ALL" ? "/admin/appointments" : `/admin/appointments?filter=${tab.key}`}
              className={cn(
                "border px-4 py-1.5 text-xs uppercase tracking-widest transition-colors",
                activeFilter === tab.key
                  ? "border-gold bg-gold/10 text-gold"
                  : "border-border hover:border-gold text-muted",
              )}
            >
              {tab.label} ({count})
            </Link>
          );
        })}
      </div>

      <div className="overflow-x-auto border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-background-secondary">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Kunde</th>
              <th className="px-4 py-3 text-left font-medium">Telefon</th>
              <th className="px-4 py-3 text-left font-medium">Leistung</th>
              <th className="px-4 py-3 text-left font-medium">Termin</th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  Keine Termine gefunden
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
                    {apt.client.phone ? (
                      <a
                        href={`tel:${apt.client.phone.replace(/\s/g, "")}`}
                        className="font-bold text-foreground hover:text-gold"
                      >
                        {apt.client.phone}
                      </a>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {apt.service.translations.find((t) => t.locale === "de")?.title ??
                      apt.service.translations[0]?.title}
                  </td>
                  <td className="px-4 py-3">
                    {apt.startTime.toLocaleString("de-DE", {
                      weekday: "short",
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[apt.status] ?? "default"}>
                      {statusLabel[apt.status] ?? apt.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/appointments/${apt.id}/edit`}
                          className="text-xs uppercase tracking-wide text-gold hover:underline"
                        >
                          Bearbeiten
                        </Link>
                        <DeleteButton
                          action={deleteAppointment.bind(null, apt.id)}
                          label=""
                          confirmMessage="Termin löschen?"
                        />
                      </div>

                      {apt.status === "PENDING" && (
                        <div className="flex flex-col gap-2 w-full items-end">
                          {/* Confirm */}
                          <form action={confirmAction}>
                            <input type="hidden" name="appointmentId" value={apt.id} />
                            <button
                              type="submit"
                              className="border border-green-600 bg-green-50 px-3 py-1 text-[11px] uppercase tracking-widest text-green-700 hover:bg-green-100 transition-colors"
                            >
                              ✓ Bestätigen
                            </button>
                          </form>
                          {/* Reject with optional reason */}
                          <details className="w-full">
                            <summary className="cursor-pointer border border-red-300 bg-red-50 px-3 py-1 text-[11px] uppercase tracking-widest text-red-700 hover:bg-red-100 transition-colors list-none text-right">
                              ✕ Ablehnen
                            </summary>
                            <form action={rejectAction} className="mt-2 border border-border bg-background p-3">
                              <input type="hidden" name="appointmentId" value={apt.id} />
                              <textarea
                                name="rejectionReason"
                                placeholder="Begründung (optional)"
                                className="w-full border border-border bg-background-secondary px-3 py-2 text-sm resize-none"
                                rows={2}
                              />
                              <button
                                type="submit"
                                className="mt-2 w-full border border-red-400 bg-red-50 px-3 py-1.5 text-xs uppercase tracking-widest text-red-700 hover:bg-red-100 transition-colors"
                              >
                                Ablehnung bestätigen
                              </button>
                            </form>
                          </details>
                        </div>
                      )}

                      {apt.notes && (
                        <p className="max-w-[200px] text-right text-xs text-muted italic">
                          {apt.notes}
                        </p>
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
