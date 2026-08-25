import type { NextConfig } from "next";

/**
 * @next/mdx is gone: there are no .mdx route files any more. Post bodies live in
 * the database and are compiled at request time by next-mdx-remote, so the
 * remaining MDX dependencies (@mdx-js/mdx, remark-gfm) are runtime deps rather
 * than build plugins.
 */
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],
};

export default nextConfig;
