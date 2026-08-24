import Link from "next/link";
import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="py-16 text-center space-y-6">
      <p className="text-6xl font-bold text-slate-300 dark:text-slate-700">404</p>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold">This page doesn&rsquo;t exist</h1>
        <p className="text-slate-600 dark:text-slate-300 max-w-prose mx-auto">
          The link may be out of date, or the page may have moved.
        </p>
      </div>

      <nav aria-label="Suggested pages" className="flex flex-wrap justify-center gap-3 pt-2">
        {siteConfig.nav.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-2xl px-4 py-2 text-sm font-semibold ring-1 ring-slate-300 dark:ring-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            {link.name}
          </Link>
        ))}
      </nav>
    </section>
  );
}
