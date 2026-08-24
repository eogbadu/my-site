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
    <footer className="border-t border-rule mt-20">
      <div className="mx-auto max-w-5xl px-5 sm:px-8 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-sm text-ink-faint">
          © {siteConfig.copyrightStartYear}–present {siteConfig.name}
        </p>
        <p className="eyebrow">{siteConfig.author.jobTitle} · Researcher</p>
      </div>
    </footer>
  );
}
