"use server";

import { revalidatePath } from "next/cache";
import { addMinutes } from "date-fns";
import {
  requireAdmin,
  logAudit,
  actionError,
  actionSuccess,
  type ActionResult,
} from "@/lib/admin";
import { notifyAppointmentStatusChange } from "@/lib/appointment-emails";
import { prisma } from "@/lib/prisma";
import { appointmentSchema } from "@/validations/admin";
import type { AppointmentStatus } from "@prisma/client";

const appointmentInclude = {
  client: true,
  service: { include: { translations: true } },
} as const;

export async function getAppointments() {
  await requireAdmin();
  return prisma.appointment.findMany({
    orderBy: { startTime: "desc" },
    include: appointmentInclude,
  });
}

export async function getAppointment(id: string) {
  await requireAdmin();
  return prisma.appointment.findUnique({
    where: { id },
    include: appointmentInclude,
  });
}

export async function createAppointment(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const session = await requireAdmin();

  const parsed = appointmentSchema.safeParse({
    clientId: formData.get("clientId"),
    serviceId: formData.get("serviceId"),
    startTime: formData.get("startTime"),
    status: formData.get("status") || "PENDING",
    notes: formData.get("notes") || undefined,
    internalNotes: formData.get("internalNotes") || undefined,
    locale: formData.get("locale") || "de",
  });

  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const service = await prisma.service.findUnique({ where: { id: parsed.data.serviceId } });
  if (!service) return actionError("Service not found");

  const startTime = new Date(parsed.data.startTime);
  const endTime = addMinutes(startTime, service.durationMinutes);

  const appointment = await prisma.appointment.create({
    data: {
      ...parsed.data,
      startTime,
      endTime,
    },
    include: appointmentInclude,
  });

  if (appointment.status === "CONFIRMED") {
    const email = await notifyAppointmentStatusChange(appointment, "PENDING");
    if (!email.ok) {
      return actionError(`Appointment saved but email failed: ${email.error}`);
    }
  }

  await logAudit(session.user.id, "CREATE", "Appointment", appointment.id);
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/calendar");
  return actionSuccess({ id: appointment.id });
}

export async function updateAppointment(id: string, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();

  const existing = await prisma.appointment.findUnique({
    where: { id },
    select: { status: true },
  });
  if (!existing) return actionError("Appointment not found");

  const parsed = appointmentSchema.safeParse({
    clientId: formData.get("clientId"),
    serviceId: formData.get("serviceId"),
    startTime: formData.get("startTime"),
    status: formData.get("status"),
    notes: formData.get("notes") || undefined,
    internalNotes: formData.get("internalNotes") || undefined,
    locale: formData.get("locale") || "de",
  });

  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const service = await prisma.service.findUnique({ where: { id: parsed.data.serviceId } });
  if (!service) return actionError("Service not found");

  const startTime = new Date(parsed.data.startTime);
  const endTime = addMinutes(startTime, service.durationMinutes);

  const appointment = await prisma.appointment.update({
    where: { id },
    data: { ...parsed.data, startTime, endTime },
    include: appointmentInclude,
  });

  const email = await notifyAppointmentStatusChange(appointment, existing.status);
  if (!email.ok) {
    return actionError(`Appointment updated but email failed: ${email.error}`);
  }

  await logAudit(session.user.id, "UPDATE", "Appointment", id);
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/calendar");
  return actionSuccess();
}

export async function deleteAppointment(id: string): Promise<void> {
  const session = await requireAdmin();
  await prisma.appointment.delete({ where: { id } });
  await logAudit(session.user.id, "DELETE", "Appointment", id);
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/calendar");
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
): Promise<ActionResult> {
  const session = await requireAdmin();

  const existing = await prisma.appointment.findUnique({
    where: { id: appointmentId },
    select: { status: true },
  });
  if (!existing) return actionError("Appointment not found");

  const appointment = await prisma.appointment.update({
    where: { id: appointmentId },
    data: { status },
    include: appointmentInclude,
  });

  await logAudit(session.user.id, "UPDATE_STATUS", "Appointment", appointmentId, { status });
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/calendar");

  void notifyAppointmentStatusChange(appointment, existing.status).then((email) => {
    if (!email.ok) {
      console.error("[Email] Status notification failed:", email.error);
    }
  });

  return actionSuccess();
}
