# Progress Tracker

**Read this first when resuming.** Status of every phase of the site upgrade.
Full plan: `~/.claude/plans/review-the-code-we-lively-melody.md`

Legend: ⬜ not started · 🟡 in progress · ✅ done · ⏸️ blocked

| # | Phase | Status | Commit | Notes |
|---|---|---|---|---|
| 1 | Contact form: fix crash + restore hardening | ✅ | `c20e98a` | Mail delivery unverifiable locally — see ERRORS E14 |
| 2 | Config, styling, build hygiene | ✅ | `143d5fc` | Fixed E4–E9; lint now fully clean |
| 3 | `siteConfig` + full SEO pass | ⬜ | — | Blocked on H9 (real URLs) for the placeholder fix |
| 4 | Accessibility + images | ⬜ | — | Needs H8 (image compression) |
| 5 | Dark mode toggle | ⬜ | — | **Requires Phase 2 first** (unlayered `body{}` fix) |
| 6 | De-client `/about` + `/projects/[slug]` | ⬜ | — | |
| 7 | Database foundation | ⬜ | — | Needs H2, H3. **Branch + Preview** |
| 8 | Auth + admin shell | ⬜ | — | Needs H4, H5. **Branch + Preview** |
| 9 | Admin CRUD + MDX renderer | ⬜ | — | **Branch + Preview** |
| 10 | Blog cutover (riskiest) | ⬜ | — | Needs H6 done *and verified*. **Branch + Preview** |
| 11 | View counts + analytics | ⬜ | — | Needs H7 |
| 12 | Tests, CI, docs | ⬜ | — | |

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

## Phase completion checklist

Before marking a phase ✅:
1. `npx tsc --noEmit` clean
2. `npx eslint .` clean (0 warnings after Phase 2)
3. `npm run build` succeeds
4. Phase-specific verification from the plan performed
5. `docs/PROGRESS.md`, `docs/ERRORS.md`, `docs/DECISIONS.md` updated
6. Committed with the phase name in the message
