import type { Metadata } from "next";

/**
 * The login page must NOT inherit the admin layout's auth guard, which would
 * redirect it to itself in a loop. Nesting it under its own layout that only
 * passes children through breaks that cycle.
 */
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children;
}
