import ProjectCard from "@/components/ProjectCard";
import { projects } from "@/data/projects";

export default function FeaturedProjects() {
  const featured = projects.filter((p) => p.featured);

  if (featured.length === 0) return null;

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-2xl font-semibold">Featured Projects</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          A snapshot of recent work. See more on the{" "}
          <a className="underline underline-offset-4" href="/projects">
            Projects
          </a>{" "}
          page.
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {featured.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </ul>
    </section>
  );
}
