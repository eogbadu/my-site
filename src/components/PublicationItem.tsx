import type { Publication } from "@/types/content";

interface Props {
  pub: Publication;
  /** "compact" trims the abstract and tags for homepage use. */
  variant?: "full" | "compact";
}

const LINK_LABELS: Array<[keyof NonNullable<Publication["links"]>, string]> = [
  ["pdf", "PDF"],
  ["doi", "DOI"],
  ["code", "Code"],
  ["poster", "Poster"],
  ["slides", "Slides"],
  ["video", "Video"],
];

export default function PublicationItem({ pub: p, variant = "full" }: Props) {
  const compact = variant === "compact";

  return (
    <li className="py-6">
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1">
        <h3 className="font-display text-xl leading-snug tracking-[-0.01em] max-w-[52ch]">
          {p.title}
        </h3>
        <span className="numeral shrink-0">{p.year}</span>
      </div>

      <p className="mt-2 text-sm text-ink-muted">{p.authors.join(", ")}</p>
      <p className="text-sm italic text-ink-faint">{p.venue}</p>

      {p.note && (
        <p className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs font-medium text-accent">
          <span aria-hidden="true">●</span>
          {p.note}
        </p>
      )}

      {p.abstract && (
        <p
          className={`mt-3 text-sm leading-relaxed text-ink-muted max-w-[68ch] ${
            compact ? "line-clamp-2" : ""
          }`}
        >
          {p.abstract}
        </p>
      )}

      {!compact && p.tags && p.tags.length > 0 && (
        <p className="mt-3 text-xs text-ink-faint">{p.tags.join(" · ")}</p>
      )}

      {p.links && (
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
          {LINK_LABELS.map(([key, label]) => {
            const href = p.links?.[key];
            if (!href) return null;
            return (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="text-accent link-underline rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
                aria-label={`Open ${label} for ${p.title} in a new tab`}
              >
                {label}
              </a>
            );
          })}
        </div>
      )}
    </li>
  );
}
