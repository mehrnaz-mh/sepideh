"use server";

import { redirect } from "next/navigation";
import {
  createPortfolioCategory,
  deletePortfolioCategory,
  createPortfolioItem,
  deletePortfolioItem,
} from "@/actions/portfolio";

export async function createCategoryAction(formData: FormData) {
  await createPortfolioCategory(formData);
  redirect("/admin/portfolio");
}

export async function deleteCategoryAction(id: string) {
  const result = await deletePortfolioCategory(id);
  if (!result.success) {
    redirect(`/admin/portfolio?error=${encodeURIComponent(result.error)}`);
  }
  redirect("/admin/portfolio");
}

export async function createItemAction(formData: FormData) {
  const result = await createPortfolioItem(formData);
  if (!result.success) redirect("/admin/portfolio?error=create-failed");
  redirect("/admin/portfolio");
}
