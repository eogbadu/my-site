import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "resumetailor",
    title: "ResumeTailor",
    summary:
      "AI-powered resume & cover letter generator with job matching and auto-apply workflow.",
    tags: ["Next.js", "OpenAI", "PostgreSQL", "Tailwind"],
    url: "https://example.com", // replace later
    repo: "https://github.com/yourhandle/resumetailor", // optional
    image: "/projects/resumetailor_3.png", // add later
    featured: true,
  },
  {
    slug: "scout-plus-plus",
    title: "SCOUT++ Toolkit",
    summary:
      "Toolkit for multimodal HRI experiments and dataset benchmarking of instruction grounding.",
    tags: ["Python", "PyTorch", "Vision-Language", "Evaluation"],
    repo: "https://github.com/yourhandle/scout-plus-plus",
    image: "/projects/scout.png", // add later
    featured: true,
  },
  {
    slug: "fsr-release-planner",
    title: "FSR Release Planner",
    summary:
      "Constraint-aware scheduler for Field Service Representatives across multiple systems.",
    tags: ["TypeScript", "Algorithms", "UX"],
    image: "/projects/fsrplanner.png", // add later
    featured: true,
  },
];
