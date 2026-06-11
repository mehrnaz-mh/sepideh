"use server";

import { redirect } from "next/navigation";
import { createMediaFile, deleteMediaFile } from "@/actions/media";

export async function createMediaAction(formData: FormData) {
  const result = await createMediaFile(formData);
  if (!result.success) redirect("/admin/media?error=1");
  redirect("/admin/media");
}

export { deleteMediaFile };
