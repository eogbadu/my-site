import Link from "next/link";
import { posts } from "@/data/posts";
import { tagToSlug, slugToLabel } from "@/lib/tags";

export const metadata = {
  title: "Blog tags",
  description: "Browse posts by topic.",
};

export default function TagIndexPage() {
  const counts = new Map<string, number>();

  for (const post of posts) {
    for (const t of post.tags ?? []) {
      const slug = tagToSlug(t);
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    }
  }

  const entries = Array.from(counts.entries()).sort((a, b) =>
    a[0].localeCompare(b[0])
  );

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Tags</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-prose">
          Browse posts by topic. Tags are a light-weight way to organize notes
          across projects, research, and progress logs.
        </p>
      </header>

      {entries.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-300">
          No tags yet — once you add tags to posts in{" "}
          <code>src/data/posts.ts</code>, they’ll show up here.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2 text-sm">
          {entries.map(([slug, count]) => (
            <li key={slug}>
              <Link
                href={`/blog/tag/${slug}`}
                className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-800 px-3 py-1 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <span>{slugToLabel(slug)}</span>
                <span className="ml-2 text-xs text-slate-500">
                  {count} post{count === 1 ? "" : "s"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
