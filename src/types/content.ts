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
