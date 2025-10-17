import Link from "next/link";
import { publications } from "@/data/research";
import { groupPublicationsByYear } from "@/lib/group";

export default function ResearchPage() {
  const groups = groupPublicationsByYear(publications);

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Research</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-prose">
          Selected publications and works in progress, grouped by year.
        </p>
      </header>

      <div className="space-y-10">
        {groups.map(([year, items]) => (
          <section key={year} className="space-y-4">
            <h2 className="text-2xl font-semibold">{year}</h2>

            <ul className="space-y-6">
              {items.map((p) => (
                <li
                  key={p.slug}
                  className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4"
                >
                  <h3 className="text-lg font-semibold">{p.title}</h3>

                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                    {p.authors.join(", ")}
                  </p>

                  <p className="text-sm text-slate-500">
                    {p.venue} · {p.year}
                  </p>

                  {p.abstract && (
                    <p className="mt-3 text-sm text-slate-700 dark:text-slate-200 max-w-prose">
                      {p.abstract}
                    </p>
                  )}

                  {/* tags */}
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

                  {/* links */}
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                    {p.links?.pdf && (
                      <a
                        href={p.links.pdf}
                        className="underline underline-offset-4 hover:opacity-80"
                        target="_blank"
                        rel="noreferrer"
                      >
                        PDF
                      </a>
                    )}
                    {p.links?.doi && (
                      <a
                        href={p.links.doi}
                        className="underline underline-offset-4 hover:opacity-80"
                        target="_blank"
                        rel="noreferrer"
                      >
                        DOI
                      </a>
                    )}
                    {p.links?.code && (
                      <a
                        href={p.links.code}
                        className="underline underline-offset-4 hover:opacity-80"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Code
                      </a>
                    )}
                    {p.links?.poster && (
                      <a
                        href={p.links.poster}
                        className="underline underline-offset-4 hover:opacity-80"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Poster
                      </a>
                    )}
                    {p.links?.slides && (
                      <a
                        href={p.links.slides}
                        className="underline underline-offset-4 hover:opacity-80"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Slides
                      </a>
                    )}
                    {p.links?.video && (
                      <a
                        href={p.links.video}
                        className="underline underline-offset-4 hover:opacity-80"
                        target="_blank"
                        rel="noreferrer"
                      >
                        Video
                      </a>
                    )}
                    {!p.links && (
                      <span className="text-slate-500">Links coming soon</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  );
}
