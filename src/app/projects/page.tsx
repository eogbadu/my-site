import Image from "next/image";
import Link from "next/link";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-prose">
          A few things I’ve built or worked on recently. I keep this list short
          and focused—each card links out when available.
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <li
            key={p.slug}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 hover:shadow-sm transition"
          >
            {/* Optional image */}
            {p.image ? (
              <div className="mb-3 relative w-full aspect-video overflow-hidden rounded-xl">
                <Image
                  src={p.image}
                  alt={p.title}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            ) : null}

            <h2 className="text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
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
                  className="underline underline-offset-4 hover:opacity-80"
                >
                  Live
                </a>
              )}
              {p.repo && (
                <a
                  href={p.repo}
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4 hover:opacity-80"
                >
                  Repo
                </a>
              )}
              {!p.url && !p.repo && (
                <span className="text-slate-500">Details coming soon</span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
