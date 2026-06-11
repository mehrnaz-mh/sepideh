import { notFound } from "next/navigation";
import { getMediaFile } from "@/actions/media";
import { EditMediaClient } from "./edit-media-client";

export default async function EditMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const file = await getMediaFile(id);
  if (!file) notFound();

  return (
    <EditMediaClient
      id={id}
      defaultUrl={file.url}
      defaultAlt={file.altText ?? ""}
      defaultFolder={file.folder ?? "uploads"}
    />
  );
}
