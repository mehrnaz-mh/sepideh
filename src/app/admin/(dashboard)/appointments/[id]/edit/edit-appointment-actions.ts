"use server";

import { redirect } from "next/navigation";
import { updateAppointment } from "@/actions/appointments";

export async function updateAppointmentAction(id: string, formData: FormData) {
  const result = await updateAppointment(id, formData);
  if (!result.success) redirect(`/admin/appointments/${id}/edit?error=${encodeURIComponent(result.error)}`);
  redirect("/admin/appointments?success=updated");
}
