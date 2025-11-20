import type { Publication } from "@/types/content";

export const publications: Publication[] = [
  {
    slug: "grounded-instruction-llms",
    title:
      "Grounded Instruction Understanding with Large Language Models: Toward Trustworthy Human-Robot Interaction",
    authors: ["E. Ogbadu", "S. Lukin", "C. Matuszek"],
    venue: "AAAI 2025 Fall Symposium",
    year: 2025,
    tags: ["HRI", "VLM", "Trustworthy AI"],
    links: {
      pdf: "/papers/grounded-instruction-llms.pdf", // put file later under /public/papers/
      // doi: "https://doi.org/...",                 // add when you have it
      // code: "https://github.com/...",             // optional
    },
    abstract:
      "Understanding natural language as a representational bridge between perception and action is critical for deploying autonomous robots in complex, high-risk environments. This work investigates how large language models (LLMs) can support this bridge by interpreting unconstrained human instructions in urban disaster response scenarios. Leveraging the SCOUT corpus, a multimodal dataset capturing human-robot dialogue through Wizard-of-Oz experiments, we construct SCOUT++, aligning over 11,000 visual frames with language commands and robot actions. We evaluate three instruction classification approaches: a neural network trained on tokenized text, GPT-4 using text alone, and GPT-4 with synchronized visual input. Results show that while GPT-4 (text-only) outperforms traditional models in accuracy, its multimodal variant exhibits degraded performance, often producing vague or hallucinated outputs. These findings expose the challenges of reliably grounding language in visual context and raise questions about the trustworthiness of foundation models in safety-critical settings. We contribute SCOUT++, a reproducible multimodal pipeline, and benchmark results that shed light on the capabilities and current limitations of vision-language models for risk-sensitive human-robot interaction.",
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
