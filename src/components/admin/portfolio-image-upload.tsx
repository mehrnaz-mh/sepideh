"use client";

import { ImageUploadField } from "@/components/admin/image-upload-field";

export function PortfolioImageUpload({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  return (
    <ImageUploadField
      name="imageUrl"
      label="Image"
      folder="portfolio"
      defaultValue={defaultValue}
      required
    />
  );
}
