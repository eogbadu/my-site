import { siteConfig } from "@/config/site";

/**
 * The year is deliberately static.
 *
 * `new Date().getFullYear()` in a server component is evaluated at build time and
 * frozen into the prerendered HTML, so the live site showed "© 2025" well into
 * 2026. A range needs no JS and never goes stale.
 */
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-10 py-6 text-center text-sm text-slate-500">
      © {siteConfig.copyrightStartYear}–present {siteConfig.name}. All rights reserved.
    </footer>
  );
}
