import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import Link from "next/link";

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
    <div className="min-w-0">
      <AdminPageHeader titleKey="calendar" descriptionKey="calendarDesc" />

      {appointments.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted">â€”</p>
      ) : (
        <div className="space-y-3">
          {appointments.map((apt) => (
            <Link
              key={apt.id}
              href={`/admin/appointments/${apt.id}/edit`}
              className="flex items-center gap-4 border border-border bg-background p-4 rounded-sm hover:border-gold transition-colors min-w-0"
            >
              <div className="shrink-0 w-12 text-center">
                <p className="text-2xl text-gold leading-none">
                  {apt.startTime.getDate()}
                </p>
                <p className="mt-0.5 text-[10px] uppercase tracking-widest text-muted">
                  {apt.startTime.toLocaleDateString("en-GB", { month: "short" })}
                </p>
              </div>

              <div className="shrink-0 w-px self-stretch bg-border" />

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-sm text-foreground">
                  {apt.client.firstName} {apt.client.lastName}
                </p>
                <p className="truncate text-xs text-muted">
                  {apt.service.translations.find((t) => t.locale === "en")?.title ??
                    apt.service.translations[0]?.title}
                </p>
                <p className="text-xs text-muted">
                  {apt.startTime.toLocaleTimeString("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>

              <StatusBadge status={apt.status} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

