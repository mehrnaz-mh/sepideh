import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminPageHeader } from "@/components/admin/page-header";
import { DeleteButton } from "@/components/admin/delete-button";
import { SubmitButton } from "@/components/admin/submit-button";
import { Badge } from "@/components/ui/badge";
import {
  FormField,
  SelectField,
  CheckboxField,
} from "@/components/admin/forms/fields";
import {
  getBlogCategories,
  getBlogPosts,
  createBlogCategory,
  deleteBlogCategory,
  deleteBlogPost,
} from "@/actions/blog";

export default async function AdminBlogPage() {
  const [categories, posts] = await Promise.all([getBlogCategories(), getBlogPosts()]);

  async function createCategoryAction(formData: FormData) {
    "use server";
    await createBlogCategory(formData);
    redirect("/admin/blog");
  }

  return (
    <div className="space-y-12">
      <AdminPageHeader
        title="Blog"
        description="Manage blog posts and categories"
        createHref="/admin/blog/new"
        createLabel="New Post"
      />

      <section>
        <h2 className="font-serif text-2xl">Categories</h2>
        <form action={createCategoryAction} className="mt-4 border border-border bg-background p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <FormField label="Slug" name="slug" required />
            <FormField label="Sort Order" name="sortOrder" type="number" defaultValue={0} />
            <FormField label="Name (DE)" name="nameDe" required />
            <FormField label="Name (EN)" name="nameEn" required />
          </div>
          <div className="mt-4">
            <SubmitButton label="Add Category" />
          </div>
        </form>
        <div className="mt-4 space-y-2">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between border border-border bg-background px-4 py-3"
            >
              <span>
                {cat.translations[0]?.name ?? cat.slug} · {cat._count.posts} posts
              </span>
              <DeleteButton action={deleteBlogCategory.bind(null, cat.id)} label="Delete" />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-serif text-2xl">Posts</h2>
        <div className="mt-4 space-y-3">
          {posts.map((post) => {
            const title = post.translations.find((t) => t.locale === "de")?.title ?? post.slug;
            return (
              <div
                key={post.id}
                className="flex items-center justify-between border border-border bg-background p-6"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg">{title}</h3>
                    <Badge variant={post.status === "PUBLISHED" ? "success" : "warning"}>
                      {post.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted">{post.slug}</p>
                </div>
                <div className="flex gap-3">
                  <Link href={`/admin/blog/${post.id}/edit`} className="text-xs uppercase text-gold">
                    Edit
                  </Link>
                  <DeleteButton action={deleteBlogPost.bind(null, post.id)} label="" />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
