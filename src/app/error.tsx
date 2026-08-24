"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * Route-level error boundary. Must be a client component — React error
 * boundaries rely on state, which only exists on the client.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Surfaced in the Vercel runtime logs. `digest` is the only safe correlator
    // to show a visitor: the message itself may contain internals.
    console.error("[error boundary]", error);
  }, [error]);

  return (
    <section className="py-16 text-center space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-prose mx-auto">
          This one is on me, not you. Try again — and if it keeps happening, please
          get in touch.
        </p>
        {error.digest && (
          <p className="text-xs text-slate-500">Reference: {error.digest}</p>
        )}
      </div>

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <button
          type="button"
          onClick={reset}
          className="rounded-2xl bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 px-5 py-2.5 text-sm font-semibold hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-2xl px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          Go home
        </Link>
        <Link
          href="/contact"
          className="rounded-2xl px-5 py-2.5 text-sm font-semibold ring-1 ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
        >
          Report it
        </Link>
      </div>
    </section>
  );
}
