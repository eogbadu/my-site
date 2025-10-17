import type { Publication } from "@/types/content";

export const publications: Publication[] = [
  {
    slug: "grounded-instruction-llms",
    title:
      "Grounded Instruction Understanding with Large Language Models: Toward Trustworthy Human-Robot Interaction",
    authors: ["E. Ogbadu", "Co-authors"],
    venue: "AAAI 2025 Fall Symposium",
    year: 2025,
    tags: ["HRI", "VLM", "Trustworthy AI"],
    links: {
      pdf: "/papers/grounded-instruction-llms.pdf", // put file later under /public/papers/
      // doi: "https://doi.org/...",                 // add when you have it
      // code: "https://github.com/...",             // optional
    },
    abstract:
      "We study how grounding LLMs in visual context improves a robot’s ability to interpret and execute natural-language instructions reliably.",
    featured: true,
  },
  {
    slug: "scout-plus-plus-dataset",
    title: "SCOUT++: A Multimodal Benchmark for Instruction Grounding in HRI",
    authors: ["E. Ogbadu"],
    venue: "Preprint",
    year: 2025,
    tags: ["Dataset", "Multimodal", "Benchmark"],
    // links: { pdf: "https://arxiv.org/abs/..." },
  },
];
