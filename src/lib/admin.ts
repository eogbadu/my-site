import "server-only";

import { auth } from "@/auth";

/**
 * THE security boundary. Call this first in every server action and in the admin
 * layout.
 *
 * Server Actions compile to publicly reachable POST endpoints addressed by an
 * action id. Someone who knows the id can invoke deletePost without ever loading
 * /admin, so an auth check on the page that renders the form protects nothing.
 *
 * Given that rendering a post body executes its MDX on the server, an unprotected
 * action is not "someone can edit the blog" — it is remote code execution.
 *
 * Throws rather than redirects, and never explains why.
 */
export async function requireAdmin() {
  const session = await auth();
  const adminId = process.env.ADMIN_GITHUB_ID;

  if (!adminId || !session?.user?.githubId || session.user.githubId !== adminId) {
    throw new Error("Unauthorized");
  }
  return session;
}

export async function isAdmin(): Promise<boolean> {
  try {
    await requireAdmin();
    return true;
  } catch {
    return false;
  }
}
