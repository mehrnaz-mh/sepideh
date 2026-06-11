"use server";

import { redirect } from "next/navigation";
import { updateClient } from "@/actions/clients";

export async function updateClientAction(id: string, formData: FormData) {
  const result = await updateClient(id, formData);
  if (!result.success) redirect(`/admin/clients/${id}/edit?error=${encodeURIComponent(result.error)}`);
  redirect("/admin/clients?success=updated");
}
