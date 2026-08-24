import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/types/content";

interface Props {
  project: Project;
  /**
   * Preload this card's image. Set it only for the single largest image above
   * the fold. It used to be derived from `featured`, but every project is
   * featured, so three below-the-fold images were preloading and competing with
   * the real LCP element for bandwidth.
   */
  eager?: boolean;
}

export default function ProjectCard({ project: p, eager = false }: Props) {
  return (
    <li className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-sm transition">
      {/* Optional image */}
      {p.image ? (
        <Link
          href={`/projects/${p.slug}`}
          className="mb-3 block relative w-full aspect-video overflow-hidden rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-400"
          tabIndex={-1}
          aria-hidden="true"
        >
          <Image
            src={p.image}
            alt={p.imageAlt ?? `${p.title} screenshot`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover"
            priority={eager}
          />
        </Link>
      ) : null}

      <h2 className="text-lg font-semibold">
        <Link
          href={`/projects/${p.slug}`}
          className="hover:underline underline-offset-4 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          {p.title}
        </Link>
      </h2>

      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-3">
        {p.summary}
      </p>

      {/* Tags */}
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

      {/* Links */}
      <div className="mt-4 flex items-center gap-3 text-sm">
        {p.url && (
          <a
            href={p.url}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md"
            aria-label={`Open ${p.title} live site in a new tab`}
            title={`Open ${p.title} live site`}
          >
            Live
          </a>
        )}
        {p.repo && (
          <a
            href={p.repo}
            target="_blank"
            rel="noreferrer"
            className="underline underline-offset-4 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md"
            aria-label={`Open ${p.title} GitHub repository in a new tab`}
            title={`Open ${p.title} repository`}
          >
            Repo
          </a>
        )}
        <Link
          href={`/projects/${p.slug}`}
          className="underline underline-offset-4 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-slate-400 rounded-md"
        >
          Details
        </Link>
      </div>
    </li>
  );
}
