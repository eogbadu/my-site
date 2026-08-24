import type { Metadata } from "next";
import { buildMetadata } from "@/lib/metadata";
import { projects } from "@/data/projects";
import ProjectCard from "@/components/ProjectCard";
import SectionHeader from "@/components/SectionHeader";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Selected engineering projects — AI-powered tools, multimodal research toolkits, and production ML systems.",
  path: "/projects",
});

export default function ProjectsPage() {
  return (
    <section>
      <SectionHeader
        as="h1"
        eyebrow="Portfolio"
        title="Projects"
        description="Products, research tooling, and internal systems — a few things I have built or worked on recently."
      />

      <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          // Only the first card is above the fold, so only it preloads.
          <ProjectCard key={p.slug} project={p} eager={i === 0} index={i} />
        ))}
      </ul>
    </section>
  );
}
