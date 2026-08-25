import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/config/site";
import { projects } from "@/data/projects";
import { getPublishedPosts, getTagCounts } from "@/db/queries";

/**
 * Static routes plus blog posts and tag pages.
 *
 * Blog entries are derived from src/data/posts.ts today; Phase 10 swaps that for
 * the database while keeping this shape.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
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

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: absoluteUrl(`/projects/${p.slug}`),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Degrade gracefully: if the database is unreachable the sitemap still lists
  // every static route rather than failing outright.
  let postRoutes: MetadataRoute.Sitemap = [];
  let tagRoutes: MetadataRoute.Sitemap = [];

  try {
    const [published, tags] = await Promise.all([getPublishedPosts(), getTagCounts()]);

    postRoutes = published.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: p.publishedAt ?? undefined,
      changeFrequency: "yearly",
      priority: 0.6,
    }));

    tagRoutes = tags.map((t) => ({
      url: absoluteUrl(`/blog/tag/${t.slug}`),
      changeFrequency: "monthly",
      priority: 0.3,
    }));
  } catch (err) {
    console.error("[sitemap] could not load posts", err);
  }

  return [...staticRoutes, ...projectRoutes, ...postRoutes, ...tagRoutes];
}

/** Dynamic for the same reason as /blog: never read the database at build time. */
export const dynamic = "force-dynamic";
