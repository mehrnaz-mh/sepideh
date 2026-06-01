import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/motion/fade-in";
import { JsonLd, breadcrumbSchema } from "@/components/seo/json-ld";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  try {
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: { translations: { where: { locale } } },
    });
    if (!post?.translations[0]) return {};
    return {
      title: post.translations[0].metaTitle || post.translations[0].title,
      description: post.translations[0].metaDesc || post.translations[0].excerpt,
    };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  let post = null;
  try {
    post = await prisma.blogPost.findUnique({
      where: { slug, status: "PUBLISHED" },
      include: {
        translations: { where: { locale } },
        author: true,
      },
    });
  } catch {
    post = null;
  }

  if (!post?.translations[0]) notFound();

  const translation = post.translations[0];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: translation.title,
          description: translation.excerpt,
          author: { "@type": "Person", name: post.author.name },
          datePublished: post.publishedAt?.toISOString(),
        }}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: `${siteUrl}/${locale}` },
          { name: "Blog", url: `${siteUrl}/${locale}/blog` },
          {
            name: translation.title,
            url: `${siteUrl}/${locale}/blog/${slug}`,
          },
        ])}
      />

      <article className="section-padding">
        <div className="luxury-container max-w-3xl">
          <FadeIn>
            <Link href="/blog" className="text-sm text-muted hover:text-gold">
              ← Blog
            </Link>
            <h1 className="mt-6 font-serif text-5xl">{translation.title}</h1>
            {translation.excerpt && (
              <p className="mt-4 text-xl text-muted">{translation.excerpt}</p>
            )}
          </FadeIn>
          <FadeIn delay={0.2} className="mt-12">
            <div
              className="prose prose-neutral max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: translation.content }}
            />
          </FadeIn>
        </div>
      </article>
    </>
  );
}
