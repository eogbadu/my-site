import Link from "next/link";
import { notFound } from "next/navigation";

import { posts } from "@/data/posts";
import { tagToSlug, slugToLabel } from "@/lib/tags";
import { buildMetadata } from "@/lib/metadata";

// Next 15: `params` is a Promise. Reading it synchronously works today only via a
// deprecation shim that is removed in Next 16.
type Props = { params: Promise<{ tag: string }> };

// Tags all come from the static posts registry, so an unlisted tag should 404
// rather than render on demand. Without this, notFound() returned HTTP 200 — a
// soft 404. NOTE: Phase 10 moves posts to the database and removes
// generateStaticParams here, at which point this must go too.
export const dynamicParams = false;

// Pre-build pages for each known tag (based on your posts registry)
export function generateStaticParams() {
  const set = new Set<string>();
  for (const p of posts) {
    (p.tags ?? []).forEach((t) => set.add(tagToSlug(t)));
  }
  return Array.from(set).map((slug) => ({ tag: slug }));
}

// Set nice <title> and meta for each tag page
export async function generateMetadata({ params }: Props) {
  const { tag } = await params;
  const label = slugToLabel(tag);
  return buildMetadata({
    title: `Tag: ${label}`,
    description: `Blog posts tagged with ${label}.`,
    path: `/blog/tag/${tag}`,
  });
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const tagSlug = tag.toLowerCase();

  // Filter posts that include this tag (slug-comparison so labels can vary)
  const filtered = posts.filter((p) =>
    (p.tags ?? []).some((t) => tagToSlug(t) === tagSlug)
  );

  if (filtered.length === 0) {
    // Unknown tag → show your 404 page
    return notFound();
  }

  // newest first (string compare is fine if date is ISO like "2025-10-19")
  const sorted = [...filtered].sort((a, b) => (a.date < b.date ? 1 : -1));
  const label = slugToLabel(tagSlug);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Tag: {label}</h1>
        <p className="text-ink-muted">
          {sorted.length} post{sorted.length === 1 ? "" : "s"}
        </p>
      </header>

      <ul className="space-y-4">
        {sorted.map((p) => (
          <li
            key={p.slug}
            className="rounded-2xl border border-rule p-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <Link
                href={`/blog/${p.slug}`}
                className="text-lg font-semibold hover:opacity-80"
              >
                {p.title}
              </Link>
              <span className="text-xs text-ink-faint">{p.date}</span>
            </div>

            {p.excerpt && (
              <p className="mt-2 text-sm text-ink-muted line-clamp-3">
                {p.excerpt}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
