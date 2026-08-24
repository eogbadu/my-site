// The year is deliberately static.
//
// `new Date().getFullYear()` in a server component is evaluated at build time and
// frozen into the prerendered HTML, so the live site showed "© 2025" well into
// 2026. A range needs no JS, never goes stale, and reads correctly either way.
// SITE_START_YEAR moves into siteConfig in Phase 3.
const SITE_START_YEAR = 2025;

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 mt-10 py-6 text-center text-sm text-slate-500">
      © {SITE_START_YEAR}–present Ekele Ogbadu. All rights reserved.
    </footer>
  );
}
