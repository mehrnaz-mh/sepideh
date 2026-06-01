import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/motion/fade-in";
import { blogCategories } from "@/data/content";
import type { Locale } from "@/data/content";
import { prisma } from "@/lib/prisma";

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
    publishedAt: Date | null;
    category: string | null;
  }[] = [];

  try {
    const dbPosts = await prisma.blogPost.findMany({
      where: { status: "PUBLISHED" },
      include: {
        translations: { where: { locale } },
        category: { include: { translations: { where: { locale } } } },
      },
      orderBy: { publishedAt: "desc" },
    });

    posts = dbPosts.map((post) => ({
      slug: post.slug,
      title: post.translations[0]?.title ?? post.slug,
      excerpt: post.translations[0]?.excerpt ?? null,
      publishedAt: post.publishedAt,
      category: post.category?.translations[0]?.name ?? null,
    }));
  } catch {
    posts = [];
  }

  return (
    <>
      <section className="section-padding bg-background-secondary">
        <div className="luxury-container">
          <FadeIn>
            <div className="gold-line mb-6" />
            <h1 className="font-serif text-5xl">{t("title")}</h1>
            <p className="mt-4 text-muted">{t("subtitle")}</p>
          </FadeIn>
        </div>
      </section>

      <section className="section-padding">
        <div className="luxury-container">
          <div className="mb-8 flex flex-wrap gap-2">
            {blogCategories.map((cat) => (
              <span
                key={cat.slug}
                className="border border-border px-4 py-2 text-xs uppercase tracking-widest"
              >
                {cat[loc].name}
              </span>
            ))}
          </div>

          {posts.length === 0 ? (
            <FadeIn>
              <p className="text-muted">
                {loc === "de"
                  ? "Blog-Beiträge folgen in Kürze."
                  : "Blog posts coming soon."}
              </p>
            </FadeIn>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => (
                <FadeIn key={post.slug} delay={i * 0.08}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="group block border border-border p-8 transition-colors hover:border-gold"
                  >
                    {post.category && (
                      <span className="text-xs uppercase tracking-widest text-gold">
                        {post.category}
                      </span>
                    )}
                    <h2 className="mt-3 font-serif text-2xl group-hover:text-gold">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="mt-3 text-sm text-muted line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                  </Link>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
