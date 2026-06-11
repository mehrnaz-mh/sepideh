"use client";

import { siteImages } from "@/data/content";
import Image from "next/image";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { useAdminLang } from "@/components/admin/lang-context";
import {
  CheckboxField,
  FormField,
  FormSection,
  SelectField,
  TextAreaField,
} from "@/components/admin/forms/fields";
import { PortfolioImageUpload } from "@/components/admin/portfolio-image-upload";
import { deletePortfolioItem } from "@/actions/portfolio";
import {
  createCategoryAction,
  deleteCategoryAction,
  createItemAction,
} from "./portfolio-actions";

type Category = {
  id: string;
  slug: string;
  translations: { locale: string; name: string }[];
  _count: { items: number };
};

type Item = {
  id: string;
  slug: string;
  translations: { locale: string; title: string }[];
  mediaFiles: { url: string }[];
};

type Service = {
  id: string;
  slug: string;
  translations: { title: string }[];
};

export function PortfolioClient({
  categories,
  items,
  services,
  error,
}: {
  categories: Category[];
  items: Item[];
  services: Service[];
  error?: string;
}) {
  const { t, lang } = useAdminLang();
  return (
    <div className="space-y-12">
      <AdminPageHeader titleKey="portfolioTitle" descriptionKey="portfolioDesc" />

      {error && (
        <p className="rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error}</p>
      )}

      <section>
        <h2 className="text-2xl mb-4">{t("categories")}</h2>
        <form action={createCategoryAction} className="border border-border bg-background p-6 rounded-sm">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormField label={t("slug")} name="slug" required placeholder="bridal" />
            <FormField label={t("sortOrder")} name="sortOrder" type="number" defaultValue={0} />
            <FormField label={t("nameDe")} name="nameDe" required />
            <FormField label={t("nameEn")} name="nameEn" required />
          </div>
          <div className="mt-4 flex justify-end">
            <SubmitButton labelKey="addCategory" />
          </div>
        </form>
        <div className="mt-4 grid gap-2">
          {categories.map((cat) => {
            const name = cat.translations.find((tr) => tr.locale === "de")?.name ?? cat.slug;
            const itemCount = cat._count.items;
            return (
              <div key={cat.id} className="flex items-center justify-between border border-border bg-background px-4 py-3 rounded-sm">
                <span className="text-sm">{name} · {itemCount}</span>
                <DeleteButton
                  action={deleteCategoryAction.bind(null, cat.id)}
                  label=""
                  confirmMessage={
                    itemCount > 0
                      ? `Delete "${name}" and all ${itemCount} portfolio item(s)? This cannot be undone.`
                      : `Delete category "${name}"?`
                  }
                />
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2 className="text-2xl mb-4">{t("addPortfolioItem")}</h2>
        <form action={createItemAction} className="space-y-6">
          <FormSection title={t("itemDetails")}>
            <FormField label={t("slug")} name="slug" required />
            <SelectField label={t("category")} name="categoryId" required
              options={categories.map((c) => ({ value: c.id, label: c.translations[0]?.name ?? c.slug }))}
            />
            <SelectField label={t("linkedService")} name="serviceId"
              options={[{ value: "", label: t("none") }, ...services.map((s) => ({ value: s.id, label: s.translations[0]?.title ?? s.slug }))]}
            />
            <div className="md:col-span-2"><PortfolioImageUpload /></div>
            <FormField label={t("sortOrder")} name="sortOrder" type="number" defaultValue={0} />
            <CheckboxField label={t("featured")} name="featured" />
          </FormSection>
          <FormSection title={t("german")}>
            <FormField label={t("titleDe")} name="titleDe" required />
            <FormField label={t("altTextDe")} name="altTextDe" />
            <div className="md:col-span-2"><TextAreaField label={t("descriptionDe")} name="descriptionDe" /></div>
          </FormSection>
          <FormSection title={t("english")}>
            <FormField label={t("titleEn")} name="titleEn" required />
            <FormField label={t("altTextEn")} name="altTextEn" />
            <div className="md:col-span-2"><TextAreaField label={t("descriptionEn")} name="descriptionEn" /></div>
          </FormSection>
          <SubmitButton labelKey="addPortfolioItem" />
        </form>
      </section>

      <section>
        <h2 className="text-2xl mb-4">{t("portfolioItems")} ({items.length})</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const image = item.mediaFiles[0]?.url ?? siteImages.hero;
            const title = item.translations.find((tr) => tr.locale === "de")?.title ?? item.slug;
            return (
              <div key={item.id} className="border border-border bg-background rounded-sm overflow-hidden">
                <div className="relative aspect-[3/4]">
                  <Image src={image} alt={title} fill className="object-cover" />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-medium">{title}</p>
                    <p className="text-xs text-muted">{item.slug}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link href={`/admin/portfolio/${item.id}/edit`} className="text-muted hover:text-gold transition-colors leading-none" title="Edit">
                      <Pencil size={16} />
                    </Link>
                    <DeleteButton action={deletePortfolioItem.bind(null, item.id)} label="" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
