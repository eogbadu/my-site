import type { NextConfig } from "next";

/**
 * @next/mdx is gone: there are no .mdx route files any more. Post bodies live in
 * the database and are compiled at request time by next-mdx-remote, so the
 * remaining MDX dependencies (@mdx-js/mdx, remark-gfm) are runtime deps rather
 * than build plugins.
 */
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx"],

  images: {
    /*
     * Post cover thumbnails live in Vercel Blob, and next/image refuses any
     * remote host that is not listed here — it returned 400 and every thumbnail
     * fell back to the placeholder.
     *
     * Pinned to this one store rather than *.public.blob.vercel-storage.com on
     * purpose: a wildcard would let anyone route arbitrary Blob content through
     * this site's image optimizer and burn its quota. If the store is ever
     * recreated the hostname changes and this needs updating.
     */
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d5kudbrlyor5aeqv.public.blob.vercel-storage.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
