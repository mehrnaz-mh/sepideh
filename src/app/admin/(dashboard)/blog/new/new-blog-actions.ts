"use server";

import { redirect } from "next/navigation";
import { createBlogPost } from "@/actions/blog";

export async function createBlogPostAction(formData: FormData) {
  const result = await createBlogPost(formData);
  if (!result.success) redirect("/admin/blog/new?error=1");
  redirect("/admin/blog?success=created");
}
