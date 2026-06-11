import { prisma } from "@/lib/prisma";
import { DashboardClient } from "./dashboard-client";

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

  return <DashboardClient stats={stats} recentAppointments={recentAppointments} />;
}
