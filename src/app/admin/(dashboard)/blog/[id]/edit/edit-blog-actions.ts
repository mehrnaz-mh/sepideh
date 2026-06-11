"use server";

import { redirect } from "next/navigation";
import { updateBlogPost } from "@/actions/blog";

export async function updateBlogPostAction(id: string, formData: FormData) {
  const result = await updateBlogPost(id, formData);
  if (!result.success) redirect(`/admin/blog/${id}/edit?error=1`);
  redirect("/admin/blog?success=updated");
}
