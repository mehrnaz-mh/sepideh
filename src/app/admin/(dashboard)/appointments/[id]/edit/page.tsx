import { notFound } from "next/navigation";
import { getAppointment } from "@/actions/appointments";
import { prisma } from "@/lib/prisma";
import { EditAppointmentClient } from "./edit-appointment-client";

export default async function EditAppointmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const appointment = await getAppointment(id);
  if (!appointment) notFound();

  const [clients, services] = await Promise.all([
    prisma.client.findMany({ orderBy: { lastName: "asc" } }),
    prisma.service.findMany({ include: { translations: true }, orderBy: { sortOrder: "asc" } }),
  ]);

  const startLocal = new Date(appointment.startTime.getTime() - appointment.startTime.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  return (
    <EditAppointmentClient
      id={id}
      appointment={{
        clientId: appointment.clientId,
        serviceId: appointment.serviceId,
        status: appointment.status,
        locale: appointment.locale,
        notes: appointment.notes,
        internalNotes: appointment.internalNotes,
      }}
      clients={clients}
      services={services}
      startLocal={startLocal}
    />
  );
}
