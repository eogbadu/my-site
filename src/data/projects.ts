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
    imageAlt:
      "Three TimeSense app screens: the reasoning behind a recommendation, the Now screen suggesting a 60-minute gym session, and weekly activity insights",
    video: "/video/timesense-demo.mp4",
    videoPoster: "/video/timesense-demo-poster.webp",
    featured: true,
    year: "2026",
    role: "Solo build",
    status: "active",
    stack: [
      "Swift / SwiftUI (iOS)",
      "Kotlin / Jetpack Compose (Android)",
      "FastAPI",
      "PostgreSQL",
      "Redis + Celery",
      "Firebase Auth",
      "Stripe · StoreKit · Play Billing",
      "Provider-agnostic LLM layer",
    ],
    highlights: [
      "Native on both platforms — SwiftUI and Jetpack Compose, not a web wrapper. The web companion handles account setup and billing, not daily use.",
      "Recommends a single best next action from calendar, location, time of day, priority, and observed energy, with a confidence score attached.",
      "Every suggestion is explainable: the app shows which signals drove it and which alternatives it considered and rejected.",
      "Learns from accepted and rejected suggestions, so recommendations sharpen as history accumulates.",
      "The LLM layer is provider-agnostic, so the reasoning backend can be swapped without touching product code.",
    ],
    body: `TimeSense started from a simple observation: most productivity tools add work. They ask you to maintain lists, tag tasks, and groom backlogs — and the maintenance quietly becomes another job.

TimeSense inverts that. It reads the signals already around you — calendar, location, time of day, activity, sleep — and answers one question: what should I do right now? You can accept or reject its suggestion, and that feedback is the only input it really needs.

The explainability work matters most to me. A recommendation you cannot interrogate is one you will not trust, so every suggestion opens into the signals behind it and the alternatives that were weighed. That connects directly to my research on trustworthy AI: a system that hedges or hallucinates its reasoning is worse than one that says less but means it.`,
    links: [{ label: "Demo video", href: "/video/timesense-demo.mp4" }],
  },
  {
    slug: "resumetailor",
    title: "ResumeTailor",
    summary:
      "AI-powered resume & cover letter generator with job matching and auto-apply workflow.",
    tags: ["Next.js", "OpenAI", "PostgreSQL", "Tailwind"],
    repo: "https://github.com/eogbadu/job-matching-platform",
    image: "/projects/resumetailor_3.webp",
    imageAlt:
      "ResumeTailor logo — a gold document icon with a person and a star, on black",
    featured: true,
    year: "2025",
    role: "Solo build",
    status: "active",
    stack: ["Next.js", "TypeScript", "PostgreSQL", "OpenAI API", "Tailwind CSS"],
    highlights: [
      "Generates tailored resumes and cover letters against a specific job posting rather than producing one generic document.",
      "Matches candidate history to postings and surfaces the gaps worth addressing.",
      "Streamlines the apply workflow so iterating on an application is cheap.",
    ],
    gallery: [
      {
        src: "/projects/resumetailor_1.webp",
        alt: "ResumeTailor branding treatment, gold on black",
      },
      {
        src: "/projects/resumetailor_2.webp",
        alt: "Alternate ResumeTailor branding treatment",
      },
    ],
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
    year: "2025",
    role: "Lead researcher",
    status: "active",
    stack: ["Python", "PyTorch", "TensorFlow", "OpenCV", "ROS", "GPT-4"],
    highlights: [
      "Reconstructed and extended the SCOUT corpus into a standardized set of 11,000+ timestamp-aligned images and 2,474 dialogue pairs.",
      "Benchmarks three instruction-classification approaches: a neural baseline, GPT-4 text-only, and GPT-4 with synchronized vision.",
      "Found that the multimodal variant *underperformed* the text-only one, producing vague or hallucinated outputs — a result worth reporting precisely because it cuts against expectations.",
      "Reproducible pipeline for preprocessing, feature engineering, and experiment orchestration.",
    ],
    body: `SCOUT++ supports research into how well vision-language models actually ground natural-language instructions in what a robot can see.

The headline finding is a negative one. Adding synchronized visual input to GPT-4 *degraded* instruction-classification accuracy relative to text alone, with the multimodal variant more prone to vague or hallucinated outputs. For safety-critical settings like urban disaster response, that is exactly the kind of result that needs publishing rather than tuning away.`,
    links: [
      { label: "Related paper (PDF)", href: "/papers/grounded-instruction-llms.pdf" },
    ],
  },
  {
    slug: "fsr-release-planner",
    title: "FSR Release Planner",
    summary:
      "Constraint-aware scheduler for Field Service Representatives across multiple systems.",
    tags: ["TypeScript", "Algorithms", "UX"],
    image: "/projects/fsrplanner.webp",
    imageAlt: "FSR ToolPlanner logo — a gold calendar and wrench icon on dark green",
    year: "2024—2025",
    role: "Senior Agile Engineer & Release Manager",
    status: "shipped",
    stack: ["TypeScript", "Constraint solving", "Scheduling heuristics"],
    highlights: [
      "Coordinates Field Service Representative assignments across multiple systems under real scheduling constraints.",
      "Built while leading release management, to remove the manual coordination that was slowing delivery.",
    ],
  },
];
