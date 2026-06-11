"use client";

import { FormField } from "@/components/admin/forms/fields";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { SubmitButton } from "@/components/admin/submit-button";

export function MediaUploadSection({
  action,
}: {
  action: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <form action={action} className="mb-8 border border-border bg-background p-6">
      <h2 className="text-xl">Add Media</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <ImageUploadField
            name="url"
            label="Image"
            folder="uploads"
            required
            includeMetadata
          />
        </div>
        <FormField label="Alt Text" name="altText" />
        <FormField label="Folder" name="folder" defaultValue="uploads" />
      </div>
      <div className="mt-4">
        <SubmitButton label="Add Media" />
      </div>
    </form>
  );
}

