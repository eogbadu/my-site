import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import FeaturedProjects from "@/components/FeaturedProjects";
import FeaturedResearch from "@/components/FeaturedResearch";
import SocialLinks from "@/components/SocialLinks";
import Typewriter from "@/components/Typewriter";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <section className="pb-16 sm:pb-20">
        <div className="grid items-center gap-10 md:grid-cols-[1.35fr_1fr]">
          <div className="space-y-6">
            <p className="eyebrow">
              {/* Reserves its line so the hero doesn't shift when the animation starts. */}
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

          <div className="order-first md:order-last mx-auto w-44 sm:w-56 md:w-full md:max-w-[300px]">
            <div className="relative aspect-square">
              <div className="absolute -inset-3 rounded-full bg-accent/10 blur-2xl" />
              <Image
                src={siteConfig.avatar}
                alt={siteConfig.name}
                fill
                sizes="(min-width: 768px) 300px, 14rem"
                priority
                className="relative z-10 rounded-full object-cover ring-1 ring-rule"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-20">
        <FeaturedProjects />
        <FeaturedResearch />
      </div>
    </>
  );
}
