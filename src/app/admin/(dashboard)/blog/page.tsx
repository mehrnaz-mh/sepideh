import { getBlogCategories, getBlogPosts } from "@/actions/blog";
import { BlogClient } from "./blog-client";

export default async function AdminBlogPage() {
  const [categories, posts] = await Promise.all([getBlogCategories(), getBlogPosts()]);
  return <BlogClient categories={categories} posts={posts} />;
}
