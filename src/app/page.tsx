import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import FeatureBlock from "@/components/FeatureBlock";
import FeaturedPosts from "@/components/FeaturedPosts";
import FeaturedProjects from "@/components/FeaturedProjects";
import FeaturedResearch from "@/components/FeaturedResearch";
import SocialLinks from "@/components/SocialLinks";
import Typewriter from "@/components/Typewriter";
import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/**
 * Dynamic because the blog preview reads the database. As a static route this
 * would be prerendered at build time, which would make `next build` depend on
 * the database — the coupling avoided everywhere else, where a Neon outage would
 * fail an unrelated deploy.
 *
 * Rendering per request costs little: the query is wrapped in unstable_cache, so
 * steady-state traffic still makes no database calls. Only the Full Route Cache
 * is given up. Same reasoning as /blog.
 */
export const dynamic = "force-dynamic";

export default function HomePage() {
  const flagship = projects.find((p) => p.featured);

  return (
    <>
      <section className="pb-12 sm:pb-16">
        <div className="grid items-center gap-10 md:grid-cols-[1.4fr_0.85fr]">
          <div className="space-y-6">
            <p className="eyebrow">
              {/* Reserves its line so the hero doesn't shift when typing starts. */}
              <Typewriter
                words={[...siteConfig.roles]}
                typingSpeed={100}
                deletingSpeed={60}
                pauseTime={2400}
                loop
              />
            </p>

            <h1 className="font-display text-[2.75rem] leading-[1.05] sm:text-6xl sm:leading-[1.03] tracking-[-0.015em]">
              Building trustworthy AI systems
              <span className="text-ink-muted"> and delightful products</span>
            </h1>

            <p className="text-lg leading-relaxed text-ink-muted max-w-[46ch]">
              I design, ship, and study AI systems — from agentic workflows and
              retrieval-augmented pipelines to multimodal human-robot interaction
              research. Currently a Lead AI/ML Engineer at Booz Allen Hamilton and a
              Ph.D. candidate at UMBC.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link
                href="/projects"
                className="rounded-full bg-ink text-paper px-5 py-2.5 text-sm font-medium hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 focus:ring-offset-paper"
              >
                See projects
              </Link>
              <Link
                href="/contact"
                className="rounded-full px-5 py-2.5 text-sm font-medium border border-rule text-ink-muted hover:text-ink hover:border-ink transition focus:outline-none focus:ring-2 focus:ring-accent"
              >
                Get in touch
              </Link>
            </div>

            <SocialLinks />
          </div>

          {/*
            Portrait, not an avatar: a 4:5 editorial crop rather than a circle with
            a blur glow behind it. A round headshot beside a headline is the most
            common personal-site layout there is, and it read as template.
          */}
          <div className="order-first md:order-last mx-auto w-40 sm:w-52 md:w-full md:max-w-[290px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-rule">
              <Image
                src={siteConfig.portrait}
                alt={siteConfig.name}
                fill
                sizes="(min-width: 768px) 290px, 13rem"
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Hard signals, for the recruiter who reads one screen and the peer who
          wants to know whether the research is real. */}
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-rule py-4 text-xs text-ink-faint">
        {siteConfig.credentials.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>

      <div className="space-y-20 pt-16">
        {flagship && <FeatureBlock project={flagship} />}
        <FeaturedProjects excludeSlug={flagship?.slug} />
        <FeaturedPosts limit={3} />
        <FeaturedResearch />
      </div>
    </>
  );
}
