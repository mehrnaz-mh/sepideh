"use client";

import Link from "next/link";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { FormField } from "@/components/admin/forms/fields";
import { SubmitButton } from "@/components/admin/submit-button";
import { useAdminLang } from "@/components/admin/lang-context";
import { createMediaAction, deleteMediaFile } from "./media-actions";

type MediaFile = {
  id: string;
  url: string;
  altText?: string | null;
  folder?: string | null;
};

export function MediaClient({ files }: { files: MediaFile[] }) {
  const { t, lang } = useAdminLang();
  const isRtl = lang === "fa";
  return (
    <div>
      <AdminPageHeader titleKey="mediaLibrary" descriptionKey="mediaLibraryDesc" />

      <form action={createMediaAction} className="mb-8 border border-border bg-background p-6">
        <h2 className="text-xl mb-4">{t("addMedia")}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <ImageUploadField name="url" label={t("image")} folder="uploads" required includeMetadata />
          </div>
          <FormField label={t("altText")} name="altText" />
          <FormField label={t("folder")} name="folder" defaultValue="uploads" />
        </div>
        <div className="mt-4">
          <SubmitButton labelKey="addMedia" />
        </div>
      </form>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
        {files.map((file) => (
          <div key={file.id} className="border border-border bg-background">
            <div className="relative aspect-square">
              <Image src={file.url} alt={file.altText ?? "Media"} fill className="object-cover" />
            </div>
            <div className="flex items-center justify-between p-2">
              <Link
                href={`/admin/media/${file.id}/edit`}
                className="text-muted hover:text-gold transition-colors leading-none"
                title={t("edit")}
              >
                <Pencil size={16} />
              </Link>
              <DeleteButton action={deleteMediaFile.bind(null, file.id)} label="" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
