import { notFound } from "next/navigation";
import { getBlogPost, getBlogCategories } from "@/actions/blog";
import { prisma } from "@/lib/prisma";
import { EditBlogClient } from "./edit-blog-client";

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

  return (
    <EditBlogClient
      post={post}
      categories={categories}
      featuredImageUrl={fullPost?.featuredImage?.url ?? ""}
    />
  );
}
