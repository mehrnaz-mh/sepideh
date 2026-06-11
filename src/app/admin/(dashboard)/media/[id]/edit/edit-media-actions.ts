"use server";

import { redirect } from "next/navigation";
import { updateMediaFile } from "@/actions/media";

export async function updateMediaAction(id: string, formData: FormData) {
  const result = await updateMediaFile(id, formData);
  if (!result.success) redirect(`/admin/media/${id}/edit?error=1`);
  redirect("/admin/media");
}
