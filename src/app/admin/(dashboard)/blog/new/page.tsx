import { getBlogCategories } from "@/actions/blog";
import { NewBlogClient } from "./new-blog-client";

export default async function NewBlogPostPage() {
  const categories = await getBlogCategories();
  return <NewBlogClient categories={categories} />;
}
