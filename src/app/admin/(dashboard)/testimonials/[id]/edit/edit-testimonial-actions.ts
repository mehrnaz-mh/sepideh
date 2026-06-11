"use server";

import { redirect } from "next/navigation";
import { updateTestimonial } from "@/actions/testimonials";

export async function updateTestimonialAction(id: string, formData: FormData) {
  const result = await updateTestimonial(id, formData);
  if (!result.success) redirect(`/admin/testimonials/${id}/edit?error=1`);
  redirect("/admin/testimonials");
}
