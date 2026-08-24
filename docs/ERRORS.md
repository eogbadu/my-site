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

### ✅ E4 — MDX component styling never applied
`src/app/mdx-components.tsx` is in the **wrong location** and has the **wrong export
shape**. Next resolves `src/mdx-components.tsx` (project root or `src/`) exporting a
**named** `useMDXComponents`; this file is under `src/app/` with a *default* export.
Nothing imports it — `grep` confirms zero references.

**Verified live:** `/blog/hello-world` emits bare `<h1>`, `<p>`, `<ul>`, `<pre>` with
no class attributes at all.
**Fixed in Phase 2** — map moved to `src/components/mdx-components.tsx` (permanent, reused
by the runtime MDX renderer later) plus a thin `src/mdx-components.tsx` shim with a *named*
`useMDXComponents` (deleted in Phase 10).

**Verified:** `/blog/hello-world` now emits
`<h1 class="text-3xl font-bold mt-2 mb-3">`, `<p class="leading-7 my-4 ...">`,
`<pre class="rounded-xl bg-slate-950 ...">`. Also added `blockquote`, `hr`, and GFM
`table`/`th`/`td` styling, which the original map lacked.

---

### ✅ E5 — Footer copyright frozen at build time
`src/components/Footer.tsx:4` calls `new Date().getFullYear()` in a **server component**,
so the value is baked into static HTML when the page is prerendered.

**Verified live:** the site renders `© 2025` as of 2026-08-24 — stale by eight months.
**Fixed in Phase 2** — renders `© 2025–present`. A range needs no JS, never goes stale, and
cannot be frozen by prerendering. `SITE_START_YEAR` moves into `siteConfig` in Phase 3.

---

### ✅ E6 — Unlayered CSS silently overrides Tailwind utilities
`src/app/globals.css:22-26` sets `background` / `color` / `font-family` on `body`
**outside any `@layer`**. `@import "tailwindcss"` puts all utilities *inside*
`@layer utilities`, and **unlayered declarations beat layered ones** in the cascade.

**Consequence:** the `bg-white dark:bg-slate-950` classes on `<body>` in `layout.tsx`
have never had any effect — the background comes from the CSS variable instead.
**Why it matters:** adding a `.dark` class toggle without removing these first produces
a toggle that appears to do nothing. **Phase 2 must precede Phase 5.**

**Fixed in Phase 2.** Verified in the built CSS: the only remaining `body{}` rule is inside
`@media print` (the intentional résumé print style). Body colors now come from the
`bg-white dark:bg-slate-950` utilities, which take effect for the first time. Also aligned
`--background` to `#020617` so the CSS variable matches the `slate-950` utility.

---

### ✅ E7 — `tailwind.config.ts` is inert
Tailwind v4 uses CSS-first configuration and does **not** auto-load `tailwind.config.ts`
without an explicit `@config` directive in the CSS — which `globals.css` lacks.

**Consequence:** the registered `@tailwindcss/line-clamp` plugin is not loaded.
`line-clamp-3` works anyway because it's core in v4. The config file is actively
misleading.
**Fixed in Phase 2** — file deleted; `@tailwindcss/line-clamp`, `autoprefixer`, and the
unrelated abandoned `mdx@0.3.1` package removed. **Verified** `.line-clamp-3` is still
emitted by Tailwind v4 core, so the 5 usages are unaffected.

---

### ✅ E8 — Dangling font variables; site renders in Arial
`globals.css:11-12` maps `--font-sans` / `--font-mono` to `var(--font-geist-sans)` /
`var(--font-geist-mono)`, which are **never defined** — `next/font` is not used anywhere.
Line 25 then hardcodes `font-family: Arial, Helvetica, sans-serif`.

The README claims the project uses `next/font` to optimize Geist. It doesn't.
**Fixed in Phase 2** — `next/font/google` Geist + Geist_Mono wired in `layout.tsx`.
**Verified:** `<html>` carries the generated variable classes and the built CSS contains
`--font-sans:var(--font-geist-sans)` with `--font-geist-sans` actually defined.

---

### ✅ E9 — Next 14 `params` signature (latent)
`src/app/blog/tag/[tag]/page.tsx:7` declares `params: { tag: string }` and reads it
synchronously. Next 15 makes `params` a `Promise`.

**Not currently broken** — verified `/blog/tag/meta` renders correctly in production via
Next 15's deprecation shim. That shim is removed in Next 16.
**Fixed in Phase 2** — `Promise<{ tag: string }>` + `await` in both `generateMetadata` and
the page component.

---

### ✅ E10 — Placeholder URLs live in production
- `src/data/projects.ts:10` → `https://example.com`
- `src/data/projects.ts:11,21` → `https://github.com/yourhandle/…` (404s)
- `src/components/SocialLinks.tsx:19` → `scholar.google.com/citations?user=XXXX`

A broken Google Scholar link on a researcher's homepage is worse than no link.

**Fixed (2026-08-25)** after checking each candidate URL anonymously rather than trusting
the names:

| URL | Anonymous result | Action |
|---|---|---|
| `scholar.google.com/citations?user=gO-0Q98AAAAJ` | 200 | used |
| `github.com/eogbadu/SCOUT-plus-plus` | 200 | used (note the capitalization — `scout-plus-plus` also redirects, but the canonical name is better) |
| `github.com/eogbadu/resumetailor` | **404** | does not exist |
| `github.com/eogbadu/job-matching-platform` | **404** to visitors | the real ResumeTailor repo, but **private** |

ResumeTailor's `url` and `repo` were therefore **removed** rather than pointed at a private
repo — `ProjectCard` already degrades to "Details coming soon". Linking a private repo
would have reproduced exactly the dead-link problem this entry is about.

**Open:** add `repo` when `job-matching-platform` goes public, and `url` if a live demo exists.

---

### ✅ E11 — No SEO surface at all
Verified live: `/robots.txt` → **404**, `/sitemap.xml` → **404**, and the homepage HTML
contains **zero** `og:` or `twitter:` meta tags. Six of eight routes export no metadata.

**Consequence:** every link shared to LinkedIn/Slack renders as a bare URL, and search
results show the same generic title for every page.
**Fixed in Phase 3.** Added `metadataBase` (canonical www origin), a title template,
per-page metadata for all six routes that had none, `sitemap.ts`, `robots.ts`, a generated
`opengraph-image.tsx`, and `not-found`/`error`/`global-error`/`loading` boundaries.
**Verified:** `og:image` now present on all 10 pages; `/robots.txt` and `/sitemap.xml`
return 200 with absolute www URLs; the OG route serves a real 1200×630 PNG.

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

### ✅ E14 — Contact form delivered nothing: the sending mailbox did not exist
Two independent problems, both confirmed by live testing:

1. `SMTP_HOST=smtp.example.com` — a placeholder. The code's `smtp.ionos.com` fallback
   never fires because the variable *is* set, just wrongly. → `EDNS getaddrinfo`.
2. With the host corrected to `smtp.ionos.com`, the credentials fail:
   **`535 Authentication credentials invalid`** (`EAUTH`).

**Consequence:** mail delivery **cannot be verified locally.** Every other path on the
contact endpoint was verified; delivery is blocked by environment, not by code.

**Stopped after one auth attempt** — repeated 535s risk a provider-side lockout.

**CONFIRMED IN PRODUCTION (2026-08-24, post-deploy).** One valid submission to
`https://www.ekeleogbadu.io/api/contact` returned:
```
{"ok":false,"formError":"Server error. Please try again later."}   [500]
```
A 500 here means `sendMail()` threw inside the try/catch — the same class of failure seen
locally (`EDNS` for a bad host, `EAUTH` for bad credentials).

**Impact: the contact form has been silently discarding every legitimate message.** The
visitor sees a generic error; nothing reaches the inbox. This predates and is entirely
independent of the Phase 1 changes — the old code had the same env handling, so any message
sent through the live form has been lost for as long as the credentials have been wrong.

**This is now the highest-priority open item.** It needs the user, since it requires the
Vercel dashboard:
1. Vercel → project → Settings → Environment Variables. Check `SMTP_HOST` — if it reads
   `smtp.example.com` (as `.env.local` does), that alone is the bug; it should be
   `smtp.ionos.com`.
2. Check the runtime logs for `[contact] error` to see whether it is `EDNS` (wrong host) or
   `EAUTH` (bad password).
3. Rotate the IONOS mailbox password (RUNBOOK H1) and set it in **both** Vercel and
   `.env.local`. That resolves the `EAUTH` case regardless.

**Diagnostic note:** the failure is *graceful* — generic message to the visitor, real error
server-side, no PII logged. So the error handling is correct; only the credentials are wrong.

**NARROWED TO AUTHENTICATION (2026-08-24).** The user confirmed Vercel has
`SMTP_HOST=smtp.ionos.com`, so the host was only wrong locally (now fixed). Remaining
evidence:
- Server is healthy — raw probe returned `220 perfora.net (mreueus003) Nemesis ESMTP
  Service ready` and `250 STARTTLS` on port 587. Not network, not TLS, not the port.
- With correct host + user `contact@ekeleogbadu.io`:
  **`535 Authentication credentials invalid`**.

So: wrong password, SMTP access disabled on the mailbox, or an app-specific password is
required. Stopped after three auth attempts to avoid triggering a block.

**Tooling added:** `scripts/check-smtp.mjs` verifies credentials in seconds without a
deploy, and maps `err.code` to a specific hint (EAUTH/EDNS/ETIMEDOUT/ECONNECTION).

**ROOT CAUSE (2026-08-25): `contact@ekeleogbadu.io` had never been created.**

Every other hypothesis was wrong. It was not a rotated password, not a blocked account, not
disabled SMTP access — `SMTP_USER` pointed at a mailbox that did not exist, so IONOS
answered `535` to every login. The contact form has therefore *never* delivered a message.

**Resolution:** the user created the mailbox in the IONOS panel and set `SMTP_PASS` in
`.env.local`. Verified locally:
```
✓ SMTP authentication succeeded.
✓ Test message sent: <cb9b70aa-...@ekeleogbadu.io>

POST /api/contact  (valid body)  ->  {"ok":true}  [200]
[contact] sent <ce687bd4-...@ekeleogbadu.io>          # messageId only, no PII
```

**Also corrected:** `MAIL_TO` was `contact@ekeleogbadu.io` locally but
`eogbadu@umbc.edu` in Vercel. Local now matches production. Deleted `.env.local.bak`,
which still held the stale password.

**RESOLVED IN PRODUCTION (2026-08-25).** The user set `SMTP_PASS` in Vercel. A valid
submission to the live endpoint now returns:
```
POST https://www.ekeleogbadu.io/api/contact  ->  {"ok":true}  [200]
```
The contact form delivers mail for the first time since it was built.

**Diagnostic lesson:** a `535` means "authentication failed", which reads as *bad password*
and pulls you toward rotating credentials. A nonexistent account produces the identical
response. Confirming the account exists should come before rotating its password.

**Note on the earlier theory:** until Phase 1 the endpoint had no rate limiting (E2), so bot
submissions could drive continuous failed SMTP logins. That was a plausible cause of a
*block*, but was not what happened here. The rate limiter is still worth having.

**Note:** the failure path itself behaved correctly — graceful 500, generic message to
the client, real error logged server-side, and **no submitter email address in the log**
(confirming the E12 fix).

---

### ✅ E15 — Vercel did not auto-deploy the Phase 1 push *(resolved)*
Commit `3b3b362` was pushed to `origin/main` at ~22:14 (confirmed: `git ls-remote origin
main` matches local `HEAD`). **Seven minutes later production was still serving the old
build.**

**Evidence the old code is still live:**
```
POST https://www.ekeleogbadu.io/api/contact  {"name":"a","email":"bad","message":"x"}
→ {"ok":false,"errors":[{"field":"name","message":"..."}]}     # old object shape
```
The new build returns `{"ok":false,"fieldErrors":{...}}`. Homepage also shows
`age: 37466` (~10 h) with `x-vercel-cache: HIT`.

**Side benefit:** this is a clean live reproduction of E1 — production really does return
error *objects* that the client then tries to render as React children.

**Needs the user (cannot be checked without Vercel dashboard access):**
1. Vercel → project → Deployments — is there a build for `3b3b362`? Queued, failed, or absent?
2. If **absent**: the Git integration is likely disconnected → Settings → Git → reconnect.
3. If **failed**: read the build log (the build passes locally, so suspect env/config).
4. If **queued/building**: nothing wrong, it was just slower than the poll window.

**Resolution:** it deployed on its own once the Next.js security upgrade (E16) was pushed.
Production went to `age: 0` and began serving the new build. The earlier delay was most
likely a queued or slow build rather than a broken integration — the poll window was simply
too short. No action was needed. Worth remembering that a Vercel deploy can take
appreciably longer than the ~7 minutes assumed here.

---

### ✅ E16 — Next.js 15.5.5 carried 29 security advisories, including a critical RCE
Surfaced by a Vercel deployment-log warning and an automated Vercel PR (#1, draft).

**The headline issue:** unauthenticated remote code execution via insecure
deserialization in the React Flight protocol —
[GHSA-9qr9-h5gf-34mp](https://github.com/vercel/next.js/security/advisories/GHSA-9qr9-h5gf-34mp)
/ CVE-2025-55182 / CVE-2025-66478.

**What `npm audit` actually showed:** 29 advisories against `next@15.5.5`, with
`fixAvailable: { version: "15.5.23", isSemVerMajor: false }`.

**Why we did NOT just merge Vercel's PR:** it bumps only to **15.5.9**, which closes the
RCE but leaves roughly 20 advisories open — multiple middleware/proxy bypasses, RSC cache
poisoning, SSRF via rewrites and Server Actions, CSP-nonce XSS, and several DoS vectors in
the Image Optimization API. 15.5.23 is the same patch line and closes all of them.

⚠️ **PR #1 must be closed, not merged.** Its branch predates this fix, so merging it later
would *downgrade* next from 15.5.23 to 15.5.9.

**Result after upgrading:** no Next-specific advisory remains. `next` is still listed by
`npm audit`, but only transitively — `via: ["postcss", "sharp"]`, both bundled inside next.
npm consequently suggests `16.3.2`, but that is **semver-major** and a separate migration;
it is not required to close the RCE.

**React was deliberately not bumped:** it isn't flagged, and Next vendors its own copy of
the RSC runtime, which is what carried the vulnerability.

**Relevance to the plan:** several of the patched advisories are *middleware/proxy bypasses*.
That is direct evidence for the Phase 8 design decision that middleware is **not** the
security boundary and `requireAdmin()` must be re-checked inside every Server Action
(DECISIONS D4).

**Verified:** `tsc --noEmit` clean, eslint unchanged, `next build` succeeds, and a
production `next start` smoke test returned 200 on all 10 routes and 404 on an unknown path.

---

### ✅ E17 — Declaring `openGraph` on a page silently drops the inherited OG image
Found while verifying Phase 3, not from the original audit.

Next's `opengraph-image.tsx` file convention injects `openGraph.images` for a segment and
its children — **but a page that declares its own `openGraph` object replaces the inherited
one wholesale, image included.**

Observed directly: `/blog` (no `openGraph` key) kept `og:image`, while `/projects` (which
set `openGraph` for a custom title) had **none**. Same site, same build, silently
inconsistent — and invisible until someone shares that specific link.

**Fix:** `src/lib/metadata.ts` exports `buildMetadata({ title, description, path })`, which
always sets `images`, canonical, and matching Twitter tags. Every page and the two route
layouts now route through it, so the image cannot be dropped by accident.

**Verified:** `og:image` count is exactly 1 on all 10 routes.

---

### ✅ E18 — Project images were 93% larger than necessary, and the alt text I first wrote was wrong
Two findings from Phase 4, one of them my own mistake.

**Size.** The images were not oversized in *dimensions* (1024–1536 px) — they were badly
encoded PNGs. Re-encoding to WebP q82 (with a modest resize) cut them dramatically:

| File | Before | After | Saved |
|---|---|---|---|
| `scout` | 3.27 MB | 244 KB | 92.7% |
| `fsrplanner` | 2.20 MB | 227 KB | 89.9% |
| `resumetailor_3` | 1.34 MB | 35 KB | 97.4% |
| `resumetailor_1` | 1.38 MB | 39 KB | 97.2% |
| `resumetailor_2` | 1.05 MB | 30 KB | 97.3% |
| `avatar` | 0.70 MB | 107 KB | 85.0% |
| **total** | **10.0 MB** | **0.67 MB** | **93%** |

`public/` went from 12 MB to 2.9 MB (the remainder is two PDFs). Visually inspected the
results — no artifacts. Note this is a repo-size and transform-cost win, not a visitor
bandwidth win: `next/image` was already transcoding on the fly.

**Alt text.** I initially wrote plausible-sounding alt text from the filenames —
e.g. "SCOUT++ toolkit visualizing a robot camera frame aligned with a natural-language
instruction". **All three were wrong.** Actually viewing the images showed they are
*logos and stock illustrations*, not screenshots:

- `resumetailor_3` — the ResumeTailor **logo** (gold document icon on black)
- `fsrplanner` — the **"FSR ToolPlanner"** logo (gold calendar + wrench on dark green)
- `scout` — an illustration of a **physical tool kit** (knife, compass, pliers) captioned
  "SCOUT++ TOOL KIT"

Corrected to describe what is actually shown. **Lesson: never write alt text from a
filename — open the image.** Invented alt text is worse than none, because a screen-reader
user has no way to detect the lie.

**Two things for the user, noted but not changed:**
1. The FSR logo reads "FSR **ToolPlanner**" while `projects.ts` says "FSR **Release
   Planner**" — one of the two is wrong.
2. The SCOUT++ image depicts a literal toolbox, which misrepresents a multimodal HRI
   benchmark. Cosmetic, but it undersells the work.

---

### ✅ E19 — Soft 404: `notFound()` in a dynamic segment returned HTTP 200
Found while testing the new `/projects/[slug]` route, and it turned out to be
**pre-existing on `/blog/tag/[tag]`** too.

When a dynamic segment has `generateStaticParams` and `dynamicParams` is left at its
default of `true`, an unknown param is rendered on demand. Calling `notFound()` there
rendered the branded 404 page but still responded **HTTP 200**:

```
/projects/nope   -> 200   <title>Project not found</title>
/blog/tag/zzz    -> 200
/totally-unknown -> 404   (a genuinely unmatched route was fine)
```

A soft 404 tells crawlers the page exists, so search engines index unlimited junk URLs.

**Fix:** `export const dynamicParams = false` on both routes. Every valid slug is known
at build time, so unlisted ones should 404 outright rather than render.

```
/projects/timesense -> 200      /projects/nope -> 404
/blog/tag/meta      -> 200      /blog/tag/zzz  -> 404
```

⚠️ **Phase 10 must remove this from `/blog/tag/[tag]`.** Once posts live in the database,
tags are no longer known at build time, and `dynamicParams = false` would 404 every tag
page created after the last deploy.

**Debugging note that cost time:** the first fix appeared not to work because `next start`
was still serving a stale `.next`. Rebuilding from a clean `.next` showed it had worked all
along. When a Next config export seems to have no effect, rebuild clean before doubting it.

---

### ✅ E20 — A zombie `next-server` held port 3000 and served a stale build for ~40 minutes
Every `npm run start` after the first was silently failing with `EADDRINUSE`, because
`pkill -f "next start"` does not match the actual process, which is named `next-server`.

The symptom was baffling rather than obvious: the served HTML referenced
`/_next/static/chunks/d9245e1c….css`, but `rm -rf .next` plus a rebuild had produced
`a25ea757….css`. So the stylesheet 404'd — reported as **HTTP 400** — and pages rendered as
unstyled HTML. It looked like a CSS build failure, then like a headless-Chrome quirk, and
was neither.

**Diagnosis:** `lsof -ti:3000` showed `78878 next-server (v15.5.23)` still listening, and
the start log said `⨯ Failed to start server / EADDRINUSE`. That log line was the whole
answer and had been sitting there unread.

**Fix:** `lsof -ti:3000 | xargs kill -9` before starting. **Always kill by port, never by
process-name pattern.**

**Lesson, and this is the second time (see E19):** when output does not match the code, stop
theorising and verify what is actually running — check the port, check the server log, check
the asset hashes. Both incidents cost real time to a stale process.

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
- **Automated security PRs may do the minimum.** Vercel's bot fixed one CVE; `npm audit`
  found 28 more closed by the same patch line. Always check `fixAvailable` yourself (E16).
- **`npm audit` flagging a package doesn't mean the package is at fault.** Check `via` —
  `next` stayed flagged only because of bundled `postcss`/`sharp` (E16).
- **Next metadata objects replace, they don't deep-merge.** Declaring `openGraph` on a page
  drops inherited fields including the file-convention image (E17).
- **A 535 SMTP response means "auth failed", which reads as *wrong password* — but a
  nonexistent mailbox returns the same code.** Confirm the account exists before rotating
  its credentials (E14).
- **Client components cannot export `metadata`.** Use a route `layout.tsx` for that segment.
- **Never write alt text from a filename.** Open the image (E18).
- **A huge PNG is usually badly encoded, not oversized.** Check dimensions before assuming
  a resize is the fix (E18).
- **`notFound()` under `generateStaticParams` yields a soft 404 (HTTP 200)** unless
  `dynamicParams = false` (E19).
- **`next start` happily serves a stale `.next`.** Rebuild clean before concluding a change
  had no effect (E19).
- **Kill dev servers by port, not by name.** `pkill -f "next start"` misses `next-server`;
  use `lsof -ti:3000 | xargs kill -9`. A zombie server silently wins the port and serves an
  old build while every restart fails with EADDRINUSE (E20).
- **Read the server log before theorising.** E20 announced itself in one line that went
  unread for half an hour.
- **Internal `<a href="/...">` forces a full page reload.** Use `next/link`; eslint's
  `@next/next/no-html-link-for-pages` catches it.
