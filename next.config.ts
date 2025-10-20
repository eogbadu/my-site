import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const withMDX = createMDX({
  options: {
    // ✅ strings are serializable; Turbopack is happy
    remarkPlugins: [require.resolve("remark-gfm")],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
};

export default withMDX(nextConfig);
