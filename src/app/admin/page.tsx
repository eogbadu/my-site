import Link from "next/link";

import DeleteButton from "@/components/admin/DeleteButton";
import { getAllPostsForAdmin } from "@/db/queries";
import { requireAdmin } from "@/lib/admin";
import { deletePost } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminHomePage() {
  await requireAdmin();
  const rows = await getAllPostsForAdmin();

  return (
    <section className="space-y-6">
      <p className="eyebrow">Posts — {rows.length}</p>

      {rows.length === 0 ? (
        <p className="text-ink-muted">
          No posts yet.{" "}
          <Link href="/admin/new" className="text-accent link-underline">
            Write the first one
          </Link>
          .
        </p>
      ) : (
        <ul className="divide-y divide-rule border-t border-rule">
          {rows.map((p) => (
            <li key={p.id} className="py-4 space-y-2">
              <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                <Link
                  href={`/admin/${p.id}/edit`}
                  className="font-display text-lg tracking-[-0.01em] hover:text-accent rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  {p.title}
                </Link>
                <span className="numeral">
                  {p.status === "published"
                    ? p.publishedAt?.toISOString().slice(0, 10)
                    : "draft"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-ink-faint">
                <span className="font-mono text-xs">/blog/{p.slug}</span>
                <span
                  className={
                    p.status === "published"
                      ? "text-success text-xs"
                      : "text-ink-faint text-xs"
                  }
                >
                  {p.status}
                </span>
                <span className="text-xs">{p.viewCount} views</span>

                <Link
                  href={`/admin/${p.id}/edit`}
                  className="hover:text-ink rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Edit
                </Link>
                <Link
                  href={`/admin/${p.id}/preview`}
                  className="hover:text-ink rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  Preview
                </Link>

                <DeleteButton
                  slug={p.slug}
                  onDelete={async () => {
                    "use server";
                    await deletePost(p.id);
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
