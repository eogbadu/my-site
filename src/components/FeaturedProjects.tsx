import ProjectCard from "@/components/ProjectCard";
import SectionHeader from "@/components/SectionHeader";
import { projects } from "@/data/projects";

export default function FeaturedProjects({
  /** Slug already shown in the flagship feature block, to avoid repeating it. */
  excludeSlug,
}: {
  excludeSlug?: string;
} = {}) {
  const featured = projects.filter((p) => p.featured && p.slug !== excludeSlug);
  if (featured.length === 0) return null;

  return (
    <section>
      <SectionHeader
        eyebrow="Selected work"
        title="More work"
        description="Things I have designed, built, and shipped."
        action={{ href: "/projects", label: "All projects" }}
      />

      {/* No `eager` here: this strip sits below the fold, and preloading it would
          compete with the hero portrait, which is the actual LCP element. */}
      <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </ul>
    </section>
  );
}
