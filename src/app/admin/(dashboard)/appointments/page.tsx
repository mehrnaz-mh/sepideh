import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
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

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  CONFIRMED: "bg-green-100 text-green-800",
  COMPLETED: "bg-background-secondary text-muted",
  CANCELLED: "bg-red-100 text-red-700",
  NO_SHOW: "bg-red-100 text-red-700",
};

const statusLabel: Record<string, string> = {
  PENDING: "Pending",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  NO_SHOW: "No Show",
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
    { key: "ALL", label: "All" },
    { key: "PENDING", label: "Pending" },
    { key: "CONFIRMED", label: "Confirmed" },
    { key: "COMPLETED", label: "Completed" },
    { key: "CANCELLED", label: "Cancelled" },
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
    <div className="min-w-0">
      <AdminPageHeader
        title="Appointments"
        description="Manage all booking requests and appointments"
        createHref="/admin/appointments/new"
        createLabel="New Appointment"
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
                "rounded-sm border px-3 py-1.5 text-xs uppercase tracking-widest transition-colors",
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

      {/* Mobile: card list */}
      <div className="flex flex-col gap-2 lg:hidden">
        {appointments.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted">No appointments found</p>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="border border-border bg-background rounded-sm p-4 min-w-0">
              {/* Top row: name + status */}
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm text-foreground">
                    {apt.client.firstName} {apt.client.lastName}
                  </p>
                  <p className="truncate text-xs text-muted">{apt.client.email}</p>
                  {apt.client.phone && (
                    <a
                      href={`tel:${apt.client.phone.replace(/\s/g, "")}`}
                      className="text-xs text-foreground hover:text-gold"
                    >
                      {apt.client.phone}
                    </a>
                  )}
                </div>
                <span className={`shrink-0 rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-wider ${statusStyles[apt.status] ?? "bg-background-secondary text-muted"}`}>
                  {statusLabel[apt.status] ?? apt.status}
                </span>
              </div>

              {/* Service + date */}
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                <span>
                  {apt.service.translations.find((t) => t.locale === "en")?.title ??
                    apt.service.translations[0]?.title}
                </span>
                <span>
                  {apt.startTime.toLocaleString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              {apt.notes && (
                <p className="mt-1 text-xs text-muted italic line-clamp-2">{apt.notes}</p>
              )}

              {/* Actions */}
              <div className="mt-3 flex items-center gap-3">
                <Link
                  href={`/admin/appointments/${apt.id}/edit`}
                  className="text-muted hover:text-gold transition-colors"
                  title="Edit"
                >
                  <Pencil size={15} />
                </Link>
                <DeleteButton
                  action={deleteAppointment.bind(null, apt.id)}
                  label=""
                  confirmMessage="Delete appointment?"
                />
                {apt.status === "PENDING" && (
                  <>
                    <form action={confirmAction}>
                      <input type="hidden" name="appointmentId" value={apt.id} />
                      <button
                        type="submit"
                        className="rounded-sm border border-green-600 bg-green-50 px-3 py-1 text-[11px] uppercase tracking-widest text-green-700 hover:bg-green-100 transition-colors"
                      >
                        ✓ Confirm
                      </button>
                    </form>
                    <details>
                      <summary className="cursor-pointer rounded-sm border border-red-300 bg-red-50 px-3 py-1 text-[11px] uppercase tracking-widest text-red-700 hover:bg-red-100 transition-colors list-none">
                        ✕ Decline
                      </summary>
                      <form action={rejectAction} className="mt-2 border border-border bg-background p-3 rounded-sm">
                        <input type="hidden" name="appointmentId" value={apt.id} />
                        <textarea
                          name="rejectionReason"
                          placeholder="Reason (optional)"
                          className="w-full border border-border bg-background-secondary px-3 py-2 text-sm resize-none rounded-sm"
                          rows={2}
                        />
                        <button
                          type="submit"
                          className="mt-2 w-full rounded-sm border border-red-400 bg-red-50 px-3 py-1.5 text-xs uppercase tracking-widest text-red-700 hover:bg-red-100 transition-colors"
                        >
                          Confirm Decline
                        </button>
                      </form>
                    </details>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden lg:block overflow-x-auto border border-border bg-background rounded-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-background-secondary">
            <tr>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-muted w-1/4">Client</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-muted">Phone</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-muted">Service</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-muted">Appointment</th>
              <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-muted">Status</th>
              <th className="px-4 py-3 text-right text-xs uppercase tracking-widest font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted">
                  No appointments found
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
                    {apt.startTime.toLocaleString("en-GB", {
                      weekday: "short",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-wider ${statusStyles[apt.status] ?? "bg-background-secondary text-muted"}`}>
                      {statusLabel[apt.status] ?? apt.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/admin/appointments/${apt.id}/edit`}
                          className="text-muted hover:text-gold transition-colors"
                          title="Edit"
                        >
                          <Pencil size={15} />
                        </Link>
                        <DeleteButton
                          action={deleteAppointment.bind(null, apt.id)}
                          label=""
                          confirmMessage="Delete appointment?"
                        />
                      </div>

                      {apt.status === "PENDING" && (
                        <div className="flex flex-col gap-2 w-full items-end">
                          <form action={confirmAction}>
                            <input type="hidden" name="appointmentId" value={apt.id} />
                            <button
                              type="submit"
                              className="rounded-sm border border-green-600 bg-green-50 px-3 py-1 text-[11px] uppercase tracking-widest text-green-700 hover:bg-green-100 transition-colors"
                            >
                              ✓ Confirm
                            </button>
                          </form>
                          <details className="w-full">
                            <summary className="cursor-pointer rounded-sm border border-red-300 bg-red-50 px-3 py-1 text-[11px] uppercase tracking-widest text-red-700 hover:bg-red-100 transition-colors list-none text-right">
                              ✕ Decline
                            </summary>
                            <form action={rejectAction} className="mt-2 border border-border bg-background p-3 rounded-sm">
                              <input type="hidden" name="appointmentId" value={apt.id} />
                              <textarea
                                name="rejectionReason"
                                placeholder="Reason (optional)"
                                className="w-full border border-border bg-background-secondary px-3 py-2 text-sm resize-none rounded-sm"
                                rows={2}
                              />
                              <button
                                type="submit"
                                className="mt-2 w-full rounded-sm border border-red-400 bg-red-50 px-3 py-1.5 text-xs uppercase tracking-widest text-red-700 hover:bg-red-100 transition-colors"
                              >
                                Confirm Decline
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
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
          <span>{filtered.length} appointments · Page {currentPage} of {totalPages}</span>
          <div className="flex items-center gap-1">
            {currentPage > 1 && (
              <Link href={pageHref(currentPage - 1)} className="flex items-center gap-1 rounded-sm border border-border px-3 py-1.5 hover:border-gold hover:text-gold transition-colors">
                <ChevronLeft size={14} /> Prev
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={pageHref(p)}
                className={cn(
                  "rounded-sm border px-3 py-1.5 transition-colors",
                  p === currentPage
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-border hover:border-gold hover:text-gold"
                )}
              >
                {p}
              </Link>
            ))}
            {currentPage < totalPages && (
              <Link href={pageHref(currentPage + 1)} className="flex items-center gap-1 rounded-sm border border-border px-3 py-1.5 hover:border-gold hover:text-gold transition-colors">
                Next <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
