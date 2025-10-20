import Image from "next/image";
import Link from "next/link";

import FeaturedProjects from "@/components/FeaturedProjects";
import FeaturedResearch from "@/components/FeaturedResearch";
import SocialLinks from "@/components/SocialLinks";
import Typewriter from "@/components/Typewriter";

export default function HomePage() {
  return (
    <>
      <section className="py-12 md:py-16">
        <div className="grid items-center gap-8 md:grid-cols-2">
          {/* Left: text content */}
          <div className="space-y-6">
            {/* 👇 Typewriter line */}
            <p className="text-3xl md:text-4xl font-semibold bg-gradient-to-r from-gray-300 via-cyan-500 to-gray-800 bg-clip-text text-transparent">
              <Typewriter
                words={[
                  "AI/ML Engineer",
                  "Computer Vision Engineer",
                  "AI/ML Researcher",
                  "Trustworthy AI Researcher",
                  "Computer Vision Researcher",
                  "HRI Researcher",
                ]}
                typingSpeed={100}
                deletingSpeed={60}
                pauseTime={2400}
                loop
              />
            </p>

            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Building trustworthy AI systems and delightful products
            </h1>

            <p className="text-slate-600 dark:text-slate-300 max-w-prose">
              I design, ship, and study AI systems — from secure RAG and
              evaluation harnesses to multimodal HRI research. Currently a
              Senior AI/ML Engineer (Associate) at Booz Allen and a graduate TA
              at UMBC.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/projects"
                className="rounded-2xl px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                See Projects
              </Link>

              <Link
                href="/contact"
                className="rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-5 py-2.5 text-sm font-semibold hover:opacity-90"
              >
                Get in Touch
              </Link>
            </div>
            {/* social links row */}
            <SocialLinks />
          </div>

          {/* Right: image */}
          <div className="mx-auto w-56 md:w-72">
            <div className="relative aspect-square">
              {/* soft glow background for depth */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/20 to-cyan-500/20 blur-2xl" />
              <Image
                src="/avatar.png" // put an image file in /public/avatar.jpg
                alt="Portrait"
                fill
                sizes="(min-width: 768px) 18rem, 14rem"
                className="relative z-10 rounded-full object-cover ring-4 ring-white dark:ring-slate-900 shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured strips */}
      <div className="space-y-12">
        <FeaturedProjects />
        <FeaturedResearch />
      </div>
    </>
  );
}
