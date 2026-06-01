"use client";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import { FormField } from "@/components/admin/forms/fields";

export function MediaEditFields({
  defaultUrl,
  defaultAlt,
  defaultFolder,
}: {
  defaultUrl: string;
  defaultAlt: string;
  defaultFolder: string;
}) {
  return (
    <div className="space-y-4 border border-border bg-background p-6">
      <ImageUploadField
        name="url"
        label="Image"
        folder={defaultFolder || "uploads"}
        defaultValue={defaultUrl}
        required
        includeMetadata
      />
      <FormField label="Alt Text" name="altText" defaultValue={defaultAlt} />
      <FormField label="Folder" name="folder" defaultValue={defaultFolder} />
    </div>
  );
}
