"use server";

import { redirect } from "next/navigation";
import { createTestimonial } from "@/actions/testimonials";

export async function createAction(formData: FormData) {
  const result = await createTestimonial(formData);
  if (!result.success) redirect("/admin/testimonials?error=1");
  redirect("/admin/testimonials");
}
