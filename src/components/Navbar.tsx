"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * Why this component uses "use client":
 * - We need useState to open/close the mobile menu.
 * - Interactivity only exists in client components.
 */
export default function Navbar() {
  const [open, setOpen] = useState(false);

  // Keeping links here (not in layout) makes it easy to reuse elsewhere later.
  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Research", href: "/research" },
    { name: "Projects", href: "/projects" },
    { name: "Resume", href: "/resume" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
      <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
        {/* Brand (why Link? avoids full page reload, keeps client state) */}
        <Link href="/" className="font-semibold tracking-tight">
          E. Ogbadu
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-6 text-sm">
          {links.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="hover:text-slate-500">
                {l.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {/* Keeping it simple for now: text icon */}☰
        </button>
      </nav>

      {/* Mobile panel (renders only when open) */}
      {open && (
        <ul className="md:hidden px-4 pb-4 space-y-2 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block py-2"
                onClick={() => setOpen(false)} // close after navigation
              >
                {l.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
