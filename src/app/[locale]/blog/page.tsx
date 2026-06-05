import { getTranslations, setRequestLocale } from "next-intl/server";
import { FadeIn } from "@/components/motion/fade-in";
import type { Locale } from "@/data/content";
import { prisma } from "@/lib/prisma";
import { BlogFilter } from "./blog-filter";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return { title: locale === "de" ? "Blog" : "Blog" };
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("blog");
  const loc = locale as Locale;

  let posts: {
    slug: string;
    title: string;
    excerpt: string | null;
    category: string | null;
    image: string | null;
    tags: string[];
  }[] = [];

  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      include: {
        translations: { where: { locale } },
        category: { include: { translations: { where: { locale } } } },
        featuredImage: true,
        tags: true,
      },
      orderBy: { publishedAt: "desc" },
    });

    posts = dbPosts.map((post) => ({
      slug: post.slug,
      title: post.translations[0]?.title ?? post.slug,
      excerpt: post.translations[0]?.excerpt ?? null,
      category: post.category?.translations[0]?.name ?? null,
      image: post.featuredImage?.url ?? null,
      tags: post.tags.map((t) => t.tag),
    }));
  } catch {
    posts = [];
  }

  return (
    <>
      <section className="section-padding-hero bg-background-secondary">
        <div className="luxury-container">
          <FadeIn>
            <div className="gold-line mb-6" />
            <h1 className="text-5xl">{t("title")}</h1>
            <p className="mt-4 text-muted">{t("subtitle")}</p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="luxury-container">
          <BlogFilter
            posts={posts}
            locale={loc}
            emptyDe="Keine Beiträge gefunden."
            emptyEn="No posts found."
          />
        </div>
      </section>
    </>
  );
}
