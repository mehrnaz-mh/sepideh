"use server";

import { redirect } from "next/navigation";
import { updateService } from "@/actions/services";

export async function updateServiceAction(id: string, formData: FormData) {
  const result = await updateService(id, formData);
  if (!result.success) redirect(`/admin/services/${id}/edit?error=${encodeURIComponent(result.error)}`);
  redirect("/admin/services?success=updated");
}
