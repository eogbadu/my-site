import type { Metadata } from "next";
import Link from "next/link";

import SectionHeader from "@/components/SectionHeader";
import { getTagCounts } from "@/db/queries";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Blog tags",
  description: "Browse blog posts by topic.",
  path: "/blog/tag",
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

export default async function TagIndexPage() {
  const tags = await getTagCounts();

  return (
    <section>
      <SectionHeader
        as="h1"
        eyebrow="Index"
        title="Tags"
        description="Browse posts by topic."
        action={{ href: "/blog", label: "All posts" }}
      />

      {tags.length === 0 ? (
        <p className="text-ink-muted">No tags yet.</p>
      ) : (
        <ul className="flex flex-wrap gap-2 text-sm">
          {tags.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/blog/tag/${t.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-rule px-3.5 py-1.5 text-ink-muted hover:text-ink hover:border-ink transition focus:outline-none focus:ring-2 focus:ring-accent"
              >
                {/* The author's original label, not a lossy guess from the slug. */}
                <span>{t.label}</span>
                <span className="numeral">{t.count}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
