import type { Config } from "drizzle-kit";

/**
 * Migrations are generated here but applied manually via `npm run db:migrate`.
 * They deliberately never run during `next build`: Vercel builds can run
 * concurrently, and a failed migration would fail an unrelated deploy.
 */
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
