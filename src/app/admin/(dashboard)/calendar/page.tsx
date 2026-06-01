import { prisma } from "@/lib/prisma";

export default async function AdminCalendarPage() {
  let appointments: Awaited<
    ReturnType<
      typeof prisma.appointment.findMany<{
        include: { client: true; service: { include: { translations: true } } };
      }>
    >
  > = [];

  try {
    appointments = await prisma.appointment.findMany({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        startTime: { gte: new Date() },
      },
      orderBy: { startTime: "asc" },
      include: {
        client: true,
        service: { include: { translations: true } },
      },
    });
  } catch {
    appointments = [];
  }

  return (
    <div>
      <h1 className="font-serif text-3xl">Calendar</h1>
      <div className="mt-8 space-y-4">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="flex items-center gap-6 border border-border bg-background p-6"
          >
            <div className="min-w-[120px] text-center">
              <p className="font-serif text-2xl text-gold">
                {apt.startTime.getDate()}
              </p>
              <p className="text-xs uppercase tracking-widest text-muted">
                {apt.startTime.toLocaleDateString("de-DE", { month: "short" })}
              </p>
            </div>
            <div>
              <p className="font-serif text-lg">
                {apt.client.firstName} {apt.client.lastName}
              </p>
              <p className="text-sm text-muted">
                {apt.service.translations[0]?.title}
              </p>
              <p className="text-sm text-muted">
                {apt.startTime.toLocaleTimeString("de-DE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <span className="ml-auto text-xs uppercase">{apt.status}</span>
          </div>
        ))}
        {appointments.length === 0 && (
          <p className="text-muted">No upcoming appointments</p>
        )}
      </div>
    </div>
  );
}
