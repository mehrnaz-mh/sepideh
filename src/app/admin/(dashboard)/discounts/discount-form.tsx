"use client";

import { useActionState, useState, type ChangeEvent } from "react";
import { AdminFormShell } from "@/components/admin/form-shell";
import { CheckboxField, FormField, FormSection, TextAreaField } from "@/components/admin/forms/fields";
import { useAdminLang } from "@/components/admin/lang-context";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { saveDiscountOffer } from "@/actions/discounts";
import type { DiscountFormValues } from "@/lib/discounts";

export function DiscountForm({ offer }: { offer?: DiscountFormValues }) {
  const { t } = useAdminLang();
  const [state, action] = useActionState(saveDiscountOffer.bind(null, offer?.id ?? null), {});
  // Controlled fields keep the draft intact when a server action returns an error.
  const [values, setValues] = useState({
    brandName: offer?.brandName ?? "",
    discountLabel: offer?.discountLabel ?? "",
    code: offer?.code ?? "",
    url: offer?.url ?? "",
    expiresAt: offer?.expiresAt ?? "",
    sortOrder: String(offer?.sortOrder ?? 0),
    offerDe: offer?.offerDe ?? "",
    offerEn: offer?.offerEn ?? "",
    descriptionDe: offer?.descriptionDe ?? "",
    descriptionEn: offer?.descriptionEn ?? "",
  });
  const [isActive, setIsActive] = useState(offer?.isActive ?? false);
  function field(name: keyof typeof values) {
    return {
      name,
      value: values[name],
      onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value;
        setValues((previous) => ({ ...previous, [name]: value }));
      },
    };
  }

  return (
    <AdminFormShell titleKey={offer ? "discountEdit" : "discountNew"} backHref="/admin/discounts" action={action}>
      {state.error && <p role="alert" className="border border-red-200 bg-red-50 p-4 text-sm text-red-800">{t(state.error)}</p>}
      <div className="border border-border bg-background p-6">
        <ImageUploadField
          name="logoUrl"
          label={t("discountLogo")}
          defaultValue={offer?.logoUrl ?? ""}
          folder="discount-logos"
          allowRemove
          chooseLabel={t("discountLogoChoose")}
          replaceLabel={t("discountLogoReplace")}
          removeLabel={t("discountLogoRemove")}
        />
        <p className="mt-2 text-xs text-muted">{t("discountLogoHint")}</p>
      </div>
      <FormSection title={t("discountDetails")}>
        <FormField label={t("discountBrand")} {...field("brandName")} required />
        <FormField label={t("discountLabel")} {...field("discountLabel")} required placeholder="20% OFF" />
        <div dir="ltr"><FormField label={t("discountCode")} {...field("code")} required placeholder="SEPIDEH15" /></div>
        <div className="md:col-span-2" dir="ltr">
          <FormField label={t("discountUrl")} {...field("url")} type="url" required placeholder="https://brand.com/?ref=sepideh" hint={t("discountUrlHint")} />
        </div>
        <FormField label={t("discountExpiry")} {...field("expiresAt")} type="date" hint={t("discountExpiryHint")} />
        <FormField label={t("sortOrder")} {...field("sortOrder")} type="number" min="0" max="100000" step="1" required />
        <div className="md:col-span-2">
          <CheckboxField label={t("discountPublish")} name="isActive" checked={isActive} onChange={(event) => setIsActive(event.target.checked)} />
          <p className="mt-2 text-xs text-muted">{t("discountPublishHint")}</p>
        </div>
      </FormSection>
      <FormSection title={t("german")}>
        <div className="md:col-span-2" dir="ltr">
          <FormField label={t("discountOfferDe")} {...field("offerDe")} required placeholder="15 % Rabatt" />
          <div className="mt-4"><TextAreaField label={t("descriptionDe")} {...field("descriptionDe")} /></div>
        </div>
      </FormSection>
      <FormSection title={t("english")}>
        <div className="md:col-span-2" dir="ltr">
          <FormField label={t("discountOfferEn")} {...field("offerEn")} required placeholder="15% off" />
          <div className="mt-4"><TextAreaField label={t("descriptionEn")} {...field("descriptionEn")} /></div>
        </div>
      </FormSection>
      <p className="text-sm text-muted">{t("discountTermsHint")}</p>
    </AdminFormShell>
  );
}
