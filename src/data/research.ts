import type { Publication } from "@/types/content";

export const publications: Publication[] = [
  {
    slug: "grounded-instruction-llms",
    title:
      "Grounded Instruction Understanding with Large Language Models: Toward Trustworthy Human-Robot Interaction",
    authors: ["Ekele Ogbadu", "Stephanie Lukin", "Cynthia Matuszek"],
    venue: "AAAI Symposium Series 7(1), 223–231",
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
    slug: "ask-to-act",
    title:
      "Ask-to-Act: Learning When Robots Should Clarify Ambiguous Grounded Instructions",
    authors: ["Ekele A. Ogbadu", "Stephanie Lukin", "Cynthia Matuszek"],
    venue: "IEEE RO-MAN 2026",
    year: 2026,
    note: "Presenting August 2026",
    tags: ["HRI", "Grounded Language", "Ambiguity", "Uncertainty"],
    abstract:
      "Robots that follow natural-language instructions must decide not only what action to execute, but also whether the current evidence is sufficient to act at all. We present Ask-to-Act, a framework for grounded robot instruction following that treats clarification as a cost-sensitive decision under uncertainty. The system either executes immediately or requests one minimal grounding cue before acting. We evaluate Ask-to-Act on SCOUT++, a grounded HRI benchmark with command-label-image examples from situated human-robot interaction. In a text-only setting, Ask-to-Act improves grounded action prediction from 0.8225 to 0.8308 accuracy while asking in 0.2350 of episodes. In a multimodal setting, command-time visual grounding improves the always-act baseline to 0.8503 accuracy, and Ask-to-Act further improves accuracy to 0.8545 while asking in 0.1277 of episodes. These results show that Ask-to-Act can adapt its interaction rate to the available evidence.",
    links: {
      pdf: "/papers/ask-to-act-roman-2026.pdf",
    },
    featured: true,
  },
];
