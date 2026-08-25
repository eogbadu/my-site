import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";

import { auth, signOut } from "@/auth";

/**
 * Defense in depth: guarantees no admin page renders for a non-admin even if the
 * middleware matcher is misconfigured or bypassed. The real boundary is still
 * requireAdmin() inside each server action.
 *
 * Lives in a (protected) route group so it wraps only the guarded pages. The
 * login page sits outside the group and therefore does not inherit this guard —
 * previously it did, and redirected itself to itself in an infinite loop. A
 * nested layout does not replace a parent layout, it nests inside it, so giving
 * login its own pass-through layout did not help.
 *
 * Route groups do not affect URLs: these pages are still /admin, /admin/new, etc.
 */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const adminId = process.env.ADMIN_GITHUB_ID;
  const ok = !!adminId && session?.user?.githubId === adminId;

  if (!ok) redirect("/admin/login");

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule pb-4">
        <div className="flex items-baseline gap-5">
          <Link href="/admin" className="font-display text-2xl tracking-[-0.01em]">
            Admin
          </Link>
          <Link
            href="/admin/new"
            className="text-sm text-ink-muted hover:text-ink link-underline rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            New post
          </Link>
          <Link
            href="/blog"
            className="text-sm text-ink-muted hover:text-ink link-underline rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            View blog →
          </Link>
        </div>

        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="text-sm text-ink-faint hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent rounded-sm"
          >
            Sign out
          </button>
        </form>
      </header>

      {children}
    </div>
  );
}
