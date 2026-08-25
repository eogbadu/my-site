// Avoid 'any' — keep shapes explicit and reusable.

export interface ProjectLink {
  label: string;
  href: string;
}

export interface GalleryImage {
  src: string;
  alt: string;
  caption?: string;
}

export interface Project {
  slug: string; // used for links and as the /projects/[slug] route segment
  title: string;
  summary: string; // 1–2 sentences, used on cards
  tags: string[]; // short filter facets, e.g., ["Next.js", "PostgreSQL"]
  url?: string; // live site (optional)
  repo?: string; // GitHub link (optional)
  image?: string; // path under /public (optional), e.g., "/projects/resumetailor_3.webp"
  imageAlt?: string; // describes the image; falls back to the title if absent
  video?: string; // demo video under /public, e.g. "/video/timesense-demo.mp4"
  videoPoster?: string; // still shown before the video plays
  featured?: boolean; // highlight on homepage (optional)

  // --- detail page (/projects/[slug]) ---
  year?: string; // "2026" or "2024—2025"
  role?: string; // "Solo build" | "Lead engineer"
  status?: "active" | "shipped" | "archived";
  stack?: string[]; // full technology list; `tags` stays the short facet set
  highlights?: string[]; // 3–5 bullets
  body?: string; // long-form description, plain paragraphs split on blank lines
  gallery?: GalleryImage[];
  links?: ProjectLink[]; // extra links beyond url/repo
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
  /** Short status line, e.g. "Presenting 27 Aug 2026". Rendered as an accent badge. */
  note?: string;
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
