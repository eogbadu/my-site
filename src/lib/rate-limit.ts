// Simple, in-memory sliding-window rate limiter.
// ⚠️ Note: This limits *per Node process*. In multi-instance deployments,
// use a shared store (Redis) instead.

type Hit = number; // epoch ms

const buckets = new Map<string, Hit[]>();

export function rateLimit(
  key: string,
  { limit, windowMs }: { limit: number; windowMs: number }
): {
  allowed: boolean;
  remaining: number;
  retryAfterSec: number;
  resetAt: number;
} {
  const now = Date.now();
  const windowStart = now - windowMs;

  const hits = buckets.get(key)?.filter((t) => t > windowStart) ?? [];
  // record this hit
  hits.push(now);
  buckets.set(key, hits);

  const count = hits.length;
  const allowed = count <= limit;

  // compute retry-after (seconds) = time until the earliest hit falls out of window
  const oldest = hits[0] ?? now;
  const retryAfterMs = Math.max(0, windowMs - (now - oldest));
  const retryAfterSec = Math.ceil(retryAfterMs / 1000);

  const remaining = Math.max(0, limit - count);
  const resetAt = now + retryAfterMs;

  return { allowed, remaining, retryAfterSec, resetAt };
}

/** Grab a best-effort client key from request headers (IP-ish). */
export function clientKeyFromRequest(req: Request): string {
  const xfwd = req.headers.get("x-forwarded-for") || "";
  const ip =
    xfwd.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
  const ua = req.headers.get("user-agent") || "";
  // tie IP + UA to reduce accidental collisions behind NAT
  return `${ip}|${ua.slice(0, 50)}`;
}
