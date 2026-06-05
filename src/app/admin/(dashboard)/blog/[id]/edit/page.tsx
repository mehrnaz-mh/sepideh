import { notFound, redirect } from "next/navigation";
import { AdminFormShell } from "@/components/admin/form-shell";
import {
  CheckboxField,
  FormField,
  FormSection,
  SelectField,
  TextAreaField,
} from "@/components/admin/forms/fields";
import { ImageUploadField } from "@/components/admin/image-upload-field";
import { getBlogPost, updateBlogPost, getBlogCategories } from "@/actions/blog";
import { prisma } from "@/lib/prisma";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, categories, fullPost] = await Promise.all([
    getBlogPost(id),
    getBlogCategories(),
    prisma.blogPost.findUnique({ where: { id }, include: { featuredImage: true } }),
  ]);
  if (!post) notFound();

  const de = post.translations.find((t) => t.locale === "de");
  const en = post.translations.find((t) => t.locale === "en");

  async function action(formData: FormData) {
    "use server";
    const result = await updateBlogPost(id, formData);
    if (!result.success) redirect(`/admin/blog/${id}/edit?error=1`);
    redirect("/admin/blog?success=updated");
  }

  return (
    <AdminFormShell title="Edit Blog Post" backHref="/admin/blog" action={action}>
      <div className="border border-border bg-background p-6">
        <h3 className="mb-4 font-serif text-lg">Cover Image</h3>
        <ImageUploadField name="featuredImageUrl" label="Wide cover image (recommended: 1200×630)" folder="blog" defaultValue={fullPost?.featuredImage?.url ?? ""} />
      </div>
      <FormSection title="Post Settings">
        <FormField label="Slug" name="slug" defaultValue={post.slug} required />
        <SelectField
          label="Category"
          name="categoryId"
          defaultValue={post.categoryId ?? ""}
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
          defaultValue={post.status}
          options={[
            { value: "DRAFT", label: "Draft" },
            { value: "PUBLISHED", label: "Published" },
            { value: "ARCHIVED", label: "Archived" },
          ]}
        />
        <FormField
          label="Tags"
          name="tags"
          defaultValue={post.tags.map((t) => t.tag).join(", ")}
        />
        <CheckboxField label="Featured" name="featured" defaultChecked={post.featured} />
      </FormSection>
      <FormSection title="German">
        <FormField label="Title (DE)" name="titleDe" defaultValue={de?.title} required />
        <FormField label="Excerpt (DE)" name="excerptDe" defaultValue={de?.excerpt ?? ""} />
        <div className="md:col-span-2">
          <TextAreaField label="Content (DE)" name="contentDe" defaultValue={de?.content} required rows={8} />
        </div>
      </FormSection>
      <FormSection title="English">
        <FormField label="Title (EN)" name="titleEn" defaultValue={en?.title} required />
        <FormField label="Excerpt (EN)" name="excerptEn" defaultValue={en?.excerpt ?? ""} />
        <div className="md:col-span-2">
          <TextAreaField label="Content (EN)" name="contentEn" defaultValue={en?.content} required rows={8} />
        </div>
      </FormSection>
    </AdminFormShell>
  );
}
