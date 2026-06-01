import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { MediaUploadSection } from "@/components/admin/media-upload-section";
import { getMediaFiles, createMediaFile, deleteMediaFile } from "@/actions/media";

export default async function AdminMediaPage() {
  const files = await getMediaFiles();

  async function createAction(formData: FormData) {
    "use server";
    const result = await createMediaFile(formData);
    if (!result.success) redirect("/admin/media?error=1");
    redirect("/admin/media");
  }

  return (
    <div>
      <AdminPageHeader
        title="Media Library"
        description="Manage images and media assets"
      />

      <MediaUploadSection action={createAction} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {files.map((file) => (
          <div key={file.id} className="border border-border bg-background">
            <div className="relative aspect-square">
              <Image src={file.url} alt={file.altText ?? "Media"} fill className="object-cover" />
            </div>
            <div className="flex items-center justify-between p-2">
              <Link
                href={`/admin/media/${file.id}/edit`}
                className="text-[10px] uppercase text-gold"
              >
                Edit
              </Link>
              <DeleteButton action={deleteMediaFile.bind(null, file.id)} label="" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
