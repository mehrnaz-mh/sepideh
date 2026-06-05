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

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Total Appointments", value: stats.appointments, icon: Calendar },
    { label: "Pending", value: stats.pending, icon: Clock },
    { label: "Clients", value: stats.clients, icon: Users },
    { label: "Testimonials", value: stats.testimonials, icon: Star },
  ];

  let recentAppointments: {
    id: string;
    startTime: Date;
    createdAt: Date;
    status: string;
    serviceId: string;
    client: { firstName: string; lastName: string };
    service: { translations: { title: string }[] };
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
    <div>
      <h1 className="font-serif text-3xl">Dashboard</h1>
      <p className="mt-2 text-muted">Overview of your beauty business</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="border border-border bg-background p-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted">{card.label}</p>
              <card.icon className="text-gold" size={20} />
            </div>
            <p className="mt-4 font-serif text-4xl">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12">
        <h2 className="font-serif text-2xl">Upcoming Appointments</h2>
        <div className="mt-4 overflow-x-auto border border-border bg-background">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-background-secondary">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Client</th>
                <th className="px-4 py-3 text-left font-medium">Service</th>
                <th className="px-4 py-3 text-left font-medium">Date</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentAppointments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted">
                    No appointments yet
                  </td>
                </tr>
              ) : (
                recentAppointments.map((apt) => (
                  <tr key={apt.id} className="border-b border-border hover:bg-background-secondary/50">
                    <td className="px-4 py-3">
                      <Link href={`/admin/appointments/${apt.id}/edit`} className="hover:text-gold">
                        {apt.client.firstName} {apt.client.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {apt.service.translations[0]?.title ?? apt.serviceId}
                    </td>
                    <td className="px-4 py-3">
                      {apt.startTime.toLocaleString("de-DE")}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-1 text-xs uppercase ${
                        apt.status === "PENDING"
                          ? "bg-amber-100 text-amber-800"
                          : apt.status === "CONFIRMED"
                          ? "bg-green-100 text-green-800"
                          : "bg-background-secondary text-muted"
                      }`}>
                        {apt.status === "PENDING" ? "Ausstehend" : apt.status === "CONFIRMED" ? "Bestätigt" : apt.status}
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
