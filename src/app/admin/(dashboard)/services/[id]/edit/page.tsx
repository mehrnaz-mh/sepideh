import { notFound } from "next/navigation";
import { getService } from "@/actions/services";
import { EditServiceClient } from "./edit-service-client";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await getService(id);
  if (!service) notFound();

  return (
    <EditServiceClient
      id={id}
      service={{
        slug: service.slug,
        sortOrder: service.sortOrder,
        durationMinutes: service.durationMinutes,
        bufferMinutes: service.bufferMinutes,
        isActive: service.isActive,
        translations: service.translations,
      }}
    />
  );
}
