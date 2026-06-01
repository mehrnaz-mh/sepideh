import { notFound, redirect } from "next/navigation";
import { AdminFormShell } from "@/components/admin/form-shell";
import {
  CheckboxField,
  FormField,
  FormSection,
  SelectField,
  TextAreaField,
} from "@/components/admin/forms/fields";
import { PortfolioImageUpload } from "@/components/admin/portfolio-image-upload";
import { getPortfolioItem, updatePortfolioItem } from "@/actions/portfolio";
import { prisma } from "@/lib/prisma";

export default async function EditPortfolioItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getPortfolioItem(id);
  if (!item) notFound();

  const [categories, services] = await Promise.all([
    prisma.portfolioCategory.findMany({ include: { translations: true } }),
    prisma.service.findMany({ include: { translations: true } }),
  ]);

  const de = item.translations.find((t) => t.locale === "de");
  const en = item.translations.find((t) => t.locale === "en");

  async function action(formData: FormData) {
    "use server";
    const result = await updatePortfolioItem(id, formData);
    if (!result.success) redirect(`/admin/portfolio/${id}/edit?error=1`);
    redirect("/admin/portfolio");
  }

  return (
    <AdminFormShell title="Edit Portfolio Item" backHref="/admin/portfolio" action={action}>
      <FormSection title="Item Details">
        <FormField label="Slug" name="slug" defaultValue={item.slug} required />
        <SelectField
          label="Category"
          name="categoryId"
          defaultValue={item.categoryId}
          required
          options={categories.map((c) => ({
            value: c.id,
            label: c.translations[0]?.name ?? c.slug,
          }))}
        />
        <SelectField
          label="Service"
          name="serviceId"
          defaultValue={item.serviceId ?? ""}
          options={[
            { value: "", label: "None" },
            ...services.map((s) => ({
              value: s.id,
              label: s.translations[0]?.title ?? s.slug,
            })),
          ]}
        />
        <div className="md:col-span-2">
          <PortfolioImageUpload defaultValue={item.mediaFiles[0]?.url ?? ""} />
        </div>
        <FormField label="Sort Order" name="sortOrder" type="number" defaultValue={item.sortOrder} />
        <CheckboxField label="Featured" name="featured" defaultChecked={item.featured} />
      </FormSection>
      <FormSection title="German">
        <FormField label="Title (DE)" name="titleDe" defaultValue={de?.title} required />
        <FormField label="Alt Text (DE)" name="altTextDe" defaultValue={de?.altText ?? ""} />
        <div className="md:col-span-2">
          <TextAreaField label="Description (DE)" name="descriptionDe" defaultValue={de?.description ?? ""} />
        </div>
      </FormSection>
      <FormSection title="English">
        <FormField label="Title (EN)" name="titleEn" defaultValue={en?.title} required />
        <FormField label="Alt Text (EN)" name="altTextEn" defaultValue={en?.altText ?? ""} />
        <div className="md:col-span-2">
          <TextAreaField label="Description (EN)" name="descriptionEn" defaultValue={en?.description ?? ""} />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
