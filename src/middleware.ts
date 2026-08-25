import NextAuth from "next-auth";

import { authConfig } from "@/auth.config";

/**
 * UX layer only: redirects an unauthenticated visitor before anything renders.
 *
 * This is deliberately NOT the security boundary. Next.js middleware has had
 * bypass CVEs, and it cannot see a Server Action invoked directly by its action
 * id. The real boundary is requireAdmin() inside every server action — see
 * src/lib/admin.ts.
 *
 * Imports auth.config (not auth) to stay edge-compatible.
 */
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  /**
   * Everything under /admin EXCEPT the login page itself.
   *
   * A plain "/admin/:path*" also matches /admin/login, so an unauthenticated
   * visitor was redirected to the login page, which the middleware then
   * redirected again — an infinite loop that curl reports as
   * "Maximum (50) redirects followed".
   *
   * The negative lookahead excludes it while still covering /admin and every
   * other nested route.
   */
  matcher: ["/admin", "/admin/((?!login).*)"],
};
