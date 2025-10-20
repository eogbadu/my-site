import Link from "next/link";
import { posts } from "../../data/posts";

export const metadata = {
  title: "Blog",
  description: "Notes, write-ups, and progress logs.",
};

export default function BlogIndexPage() {
  // newest first
  const sorted = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Blog</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-prose">
          Essays, experiments, and build logs.
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
            {p.tags && p.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-1 rounded-full ring-1 ring-slate-300 dark:ring-slate-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
