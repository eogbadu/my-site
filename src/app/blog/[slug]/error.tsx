"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Safety net for a stored post body that fails to render. validateMdx should stop
 * that at save time, but a rendering failure must not take down the whole route.
 */
export default function BlogPostError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[blog post]", error);
  }, [error]);

  return (
    <section className="py-16 space-y-5">
      <h1 className="font-display text-3xl">This post failed to render</h1>
      <p className="text-ink-muted max-w-prose">
        Something in the content could not be displayed. The rest of the site is fine.
      </p>
      {error.digest && <p className="text-xs text-ink-faint">Reference: {error.digest}</p>}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-ink text-paper px-5 py-2.5 text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent"
        >
          Try again
        </button>
        <Link
          href="/blog"
          className="rounded-full px-5 py-2.5 text-sm font-medium border border-rule text-ink-muted hover:text-ink focus:outline-none focus:ring-2 focus:ring-accent"
        >
          All posts
        </Link>
      </div>
    </section>
  );
}
