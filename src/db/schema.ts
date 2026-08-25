import { sql } from "drizzle-orm";
import {
  check,
  char,
  date,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const postStatus = pgEnum("post_status", ["draft", "published"]);

/**
 * `tags` holds the author's display labels; `tag_slugs` holds tagToSlug() of each,
 * derived on write.
 *
 * Storing both is deliberate: slugToLabel() is a lossy guess that renders
 * "Trustworthy AI" as "Trustworthy Ai". Keeping the slugs makes the tag page a
 * single GIN-indexed lookup while the labels stay exactly as written.
 *
 * A normalized tags + post_tags join would be more correct for renames, but for
 * one author and tens of posts it is machinery with no payoff.
 */
export const posts = pgTable(
  "posts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 160 }).notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    excerpt: varchar("excerpt", { length: 400 }),
    /** MDX source. This is the source of truth; nothing stores rendered HTML. */
    body: text("body").notNull(),
    tags: text("tags").array().notNull().default(sql`'{}'::text[]`),
    tagSlugs: text("tag_slugs").array().notNull().default(sql`'{}'::text[]`),
    coverImage: text("cover_image"),
    status: postStatus("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    viewCount: integer("view_count").notNull().default(0),
  },
  (t) => [
    uniqueIndex("posts_slug_key").on(t.slug),
    index("posts_status_published_idx").on(t.status, t.publishedAt.desc()),
    index("posts_tag_slugs_idx").using("gin", t.tagSlugs),
    // Makes "published with no date" structurally impossible.
    check(
      "posts_published_needs_date",
      sql`${t.status} <> 'published' OR ${t.publishedAt} IS NOT NULL`
    ),
  ]
);

/**
 * One row per visitor per post per day.
 *
 * `visitor_hash` is sha256(ip | user-agent | rotating salt) — no raw IP is ever
 * stored, and because the salt includes the date it rotates daily on its own.
 */
export const postViews = pgTable(
  "post_views",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    visitorHash: char("visitor_hash", { length: 64 }).notNull(),
    day: date("day").notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [primaryKey({ columns: [t.postId, t.visitorHash, t.day] })]
);

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
