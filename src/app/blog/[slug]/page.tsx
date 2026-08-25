import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import MdxContent from "@/components/MdxContent";
import { getPostBySlug } from "@/db/queries";
import { buildMetadata } from "@/lib/metadata";
import { readingTime } from "@/lib/reading-time";
import { tagToSlug } from "@/lib/tags";

type Props = { params: Promise<{ slug: string }> };

/**
 * Deliberately NO generateStaticParams.
 *
 * Prerendering known posts is tempting, but it would make `next build` depend on
 * the database — so a Neon cold start or a transient error could fail a deploy
 * that has nothing to do with the blog. The cost is one HTTP query on the first
 * request after a cache miss; every request after that is served from the cache.
 */
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: "Post not found",
      description: "",
      path: `/blog/${slug}`,
      noindex: true,
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.excerpt ?? post.title,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.publishedAt?.toISOString(),
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  // getPostBySlug filters on status = 'published', so drafts 404 publicly.
  if (!post) notFound();

  return (
    <article className="space-y-8">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link
          href="/blog"
          className="text-ink-muted hover:text-ink link-underline rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          ← All posts
        </Link>
      </nav>

      <header className="space-y-4 border-b border-rule pb-8">
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.08] tracking-[-0.015em]">
          {post.title}
        </h1>

        <p className="text-sm text-ink-faint">
          <time dateTime={post.publishedAt?.toISOString()}>
            {post.publishedAt?.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {" · "}
          {readingTime(post.body)} min read
        </p>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((t) => (
              <Link
                key={t}
                href={`/blog/tag/${tagToSlug(t)}`}
                className="text-xs px-2.5 py-1 rounded-full ring-1 ring-rule text-ink-muted hover:text-ink hover:ring-ink transition focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {t}
              </Link>
            ))}
          </div>
        )}
      </header>

      <div className="max-w-[68ch]">
        <MdxContent source={post.body} />
      </div>
    </article>
  );
}
