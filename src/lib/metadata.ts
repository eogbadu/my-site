import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

/**
 * Builds per-page metadata with consistent canonical, Open Graph, and Twitter tags.
 *
 * Why this exists rather than hand-writing `openGraph` on each page: declaring an
 * `openGraph` object in a page's metadata *replaces* the inherited one, including
 * the `images` entry that the root `opengraph-image.tsx` file convention supplies.
 * Pages that set openGraph therefore silently lost their social preview image
 * while pages that didn't kept it — an inconsistency that is easy to reintroduce
 * and invisible until someone shares a link.
 *
 * Routing every page through here makes the image impossible to drop by accident.
 */
export function buildMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
  noindex = false,
}: {
  title: string;
  description: string;
  /** Site-relative, e.g. "/projects". */
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  noindex?: boolean;
}): Metadata {
  // Matches the root layout's title.template so OG/Twitter titles agree with <title>.
  const fullTitle = siteConfig.titleTemplate.replace("%s", title);

  return {
    title,
    description,
    alternates: { canonical: path },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
    openGraph: {
      type,
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      url: path,
      images: ["/opengraph-image"],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/opengraph-image"],
    },
  };
}
