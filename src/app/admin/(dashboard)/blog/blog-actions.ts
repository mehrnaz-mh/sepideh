"use server";

import { redirect } from "next/navigation";
import { createBlogCategory, deleteBlogCategory, deleteBlogPost } from "@/actions/blog";

export async function createCategoryAction(formData: FormData) {
  await createBlogCategory(formData);
  redirect("/admin/blog");
}

export { deleteBlogCategory, deleteBlogPost };
