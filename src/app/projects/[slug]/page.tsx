import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { projects } from "@/data/projects";
import { buildMetadata } from "@/lib/metadata";

type Props = { params: Promise<{ slug: string }> };

/**
 * Every valid slug is known at build time, so unlisted ones should 404 outright
 * rather than being rendered on demand.
 *
 * This also fixes a soft 404: with dynamicParams left at its default of `true`,
 * calling notFound() for an unknown slug rendered the 404 page but still
 * returned HTTP 200, which tells crawlers the page exists.
 */
export const dynamicParams = false;

/**
 * Safe to prerender: the source is a static TypeScript array, so unlike the blog
 * this never makes the build depend on a database.
 */
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return buildMetadata({ title: "Project not found", description: "", path: "/projects", noindex: true });

  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
  });
}

const STATUS_LABEL: Record<NonNullable<import("@/types/content").Project["status"]>, string> = {
  active: "Active",
  shipped: "Shipped",
  archived: "Archived",
};

export default async function ProjectDetailPage({ params }: Props) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const meta = [
    project.year,
    project.role,
    project.status ? STATUS_LABEL[project.status] : undefined,
  ].filter(Boolean);

  const links = [
    ...(project.url ? [{ label: "Live site", href: project.url }] : []),
    ...(project.repo ? [{ label: "Source code", href: project.repo }] : []),
    ...(project.links ?? []),
  ];

  return (
    <article className="space-y-10">
      <nav aria-label="Breadcrumb" className="text-sm">
        <Link
          href="/projects"
          className="text-slate-600 dark:text-slate-300 hover:underline underline-offset-4 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          ← All projects
        </Link>
      </nav>

      <header className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{project.title}</h1>

        {meta.length > 0 && (
          <p className="text-sm text-slate-500">{meta.join(" · ")}</p>
        )}

        <p className="text-lg text-slate-700 dark:text-slate-200 max-w-prose">
          {project.summary}
        </p>

        <div className="flex flex-wrap gap-2">
          {project.tags.map((t) => (
            <span
              key={t}
              className="text-xs px-2 py-1 rounded-full ring-1 ring-slate-300 dark:ring-slate-700"
            >
              {t}
            </span>
          ))}
        </div>

        {links.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {links.map((l) => {
              const external = /^https?:\/\//.test(l.href);
              return (
                <a
                  key={l.href}
                  href={l.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                  className="rounded-2xl px-4 py-2 text-sm font-semibold ring-1 ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
                >
                  {l.label}
                  {external ? " ↗" : ""}
                </a>
              );
            })}
          </div>
        )}
      </header>

      {project.image && (
        <div className="relative w-full aspect-video overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          <Image
            src={project.image}
            alt={project.imageAlt ?? `${project.title} screenshot`}
            fill
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
            priority
          />
        </div>
      )}

      {project.video && (
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Demo</h2>
          {/*
            Plain <video controls> — no player library, no client JS. `preload="none"`
            keeps the 2.7 MB file off the initial page load; the poster stands in
            until someone presses play.
          */}
          <video
            controls
            preload="none"
            playsInline
            poster={project.videoPoster}
            className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-black"
          >
            <source src={project.video} type="video/mp4" />
            Your browser doesn&rsquo;t support embedded video.{" "}
            <a href={project.video} className="underline underline-offset-4">
              Download the demo
            </a>{" "}
            instead.
          </video>
        </section>
      )}

      {project.highlights && project.highlights.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Highlights</h2>
          <ul className="list-disc pl-6 space-y-2 text-slate-700 dark:text-slate-200 max-w-prose">
            {project.highlights.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </section>
      )}

      {project.body && (
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Background</h2>
          <div className="space-y-4 text-slate-700 dark:text-slate-200 max-w-prose leading-7">
            {project.body.split("\n\n").map((para) => (
              <p key={para.slice(0, 40)}>{para}</p>
            ))}
          </div>
        </section>
      )}

      {project.stack && project.stack.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Stack</h2>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((t) => (
              <li
                key={t}
                className="text-sm px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800"
              >
                {t}
              </li>
            ))}
          </ul>
        </section>
      )}

      {project.gallery && project.gallery.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-2xl font-semibold">Gallery</h2>
          <ul className="grid gap-4 sm:grid-cols-2">
            {project.gallery.map((g) => (
              <li key={g.src} className="space-y-2">
                <div className="relative w-full aspect-square overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                </div>
                {g.caption && (
                  <p className="text-xs text-slate-500">{g.caption}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <Link
          href="/projects"
          className="text-sm text-slate-600 dark:text-slate-300 hover:underline underline-offset-4 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          ← All projects
        </Link>
      </footer>
    </article>
  );
}
