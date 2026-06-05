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
import { Pencil, ChevronLeft, ChevronRight } from "lucide-react";
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

const PAGE_SIZE = 15;

export default async function AdminAppointmentsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; page?: string }>;
}) {
  const { filter, page } = await searchParams;
  const activeFilter = (filter as AppointmentStatus | "ALL" | undefined) ?? "ALL";
  const currentPage = Math.max(1, parseInt(page ?? "1", 10));
  const allAppointments = await getAppointments();

  const filtered =
    activeFilter === "ALL"
      ? allAppointments
      : allAppointments.filter((a) => a.status === activeFilter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const appointments = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const tabs: Array<{ key: string; label: string }> = [
    { key: "ALL", label: "Alle" },
    { key: "PENDING", label: "Ausstehend" },
    { key: "CONFIRMED", label: "Bestätigt" },
    { key: "COMPLETED", label: "Abgeschlossen" },
    { key: "CANCELLED", label: "Storniert" },
  ];

  function pageHref(p: number) {
    const params = new URLSearchParams();
    if (activeFilter !== "ALL") params.set("filter", activeFilter);
    if (p > 1) params.set("page", String(p));
    const q = params.toString();
    return `/admin/appointments${q ? `?${q}` : ""}`;
  }

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
              <th className="px-4 py-3 text-left font-medium w-1/4">Kunde</th>
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
                  <td className="px-4 py-3 w-1/4">
                    <div className="font-medium">
                      {apt.client.firstName} {apt.client.lastName}
                    </div>
                    <div className="text-xs text-muted break-all">{apt.client.email}</div>
                    {apt.notes && (
                      <div className="mt-1 text-xs text-muted italic line-clamp-2" title={apt.notes}>
                        {apt.notes}
                      </div>
                    )}
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
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/appointments/${apt.id}/edit`}
                          className="text-muted hover:text-gold transition-colors"
                          title="Bearbeiten"
                        >
                          <Pencil size={15} />
                        </Link>
                        <DeleteButton
                          action={deleteAppointment.bind(null, apt.id)}
                          label=""
                          confirmMessage="Termin löschen?"
                        />
                      </div>

                      {apt.status === "PENDING" && (
                        <div className="flex flex-col gap-2 w-full items-end">
                          <form action={confirmAction}>
                            <input type="hidden" name="appointmentId" value={apt.id} />
                            <button
                              type="submit"
                              className="border border-green-600 bg-green-50 px-3 py-1 text-[11px] uppercase tracking-widest text-green-700 hover:bg-green-100 transition-colors"
                            >
                              ✓ Bestätigen
                            </button>
                          </form>
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

                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm text-muted">
          <span>{filtered.length} Termine · Seite {currentPage} von {totalPages}</span>
          <div className="flex items-center gap-1">
            {currentPage > 1 && (
              <Link href={pageHref(currentPage - 1)} className="flex items-center gap-1 border border-border px-3 py-1.5 hover:border-gold hover:text-gold transition-colors">
                <ChevronLeft size={14} /> Zurück
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={pageHref(p)}
                className={cn(
                  "border px-3 py-1.5 transition-colors",
                  p === currentPage
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border hover:border-gold hover:text-gold"
                )}
              >
                {p}
              </Link>
            ))}
            {currentPage < totalPages && (
              <Link href={pageHref(currentPage + 1)} className="flex items-center gap-1 border border-border px-3 py-1.5 hover:border-gold hover:text-gold transition-colors">
                Weiter <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
