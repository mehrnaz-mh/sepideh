import { redirect } from "next/navigation";
import { AdminFormShell } from "@/components/admin/form-shell";
import {
  CheckboxField,
  FormField,
  FormSection,
  SelectField,
  TextAreaField,
} from "@/components/admin/forms/fields";
import { createBlogPost } from "@/actions/blog";
import { getBlogCategories } from "@/actions/blog";

export default async function NewBlogPostPage() {
  const categories = await getBlogCategories();

  async function action(formData: FormData) {
    "use server";
    const result = await createBlogPost(formData);
    if (!result.success) redirect("/admin/blog/new?error=1");
    redirect("/admin/blog");
  }

  return (
    <AdminFormShell title="New Blog Post" backHref="/admin/blog" action={action} submitLabel="Create">
      <FormSection title="Post Settings">
        <FormField label="Slug" name="slug" required />
        <SelectField
          label="Category"
          name="categoryId"
          options={[
            { value: "", label: "None" },
            ...categories.map((c) => ({
              value: c.id,
              label: c.translations[0]?.name ?? c.slug,
            })),
          ]}
        />
        <SelectField
          label="Status"
          name="status"
          defaultValue="DRAFT"
          options={[
            { value: "DRAFT", label: "Draft" },
            { value: "PUBLISHED", label: "Published" },
            { value: "ARCHIVED", label: "Archived" },
          ]}
        />
        <FormField label="Tags (comma-separated)" name="tags" />
        <CheckboxField label="Featured" name="featured" />
      </FormSection>
      <FormSection title="German">
        <FormField label="Title (DE)" name="titleDe" required />
        <FormField label="Excerpt (DE)" name="excerptDe" />
        <div className="md:col-span-2">
          <TextAreaField label="Content (DE)" name="contentDe" required rows={8} />
        </div>
      </FormSection>
      <FormSection title="English">
        <FormField label="Title (EN)" name="titleEn" required />
        <FormField label="Excerpt (EN)" name="excerptEn" />
        <div className="md:col-span-2">
          <TextAreaField label="Content (EN)" name="contentEn" required rows={8} />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
