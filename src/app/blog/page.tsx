import type { Metadata } from "next";
import Link from "next/link";

import SectionHeader from "@/components/SectionHeader";
import { getPublishedPosts } from "@/db/queries";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Blog",
  description: "Essays, experiments, and build logs on AI/ML engineering and research.",
  path: "/blog",
});

/**
 * force-dynamic, not ISR.
 *
 * As a static route this would be prerendered at build time, which means reading
 * the database during `next build` — the exact coupling avoided everywhere else,
 * where a Neon outage would fail an unrelated deploy.
 *
 * Rendering per request costs almost nothing here because the query itself is
 * wrapped in unstable_cache: steady-state traffic still makes zero database
 * calls, it just re-renders from cached data. The Full Route Cache is the only
 * thing given up, and correctness of the deploy pipeline is worth more.
 */
export const dynamic = "force-dynamic";

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <section>
      <SectionHeader
        as="h1"
        eyebrow="Writing"
        title="Blog"
        description="Essays, experiments, and build logs."
        action={{ href: "/blog/tag", label: "Browse tags" }}
      />

      {posts.length === 0 ? (
        <p className="text-ink-muted">No posts published yet.</p>
      ) : (
        <ul className="divide-y divide-rule border-t border-rule">
          {posts.map((p) => (
            <li key={p.slug} className="py-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1">
                <h2 className="font-display text-xl tracking-[-0.01em]">
                  <Link
                    href={`/blog/${p.slug}`}
                    className="hover:text-accent transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  >
                    {p.title}
                  </Link>
                </h2>
                <span className="numeral shrink-0">
                  {p.publishedAt?.slice(0, 10)}
                </span>
              </div>

              {p.excerpt && (
                <p className="mt-2 text-sm leading-relaxed text-ink-muted max-w-[68ch]">
                  {p.excerpt}
                </p>
              )}

              {p.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t, i) => (
                    <Link
                      key={t}
                      href={`/blog/tag/${p.tagSlugs[i] ?? ""}`}
                      className="text-xs px-2.5 py-1 rounded-full ring-1 ring-rule text-ink-muted hover:text-ink hover:ring-ink transition focus:outline-none focus:ring-2 focus:ring-accent"
                    >
                      {t}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
