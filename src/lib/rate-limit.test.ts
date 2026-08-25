import { describe, expect, it } from "vitest";

import { clientKeyFromRequest, rateLimit } from "./rate-limit";

const OPTS = { limit: 3, windowMs: 60_000 };

describe("rateLimit", () => {
  it("allows up to the limit, then denies", () => {
    const key = `k-${Math.random()}`;
    expect(rateLimit(key, OPTS).allowed).toBe(true);
    expect(rateLimit(key, OPTS).allowed).toBe(true);
    expect(rateLimit(key, OPTS).allowed).toBe(true);
    expect(rateLimit(key, OPTS).allowed).toBe(false);
  });

  it("counts remaining down to zero and never below", () => {
    const key = `k-${Math.random()}`;
    expect(rateLimit(key, OPTS).remaining).toBe(2);
    expect(rateLimit(key, OPTS).remaining).toBe(1);
    expect(rateLimit(key, OPTS).remaining).toBe(0);
    expect(rateLimit(key, OPTS).remaining).toBe(0);
  });

  it("keeps separate buckets per key", () => {
    const a = `a-${Math.random()}`;
    const b = `b-${Math.random()}`;
    rateLimit(a, OPTS);
    rateLimit(a, OPTS);
    rateLimit(a, OPTS);
    expect(rateLimit(a, OPTS).allowed).toBe(false);
    expect(rateLimit(b, OPTS).allowed).toBe(true);
  });

  it("reports a retry-after within the window once blocked", () => {
    const key = `k-${Math.random()}`;
    for (let i = 0; i < 3; i++) rateLimit(key, OPTS);
    const blocked = rateLimit(key, OPTS);
    expect(blocked.retryAfterSec).toBeGreaterThan(0);
    expect(blocked.retryAfterSec).toBeLessThanOrEqual(60);
  });
});

describe("clientKeyFromRequest", () => {
  it("uses the first x-forwarded-for entry", () => {
    const req = new Request("https://x.test", {
      headers: { "x-forwarded-for": "1.2.3.4, 5.6.7.8", "user-agent": "UA" },
    });
    expect(clientKeyFromRequest(req)).toBe("1.2.3.4|UA");
  });

  it("falls back to x-real-ip, then to unknown", () => {
    const withReal = new Request("https://x.test", {
      headers: { "x-real-ip": "9.9.9.9" },
    });
    expect(clientKeyFromRequest(withReal)).toBe("9.9.9.9|");
    expect(clientKeyFromRequest(new Request("https://x.test"))).toBe("unknown|");
  });

  it("truncates the user agent so a long header cannot bloat the key", () => {
    const req = new Request("https://x.test", {
      headers: { "x-real-ip": "1.1.1.1", "user-agent": "z".repeat(500) },
    });
    expect(clientKeyFromRequest(req).length).toBeLessThan(80);
  });
});
