import type { Root } from "mdast";

/**
 * Remark plugin that rejects `import` / `export` statements in a post body.
 *
 * MDX compiles to JavaScript and is evaluated server-side, so a body that can
 * import a module can reach `node:fs`, `node:child_process`, and process.env —
 * which holds DATABASE_URL, SMTP_PASS, and AUTH_SECRET.
 *
 * The trust boundary is already "only the allowlisted admin can write posts.body"
 * (see src/lib/mdx.ts). This guard exists so that a mistake in that boundary
 * cannot escalate from "someone edited a post" to "someone ran code": with no
 * imports available, an injected body has almost nothing to reach for.
 *
 * Applied in both the render path and the save-validation path.
 */
export function rejectEsm() {
  return (tree: Root) => {
    for (const node of tree.children as Array<{ type: string }>) {
      if (node.type === "mdxjsEsm") {
        throw new Error(
          "import/export statements are not allowed in post content."
        );
      }
    }
  };
}
