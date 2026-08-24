import type { Project } from "@/types/content";

export const projects: Project[] = [
  {
    slug: "timesense",
    title: "TimeSense",
    summary:
      "Mobile-first, context-aware personal time assistant. Learns your routines, commute, meals, sleep, and calendar to tell you what to do next — without making you maintain another productivity system.",
    tags: ["Swift", "Kotlin", "FastAPI", "PostgreSQL", "LLM"],
    repo: "https://github.com/eogbadu/TimeSense",
    image: "/projects/timesense.webp",
    video: "/video/timesense-demo.mp4",
    videoPoster: "/video/timesense-demo-poster.webp",
    imageAlt:
      "Three TimeSense app screens: the reasoning behind a recommendation, the Now screen suggesting a 60-minute gym session, and weekly activity insights",
    featured: true,
  },
  {
    slug: "resumetailor",
    title: "ResumeTailor",
    summary:
      "AI-powered resume & cover letter generator with job matching and auto-apply workflow.",
    tags: ["Next.js", "OpenAI", "PostgreSQL", "Tailwind"],
    // No links yet: the repo (eogbadu/job-matching-platform) is private, so a link
    // would 404 for visitors. Add `repo` when it goes public, and `url` when a live
    // demo exists. The card renders "Details coming soon" in the meantime.
    image: "/projects/resumetailor_3.webp",
    imageAlt:
      "ResumeTailor logo — a gold document icon with a person and a star, on black",
    featured: true,
  },
  {
    slug: "scout-plus-plus",
    title: "SCOUT++ Toolkit",
    summary:
      "Toolkit for multimodal HRI experiments and dataset benchmarking of instruction grounding.",
    tags: ["Python", "PyTorch", "Vision-Language", "Evaluation"],
    repo: "https://github.com/eogbadu/SCOUT-plus-plus",
    image: "/projects/scout.webp",
    imageAlt:
      "SCOUT++ Tool Kit illustration — hand tools arranged in an open leather case",
    featured: true,
  },
  {
    slug: "fsr-release-planner",
    title: "FSR Release Planner",
    summary:
      "Constraint-aware scheduler for Field Service Representatives across multiple systems.",
    tags: ["TypeScript", "Algorithms", "UX"],
    image: "/projects/fsrplanner.webp",
    imageAlt: "FSR ToolPlanner logo — a gold calendar and wrench icon on dark green",
    featured: true,
  },
];
