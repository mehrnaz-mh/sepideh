"use server";

import { revalidatePath } from "next/cache";
import {
  requireAdmin,
  logAudit,
  actionError,
  actionSuccess,
  parseFormBoolean,
  type ActionResult,
} from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { clientSchema } from "@/validations/admin";

export async function getClients() {
  await requireAdmin();
  return prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { appointments: true } } },
  });
}

export async function getClient(id: string) {
  await requireAdmin();
  return prisma.client.findUnique({
    where: { id },
    include: { appointments: { orderBy: { startTime: "desc" }, take: 10 } },
  });
}

function parseClientForm(formData: FormData) {
  return clientSchema.safeParse({
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    notes: formData.get("notes") || undefined,
    tags: formData.get("tags") || undefined,
    isVip: parseFormBoolean(formData.get("isVip")),
    locale: formData.get("locale") || "de",
  });
}

export async function createClient(formData: FormData): Promise<ActionResult<{ id: string }>> {
  const session = await requireAdmin();
  const parsed = parseClientForm(formData);
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const tags = parsed.data.tags
    ? parsed.data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const client = await prisma.client.create({
    data: { ...parsed.data, tags },
  });

  await logAudit(session.user.id, "CREATE", "Client", client.id);
  revalidatePath("/admin/clients");
  return actionSuccess({ id: client.id });
}

export async function updateClient(id: string, formData: FormData): Promise<ActionResult> {
  const session = await requireAdmin();
  const parsed = parseClientForm(formData);
  if (!parsed.success) return actionError(parsed.error.issues[0]?.message || "Invalid data");

  const tags = parsed.data.tags
    ? parsed.data.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  await prisma.client.update({
    where: { id },
    data: { ...parsed.data, tags },
  });

  await logAudit(session.user.id, "UPDATE", "Client", id);
  revalidatePath("/admin/clients");
  return actionSuccess();
}

export async function deleteClient(id: string): Promise<void> {
  const session = await requireAdmin();
  const appointmentCount = await prisma.appointment.count({ where: { clientId: id } });

  await prisma.$transaction(async (tx) => {
    if (appointmentCount > 0) {
      await tx.appointment.deleteMany({ where: { clientId: id } });
    }
    await tx.client.delete({ where: { id } });
  });

  await logAudit(session.user.id, "DELETE", "Client", id, {
    deletedAppointmentCount: appointmentCount,
  });
  revalidatePath("/admin/clients");
  revalidatePath("/admin/appointments");
  revalidatePath("/admin/calendar");
}

export async function toggleClientVip(clientId: string, isVip: boolean): Promise<ActionResult> {
  const session = await requireAdmin();
  await prisma.client.update({ where: { id: clientId }, data: { isVip } });
  await logAudit(session.user.id, "UPDATE", "Client", clientId, { isVip });
  revalidatePath("/admin/clients");
  return actionSuccess();
}
