import type { ResumeData } from "@/types/content";

export const resume: ResumeData = {
  name: "Ekele Ogbadu",
  tagline: "AI/ML Engineer • Researcher • Builder",
  summary:
    "I design, ship, and study AI systems — from secure RAG and evaluation harnesses to multimodal HRI research.",
  sections: [
    {
      heading: "Experience",
      items: [
        {
          title: "Senior AI/ML Engineer (Associate)",
          org: "Booz Allen Hamilton",
          location: "Remote",
          period: "2025 — Present",
          bullets: [
            "Shipped secure RAG + LLM evaluation tied to business KPIs.",
            "Led model hardening: observability, CI/CD, data/versioning.",
          ],
        },
        {
          title: "Graduate TA / Research Assistant",
          org: "UMBC IRL Lab",
          location: "Baltimore, MD",
          period: "2024 — Present",
          bullets: [
            "Built SCOUT++ dataset; evaluated VLMs for instruction grounding.",
            "Designed graduate AI homework sets and rubrics.",
          ],
        },
      ],
    },
    {
      heading: "Education",
      items: [
        {
          title: "M.S. (in progress), Computer Science",
          org: "University of Maryland, Baltimore County",
          period: "2024 — Present",
        },
      ],
    },
    {
      heading: "Skills",
      items: [
        {
          title: "Languages & Tools",
          bullets: [
            "TypeScript, Python, Node.js, Next.js, Tailwind CSS",
            "PyTorch, TensorFlow, PostgreSQL",
            "AWS, Docker, CI/CD",
          ],
        },
      ],
    },
  ],
};
