// Avoid 'any' — keep shapes explicit and reusable.
export interface Project {
  slug: string; // used for links or keys (e.g., "resumetailor")
  title: string;
  summary: string; // 1–2 sentences, used on cards
  tags: string[]; // e.g., ["Next.js", "PostgreSQL"]
  url?: string; // external link (optional)
  repo?: string; // GitHub link (optional)
  image?: string; // path under /public (optional), e.g., "/projects/resumetailor.png"
  featured?: boolean; // highlight on homepage (optional)
}

export interface Publication {
  slug: string; // short id, used as key and future routes (e.g., "grounded-instruction-llms")
  title: string;
  authors: string[]; // ["E. Ogbadu", "C. Matuszek", ...]
  venue: string; // "AAAI Fall Symposium"
  year: number; // 2025
  tags?: string[]; // ["HRI", "VLM", "Trustworthy AI"]
  links?: {
    pdf?: string; // "/papers/giullm.pdf" or external URL
    doi?: string; // "https://doi.org/..."
    code?: string; // repo link
    poster?: string; // asset link (optional)
    slides?: string; // asset link (optional)
    video?: string; // talk/demo video
  };
  abstract?: string; // optional short summary
  featured?: boolean; // for highlighting on home later
}

export interface ResumeItem {
  title: string;
  org?: string;
  location?: string;
  period?: string; // e.g. "2025 — Present"
  bullets?: string[]; // short points
}

export interface ResumeData {
  name: string;
  tagline?: string;
  summary?: string;
  sections: Array<{
    heading: string;
    items: ResumeItem[];
  }>;
}
