import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // /admin arrives in Phase 8. Listing it here is belt-and-braces only —
      // the real protection is server-side auth, not robots.txt.
      disallow: ["/api/", "/admin"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
