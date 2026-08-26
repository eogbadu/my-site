# Progress Tracker

**Read this first when resuming.** Status of every phase of the site upgrade.
Full plan: `~/.claude/plans/review-the-code-we-lively-melody.md`

Legend: ⬜ not started · 🟡 in progress · ✅ done · ⏸️ blocked

| # | Phase | Status | Commit | Notes |
|---|---|---|---|---|
| 1 | Contact form: fix crash + restore hardening | ✅ | `c20e98a` | Mail delivery unverifiable locally — see ERRORS E14 |
| 2 | Config, styling, build hygiene | ✅ | `143d5fc` | Fixed E4–E9; lint now fully clean |
| 3 | `siteConfig` + full SEO pass | ✅ | `8bf9ca4` | Placeholder URLs (H9) still pending — deferred to Phase 4 |
| 4 | Accessibility + images | ✅ | `a2d9b87` | Images compressed in-repo; H8 no longer needed |
| 5 | Dark mode toggle | ✅ | `e2f30c7` | Token-driven; zero `dark:` variants remain |
| 6 | De-client `/about` + `/projects/[slug]` | ✅ | `36d382d` | Also fixed a pre-existing soft 404 (E19) |
| 7 | Database foundation | ✅ **live** | `161e17d` | Neon provisioned, migrated, seeded |
| 8 | Auth + admin shell | ✅ **live** | `39675c3` | OAuth app + env set; sign-in verified |
| 9 | Admin CRUD + MDX renderer | ✅ **live** | `80f0aee` | Post created and published through the admin |
| 10 | Blog cutover (riskiest) | ✅ **live** | `08e33e9` | Blog serves from Neon; real 404s verified |
| 11 | View counts + analytics | ✅ | `bdbacf6` | Counting verified; analytics needs H7 toggled |
| 12 | Tests, CI, docs | ✅ | `0d6f8e1` | 22 tests; CI needs no secrets. Found E23 |

## Current state

**Starting point commit:** `e2d38b5` — clean tree, branch `main`.

Baseline verified before any changes:
- `npx tsc --noEmit` → clean
- `npx eslint .` → 3 warnings (unused `Twitter`, unused `isEmpty`, anonymous default export)

## Session log

### 2026-08-24 — Review and planning
- Read the full codebase (~1,900 lines) and audited it.
- Verified deployment topology by DNS lookup and live HTTP requests: **Vercel serves
  the site**; IONOS is DNS + mail only; `www` is canonical; no production Docker.
- Confirmed four defects live in production (see `docs/ERRORS.md`).
- Established the 12-phase plan; user approved.
- Created the documentation system (`CLAUDE.md`, `docs/`).
- Completed **Phase 1**. See below.
- **Next:** Phase 2 — config, styling, build hygiene.

### 2026-08-24 — Phase 1 complete

**Changed:** `src/app/api/contact/route.ts`, `src/app/contact/page.tsx`.

Fixed E1 (crash), E2 (rate limiting), E3 (honeypot), E12 (PII in logs). Added `.max()`
bounds to every field, memoized the SMTP transporter at module scope, and moved to a
`{ ok, fieldErrors, formError }` contract via zod 4's `z.flattenError()`. The client now
renders errors inline per field with `aria-invalid` / `aria-describedby`, and the honeypot
uses React 19's `inert` instead of `aria-hidden` around a focusable input.

**Verified by live request against a dev server:**

| Test | Result |
|---|---|
| Validation error (the crash case) | `400` + `fieldErrors` as **string arrays** — renderable, no crash |
| Honeypot filled | `204`, empty body, no mail |
| Honeypot present but empty (real user) | falls through to normal validation ✅ |
| Malformed JSON | `400` + `formError` |
| Rate limit — 7 requests | 5 pass, 6th and 7th → `429` with `Retry-After: 599` |
| `RateLimit-Remaining` header | counts down 4→3→2→1→0 correctly |
| Contact page render | `200`, `inert` present in HTML, no dev errors |
| Error-path logging | error logged, **no submitter email** in output ✅ |

**Not verified: actual mail delivery.** Blocked by environment, not code — see ERRORS E14.
`.env.local` has a placeholder `SMTP_HOST` and credentials that return
`535 Authentication credentials invalid`. Stopped after one attempt to avoid a lockout.

⚠️ **Open question for the user:** if production's `SMTP_PASS` is also stale, the live
contact form is already silently broken. Worth checking the Vercel env vars (RUNBOOK H1).

**One bug introduced and caught during testing:** the honeypot's `.max(0)` — see E13.

### 2026-08-24 — Out-of-band security upgrade

Next.js **15.5.5 → 15.5.23** (`559f574`), closing 29 advisories including the critical
React Flight RCE. Chose 15.5.23 over the 15.5.9 in Vercel's automated PR #1, which would
have left ~20 advisories open. See ERRORS E16.

⚠️ **Vercel PR #1 must be CLOSED, not merged** — merging it would downgrade next to 15.5.9.

### 2026-08-24 — Phase 1 verified in production

Deploy landed after the security push. Verified against `https://www.ekeleogbadu.io`:

| Check | Result |
|---|---|
| All 10 routes | `200` |
| Unknown path | `404` |
| Validation error (the crash case) | `400` + `fieldErrors` string arrays ✅ |
| Honeypot filled | `204` ✅ |
| Rate limit, 7 requests | 5 pass, 6th and 7th `429` ✅ (warm-lambda reuse held) |
| **Valid submission** | **`500` — mail delivery is broken, see E14** ⚠️ |

### 2026-08-24 — Phase 2 complete

Fixed **E4, E5, E6, E7, E8, E9**. Lint went from 3 warnings to **zero**.

| Change | Verified by |
|---|---|
| MDX map moved to the correct location + named export | `/blog/hello-world` now emits `<h1 class="text-3xl font-bold...">` — **styled for the first time** |
| `next/font` Geist wired | built CSS has `--font-sans:var(--font-geist-sans)` with the variable defined; `<html>` carries the classes |
| Unlayered `body{}` removed | only remaining `body` rule is inside `@media print` |
| `tailwind.config.ts` deleted, plugin removed | `.line-clamp-3` still emitted by v4 core |
| Next 15 async `params` | typecheck clean, `/blog/tag/meta` → 200 |
| Footer year | renders `© 2025–present` |
| `src/lib/env.ts` + `.env.example` | wired into the contact route; no raw `process.env` left there |

Also added `blockquote`, `hr`, and GFM `table`/`th`/`td` to the MDX map (previously
unstyled), and rewrote the README, which was still `create-next-app` boilerplate.

**Deps:** removed `@tailwindcss/line-clamp`, `autoprefixer`, `mdx@0.3.1`; moved
`@mdx-js/mdx` + `remark-gfm` to `dependencies` (they are runtime deps); added
`server-only`, `@types/mdx`; bumped `eslint-config-next` to match Next 15.5.23.

**Verified in production** after deploy:

| Check | Result |
|---|---|
| `/blog/hello-world` | `<h1 class="text-3xl font-bold mt-2 mb-3">`, `<pre class="rounded-xl bg-slate-950 ...">` — **styled live for the first time** |
| Footer | renders `© 2025–present Ekele Ogbadu. All rights reserved.` |
| `<html>` | carries the Geist + Geist Mono variable classes |
| All 10 routes | `200`; unknown path `404` |

### 2026-08-25 — Phase 3 complete

Fixed **E11** (no SEO surface) and found/fixed **E17** along the way.

Created `src/config/site.ts` as the single source of truth and wired it into Navbar,
SocialLinks, Footer, ResumeActions, the homepage hero, and the root metadata — those values
had been duplicated across six files.

| Added | Verified |
|---|---|
| `metadataBase` + title template + OG/Twitter/robots | `<title>Projects · Ekele Ogbadu</title>`, canonical on every page |
| Per-page metadata for all 6 routes that had none | titles/canonicals confirmed on all 10 routes |
| `src/lib/metadata.ts` (`buildMetadata`) | `og:image` count exactly 1 on all 10 routes |
| `sitemap.ts` | `/sitemap.xml` → 200, absolute www URLs, includes posts + tags |
| `robots.ts` | `/robots.txt` → 200, disallows `/api/` and `/admin`, points at sitemap |
| `opengraph-image.tsx` | real 1200×630 PNG, 184 KB |
| `not-found` / `error` / `global-error` / `loading` | `/does-not-exist` → 404 with branded page |

`/about` and `/contact` are client components and cannot export `metadata`, so each got a
route `layout.tsx`. The `/about` one is removed in Phase 6 when the page becomes a server
component.

**Also fixed:** `ResumeActions.copyLink` used `window.location.origin`, which on the apex
produces a URL that 307-redirects; it now shares the canonical origin.

### 2026-08-25 — Phase 4 complete

**Accessibility** — verified in the rendered HTML:
- Skip link as the first focusable element, targeting `<main id="main" tabindex="-1">`
  with `scroll-mt-20` to clear the sticky header
- `<nav aria-label="Main">`; mobile toggle now uses lucide `Menu`/`X` (self-hiding from the
  a11y tree) with `aria-expanded` + `aria-controls="mobile-menu"`, Escape to close, and
  focus returned to the trigger
- Descriptive `alt` everywhere; added `imageAlt` to the `Project` type

**Images** — 10.0 MB → 0.67 MB (93%), `public/` 12 MB → 2.9 MB. See ERRORS E18.
Did the compression in-repo with the `sharp` already present via Next, so **runbook H8 is
no longer a user action**. Kept `resumetailor_1/_2` for the Phase 6 gallery.

**`priority` fix** — was `priority={p.featured}`, and every project is featured, so
below-the-fold cards preloaded and competed with the LCP. Now an explicit `eager` prop.
Verified: exactly **1** preload tag on `/` (the hero avatar), **0** on `/projects`.

**Also:** added TimeSense as the flagship project (first + featured), and deleted the five
unreferenced `create-next-app` SVGs.

### 2026-08-25 — Phase 6 complete

**`/about` is a server component again.** Extracted `src/components/Tabs.tsx` (client) and
pass the panels in as server-rendered JSX, so all three tabs' prose ships as crawlable HTML
— verified all three panels present in the response. Full WAI-ARIA tabs: 3 `role="tab"`,
3 `role="tabpanel"`, 2 hidden, 1 `aria-selected="true"`, roving tabindex, arrow/Home/End
keys. Its route `layout.tsx` (a Phase 3 workaround) is gone since the page exports its own
metadata now.

**`/projects/[slug]`** — 4 pages prerendered, each with hero image, highlights, background
prose, stack, links, optional gallery and video. The TimeSense demo video now renders with
`preload="none"` so the 2.7 MB file stays off the initial load. `resumetailor_1/_2.webp`
finally have a purpose as the ResumeTailor gallery.

**Fixed a pre-existing soft 404** — see ERRORS E19.

**Also:** restored ResumeTailor's repo link now that `job-matching-platform` is public
(verified 200 anonymously); converted three internal `<a>` tags to `next/link` (one was a
lint *error*, not a warning); added project pages to the sitemap; **unfeatured FSR Release
Planner** so `/` shows 3 cards and `/projects` shows 4 — they were identical before.

### 2026-08-25 — Content, design, and conference readiness

Out of phase order, driven by the user's brief that the site serves recruiters **and**
academic credibility at conferences — and by an IEEE RO-MAN talk two days out.

- **Résumé** rebuilt from the June 2026 docx (Lead AI/ML Engineer; Prescient Edge, Navy, and
  entrepreneurial roles the site never showed). `public/resume.pdf` was still the **May 2025**
  file; regenerated from the docx via LibreOffice. Master's thesis added under the M.S. entry.
- **Research** corrected — see ERRORS **E21**. Ask-to-Act now carries its real three-author
  list, the real abstract, and the camera-ready PDF, plus a "Presenting August 2026" badge
  via a new optional `note` field on `Publication`.
- **SCOUT++** card rebuilt from the project's own release material (example-task flow), with
  a three-image gallery. The previous image was stock art of a literal toolbox.
- **TimeSense** card composited from three real demo-video frames; demo video re-encoded
  6.3 MB → 2.7 MB and wired into the detail page with `preload="none"`.
- **Design pass** — editorial identity, token system, serif display face. See DECISIONS D11.
- **Favicon** — serif EO monogram replacing the create-next-app default. Verified live;
  browsers cache favicons aggressively, so a hard refresh or incognito window is needed to
  see the change.

### 2026-08-25 — Phase 5 complete

Three-state theme (light / dark / system) on `data-theme`, with the dark token block
declared twice on purpose: under `prefers-color-scheme` guarded by
`:not([data-theme="light"])` so an explicit light choice wins on a dark OS, and under
`[data-theme="dark"]` so an explicit dark choice wins on a light OS.

The Phase-3 token work paid off here: because components style themselves with `bg-paper`
/ `text-ink-muted` rather than `dark:` variants, re-theming is purely a matter of
redefining custom properties. **Zero `dark:` variants remain in any component** — the last
four (semantic red/green on the contact form) became `--danger` / `--success` tokens.

Anti-flash script is inline and render-blocking in `<head>`, wrapped in try/catch so a
storage-disabled browser degrades to system preference instead of throwing before paint.
`ThemeToggle` renders a fixed-size placeholder until mounted, since the stored theme is
unknown during SSR and rendering the real icon would guarantee a hydration mismatch.

**Verified** by rendering the real page HTML with `data-theme="dark"` and a self-contained
CSS inline: background `#0b0b0c`, light text, correct rules and muted labels.

### 2026-08-25 — Phases 7–10 written on `feat/db-blog-admin`

All four phases are coded, typechecked, linted, and building. **None are merged.**
`main` is untouched and still serving the verified site.

| Phase | State | Blocked on |
|---|---|---|
| 7 Database | code complete, migration SQL generated and reviewed | H2/H3 — Neon + `vercel env pull` |
| 8 Auth | code complete; verified it fails **closed** with no credentials | H4/H5 — GitHub OAuth apps + env |
| 9 Admin CRUD | code complete; MDX guard verified directly | — |
| 10 Cutover | code complete, **must not merge yet** | H6 — migrate + seed + verify |

**⛔ Why Phase 10 must not merge.** It deletes `src/app/blog/hello-world/page.mdx` in the
same commit that adds `/blog/[slug]` — correct, because a static segment always beats a
dynamic one. But that means the live, indexed `/blog/hello-world` URL is served **only**
from the database from that commit onward. If the row is not there, that URL 404s.

**Open question, unresolved.** With no database configured, `/blog` returns HTTP 200 while
stuck on its loading fallback, and `/blog/hello-world` renders 404 *content* with HTTP
**200** — a soft 404 on the one URL that must not break. This is likely an artifact of the
query throwing rather than returning null, and should resolve once a real database returns
a real row. **It has to be confirmed against a live database before merging**, and if
`notFound()` still yields 200 for a genuinely missing post, that needs fixing first (cf. E19).

**Design decision made during Phase 10:** `/blog`, `/blog/tag`, and `/sitemap.xml` are
`force-dynamic`. As static routes Next prerenders them at build, which would read the
database during `next build` — the exact coupling avoided everywhere else. Per-request
rendering costs almost nothing because the queries are wrapped in `unstable_cache`, so
steady-state traffic still makes zero database calls; only the Full Route Cache is given up.
`/sitemap.xml` additionally degrades gracefully, listing all 12 static routes if the
database is unreachable — verified.
### 2026-08-25 — Phase 12 complete

22 tests across `tags`, `group`, `rate-limit`, and the contact schema, plus a GitHub Actions
workflow running typecheck → lint (`--max-warnings 0`) → tests → build on every push and PR.

**CI is given no secrets, deliberately.** Nothing in the build may read the database or mail
config, so if that step ever starts needing one, the coupling has been reintroduced and
should be fixed rather than papered over. That property is why it holds: `DATABASE_URL` is
optional in the env schema and asserted at point of use, the db client is lazily
constructed, and no route reads the database at build time.

**The suite immediately earned its keep** — a test asserting email normalisation failed on
the first run and turned out to be a live production bug (ERRORS **E23**): `z.email().trim()`
validates before it transforms, so any address pasted with a stray space was rejected as
invalid. Confirmed against production, then fixed. The route also had its own copy of the
schema, so the test would have proved nothing about the real endpoint; the schema is now
extracted and imported by both.

Several tests are written as regression guards for specific past incidents — the honeypot
must *pass* validation (E13), field errors must be plain strings (E1), and the lossy
`slugToLabel` round-trip is asserted as lossy to document why the database stores both tags
and tag_slugs.

### 2026-08-26 — Phases 7–10 shipped

Neon provisioned via the Vercel Marketplace, migrated, seeded, and the cutover merged and
deployed. **The blog now serves from the database.** Verified in production:
`/blog/hello-world` 200 with correct content, `/blog` and the tag pages 200, and missing
posts and unknown tags returning **real 404s**.

Running against a real database immediately exposed three bugs that no amount of local
reasoning had caught — see ERRORS **E24**, **E25**, **E26**. The first two compounded:
`loading.tsx` made every route stream, which both turned `notFound()` into a soft 404 *and*
masked a 500 as a success. Removing it surfaced a `Date`-serialisation bug that had been
invisible.

Two CI failures also worth recording, both lockfile-related and neither affecting
production:
1. `npm ci` wanted platform binaries a macOS-generated lockfile omitted.
2. The real cause was subtler — npm 11 and npm 10 **hoist transitive dependencies
   differently**, so a lockfile written by one is not valid for the other. CI now runs
   Node 24 (npm 11) to match. Green.

**Still outstanding:** the admin dashboard is deployed but unreachable until the GitHub
OAuth apps and auth env vars exist (RUNBOOK H4/H5). `/admin` correctly 307s to its login
page in the meantime.

### 2026-08-26 — Phase 11 complete (all twelve phases done)

View counting and analytics. Also corrects the table: phases 8 and 9 were still marked
blocked, but the OAuth app and env vars are in place and a post has been created and
published through the admin.

**Counting** — `POST /api/posts/[slug]/views`, one atomic CTE: resolve the slug, insert
into `post_views`, and add however many rows the insert actually created (1 for a new
visitor, 0 for a repeat). One statement, one round trip, which is why the HTTP driver's
lack of interactive transactions costs nothing.

Two dedupe layers, both verified against the real database:

| | |
|---|---|
| Same visitor, 4 requests | stays at **1** |
| Different visitor | **2** |
| Unknown post | **404** |

`visitor_hash` is `sha256(ip \| user-agent \| AUTH_SECRET \| date)` — **no raw IP is
stored**, and because the date is an input the salt rotates daily on its own, so
yesterday's hashes cannot be correlated with today's.

**The rule that protects the cache:** this endpoint must never call `revalidateBlog()`.
Invalidating on every pageview would be worse than having no cache at all. Instead it
returns the fresh total and `ViewCounter` renders it, so the number is live without the
page cache ever knowing. Verified: the route contains no revalidation call.

`ViewCounter` fires on mount rather than during render, so `<Link>` prefetch — which
fetches the RSC payload without mounting — cannot inflate the count.

**Analytics** — `@vercel/analytics` and `@vercel/speed-insights` in the root layout.
Cookieless, so no consent banner. Still needs **H7**: enabling both in the Vercel
dashboard. Installing the packages alone does nothing.

## Phase completion checklist

Before marking a phase ✅:
1. `npx tsc --noEmit` clean
2. `npx eslint .` clean (0 warnings after Phase 2)
3. `npm run build` succeeds
4. Phase-specific verification from the plan performed
5. `docs/PROGRESS.md`, `docs/ERRORS.md`, `docs/DECISIONS.md` updated
6. Committed with the phase name in the message
