"use server";

import { redirect } from "next/navigation";
import {
  updateSettings,
  createAvailabilityRule,
  deleteAvailabilityRule,
  createBlockedDate,
  deleteBlockedDate,
} from "@/actions/settings";

export async function saveSettingsAction(formData: FormData) {
  const result = await updateSettings(formData);
  if (!result.success) redirect(`/admin/settings?error=${encodeURIComponent(result.error ?? "1")}`);
  redirect("/admin/settings?success=updated");
}

export async function addRuleAction(formData: FormData) {
  const result = await createAvailabilityRule(formData);
  if (!result.success) redirect(`/admin/settings?error=${encodeURIComponent(result.error ?? "time_format")}`);
  redirect("/admin/settings?success=created");
}

export async function addBlockedAction(formData: FormData) {
  const result = await createBlockedDate(formData);
  if (!result.success) redirect(`/admin/settings?error=${encodeURIComponent(result.error ?? "1")}`);
  redirect("/admin/settings?success=created");
}

export { deleteAvailabilityRule, deleteBlockedDate };
