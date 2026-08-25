import Link from "next/link";
import { notFound } from "next/navigation";

import MdxContent from "@/components/MdxContent";
import { getPostById } from "@/db/queries";
import { requireAdmin } from "@/lib/admin";
import { readingTime } from "@/lib/reading-time";

export const dynamic = "force-dynamic";

/**
 * Renders the draft through the exact same MdxContent and component map as the
 * public page, so preview is accurate by construction. A second, client-side
 * renderer would quietly disagree with production.
 */
export default async function PreviewPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <article className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <p className="eyebrow">Preview — {post.status}</p>
        <Link
          href={`/admin/${post.id}/edit`}
          className="text-sm text-ink-muted hover:text-ink link-underline rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
        >
          ← Back to editor
        </Link>
      </div>

      <header className="space-y-3 border-b border-rule pb-6">
        <h1 className="font-display text-4xl tracking-[-0.015em]">{post.title}</h1>
        <p className="text-sm text-ink-faint">
          {post.tags.join(" · ")}
          {post.tags.length > 0 && " — "}
          {readingTime(post.body)} min read
        </p>
      </header>

      <div className="max-w-[68ch]">
        <MdxContent source={post.body} />
      </div>
    </article>
  );
}
