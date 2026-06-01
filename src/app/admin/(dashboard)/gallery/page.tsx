import Image from "next/image";
import Link from "next/link";
import { AdminPageHeader } from "@/components/admin/page-header";
import { getMediaFiles } from "@/actions/media";

export default async function AdminGalleryPage() {
  const files = await getMediaFiles();

  return (
    <div>
      <AdminPageHeader
        title="Gallery"
        description="Visual media browser — manage files in Media Library"
        createHref="/admin/media"
        createLabel="Upload Media"
      />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {files.map((file) => (
          <Link
            key={file.id}
            href={`/admin/media/${file.id}/edit`}
            className="group border border-border bg-background"
          >
            <div className="relative aspect-square overflow-hidden">
              <Image
                src={file.url}
                alt={file.altText ?? "Gallery"}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
