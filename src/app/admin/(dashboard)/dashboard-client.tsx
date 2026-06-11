"use client";

import Link from "next/link";
import { Calendar, Clock, Star, Users } from "lucide-react";
import { useAdminLang } from "@/components/admin/lang-context";
import { StatusBadge } from "@/components/admin/status-badge";

type Appointment = {
  id: string;
  startTime: Date;
  createdAt: Date;
  status: string;
  serviceId: string;
  client: { firstName: string; lastName: string };
  service: { translations: { title: string; locale: string }[] };
};

type Stats = {
  appointments: number;
  pending: number;
  clients: number;
  testimonials: number;
};

export function DashboardClient({
  stats,
  recentAppointments,
}: {
  stats: Stats;
  recentAppointments: Appointment[];
}) {
  const { t, dir, lang } = useAdminLang();
  const isRtl = dir === "rtl";
  const align = isRtl ? "text-right" : "text-left";

  const cards = [
    { labelKey: "totalAppointments", value: stats.appointments, icon: Calendar, href: "/admin/appointments" },
    { labelKey: "pending", value: stats.pending, icon: Clock, href: "/admin/appointments?filter=PENDING" },
    { labelKey: "clients", value: stats.clients, icon: Users, href: "/admin/clients" },
    { labelKey: "testimonials", value: stats.testimonials, icon: Star, href: "/admin/testimonials" },
  ];

  return (
    <div className="min-w-0">
      <div className="mb-6">
        <h1 className="text-2xl text-foreground sm:text-3xl">{t("dashboard")}</h1>
        <p className="mt-1 text-sm text-muted">{t("dashboardSub")}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.labelKey}
            href={card.href}
            className="group border border-border bg-background p-4 transition-colors hover:border-gold rounded-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-widest text-muted leading-tight">{t(card.labelKey)}</p>
              <card.icon className="shrink-0 text-beige-soft group-hover:text-gold transition-colors" size={16} />
            </div>
            <p className="mt-3 text-3xl text-foreground sm:text-4xl">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl text-foreground">{t("recentAppointments")}</h2>
          <Link
            href="/admin/appointments"
            className="text-xs uppercase tracking-widest text-muted hover:text-gold transition-colors"
          >
            {isRtl ? "مشاهده همه ←" : "View all →"}
          </Link>
        </div>

        {/* Mobile: card list */}
        <div className="flex flex-col gap-2 lg:hidden">
          {recentAppointments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">{t("noAppointmentsYet")}</p>
          ) : (
            recentAppointments.map((apt) => (
              <Link
                key={apt.id}
                href={`/admin/appointments/${apt.id}/edit`}
                className="block border border-border bg-background p-3 rounded-sm hover:border-gold transition-colors min-w-0"
              >
                <div className="flex items-start justify-between gap-2 min-w-0">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-sm text-foreground">
                      {apt.client.firstName} {apt.client.lastName}
                    </p>
                    <p className="truncate mt-0.5 text-xs text-muted">
                      {apt.service.translations.find((tr) => tr.locale === "en")?.title ??
                        apt.service.translations[0]?.title ?? apt.serviceId}
                    </p>
                  </div>
                  <StatusBadge status={apt.status} />
                </div>
                <p className="mt-1.5 text-xs text-muted">
                  {apt.startTime.toLocaleString("en-GB", {
                    weekday: "short", day: "2-digit", month: "short",
                    year: "numeric", hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </Link>
            ))
          )}
        </div>

        {/* Desktop: table */}
        <div className="hidden lg:block overflow-x-auto border border-border bg-background rounded-sm">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-background-secondary">
              <tr>
                <th className={`px-4 py-3 ${align} text-xs uppercase tracking-widest font-medium text-muted`}>{t("client")}</th>
                <th className={`px-4 py-3 ${align} text-xs uppercase tracking-widest font-medium text-muted`}>{t("service")}</th>
                <th className={`px-4 py-3 ${align} text-xs uppercase tracking-widest font-medium text-muted`}>{t("date")}</th>
                <th className={`px-4 py-3 ${align} text-xs uppercase tracking-widest font-medium text-muted`}>{t("booked")}</th>
                <th className={`px-4 py-3 ${align} text-xs uppercase tracking-widest font-medium text-muted`}>{t("status")}</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">{t("noAppointmentsYet")}</td>
                </tr>
              ) : (
                recentAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-border hover:bg-background-secondary/50 transition-colors">
                    <td className={`px-4 py-3 ${align}`}>
                      <Link href={`/admin/appointments/${apt.id}/edit`} className="font-medium hover:text-gold transition-colors">
                        {apt.client.firstName} {apt.client.lastName}
                      </Link>
                    </td>
                    <td className={`px-4 py-3 ${align} text-muted`}>
                      {apt.service.translations.find((tr) => tr.locale === "en")?.title ??
                        apt.service.translations[0]?.title ?? apt.serviceId}
                    </td>
                    <td className={`px-4 py-3 ${align} text-muted`}>
                      {apt.startTime.toLocaleString("en-GB", {
                        weekday: "short", day: "2-digit", month: "short",
                        year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </td>
                    <td className={`px-4 py-3 ${align} text-muted`}>
                      {apt.createdAt.toLocaleDateString("en-GB", {
                        day: "2-digit", month: "short", year: "numeric",
                      })}
                    </td>
                    <td className={`px-4 py-3 ${align}`}>
                      <StatusBadge status={apt.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
