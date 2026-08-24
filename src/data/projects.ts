import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "resumetailor",
    title: "ResumeTailor",
    summary:
      "AI-powered resume & cover letter generator with job matching and auto-apply workflow.",
    tags: ["Next.js", "OpenAI", "PostgreSQL", "Tailwind"],
    // No links yet: the repo (eogbadu/job-matching-platform) is private, so a link
    // would 404 for visitors. Add `repo` when it goes public, and `url` when a live
    // demo exists. The card renders "Details coming soon" in the meantime.
    image: "/projects/resumetailor_3.png",
    featured: true,
  },
  {
    slug: "scout-plus-plus",
    title: "SCOUT++ Toolkit",
    summary:
      "Toolkit for multimodal HRI experiments and dataset benchmarking of instruction grounding.",
    tags: ["Python", "PyTorch", "Vision-Language", "Evaluation"],
    repo: "https://github.com/eogbadu/SCOUT-plus-plus",
    image: "/projects/scout.png",
    featured: true,
  },
  {
    slug: "fsr-release-planner",
    title: "FSR Release Planner",
    summary:
      "Constraint-aware scheduler for Field Service Representatives across multiple systems.",
    tags: ["TypeScript", "Algorithms", "UX"],
    image: "/projects/fsrplanner.png",
    featured: true,
  },
];
