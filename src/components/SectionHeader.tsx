import Link from "next/link";
import type { ReactNode } from "react";

/**
 * Consistent section opener: a mono eyebrow label, a serif title, and an optional
 * link to the fuller page. Used across the home page and section pages so the
 * typographic rhythm is identical everywhere.
 */
export default function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  as: Heading = "h2",
}: {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  action?: { href: string; label: string };
  /** Page titles should pass "h1"; in-page sections keep the h2 default. */
  as?: "h1" | "h2";
}) {
  return (
    <header className="space-y-3 pb-8">
      <p className="eyebrow">{eyebrow}</p>

      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <Heading className="font-display text-3xl sm:text-4xl tracking-[-0.01em]">
          {title}
        </Heading>
        {action && (
          <Link
            href={action.href}
            className="text-sm text-ink-muted hover:text-ink link-underline rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
          >
            {action.label} →
          </Link>
        )}
      </div>

      {description && (
        <p className="text-ink-muted max-w-[60ch] leading-relaxed">{description}</p>
      )}
    </header>
  );
}
