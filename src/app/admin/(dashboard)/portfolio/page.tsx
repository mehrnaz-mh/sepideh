import { siteImages } from "@/data/content";
import Image from "next/image";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import {
  CheckboxField,
  FormField,
  FormSection,
  SelectField,
  TextAreaField,
} from "@/components/admin/forms/fields";
import { PortfolioImageUpload } from "@/components/admin/portfolio-image-upload";
import {
  getPortfolioCategories,
  getPortfolioItems,
  createPortfolioCategory,
  deletePortfolioCategory,
  createPortfolioItem,
  deletePortfolioItem,
} from "@/actions/portfolio";
import { prisma } from "@/lib/prisma";

export default async function AdminPortfolioPage() {
  const [categories, items] = await Promise.all([
    getPortfolioCategories(),
    getPortfolioItems(),
  ]);

  async function createCategoryAction(formData: FormData) {
    "use server";
    await createPortfolioCategory(formData);
    redirect("/admin/portfolio");
  }

  async function createItemAction(formData: FormData) {
    "use server";
    const result = await createPortfolioItem(formData);
    if (!result.success) redirect("/admin/portfolio?error=create-failed");
    redirect("/admin/portfolio");
  }

  const services = await prisma.service.findMany({
    include: { translations: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="space-y-12">
      <AdminPageHeader
        title="Portfolio"
        description="Manage portfolio categories and gallery items"
      />

      <section>
        <h2 className="font-serif text-2xl">Categories</h2>
        <form action={createCategoryAction} className="mt-4 border border-border bg-background p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormField label="Slug" name="slug" required placeholder="bridal" />
            <FormField label="Sort Order" name="sortOrder" type="number" defaultValue={0} />
            <FormField label="Name (DE)" name="nameDe" required />
            <FormField label="Name (EN)" name="nameEn" required />
          </div>
          <div className="mt-4">
            <SubmitButton label="Add Category" />
          </div>
        </form>
        <div className="mt-4 grid gap-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between border border-border bg-background px-4 py-3"
            >
              <span>
                {cat.translations.find((t) => t.locale === "de")?.name ?? cat.slug} ·{" "}
                {cat._count.items} items
              </span>
              <DeleteButton action={deletePortfolioCategory.bind(null, cat.id)} label="Delete" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl">Add Portfolio Item</h2>
        <form action={createItemAction} className="mt-4 space-y-6">
          <FormSection title="Item Details">
            <FormField label="Slug" name="slug" required />
            <SelectField
              label="Category"
              name="categoryId"
              required
              options={categories.map((c) => ({
                value: c.id,
                label: c.translations[0]?.name ?? c.slug,
              }))}
            />
            <SelectField
              label="Linked Service (optional)"
              name="serviceId"
              options={[
                { value: "", label: "None" },
                ...services.map((s) => ({
                  value: s.id,
                  label: s.translations[0]?.title ?? s.slug,
                })),
              ]}
            />
            <div className="md:col-span-2">
              <PortfolioImageUpload />
            </div>
            <FormField label="Sort Order" name="sortOrder" type="number" defaultValue={0} />
            <CheckboxField label="Featured" name="featured" />
          </FormSection>
          <FormSection title="German">
            <FormField label="Title (DE)" name="titleDe" required />
            <FormField label="Alt Text (DE)" name="altTextDe" />
            <div className="md:col-span-2">
              <TextAreaField label="Description (DE)" name="descriptionDe" />
            </div>
          </FormSection>
          <FormSection title="English">
            <FormField label="Title (EN)" name="titleEn" required />
            <FormField label="Alt Text (EN)" name="altTextEn" />
            <div className="md:col-span-2">
              <TextAreaField label="Description (EN)" name="descriptionEn" />
            </div>
          </FormSection>
          <SubmitButton label="Add Portfolio Item" />
        </form>
      </section>

      <section>
        <h2 className="font-serif text-2xl">Portfolio Items ({items.length})</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => {
            const image = item.mediaFiles[0]?.url ?? siteImages.hero;
            const title = item.translations.find((t) => t.locale === "de")?.title ?? item.slug;
            return (
              <div key={item.id} className="border border-border bg-background">
                <div className="relative aspect-[3/4]">
                  <Image src={image} alt={title} fill className="object-cover" />
                </div>
                <div className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-serif">{title}</p>
                    <p className="text-xs text-muted">{item.slug}</p>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/portfolio/${item.id}/edit`}
                      className="text-xs uppercase text-gold"
                    >
                      Edit
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
