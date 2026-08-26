import { revalidatePath, revalidateTag } from "next/cache";

/**
 * Called by every mutating admin action so a publish is visible immediately.
 *
 * Fires both mechanisms deliberately: tags clear the Data Cache entries created
 * by unstable_cache, while revalidatePath(pattern, "page") clears the Full Route
 * Cache for every instance of a dynamic segment. Together they guarantee the next
 * request after a publish is fresh.
 *
 * NOTE: the view-count endpoint must never call this. Busting the cache on every
 * pageview would be worse than having no cache at all.
 */
export function revalidateBlog(slug?: string) {
  revalidateTag("posts");
  if (slug) revalidateTag(`post:${slug}`);

  // The homepage carries a blog preview, so a publish has to refresh it too.
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/tag");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/blog/tag/[tag]", "page");
  revalidatePath("/sitemap.xml");
}
