import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import PostThumb from "@/components/PostThumb";
import SectionHeader from "@/components/SectionHeader";
import { getPostsByTagSlug } from "@/db/queries";
import { buildMetadata } from "@/lib/metadata";
import { slugToLabel } from "@/lib/tags";

type Props = { params: Promise<{ tag: string }> };

/**
 * No generateStaticParams and no dynamicParams:false any more.
 *
 * Both were correct while tags came from a static array. Now that tags live in
 * the database, freezing the set at build time would 404 every tag page created
 * after the last deploy. Unknown tags simply return no posts and 404 below.
 */
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tag } = await params;
  const posts = await getPostsByTagSlug(tag);
  const label = posts[0]?.tags[posts[0].tagSlugs.indexOf(tag)] ?? slugToLabel(tag);

  return buildMetadata({
    title: `Tag: ${label}`,
    description: `Blog posts tagged with ${label}.`,
    path: `/blog/tag/${tag}`,
    noindex: posts.length === 0,
  });
}

export default async function TagPage({ params }: Props) {
  const { tag } = await params;
  const posts = await getPostsByTagSlug(tag);

  if (posts.length === 0) notFound();

  // Recover the author's original label rather than guessing it from the slug —
  // slugToLabel would render "trustworthy-ai" as "Trustworthy Ai".
  const label = posts[0].tags[posts[0].tagSlugs.indexOf(tag)] ?? slugToLabel(tag);

  return (
    <section>
      <SectionHeader
        as="h1"
        eyebrow="Tagged"
        title={label}
        description={`${posts.length} post${posts.length === 1 ? "" : "s"}.`}
        action={{ href: "/blog/tag", label: "All tags" }}
      />

      <ul className="divide-y divide-rule border-t border-rule">
        {posts.map((p) => (
          <li key={p.slug} className="flex gap-5 py-6">
            <Link href={`/blog/${p.slug}`} tabIndex={-1} aria-hidden="true">
              <PostThumb src={p.coverImage} title={p.title} />
            </Link>

            <div className="min-w-0 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-6 gap-y-1">
              <h2 className="font-display text-xl tracking-[-0.01em]">
                <Link
                  href={`/blog/${p.slug}`}
                  className="hover:text-accent transition-colors rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {p.title}
                </Link>
              </h2>
              <span className="numeral shrink-0">
                {p.publishedAt?.slice(0, 10)}
              </span>
            </div>
            {p.excerpt && (
              <p className="mt-2 text-sm leading-relaxed text-ink-muted max-w-[68ch]">
                {p.excerpt}
              </p>
            )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
