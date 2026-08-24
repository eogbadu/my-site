import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/types/content";

interface Props {
  project: Project;
  /**
   * Preload this card's image. Set it only for the single largest image above
   * the fold — deriving it from `featured` meant every card preloaded and
   * competed with the real LCP element.
   */
  eager?: boolean;
  /** Editorial index shown as 01, 02, … */
  index?: number;
}

export default function ProjectCard({ project: p, eager = false, index }: Props) {
  return (
    <li className="group flex">
      <Link
        href={`/projects/${p.slug}`}
        className="flex h-full flex-col rounded-lg focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-paper"
      >
        {p.image ? (
          <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-rule bg-surface">
            <Image
              src={p.image}
              alt={p.imageAlt ?? `${p.title} preview`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
              priority={eager}
            />
          </div>
        ) : (
          <div className="w-full aspect-video rounded-lg border border-dashed border-rule" />
        )}

        <div className="flex flex-1 flex-col pt-4 gap-2">
          <div className="flex items-baseline gap-3">
            {typeof index === "number" && (
              <span className="numeral">{String(index + 1).padStart(2, "0")}</span>
            )}
            <h3 className="font-display text-xl tracking-[-0.01em] group-hover:text-accent transition-colors">
              {p.title}
            </h3>
            {p.year && <span className="numeral ml-auto">{p.year}</span>}
          </div>

          <p className="text-sm leading-relaxed text-ink-muted line-clamp-3">{p.summary}</p>

          {/* mt-auto pins the tag row to the bottom so it lines up across columns
              even when summaries differ in length. */}
          <p className="mt-auto pt-2 text-xs text-ink-faint">{p.tags.join(" · ")}</p>
        </div>
      </Link>
    </li>
  );
}
