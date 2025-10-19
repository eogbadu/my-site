import { publications } from "@/data/research";

export default function FeaturedResearch() {
  const featured = publications.filter((p) => p.featured);

  if (featured.length === 0) return null;

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold">Featured Research</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Highlights from publications and works in progress. See the full list
          on{" "}
          <a className="underline underline-offset-4" href="/research">
            Research
          </a>
          .
        </p>
      </header>

      <ul className="space-y-3">
        {featured.map((p) => (
          <li
            key={p.slug}
            className="rounded-xl border border-slate-200 dark:border-slate-800 p-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <h3 className="text-base font-semibold">{p.title}</h3>
              <span className="text-xs text-slate-500">
                {p.venue} · {p.year}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {p.authors.join(", ")}
            </p>

            {p.abstract && (
              <p className="mt-2 text-sm text-slate-700 dark:text-slate-200 line-clamp-3">
                {p.abstract}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
              {p.links?.pdf && (
                <a
                  href={p.links.pdf}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md"
                  aria-label={`Open PDF for ${p.title} in a new tab`}
                  title={`Open PDF for ${p.title}`}
                >
                  PDF
                </a>
              )}
              {p.links?.doi && (
                <a
                  href={p.links.doi}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md"
                >
                  DOI
                </a>
              )}
              {p.links?.code && (
                <a
                  href={p.links.code}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md"
                >
                  Code
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
