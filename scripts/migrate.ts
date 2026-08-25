/**
 * Applies pending migrations. Run manually against each environment:
 *
 *   DATABASE_URL='<url>' npm run db:migrate
 *
 * Deliberately NOT wired into `next build`. Vercel builds can run concurrently,
 * and a failed migration would fail a deploy that had nothing to do with it.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set.");
  process.exit(1);
}

const host = new URL(url).host;
console.log(`Applying migrations to ${host} …`);

await migrate(drizzle(neon(url)), { migrationsFolder: "./drizzle" });
console.log("✓ migrations applied");
