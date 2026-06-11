"use client";

import { ImageUploadField } from "@/components/admin/image-upload-field";
import { useAdminLang } from "@/components/admin/lang-context";

export function PortfolioImageUpload({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const { t } = useAdminLang();
  return (
    <ImageUploadField
      name="imageUrl"
      label={t("image")}
      folder="portfolio"
      defaultValue={defaultValue}
      required
    />
  );
}
