import { notFound } from "next/navigation";
import { getTestimonial } from "@/actions/testimonials";
import { EditTestimonialClient } from "./edit-testimonial-client";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getTestimonial(id);
  if (!item) notFound();

  return (
    <EditTestimonialClient
      id={id}
      item={{
        clientName: item.clientName,
        eventType: item.eventType,
        type: item.type,
        rating: item.rating,
        sortOrder: item.sortOrder,
        featured: item.featured,
        translations: item.translations,
      }}
    />
  );
}
