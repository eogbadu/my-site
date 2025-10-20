// next.config.ts
import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const withMDX = createMDX({
  // (optional) restrict extension explicitly
  extension: /\.mdx?$/,
  options: {
    // pass module paths as strings, not functions (serializable)
    remarkPlugins: [require.resolve("remark-gfm")],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
};

export default withMDX(nextConfig);
