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

      {/*
        Column count follows the item count so the row always looks deliberate.
        Pulling the flagship out into its own block leaves two cards here, and two
        cards in a three-column grid read as a missing third rather than a pair.

        No `eager`: this strip sits below the fold, and preloading it would compete
        with the hero portrait, which is the actual LCP element.
      */}
      <ul
        className={`grid gap-x-8 gap-y-12 sm:grid-cols-2 ${
          featured.length >= 3 ? "lg:grid-cols-3" : ""
        }`}
      >
        {featured.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </ul>
    </section>
  );
}
