import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { requireDatabaseUrl } from "@/lib/env";
import * as schema from "./schema";

/**
 * `import "server-only"` above is the guard that keeps DATABASE_URL out of the
 * browser bundle: the build fails loudly if a client component ever imports this.
 * That matters more than usual here, because anything able to write posts.body
 * gets server-side code execution when that MDX is rendered.
 *
 * Uses the HTTP driver rather than WebSockets: one fetch per query, no connection
 * pooling to reason about, and identical behaviour in every runtime. The only
 * tradeoff is no interactive transactions, and nothing in this design needs one —
 * the view-count increment is a single CTE statement.
 */
export const db = drizzle(neon(requireDatabaseUrl()), { schema });

export { schema };
