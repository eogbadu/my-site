import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/config/site";
import { posts } from "@/data/posts";
import { tagToSlug } from "@/lib/tags";

/**
 * Static routes plus blog posts and tag pages.
 *
 * Blog entries are derived from src/data/posts.ts today; Phase 10 swaps that for
 * the database while keeping this shape.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/about"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/projects"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/research"), changeFrequency: "monthly", priority: 0.9 },
    { url: absoluteUrl("/resume"), changeFrequency: "monthly", priority: 0.8 },
    { url: absoluteUrl("/blog"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/blog/tag"), changeFrequency: "monthly", priority: 0.4 },
    { url: absoluteUrl("/contact"), changeFrequency: "yearly", priority: 0.5 },
  ];

  const published = posts.filter((p) => !p.draft);

  const postRoutes: MetadataRoute.Sitemap = published.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const tagRoutes: MetadataRoute.Sitemap = Array.from(
    new Set(published.flatMap((p) => p.tags ?? []).map(tagToSlug))
  ).map((tag) => ({
    url: absoluteUrl(`/blog/tag/${tag}`),
    changeFrequency: "monthly",
    priority: 0.3,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}

export const revalidate = 3600;
