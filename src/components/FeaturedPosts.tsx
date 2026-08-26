import Link from "next/link";

import SectionHeader from "@/components/SectionHeader";
import { getPublishedPosts } from "@/db/queries";

/**
 * Latest posts on the homepage.
 *
 * Reads through the same cached query as /blog, so steady-state traffic makes no
 * extra database calls. Publishing invalidates it via revalidateBlog(), which
 * revalidates "/" alongside the blog routes.
 *
 * Renders nothing when there are no posts, so the homepage never shows an empty
 * section.
 */
export default async function FeaturedPosts({ limit = 3 }: { limit?: number }) {
  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];

  try {
    posts = (await getPublishedPosts()).slice(0, limit);
  } catch (err) {
    // A database problem should cost the homepage this section, not the page.
    console.error("[home] could not load posts", err);
    return null;
  }

  if (posts.length === 0) return null;

  return (
    <section>
      <SectionHeader
        eyebrow="Writing"
        title="From the blog"
        description="Notes on what I am building and reading."
        action={{ href: "/blog", label: "All posts" }}
      />

      <ul className="divide-y divide-rule border-t border-rule">
        {posts.map((p) => (
          <li key={p.slug} className="py-5">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1">
              <h3 className="font-display text-lg tracking-[-0.01em]">
                <Link
                  href={`/blog/${p.slug}`}
                  className="hover:text-accent transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {p.title}
                </Link>
              </h3>
              <span className="numeral shrink-0">{p.publishedAt?.slice(0, 10)}</span>
            </div>

            {p.excerpt && (
              <p className="mt-1.5 text-sm leading-relaxed text-ink-muted max-w-[68ch]">
                {p.excerpt}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
