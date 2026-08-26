"use client";

import { useEffect, useState } from "react";

/**
 * Records a view and shows the live count.
 *
 * Two layers stop over-counting:
 *   - sessionStorage here, so a refresh within a session does not re-fire
 *   - the (post_id, visitor_hash, day) primary key server-side, so a visitor
 *     counts once per post per day even across sessions
 *
 * Firing on mount rather than during render is deliberate: <Link> prefetch
 * fetches the RSC payload without ever mounting the component, so hovering a
 * link cannot inflate the count.
 *
 * The server returns the fresh total and it is rendered here, which is how the
 * number stays live without the endpoint ever revalidating the page cache.
 */
export default function ViewCounter({
  slug,
  initial,
}: {
  slug: string;
  initial: number;
}) {
  const [views, setViews] = useState(initial);

  useEffect(() => {
    const key = `viewed:${slug}`;
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");

    let cancelled = false;
    fetch(`/api/posts/${slug}/views`, { method: "POST" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!cancelled && typeof data?.views === "number") setViews(data.views);
      })
      .catch(() => {
        // A failed count must never disturb the page.
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <span>
      {views.toLocaleString()} {views === 1 ? "view" : "views"}
    </span>
  );
}
