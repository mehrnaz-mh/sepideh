"use server";

import { redirect } from "next/navigation";
import { updateAvailabilityRule } from "@/actions/settings";

export async function updateRuleAction(id: string, formData: FormData) {
  const result = await updateAvailabilityRule(id, formData);
  if (!result.success) redirect(`/admin/settings/availability/${id}/edit?error=time_format`);
  redirect("/admin/settings?success=updated");
}
