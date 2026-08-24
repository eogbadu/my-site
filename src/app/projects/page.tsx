import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Selected engineering projects — AI-powered tools, multimodal research toolkits, and production ML systems.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-prose">
          A few things I’ve built or worked on recently.
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          // Only the first card is above the fold, so only it preloads.
          <ProjectCard key={p.slug} project={p} eager={i === 0} />
        ))}
      </ul>
    </section>
  );
}
