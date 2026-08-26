import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

import { db } from "@/db";
import { clientKeyFromRequest, rateLimit } from "@/lib/rate-limit";

/**
 * Increments a post's view count and returns the new total.
 *
 * CRITICAL: this must never call revalidateBlog(). Busting the cache on every
 * pageview would be worse than having no cache at all. Instead the endpoint
 * returns the fresh count and the client renders it, so the number is live
 * without the page cache ever knowing.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * sha256(ip | user-agent | secret | date).
 *
 * No raw IP is ever stored, and because the date is part of the input the salt
 * rotates daily on its own — yesterday's hashes cannot be correlated with
 * today's, and the same visitor counts once per post per day.
 */
function visitorHash(request: Request): string {
  const xff = request.headers.get("x-forwarded-for") ?? "";
  const ip = xff.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
  const ua = request.headers.get("user-agent") ?? "";
  const day = new Date().toISOString().slice(0, 10);
  const secret = process.env.AUTH_SECRET ?? "view-salt";

  return createHash("sha256").update(`${ip}|${ua}|${secret}|${day}`).digest("hex");
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  // Cheap flood protection. The unique constraint below already makes repeats a
  // no-op, but this stops a script burning database round trips.
  const { allowed } = rateLimit(`views:${clientKeyFromRequest(request)}`, {
    limit: 30,
    windowMs: 60_000,
  });
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    /*
     * One statement, one round trip — which is why the HTTP driver's lack of
     * interactive transactions costs nothing here.
     *
     * The INSERT is deduped by the (post_id, visitor_hash, day) primary key, and
     * the UPDATE adds however many rows the insert actually created: 1 for a new
     * visitor, 0 for a repeat.
     */
    const result = await db.execute<{ view_count: number }>(sql`
      WITH target AS (
        SELECT id FROM posts WHERE slug = ${slug} AND status = 'published'
      ), ins AS (
        INSERT INTO post_views (post_id, visitor_hash)
        SELECT id, ${visitorHash(request)} FROM target
        ON CONFLICT DO NOTHING
        RETURNING post_id
      )
      UPDATE posts
         SET view_count = view_count + (SELECT count(*) FROM ins)
       WHERE id IN (SELECT id FROM target)
      RETURNING view_count
    `);

    const row = result.rows?.[0];
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(
      { views: Number(row.view_count) },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[views] error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
