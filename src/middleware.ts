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
  matcher: ["/admin/:path*"],
};
