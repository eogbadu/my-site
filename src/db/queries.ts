import "server-only";

import { and, desc, eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db } from "./index";
import { posts } from "./schema";

/**
 * Every read is wrapped in unstable_cache and tagged, so steady-state traffic
 * costs zero database queries and publishing invalidates precisely.
 *
 * `revalidate` is a safety net, not the mechanism — tags do the real work via
 * revalidateBlog() in src/lib/revalidate.ts.
 *
 * Not `use cache` / cacheLife: those are canary-only in Next 15.5 and this is a
 * live site.
 */
const HOUR = 3600;

/**
 * `publishedAt` is an ISO string, not a Date.
 *
 * unstable_cache serialises its return value to JSON, so a Date survives the
 * first call and comes back as a string on every cache hit. Typing it as Date
 * was a lie that only surfaced as `publishedAt.toISOString is not a function`
 * once a real database was attached. Returning a string makes the serialisation
 * boundary explicit and the failure impossible.
 */
export type PostListItem = {
  slug: string;
  title: string;
  excerpt: string | null;
  tags: string[];
  tagSlugs: string[];
  publishedAt: string | null;
  viewCount: number;
};

export type PostDetail = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string;
  tags: string[];
  tagSlugs: string[];
  publishedAt: string | null;
  viewCount: number;
};

/** Normalises whatever the driver returns into an ISO string. */
function iso(value: Date | string | null): string | null {
  if (!value) return null;
  return value instanceof Date ? value.toISOString() : value;
}

const listColumns = {
  slug: posts.slug,
  title: posts.title,
  excerpt: posts.excerpt,
  tags: posts.tags,
  tagSlugs: posts.tagSlugs,
  publishedAt: posts.publishedAt,
  viewCount: posts.viewCount,
};

export const getPublishedPosts = unstable_cache(
  async (): Promise<PostListItem[]> => {
    const rows = await db
      .select(listColumns)
      .from(posts)
      .where(eq(posts.status, "published"))
      .orderBy(desc(posts.publishedAt));
    return rows.map((r) => ({ ...r, publishedAt: iso(r.publishedAt) }));
  },
  ["published-posts"],
  { revalidate: HOUR, tags: ["posts"] }
);

export const getPostBySlug = (slug: string) =>
  unstable_cache(
    async (): Promise<PostDetail | null> => {
      const rows = await db
        .select()
        .from(posts)
        .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
        .limit(1);
      const r = rows[0];
      if (!r) return null;
      return {
        id: r.id,
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        body: r.body,
        tags: r.tags,
        tagSlugs: r.tagSlugs,
        publishedAt: iso(r.publishedAt),
        viewCount: r.viewCount,
      };
    },
    ["post", slug],
    { revalidate: HOUR, tags: ["posts", `post:${slug}`] }
  )();

export const getPostsByTagSlug = (tagSlug: string) =>
  unstable_cache(
    async (): Promise<PostListItem[]> => {
      const rows = await db
        .select(listColumns)
        .from(posts)
        .where(
          and(
            eq(posts.status, "published"),
            // GIN-indexed array containment
            sql`${posts.tagSlugs} @> ARRAY[${tagSlug}]::text[]`
          )
        )
        .orderBy(desc(posts.publishedAt));
      return rows.map((r) => ({ ...r, publishedAt: iso(r.publishedAt) }));
    },
    ["posts-by-tag", tagSlug],
    { revalidate: HOUR, tags: ["posts"] }
  )();

export type TagCount = { slug: string; label: string; count: number };

/**
 * Counts posts per tag. Returns the author's original label alongside the slug so
 * the tag page never has to guess it back from the slug.
 */
export const getTagCounts = unstable_cache(
  async (): Promise<TagCount[]> => {
    const rows = await db.execute<{ slug: string; label: string; count: string }>(sql`
      SELECT s.slug, MIN(t.label) AS label, COUNT(*)::text AS count
      FROM ${posts} p,
           LATERAL unnest(p.tag_slugs) WITH ORDINALITY AS s(slug, ord),
           LATERAL unnest(p.tags)      WITH ORDINALITY AS t(label, ord)
      WHERE p.status = 'published' AND s.ord = t.ord
      GROUP BY s.slug
      ORDER BY s.slug
    `);
    return (rows.rows ?? []).map((r) => ({
      slug: r.slug,
      label: r.label,
      count: Number(r.count),
    }));
  },
  ["tag-counts"],
  { revalidate: HOUR, tags: ["posts"] }
);

/** Admin listing: every post regardless of status. Never cached. */
export async function getAllPostsForAdmin() {
  return db
    .select({
      id: posts.id,
      slug: posts.slug,
      title: posts.title,
      status: posts.status,
      publishedAt: posts.publishedAt,
      updatedAt: posts.updatedAt,
      viewCount: posts.viewCount,
    })
    .from(posts)
    .orderBy(desc(posts.updatedAt));
}

export async function getPostById(id: string) {
  const rows = await db.select().from(posts).where(eq(posts.id, id)).limit(1);
  return rows[0] ?? null;
}
