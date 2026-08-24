# Errors, Bugs & Gotchas

Every non-obvious problem found, its root cause, and how it was resolved. Append as
you go — the point is that a future session doesn't re-derive any of this.

Status: 🔴 open · ✅ fixed

---

## Found during the initial audit (2026-08-24)

### ✅ E1 — Contact form crashes on any validation error
**Severity: high — reproducible in production.**

`src/app/api/contact/route.ts:38-41` returns errors as objects:
```ts
const errors = parseResult.error.issues.map((i) => ({ field: …, message: … }));
```
`src/app/contact/page.tsx:15` types state as `string[]`, and line 124 renders each
entry directly as a React child. Rendering an object as a React child throws
*"Objects are not valid as a React child"* and blanks the page.

**Why TypeScript didn't catch it:** `res.json()` returns `any`, so the object array
flows into `string[]` state unchecked.

**Reproduce:** submit the live form with a 1-character name.
**Fix:** Phase 1 — standardize on `{ ok, fieldErrors, formError }` via zod 4's
`z.flattenError()`, render errors inline per field.

---

### ✅ E2 — Rate limiting silently removed from the live mail endpoint
Commit `b1e7b02` added `rateLimit` to `/api/contact`; commit `e2d38b5`
("Updated the route.ts file") rewrote the route and dropped it. `src/lib/rate-limit.ts`
is now dead code — nothing imports it.

**Impact:** `/api/contact` is an unauthenticated, unthrottled relay into the IONOS
mailbox. Anyone can script it.
**Fix:** Phase 1 — re-import the existing module (5 req / 10 min). Note it is
per-Node-process; on Vercel that still blunts naive floods.

---

### ✅ E3 — Honeypot never checked server-side
`src/app/contact/page.tsx:116` sends a `website` field and line 29 handles a `204`
response, but `route.ts` never reads it. Zod's default object behavior **strips**
unknown keys rather than rejecting, so the field is silently ignored and bots pass.

**Gotcha:** the client half of this feature has been shipping as pure decoration.
**Fix:** Phase 1 — declare `website` as a plain optional string so it survives validation,
then check `website.length > 0` after parsing and return 204. See E13 for why `.max(0)`
is the wrong way to do this.

---

### 🔴 E4 — MDX component styling never applied
`src/app/mdx-components.tsx` is in the **wrong location** and has the **wrong export
shape**. Next resolves `src/mdx-components.tsx` (project root or `src/`) exporting a
**named** `useMDXComponents`; this file is under `src/app/` with a *default* export.
Nothing imports it — `grep` confirms zero references.

**Verified live:** `/blog/hello-world` emits bare `<h1>`, `<p>`, `<ul>`, `<pre>` with
no class attributes at all.
**Fix:** Phase 2 — move the map to `src/components/mdx-components.tsx` (permanent, reused
by the runtime MDX renderer) plus a thin `src/mdx-components.tsx` shim (deleted in Phase 10).

---

### 🔴 E5 — Footer copyright frozen at build time
`src/components/Footer.tsx:4` calls `new Date().getFullYear()` in a **server component**,
so the value is baked into static HTML when the page is prerendered.

**Verified live:** the site renders `© 2025` as of 2026-08-24 — stale by eight months.
**Fix:** Phase 3 — drop the dynamic year entirely; render
`© {copyrightStartYear}–present` from `siteConfig`. Zero JS, never stale.

---

### 🔴 E6 — Unlayered CSS silently overrides Tailwind utilities
`src/app/globals.css:22-26` sets `background` / `color` / `font-family` on `body`
**outside any `@layer`**. `@import "tailwindcss"` puts all utilities *inside*
`@layer utilities`, and **unlayered declarations beat layered ones** in the cascade.

**Consequence:** the `bg-white dark:bg-slate-950` classes on `<body>` in `layout.tsx`
have never had any effect — the background comes from the CSS variable instead.
**Why it matters:** adding a `.dark` class toggle without removing these first produces
a toggle that appears to do nothing. **Phase 2 must precede Phase 5.**

---

### 🔴 E7 — `tailwind.config.ts` is inert
Tailwind v4 uses CSS-first configuration and does **not** auto-load `tailwind.config.ts`
without an explicit `@config` directive in the CSS — which `globals.css` lacks.

**Consequence:** the registered `@tailwindcss/line-clamp` plugin is not loaded.
`line-clamp-3` works anyway because it's core in v4. The config file is actively
misleading.
**Fix:** Phase 2 — delete the file; drop the plugin and `autoprefixer`.

---

### 🔴 E8 — Dangling font variables; site renders in Arial
`globals.css:11-12` maps `--font-sans` / `--font-mono` to `var(--font-geist-sans)` /
`var(--font-geist-mono)`, which are **never defined** — `next/font` is not used anywhere.
Line 25 then hardcodes `font-family: Arial, Helvetica, sans-serif`.

The README claims the project uses `next/font` to optimize Geist. It doesn't.
**Fix:** Phase 2 — wire `next/font/google` properly so the existing `@theme inline`
mapping resolves.

---

### 🔴 E9 — Next 14 `params` signature (latent)
`src/app/blog/tag/[tag]/page.tsx:7` declares `params: { tag: string }` and reads it
synchronously. Next 15 makes `params` a `Promise`.

**Not currently broken** — verified `/blog/tag/meta` renders correctly in production via
Next 15's deprecation shim. That shim is removed in Next 16.
**Fix:** Phase 2 — `Promise<{ tag: string }>` + `await`.

---

### 🔴 E10 — Placeholder URLs live in production
- `src/data/projects.ts:10` → `https://example.com`
- `src/data/projects.ts:11,21` → `https://github.com/yourhandle/…` (404s)
- `src/components/SocialLinks.tsx:19` → `scholar.google.com/citations?user=XXXX`

A broken Google Scholar link on a researcher's homepage is worse than no link.
**Fix:** Phase 4 — needs real URLs from the user (RUNBOOK H9).

---

### 🔴 E11 — No SEO surface at all
Verified live: `/robots.txt` → **404**, `/sitemap.xml` → **404**, and the homepage HTML
contains **zero** `og:` or `twitter:` meta tags. Six of eight routes export no metadata.

**Consequence:** every link shared to LinkedIn/Slack renders as a bare URL, and search
results show the same generic title for every page.
**Fix:** Phase 3.

---

### ✅ E12 — Submitter email addresses written to logs
`src/app/api/contact/route.ts:96` logs `info.accepted` / `info.rejected`, putting
third-party email addresses into Vercel's log drain.
**Fix:** Phase 1 — log `info.messageId` only.

---

---

## Found during Phase 1 implementation (2026-08-24)

### ✅ E13 — Honeypot `.max(0)` defeated its own purpose *(self-inflicted, caught in testing)*
First implementation declared `website: z.string().max(0).optional().default("")`.

**What went wrong:** `.max(0)` makes **zod reject** a filled honeypot with a 400 *before*
the silent-204 branch is ever reached. That (a) leaks the field's existence to a bot,
which can then simply omit it, and (b) breaks the silent-accept design.

**Caught by:** the honeypot test returned `HTTP 400` where `204` was expected.
**Fix:** declare it as a plain optional string and check `website.length > 0` manually
after parsing. Comment added so nobody "tightens" it back.

**Lesson:** validation-layer strictness and honeypot semantics are in direct conflict —
the honeypot must survive validation to be handled deliberately.

---

### 🔴 E14 — Local `.env.local` SMTP config is non-functional
Two independent problems, both confirmed by live testing:

1. `SMTP_HOST=smtp.example.com` — a placeholder. The code's `smtp.ionos.com` fallback
   never fires because the variable *is* set, just wrongly. → `EDNS getaddrinfo`.
2. With the host corrected to `smtp.ionos.com`, the credentials fail:
   **`535 Authentication credentials invalid`** (`EAUTH`).

**Consequence:** mail delivery **cannot be verified locally.** Every other path on the
contact endpoint was verified; delivery is blocked by environment, not by code.

**Stopped after one auth attempt** — repeated 535s risk a provider-side lockout.

**Open questions for the user (see RUNBOOK H1):**
- Are the **production** (Vercel) SMTP vars correct? If `SMTP_PASS` is stale there too,
  **the live contact form is silently broken** and every submission returns a 500.
- Rotating the password (H1) and updating both Vercel and `.env.local` resolves this
  either way.

**Note:** the failure path itself behaved correctly — graceful 500, generic message to
the client, real error logged server-side, and **no submitter email address in the log**
(confirming the E12 fix).

---

## Gotchas worth remembering

- **Zod strips unknown keys by default.** An extra field in the request body causes no
  validation error — it just vanishes. That's why E3 was invisible.
- **`res.json()` is `any`.** It defeats `strict` mode at every fetch boundary. That's how
  E1 shipped.
- **Static route segments beat dynamic ones.** Relevant to the Phase 10 cutover.
- **Server components bake `Date` calls into static HTML** at build time (E5).
- **Unlayered CSS wins over `@layer`ed CSS** regardless of specificity or order (E6).
- **A honeypot field must pass validation**, not fail it, or the bot learns to drop it (E13).
- **`.env.local` is not a trustworthy mirror of production.** It held a placeholder host
  and stale credentials; don't infer production health from local behavior (E14).
