/**
 * Seeds the existing hello-world post into the database.
 *
 *   DATABASE_URL='<url>' npm run db:seed
 *
 * Idempotent via ON CONFLICT DO NOTHING, so it is safe to re-run.
 *
 * MUST be run and verified before the Phase 10 cutover deploys. /blog/hello-world
 * is a live, indexed URL; if the row is missing when the static .mdx file is
 * deleted, that URL 404s.
 */
import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { sql } from "drizzle-orm";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const db = drizzle(neon(url));

// Strip the `export const metadata = {…}` block: that was the .mdx route file's
// way of setting the page title, and those fields become real columns here.
const raw = readFileSync("src/app/blog/hello-world/page.mdx", "utf8");
const body = raw.replace(/^export const metadata\s*=\s*\{[\s\S]*?\};\s*/m, "").trim();

const post = {
  slug: "hello-world",
  title: "Hello, World (Why I’m Blogging)",
  excerpt: "How I plan to use this space and what to expect.",
  body,
  tags: ["meta"],
  tagSlugs: ["meta"],
  publishedAt: new Date("2025-10-19T00:00:00Z"),
};

const result = await db.execute(sql`
  INSERT INTO posts (slug, title, excerpt, body, tags, tag_slugs, status, published_at)
  VALUES (
    ${post.slug}, ${post.title}, ${post.excerpt}, ${post.body},
    ${post.tags}, ${post.tagSlugs}, 'published', ${post.publishedAt}
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING slug
`);

const inserted = result.rows?.length ?? 0;
console.log(
  inserted > 0
    ? `✓ seeded "${post.slug}" (${body.length} chars of MDX)`
    : `• "${post.slug}" already present — nothing to do`
);

const check = await db.execute(sql`SELECT slug, status FROM posts ORDER BY published_at DESC`);
console.log("\nposts now in the database:");
for (const row of check.rows ?? []) console.log(`  ${row.status}\t${row.slug}`);
