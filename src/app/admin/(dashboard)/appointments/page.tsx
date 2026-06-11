import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import { T } from "@/components/admin/t";
import { cn } from "@/lib/utils";
import {
  getAppointments,
  deleteAppointment,
} from "@/actions/appointments";
import { DeleteButton } from "@/components/admin/delete-button";
import { Pencil, ChevronLeft, ChevronRight } from "lucide-react";
import type { AppointmentStatus } from "@prisma/client";
import { AppointmentsTable } from "./appointments-table";

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

  const tabs: Array<{ key: string; labelKey: string }> = [
    { key: "ALL", labelKey: "all" },
    { key: "PENDING", labelKey: "pending" },
    { key: "CONFIRMED", labelKey: "confirmed" },
    { key: "COMPLETED", labelKey: "completed" },
    { key: "CANCELLED", labelKey: "cancelled" },
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
    const { confirmAppointment } = await import("@/actions/appointments");
    await confirmAppointment(String(formData.get("appointmentId")));
  }

  async function rejectAction(formData: FormData) {
    "use server";
    const { rejectAppointment } = await import("@/actions/appointments");
    await rejectAppointment(String(formData.get("appointmentId")), (formData.get("rejectionReason") as string) || undefined);
  }

  return (
    <div className="min-w-0">
      <AdminPageHeader
        titleKey="appointments"
        descriptionKey="appointmentsDesc"
        createHref="/admin/appointments/new"
        createLabelKey="newAppointment"
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
              <T k={tab.labelKey} /> ({count})
            </Link>
          );
        })}
      </div>

      {/* Mobile: card list */}
      <div className="flex flex-col gap-2 lg:hidden">
        {appointments.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted"><T k="noAppointmentsFound" /></p>
        ) : (
          appointments.map((apt) => (
            <div key={apt.id} className="border border-border bg-background rounded-sm p-4 min-w-0">
              <div className="flex items-start justify-between gap-2 min-w-0">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-sm text-foreground">
                    {apt.client.firstName} {apt.client.lastName}
                  </p>
                  <p className="truncate text-xs text-muted">{apt.client.email}</p>
                  {apt.client.phone && (
                    <a href={`tel:${apt.client.phone.replace(/\s/g, "")}`} className="text-xs text-foreground hover:text-gold">
                      {apt.client.phone}
                    </a>
                  )}
                </div>
                <StatusBadge status={apt.status} />
              </div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                <span>{apt.service.translations.find((t) => t.locale === "en")?.title ?? apt.service.translations[0]?.title}</span>
                <span>{apt.startTime.toLocaleString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              {apt.notes && <p className="mt-1 text-xs text-muted italic line-clamp-2">{apt.notes}</p>}
              <div className="mt-3 flex items-center gap-3">
                <Link href={`/admin/appointments/${apt.id}/edit`} className="text-muted hover:text-gold transition-colors leading-none" title="Edit">
                  <Pencil size={16} />
                </Link>
                <DeleteButton action={deleteAppointment.bind(null, apt.id)} label="" confirmMessage="Delete appointment?" />
                {apt.status === "PENDING" && (
                  <>
                    <form action={confirmAction}>
                      <input type="hidden" name="appointmentId" value={apt.id} />
                      <button type="submit" className="rounded-sm border border-green-600 px-3 py-1 text-[11px] uppercase tracking-widest text-green-700 hover:bg-green-50 transition-colors">
                        <T k="confirm" />
                      </button>
                    </form>
                    <details>
                      <summary className="cursor-pointer rounded-sm border border-red-300 px-3 py-1 text-[11px] uppercase tracking-widest text-red-600 hover:bg-red-50 transition-colors list-none">
                        <T k="decline" />
                      </summary>
                      <form action={rejectAction} className="mt-2 border border-border bg-background p-3 rounded-sm">
                        <input type="hidden" name="appointmentId" value={apt.id} />
                        <textarea name="rejectionReason" className="w-full border border-border bg-background-secondary px-3 py-2 text-sm resize-none rounded-sm" rows={2} />
                        <button type="submit" className="mt-2 w-full rounded-sm border border-red-400 px-3 py-1.5 text-xs uppercase tracking-widest text-red-700 hover:bg-red-50 transition-colors">
                          <T k="confirmDecline" />
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

      {/* Desktop: client component table with RTL-aware alignment */}
      <AppointmentsTable appointments={appointments} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-muted">
          <span>{filtered.length} · <T k="page" /> {currentPage} <T k="of" /> {totalPages}</span>
          <div className="flex items-center gap-1">
            {currentPage > 1 && (
              <Link href={pageHref(currentPage - 1)} className="flex items-center gap-1 rounded-sm border border-border px-3 py-1.5 hover:border-gold hover:text-gold transition-colors">
                <ChevronLeft size={14} /> <T k="prev" />
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
                <T k="next" /> <ChevronRight size={14} />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
