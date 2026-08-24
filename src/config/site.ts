/**
 * Single source of truth for site-wide identity, navigation, and SEO defaults.
 *
 * Before this existed, these values were scattered across Navbar (nav links),
 * SocialLinks (social URLs), page.tsx (typewriter roles), Footer (name),
 * layout.tsx (title/description), and ResumeActions (résumé path) — so changing
 * any of them meant hunting through components.
 *
 * No secrets here. Environment values live in src/lib/env.ts.
 */

export type SocialIcon = "linkedin" | "github" | "scholar" | "email";

export interface NavLink {
  name: string;
  href: string;
}

export interface SocialLink {
  name: string;
  href: string;
  icon: SocialIcon;
  /** Brand color, applied on hover. */
  color: string;
}

export const siteConfig = {
  name: "Ekele Ogbadu",
  /** Short form used for the navbar brand. */
  shortName: "E. Ogbadu",

  /**
   * Canonical origin. The apex 307-redirects to www, so this MUST include www —
   * using the apex would emit canonicals that redirect and break OAuth callbacks.
   */
  url: "https://www.ekeleogbadu.io",

  title: "Ekele Ogbadu — AI/ML Engineer & Researcher",
  /** `%s` is replaced by each page's own title. */
  titleTemplate: "%s · Ekele Ogbadu",
  description:
    "AI/ML Engineer and researcher working on trustworthy AI, computer vision, and multimodal human-robot interaction.",

  locale: "en_US",
  /** Rendered as "© {year}–present". Static by design — see Footer. */
  copyrightStartYear: 2025,

  author: {
    name: "Ekele Ogbadu",
    email: "eogbadu1@umbc.edu",
    jobTitle: "Senior AI/ML Engineer",
    affiliation: "Booz Allen Hamilton · UMBC",
  },

  keywords: [
    "Ekele Ogbadu",
    "AI/ML Engineer",
    "Machine Learning Engineer",
    "Computer Vision",
    "Human-Robot Interaction",
    "Trustworthy AI",
    "Multimodal Learning",
    "UMBC",
  ],

  resumePdf: "/resume.pdf",
  avatar: "/avatar.png",

  nav: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Research", href: "/research" },
    { name: "Projects", href: "/projects" },
    { name: "Blog", href: "/blog" },
    { name: "Resume", href: "/resume" },
    { name: "Contact", href: "/contact" },
  ] satisfies NavLink[],

  social: [
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/in/ekele-ogbadu",
      icon: "linkedin",
      color: "#0A66C2",
    },
    {
      name: "GitHub",
      href: "https://github.com/eogbadu",
      icon: "github",
      color: "#181717",
    },
    {
      name: "Google Scholar",
      href: "https://scholar.google.com/citations?user=gO-0Q98AAAAJ&hl=en",
      icon: "scholar",
      color: "#4285F4",
    },
    {
      name: "Email",
      href: "mailto:eogbadu1@umbc.edu",
      icon: "email",
      color: "#EA4335",
    },
  ] satisfies SocialLink[],

  /** Rotating roles in the homepage hero. */
  roles: [
    "AI/ML Engineer",
    "Computer Vision Engineer",
    "AI/ML Researcher",
    "Trustworthy AI Researcher",
    "Computer Vision Researcher",
    "HRI Researcher",
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** Absolute URL for a site-relative path. Needed for canonicals and OG tags. */
export function absoluteUrl(path = "/"): string {
  return new URL(path, siteConfig.url).toString();
}
