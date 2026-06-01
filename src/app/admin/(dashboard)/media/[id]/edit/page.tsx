import { notFound, redirect } from "next/navigation";
import { AdminFormShell } from "@/components/admin/form-shell";
import { MediaEditFields } from "@/components/admin/media-edit-upload";
import { getMediaFile, updateMediaFile } from "@/actions/media";

export default async function EditMediaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const file = await getMediaFile(id);
  if (!file) notFound();

  async function action(formData: FormData) {
    "use server";
    const result = await updateMediaFile(id, formData);
    if (!result.success) redirect(`/admin/media/${id}/edit?error=1`);
    redirect("/admin/media");
  }

  return (
    <AdminFormShell title="Edit Media" backHref="/admin/media" action={action}>
      <MediaEditFields
        defaultUrl={file.url}
        defaultAlt={file.altText ?? ""}
        defaultFolder={file.folder ?? "uploads"}
      />
    </AdminFormShell>
  );
}
