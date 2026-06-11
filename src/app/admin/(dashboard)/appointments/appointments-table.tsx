"use client";

import Link from "next/link";
import { Pencil } from "lucide-react";
import { useAdminLang } from "@/components/admin/lang-context";
import { StatusBadge } from "@/components/admin/status-badge";
import { DeleteButton } from "@/components/admin/delete-button";
import { deleteAppointment } from "@/actions/appointments";
import { confirmAction, rejectAction } from "./appointment-actions";

type Apt = {
  id: string;
  status: string;
  startTime: Date;
  notes: string | null;
  client: { firstName: string; lastName: string; email: string; phone: string | null };
  service: { translations: { title: string; locale: string }[] };
};

export function AppointmentsTable({ appointments }: { appointments: Apt[] }) {
  const { t, dir } = useAdminLang();
  const isRtl = dir === "rtl";
  const th = `px-4 py-3 text-xs uppercase tracking-widest font-medium text-muted ${isRtl ? "text-right" : "text-left"}`;
  const td = `px-4 py-3 ${isRtl ? "text-right" : "text-left"}`;
  const actionsAlign = isRtl ? "text-right" : "text-left";

  return (
    <div className="hidden lg:block overflow-x-auto border border-border bg-background rounded-sm">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-background-secondary">
          <tr>
            <th className={`${th} w-1/4`}>{t("client")}</th>
            <th className={th}>{t("phone")}</th>
            <th className={th}>{t("service")}</th>
            <th className={th}>{t("appointment")}</th>
            <th className={th}>{t("status")}</th>
            <th className={`px-4 py-3 text-xs uppercase tracking-widest font-medium text-muted ${actionsAlign}`}>{t("actions")}</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-muted">{t("noAppointmentsFound")}</td>
            </tr>
          ) : (
            appointments.map((apt) => (
              <tr key={apt.id} className="border-b border-border hover:bg-background-secondary/40 transition-colors">
                <td className={`${td} w-1/4`}>
                  <div className="font-medium">{apt.client.firstName} {apt.client.lastName}</div>
                  <div className="text-xs text-muted">{apt.client.email}</div>
                </td>
                <td className={td}>
                  {apt.client.phone ? (
                    <a href={`tel:${apt.client.phone.replace(/\s/g, "")}`} className="text-foreground hover:text-gold transition-colors">
                      {apt.client.phone}
                    </a>
                  ) : <span className="text-muted">—</span>}
                </td>
                <td className={td}>
                  {apt.service.translations.find((tr) => tr.locale === "de")?.title ?? apt.service.translations[0]?.title}
                </td>
                <td className={`${td} text-muted`}>
                  {apt.startTime.toLocaleString("en-GB", { weekday: "short", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </td>
                <td className={td}>
                  <StatusBadge status={apt.status} />
                </td>
                <td className={`px-4 py-3 ${actionsAlign}`}>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/appointments/${apt.id}/edit`} className="text-muted hover:text-gold transition-colors leading-none" title="Edit">
                      <Pencil size={16} />
                    </Link>
                    <DeleteButton action={deleteAppointment.bind(null, apt.id)} label="" confirmMessage="Delete appointment?" />
                    {apt.status === "PENDING" && (
                      <>
                        <form action={confirmAction}>
                          <input type="hidden" name="id" value={apt.id} />
                          <button type="submit" className="text-xs uppercase tracking-widest text-green-700 hover:text-green-800 transition-colors">
                            {isRtl ? "تأیید" : "Accept"}
                          </button>
                        </form>
                        <details className="relative inline" suppressHydrationWarning>
                          <summary className="inline text-xs uppercase tracking-widest text-red-500 hover:text-red-700 transition-colors cursor-pointer list-none">
                            {isRtl ? "رد" : "Decline"}
                          </summary>
                          <form action={rejectAction} className="absolute right-0 top-full z-10 mt-1 w-52 border border-border bg-background p-3 rounded-sm shadow-md">
                            <input type="hidden" name="id" value={apt.id} />
                            <textarea name="reason" placeholder="Reason (optional)" className="w-full border border-border bg-background-secondary px-2 py-1.5 text-xs resize-none rounded-sm" rows={2} />
                            <button type="submit" className="mt-2 w-full rounded-sm border border-red-400 px-3 py-1 text-xs uppercase tracking-widest text-red-700 hover:bg-red-50 transition-colors">
                              {t("confirmDecline")}
                            </button>
                          </form>
                        </details>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
