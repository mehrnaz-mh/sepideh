"use server";

import { redirect } from "next/navigation";
import { updatePortfolioItem } from "@/actions/portfolio";

export async function updatePortfolioAction(id: string, formData: FormData) {
  const result = await updatePortfolioItem(id, formData);
  if (!result.success) redirect(`/admin/portfolio/${id}/edit?error=1`);
  redirect("/admin/portfolio?success=updated");
}
