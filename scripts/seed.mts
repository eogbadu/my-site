/**
 * Seeds the original hello-world post into the database.
 *
 *   DATABASE_URL='<url>' npm run db:seed
 *
 * Idempotent via ON CONFLICT DO NOTHING, so it is safe to re-run.
 *
 * MUST be run and verified before the Phase 10 cutover deploys. /blog/hello-world
 * is a live, indexed URL, and the cutover deletes the static .mdx file that
 * currently serves it. No row here means that URL 404s.
 *
 * The body is inlined rather than read from src/app/blog/hello-world/page.mdx on
 * purpose: that file is deleted by the very commit this seed exists to support,
 * so reading it would only work before the cutover and fail afterwards. Content
 * is copied verbatim from the file, minus its `export const metadata` block —
 * those fields are real columns here.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { desc } from "drizzle-orm";

import { posts } from "../src/db/schema.ts";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const db = drizzle(neon(url));

const body = `# Hello, World 👋

Welcome to the blog! I’ll share progress logs, AI notes, and project breakdowns.

- Why now
- What I’m building
- How I’ll keep posts concise

\`\`\`ts
// Example snippet (rendered with our <pre>/<code> styles)
function greet(name: string) {
  return \`Hello, \${name}!\`;
}
\`\`\`
`;

const post = {
  slug: "hello-world",
  title: "Hello, World (Why I’m Blogging)",
  excerpt: "How I plan to use this space and what to expect.",
  tags: ["meta"],
  tagSlugs: ["meta"],
  publishedAt: new Date("2025-10-19T00:00:00Z"),
};

// Drizzle's typed insert, not a raw sql`` template: the raw template sends a JS
// array as a plain string, which Postgres rejects with
// "Array value must start with { or dimension information".
const inserted = await db
  .insert(posts)
  .values({ ...post, body, status: "published" })
  .onConflictDoNothing({ target: posts.slug })
  .returning({ slug: posts.slug });

console.log(
  inserted.length > 0
    ? `✓ seeded "${post.slug}" (${body.length} chars of MDX)`
    : `• "${post.slug}" already present — nothing to do`
);

const all = await db
  .select({
    slug: posts.slug,
    status: posts.status,
    publishedAt: posts.publishedAt,
    tags: posts.tags,
  })
  .from(posts)
  .orderBy(desc(posts.publishedAt));

console.log("\nposts now in the database:");
for (const r of all) {
  console.log(
    `  ${r.status}\t${r.slug}\t${r.publishedAt?.toISOString().slice(0, 10)}\t[${r.tags.join(", ")}]`
  );
}
