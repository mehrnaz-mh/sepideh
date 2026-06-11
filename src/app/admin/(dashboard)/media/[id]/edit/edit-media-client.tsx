"use client";

import { AdminFormShell } from "@/components/admin/form-shell";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { FormField } from "@/components/admin/forms/fields";
import { useAdminLang } from "@/components/admin/lang-context";
import { updateMediaAction } from "./edit-media-actions";

export function EditMediaClient({
  id,
  defaultUrl,
  defaultAlt,
  defaultFolder,
}: {
  id: string;
  defaultUrl: string;
  defaultAlt: string;
  defaultFolder: string;
}) {
  const { t } = useAdminLang();
  const action = updateMediaAction.bind(null, id);

  return (
    <AdminFormShell titleKey="editMedia" backHref="/admin/media" action={action}>
      <div className="space-y-4 border border-border bg-background p-6">
        <ImageUploadField
          name="url"
          label={t("image")}
          folder={defaultFolder || "uploads"}
          defaultValue={defaultUrl}
          required
          includeMetadata
        />
        <FormField label={t("altText")} name="altText" defaultValue={defaultAlt} />
        <FormField label={t("folder")} name="folder" defaultValue={defaultFolder} />
      </div>
    </AdminFormShell>
  );
}
