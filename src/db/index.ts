import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import { requireDatabaseUrl } from "@/lib/env";
import * as schema from "./schema";

/**
 * `import "server-only"` is the guard that keeps DATABASE_URL out of the browser
 * bundle: the build fails loudly if a client component ever imports this. That
 * matters more than usual, because anything able to write posts.body gets
 * server-side code execution when that MDX is later rendered.
 *
 * Uses the HTTP driver rather than WebSockets: one fetch per query, no pooling to
 * reason about, identical behaviour in every runtime. Its lack of interactive
 * transactions costs nothing here — every write is a single statement.
 */
type Db = ReturnType<typeof drizzle<typeof schema>>;

let instance: Db | null = null;

function getDb(): Db {
  if (!instance) {
    instance = drizzle(neon(requireDatabaseUrl()), { schema });
  }
  return instance;
}

/**
 * Lazily initialised on first query, NOT at module import.
 *
 * This is load-bearing: Next collects page data for every route at build time,
 * which imports this module. Connecting eagerly made `next build` fail whenever
 * DATABASE_URL was absent — exactly the coupling that was supposed to be avoided,
 * so that a database outage can never fail a deploy and CI can build without
 * secrets.
 */
export const db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    return Reflect.get(getDb(), prop, receiver);
  },
});

export { schema };
