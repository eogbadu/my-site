import Link from "next/link";
import { notFound } from "next/navigation";

import { posts } from "@/data/posts";
import { tagToSlug, slugToLabel } from "@/lib/tags";

type Props = { params: { tag: string } };

// Pre-build pages for each known tag (based on your posts registry)
export function generateStaticParams() {
  const set = new Set<string>();
  for (const p of posts) {
    (p.tags ?? []).forEach((t) => set.add(tagToSlug(t)));
  }
  return Array.from(set).map((slug) => ({ tag: slug }));
}

// Set nice <title> and meta for each tag page
export function generateMetadata({ params }: Props) {
  const label = slugToLabel(params.tag);
  return {
    title: `Tag: ${label}`,
    description: `Posts tagged with ${label}`,
  };
}

export default function TagPage({ params }: Props) {
  const tagSlug = params.tag.toLowerCase();

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
        <p className="text-slate-600 dark:text-slate-300">
          {sorted.length} post{sorted.length === 1 ? "" : "s"}
        </p>
      </header>

      <ul className="space-y-4">
        {sorted.map((p) => (
          <li
            key={p.slug}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <Link
                href={`/blog/${p.slug}`}
                className="text-lg font-semibold hover:opacity-80"
              >
                {p.title}
              </Link>
              <span className="text-xs text-slate-500">{p.date}</span>
            </div>

            {p.excerpt && (
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 line-clamp-3">
                {p.excerpt}
              </p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
