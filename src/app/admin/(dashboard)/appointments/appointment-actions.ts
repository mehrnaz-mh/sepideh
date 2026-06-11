"use server";

import { confirmAppointment, rejectAppointment } from "@/actions/appointments";

export async function confirmAction(formData: FormData) {
  await confirmAppointment(String(formData.get("id")));
}

export async function rejectAction(formData: FormData) {
  await rejectAppointment(
    String(formData.get("id")),
    (formData.get("reason") as string) || undefined,
  );
}
