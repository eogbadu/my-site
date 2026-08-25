import GitHub from "next-auth/providers/github";
import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe half of the auth setup: providers and callbacks only, no database
 * and no Node APIs, so `middleware.ts` can import it.
 *
 * The allowlist is a single comparison against a numeric GitHub user id. It is
 * deliberately the id and never the login: GitHub logins can be renamed and the
 * old name then reclaimed by someone else.
 */
export const authConfig = {
  providers: [GitHub],

  // 7 days rather than the 30-day default. JWT strategy means sessions cannot be
  // revoked server-side before expiry; the panic button is rotating AUTH_SECRET
  // in Vercel, which invalidates every token at once.
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 7 },

  pages: { signIn: "/admin/login", error: "/admin/login" },

  callbacks: {
    /** Gate 1: refuse to mint a session for anyone but the allowlisted account. */
    signIn({ account, profile }) {
      const adminId = process.env.ADMIN_GITHUB_ID;
      return (
        account?.provider === "github" &&
        !!adminId &&
        String(profile?.id) === adminId
      );
    },

    /** Gate 2: stamp the identity into the token so later checks need no network. */
    jwt({ token, profile }) {
      if (profile?.id) token.githubId = String(profile.id);
      return token;
    },

    session({ session, token }) {
      if (session.user) session.user.githubId = token.githubId as string | undefined;
      return session;
    },

    /** Gate 3: used by the edge middleware matcher. */
    authorized({ auth }) {
      const adminId = process.env.ADMIN_GITHUB_ID;
      return !!adminId && auth?.user?.githubId === adminId;
    },
  },
} satisfies NextAuthConfig;
