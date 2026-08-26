"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/types/content";

/**
 * Full-width feature for the flagship project.
 *
 * Plays the demo video muted and looping when the browser allows motion, and
 * falls back to the poster still otherwise. The check is JS rather than CSS
 * because autoplay cannot be suppressed by a media query — CSS could hide the
 * element, but the video would still download and play behind it.
 *
 * The video is only mounted after the motion preference is known, so a
 * reduced-motion visitor never fetches it at all.
 */
export default function FeatureBlock({ project }: { project: Project }) {
  const [motionOk, setMotionOk] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMotionOk(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const showVideo = motionOk === true && Boolean(project.video);

  return (
    <section aria-labelledby="feature-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 pb-5">
        <div className="space-y-2">
          <p className="eyebrow">Flagship</p>
          <h2
            id="feature-heading"
            className="font-display text-3xl sm:text-4xl tracking-[-0.01em]"
          >
            {project.title}
          </h2>
        </div>
        <Link
          href={`/projects/${project.slug}`}
          className="text-sm text-ink-muted hover:text-ink link-underline rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Read more →
        </Link>
      </div>

      <Link
        href={`/projects/${project.slug}`}
        className="group block overflow-hidden rounded-xl border border-rule bg-surface focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-4 focus:ring-offset-paper"
      >
        <div className="relative w-full aspect-video">
          {showVideo ? (
            <video
              className="absolute inset-0 h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={project.videoPoster}
              aria-label={`${project.title} demo`}
            >
              <source src={project.video} type="video/mp4" />
            </video>
          ) : (
            project.image && (
              <Image
                src={project.image}
                alt={project.imageAlt ?? `${project.title} preview`}
                fill
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-cover"
              />
            )
          )}
        </div>
      </Link>

      <p className="pt-4 text-ink-muted leading-relaxed max-w-[62ch]">
        {project.summary}
      </p>

      {project.tags.length > 0 && (
        <p className="pt-2 text-xs text-ink-faint">{project.tags.join(" · ")}</p>
      )}
    </section>
  );
}
