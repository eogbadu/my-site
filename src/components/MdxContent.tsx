import { MDXRemote } from "next-mdx-remote/rsc";

import { mdxComponents } from "@/components/mdx-components";
import { mdxOptions } from "@/lib/mdx";

/**
 * Renders a post body stored in the database.
 *
 * Server component — adds zero client JavaScript. Reuses the same styled element
 * map as the file-based MDX pipeline, so restyling every post is still a matter
 * of editing one file.
 *
 * No `scope` is passed: nothing from the server should be in evaluation scope.
 */
export default function MdxContent({ source }: { source: string }) {
  return (
    <MDXRemote source={source} components={mdxComponents} options={{ mdxOptions }} />
  );
}
