import { getTestimonials } from "@/actions/testimonials";
import { TestimonialsClient } from "./testimonials-client";

export default async function AdminTestimonialsPage() {
  const testimonials = await getTestimonials();
  return <TestimonialsClient testimonials={testimonials} />;
}
