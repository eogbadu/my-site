import type { MDXComponents } from "mdx/types";
import { mdxComponents } from "@/components/mdx-components";

/**
 * Next.js convention file. It must live at the project root or in `src/`, and it
 * must export `useMDXComponents` by name — the previous version was at
 * `src/app/mdx-components.tsx` with a default export, so it was never picked up
 * and MDX pages rendered unstyled.
 *
 * This shim exists only for @next/mdx. It is removed once blog posts move to the
 * database and are rendered at runtime instead of as `.mdx` route files.
 */
export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return { ...mdxComponents, ...components };
}
