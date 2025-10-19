import type { Publication } from "@/types/content";

interface Props {
  pub: Publication;
}

export default function PublicationItem({ pub: p }: Props) {
  return (
    <li className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4">
      <h3 className="text-lg font-semibold">{p.title}</h3>

      <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
        {p.authors.join(", ")}
      </p>

      <p className="text-sm text-slate-500">
        {p.venue} · {p.year}
      </p>

      {p.abstract && (
        <p className="mt-3 text-sm text-slate-700 dark:text-slate-200 max-w-prose line-clamp-4">
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
            aria-label={`Open DOI for ${p.title} in a new tab`}
            title={`Open DOI for ${p.title}`}
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
            aria-label={`Open code repository for ${p.title} in a new tab`}
            title={`Open code for ${p.title}`}
          >
            Code
          </a>
        )}
        {p.links?.poster && (
          <a
            href={p.links.poster}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md"
            aria-label={`Open poster for ${p.title} in a new tab`}
            title={`Open poster for ${p.title}`}
          >
            Poster
          </a>
        )}
        {p.links?.slides && (
          <a
            href={p.links.slides}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md"
            aria-label={`Open slide for ${p.title} in a new tab`}
            title={`Open slide for ${p.title}`}
          >
            Slides
          </a>
        )}
        {p.links?.video && (
          <a
            href={p.links.video}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md"
            aria-label={`Open video for ${p.title} in a new tab`}
            title={`Open video for ${p.title}`}
          >
            Video
          </a>
        )}
        {!p.links && <span className="text-slate-500">Links coming soon</span>}
      </div>
    </li>
  );
}
