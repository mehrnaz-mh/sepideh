import { prisma } from "@/lib/prisma";
import { Calendar, Clock, Star, Users } from "lucide-react";
import Link from "next/link";

async function getStats() {
  try {
    const [appointments, clients, pending, testimonials] = await Promise.all([
      prisma.appointment.count(),
      prisma.client.count(),
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.testimonial.count(),
    ]);
    return { appointments, clients, pending, testimonials };
  } catch {
    return { appointments: 0, clients: 0, pending: 0, testimonials: 0 };
  }
}

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

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Appointments", value: stats.appointments, icon: Calendar, href: "/admin/appointments" },
    { label: "Pending", value: stats.pending, icon: Clock, href: "/admin/appointments?filter=PENDING" },
    { label: "Clients", value: stats.clients, icon: Users, href: "/admin/clients" },
    { label: "Testimonials", value: stats.testimonials, icon: Star, href: "/admin/testimonials" },
  ];

  let recentAppointments: {
    id: string;
    startTime: Date;
    createdAt: Date;
    status: string;
    serviceId: string;
    client: { firstName: string; lastName: string };
    service: { translations: { title: string; locale: string }[] };
  }[] = [];

  try {
    recentAppointments = await prisma.appointment.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        client: true,
        service: { include: { translations: true } },
      },
    });
  } catch {
    recentAppointments = [];
  }

  return (
    <div className="min-w-0">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="font-serif text-2xl text-foreground sm:text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">Overview of your beauty business</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="group border border-border bg-background p-4 transition-colors hover:border-gold rounded-sm"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-[10px] uppercase tracking-widest text-muted leading-tight">{card.label}</p>
              <card.icon className="shrink-0 text-beige-soft group-hover:text-gold transition-colors" size={16} />
            </div>
            <p className="mt-3 font-serif text-3xl text-foreground sm:text-4xl">{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Recent appointments */}
      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-xl text-foreground">Recent Appointments</h2>
          <Link
            href="/admin/appointments"
            className="text-xs uppercase tracking-widest text-muted hover:text-gold transition-colors"
          >
            View all →
          </Link>
        </div>

        {/* Mobile: card list */}
        <div className="flex flex-col gap-2 lg:hidden">
          {recentAppointments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted">No appointments yet</p>
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
                      {apt.service.translations.find((t) => t.locale === "en")?.title ??
                        apt.service.translations[0]?.title ??
                        apt.serviceId}
                    </p>
                  </div>
                  <span className={`shrink-0 rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-wider ${statusStyles[apt.status] ?? "bg-background-secondary text-muted"}`}>
                    {statusLabel[apt.status] ?? apt.status}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-muted">
                  {apt.startTime.toLocaleString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
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
                <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-muted">Client</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-muted">Service</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-muted">Date</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-muted">Booked</th>
                <th className="px-4 py-3 text-left text-xs uppercase tracking-widest font-medium text-muted">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted">
                    No appointments yet
                  </td>
                </tr>
              ) : (
                recentAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-border hover:bg-background-secondary/50 transition-colors">
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/appointments/${apt.id}/edit`}
                        className="font-medium hover:text-gold transition-colors"
                      >
                        {apt.client.firstName} {apt.client.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {apt.service.translations.find((t) => t.locale === "en")?.title ??
                        apt.service.translations[0]?.title ??
                        apt.serviceId}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {apt.startTime.toLocaleString("en-GB", {
                        weekday: "short",
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                    <td className="px-4 py-3 text-muted">
                      {apt.createdAt.toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-sm px-2 py-0.5 text-[11px] uppercase tracking-wider ${statusStyles[apt.status] ?? "bg-background-secondary text-muted"}`}>
                        {statusLabel[apt.status] ?? apt.status}
                      </span>
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
