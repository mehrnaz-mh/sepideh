"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { FadeIn } from "@/components/motion/fade-in";
import { blogCategories } from "@/data/content";
import type { Locale } from "@/data/content";

type Post = {
  slug: string;
  title: string;
  excerpt: string | null;
  category: string | null;
  image: string | null;
  tags: string[];
};

export function BlogFilter({
  posts,
  locale,
  emptyDe,
  emptyEn,
}: {
  posts: Post[];
  locale: Locale;
  emptyDe: string;
  emptyEn: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  const filtered = active
    ? posts.filter((p) => p.tags.includes(active))
    : posts;

  return (
    <>
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActive(null)}
          className={`border px-4 py-2 text-xs uppercase tracking-widest transition-colors hover:border-gold hover:text-gold ${!active ? "border-gold text-gold" : "border-border"}`}
        >
          {locale === "de" ? "Alle" : "All"}
        </button>
        {blogCategories.map((cat) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setActive(active === cat.slug ? null : cat.slug)}
            className={`border px-4 py-2 text-xs uppercase tracking-widest transition-colors hover:border-gold hover:text-gold ${active === cat.slug ? "border-gold text-gold" : "border-border"}`}
          >
            {cat[locale].name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted">{locale === "de" ? emptyDe : emptyEn}</p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => (
            <FadeIn key={post.slug} delay={i * 0.08}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block border border-border transition-colors hover:border-gold overflow-hidden rounded-lg"
              >
                {post.image && (
                  <div className="relative aspect-video w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      unoptimized={post.image.startsWith("http")}
                    />
                  </div>
                )}
                <div className="p-6">
                  {post.category && (
                    <span className="text-xs uppercase tracking-widest text-gold">
                      {post.category}
                    </span>
                  )}
                  <h2 className="mt-2 text-2xl group-hover:text-gold">{post.title}</h2>
                  {post.excerpt && (
                    <p className="mt-3 text-sm text-muted line-clamp-3">{post.excerpt}</p>
                  )}
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      )}
    </>
  );
}
