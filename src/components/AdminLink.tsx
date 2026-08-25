"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * Shows an "Admin" link in the navbar, but only to the signed-in admin.
 *
 * Deliberately client-side via /api/auth/session rather than calling auth() in
 * the root layout: auth() reads cookies, which would opt every page in the site
 * out of static rendering just to decide whether to show one link. Fetching after
 * hydration keeps the public site static and costs the admin a brief flash before
 * the link appears — the right trade when there is exactly one admin.
 *
 * This is a convenience affordance, not a security control. Every admin route is
 * guarded server-side regardless of what this renders.
 */
export default function AdminLink() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/session")
      .then((r) => (r.ok ? r.json() : null))
      .then((s) => {
        if (!cancelled && s?.user?.githubId) setIsAdmin(true);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  if (!isAdmin) return null;

  return (
    <Link
      href="/admin"
      className="text-accent hover:opacity-80 link-underline rounded-sm focus:outline-none focus:ring-2 focus:ring-accent"
    >
      Admin
    </Link>
  );
}
