import remarkGfm from "remark-gfm";

import { rejectEsm } from "./mdx-guards";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * TRUST MODEL — read before changing anything here.
 *
 * MDX is not data, it is a program. It compiles to JavaScript and is evaluated
 * with `new Function` in the Node server runtime. So the question is never "can
 * this XSS a visitor" — it is "who can write posts.body, because that person has
 * server-side code execution".
 *
 * Write paths to posts.body, all closed:
 *   1. The admin server actions — gated by requireAdmin() on every one.
 *   2. Anyone holding DATABASE_URL — kept server-only via `import "server-only"`
 *      in src/db/index.ts, which fails the build if a client component imports it.
 *      Never prefix any database or auth variable with NEXT_PUBLIC_.
 *   3. SQL injection — Drizzle parameterises everything. Never string-concatenate
 *      into sql``.
 *
 * With those closed the trust level is "code Ekele wrote", the same as the rest
 * of the repo. That is a coherent position for a single-author blog.
 *
 * WHAT DOES NOT HELP: rehype-sanitize. It runs on the HAST *after* compilation,
 * by which point any {expression} has already executed. Sanitisation defends
 * against untrusted *markup*, not untrusted *MDX*. Do not add it here and assume
 * the problem is solved.
 *
 * IF THE TRUST MODEL EVER CHANGES — a second author, guest posts, comments — the
 * correct migration is to switch `format` below from "mdx" to "md", which
 * disables JSX and expression evaluation entirely while keeping GFM, and to add
 * rehype-sanitize on that separate pipeline. That is a one-line change here.
 *
 * Also: these routes must stay on the Node runtime. Never set
 * `export const runtime = "edge"` on a page that renders post content.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const mdxOptions = {
  format: "mdx" as const,
  remarkPlugins: [remarkGfm, rejectEsm],
  rehypePlugins: [],
};

/**
 * Compiles a body without rendering it, to check it is valid.
 *
 * Primarily a reliability control: a post that fails to compile would 500
 * /blog/[slug] for every visitor, so the save action refuses to store it.
 * Secondarily it is where the no-imports guard fires at authoring time rather
 * than at read time.
 */
export async function validateMdx(
  source: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { compile } = await import("@mdx-js/mdx");
    await compile(source, {
      format: mdxOptions.format,
      remarkPlugins: mdxOptions.remarkPlugins,
      rehypePlugins: mdxOptions.rehypePlugins,
    });
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Could not compile this content.",
    };
  }
}
