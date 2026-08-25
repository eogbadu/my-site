# Runbook

Setup, environment, deploy procedures, and the action items only a human can do.

---

## Human action items

`H6` is the one that can take the live site down if skipped.

| # | Action | Needed before | Status |
|---|---|---|---|
| H1 | ~~Set `SMTP_PASS` in Vercel~~ — **done**; live form verified returning `{ok:true}` | — | ✅ |
| H2 | Vercel → **Storage → Neon (Marketplace)** → create DB. Enable branch-per-preview | Phase 7 | ⬜ |
| H3 | `npm i -g vercel && vercel link && vercel env pull .env.local` | Phase 7 | ⬜ |
| H4 | Create **two** GitHub OAuth Apps (one callback URL each) | Phase 8 | ⬜ |
| H5 | Add auth env vars to Vercel (all environments) | Phase 8 | ⬜ |
| H6 | **Run migrate + seed against production, and verify the row exists** | Before deploying Phase 10 | ⬜ |
| H7 | Vercel → Analytics tab → enable Web Analytics **and** Speed Insights | Phase 11 | ⬜ |
| H8 | Compress the 5 large PNGs — **keep `resumetailor_1/_2.png`** | Phase 4 | ⬜ |
| H9 | ~~Real project URLs + Scholar ID~~ — **done**. Remaining: make `job-matching-platform` public (or supply a live ResumeTailor URL) to restore that card's links | Anytime | 🟡 |
| H10 | Confirm nothing uses the IONOS MariaDB, then drop the WordPress tables | Any time — *not part of this project* | ⬜ |
| H11 | Add `www.ekeleogbadu.io` to Google Search Console, submit `/sitemap.xml` | After Phase 3 | ⬜ |

### H1 — Rotate SMTP password ⚠️ NOW URGENT
**This is no longer hygiene — it is a live outage.** The contact form returns 500 on every
valid submission in production, so visitor messages are being silently discarded.

Diagnosis (2026-08-24), narrowed to authentication:
- `SMTP_HOST` is correct in Vercel (`smtp.ionos.com`), and was a placeholder
  (`smtp.example.com`) in `.env.local` — now corrected locally.
- The server is reachable and healthy: banner `220 perfora.net ... Nemesis ESMTP Service
  ready`, `250 STARTTLS` offered on port 587. Not a network or TLS problem.
- With the correct host and user `contact@ekeleogbadu.io`, auth fails:
  **`535 Authentication credentials invalid`**.

So the password is wrong (or SMTP access is off for that mailbox, or it needs an
app-specific password).

**Fix:**
1. IONOS control panel → Email → the `contact@ekeleogbadu.io` mailbox → reset the password.
2. While there, confirm SMTP/IMAP access is **enabled** for the mailbox, and check whether
   an app-specific password is required.
3. Update `SMTP_PASS` in **Vercel** (all environments) *and* `.env.local`.
4. Verify without deploying: `node --env-file=.env.local scripts/check-smtp.mjs`
5. Once it passes: `node --env-file=.env.local scripts/check-smtp.mjs --send`
6. Redeploy so Vercel picks up the new value, then submit the live form once.

⚠️ **Repeated failed logins can get an IONOS mailbox temporarily blocked.** Until today the
endpoint had no rate limiting (ERRORS E2), so bot traffic may have been driving failed auth
attempts continuously. If a fresh password still returns 535, the account may be blocked —
contact IONOS support.

Nothing leaked, for the record: `git log --all -S 'SMTP_PASS='` found nothing and no `.env*`
file appears anywhere in git history.

**Local backup:** `.env.local.bak` holds the pre-edit version (gitignored). Delete it once
the new password is in place.

### H3 — Pulling env vars
`vercel env pull` **overwrites** `.env.local`. That file already holds the SMTP vars, so
back it up first and merge, don't clobber:
```bash
cp .env.local .env.local.bak && vercel env pull .env.local.new
```

### H2 — Create the Neon database (step by step)

Use the **Vercel Marketplace**, not a standalone Neon account: it injects `DATABASE_URL`
into Production, Preview, and Development automatically, which removes a whole class of
"works locally, 500s in production" mistakes.

1. vercel.com → the **my-site** project
2. **Storage** tab → **Create Database** → **Neon** (listed as Serverless Postgres)
3. Region: pick one near the functions — **Washington D.C. (iad1)** for US-East
4. Free plan; connect it to **my-site** and link **all three** environments
5. Enable **"Create a branch for each preview deployment"** if offered, so preview deploys
   never touch production data

Dashboard labels shift; the thing to confirm is that **Settings → Environment Variables**
afterwards lists `DATABASE_URL`.

*Chosen over Supabase because its free tier pauses after 7 days idle and needs a manual
dashboard unpause — a monthly-posting blog would be found paused and `/blog` would 500.
Neon autosuspends and resumes transparently. See DECISIONS D1.*

### H3 — Install the CLI, link, and pull env vars

```bash
npm i -g vercel
cd ~/Documents/CAREER/PROJECTS/personal_site/my-site
vercel login
vercel link                      # select the existing "my-site" project
```

⚠️ **`vercel env pull` overwrites `.env.local`**, which holds the working SMTP credentials.
Never run it directly at that file:

```bash
cp .env.local .env.local.bak
vercel env pull .env.local.new   # then merge DATABASE_URL into .env.local
```

Pasting the `DATABASE_URL` line in by hand is a perfectly good alternative.

### H6 — Migrate and seed ⚠️

```bash
git checkout feat/db-blog-admin
npm run db:migrate    # creates posts + post_views
npm run db:seed       # inserts hello-world; idempotent
```

The seed script prints every row it finds. **Confirm `hello-world` is listed.** If that row
is absent when the Phase 10 cutover deploys, `/blog/hello-world` — a live, indexed URL —
returns 404, because the static `.mdx` file is deleted in the same commit.

Still to resolve against a live database before merging: with no database configured,
`/blog/hello-world` renders 404 content with HTTP **200**. Confirm a real missing post
returns a real 404 (cf. ERRORS E19).

### H4 — GitHub OAuth apps
GitHub → Settings → Developer settings → OAuth Apps. **An OAuth App allows exactly one
callback URL**, so two apps are required:

- **prod** — homepage `https://www.ekeleogbadu.io`,
  callback `https://www.ekeleogbadu.io/api/auth/callback/github`
- **local** — callback `http://localhost:3000/api/auth/callback/github`

⚠️ **`www`, not the apex.** The apex 307-redirects and the callback would break.

⚠️ **Don't try to make `/admin` work on Vercel Preview URLs** — they're randomly generated
per deploy and can't be registered as a callback. Test admin locally, always.

### H5 — Auth environment variables
```bash
openssl rand -base64 32   # AUTH_SECRET — use a DIFFERENT value locally than in prod
```
| Variable | Value |
|---|---|
| `AUTH_SECRET` | generated above |
| `AUTH_GITHUB_ID` | from the OAuth app |
| `AUTH_GITHUB_SECRET` | from the OAuth app |
| `ADMIN_GITHUB_ID` | `70936452` (verified via GitHub API) |
| `AUTH_URL` | `https://www.ekeleogbadu.io` |
| `AUTH_TRUST_HOST` | `true` |

### H6 — Production migrate + seed ⚠️
**This must be done and verified before the Phase 10 deploy.** If the `hello-world` row
doesn't exist when Phase 10 ships, that live, indexed URL 404s.
```bash
DATABASE_URL='<prod-url>' npm run db:migrate
DATABASE_URL='<prod-url>' npm run db:seed
DATABASE_URL='<prod-url>' npm run db:studio   # confirm the row with your own eyes
```

### H8 — Image compression
Set expectations correctly: `next/image` already transcodes to WebP/AVIF on Vercel, so
**visitors are not downloading 3.3 MB today.** The real cost is repo size, clone time, and
image-optimization transform cost. Worth doing, not a performance emergency.

```bash
npx sharp-cli -i public/projects/scout.png -o public/projects/scout.webp \
  resize 1600 -- --format webp --quality 80
```
Repeat for `fsrplanner.png`, `resumetailor_1/_2/_3.png`; `avatar.png` at 800px.

⚠️ **Do not delete `resumetailor_1.png` / `_2.png`.** They are currently unreferenced but
become the `/projects/resumetailor` gallery in Phase 6. Compress, keep.

Safe to delete: `public/{next,vercel,globe,window,file}.svg`.

---

## Environment variables

All server-side. **Nothing is `NEXT_PUBLIC_`, and nothing should become so** — a
`NEXT_PUBLIC_DATABASE_URL` would be a full compromise (see DECISIONS D5).

| Variable | Phase | Purpose |
|---|---|---|
| `SMTP_HOST` | existing | defaults to `smtp.ionos.com` |
| `SMTP_PORT` | existing | defaults to `587` |
| `SMTP_SECURE` | existing | string `"true"` comparison |
| `SMTP_USER` | existing | required |
| `SMTP_PASS` | existing | **secret** |
| `MAIL_TO` | existing | defaults to `SMTP_USER` |
| `DATABASE_URL` | 7 | Neon, injected by the Vercel integration |
| `AUTH_SECRET` | 8 | **secret** — rotating this kills all sessions |
| `AUTH_GITHUB_ID` | 8 | |
| `AUTH_GITHUB_SECRET` | 8 | **secret** |
| `ADMIN_GITHUB_ID` | 8 | `70936452` |
| `AUTH_URL` | 8 | `https://www.ekeleogbadu.io` |
| `AUTH_TRUST_HOST` | 8 | `true` |

---

## Commands

```bash
npm run dev                 # localhost:3000
npm run build               # production build
npx tsc --noEmit            # type check
npx eslint .                # lint

# Diagnose SMTP without a deploy cycle:
node --env-file=.env.local scripts/check-smtp.mjs           # verify login only
node --env-file=.env.local scripts/check-smtp.mjs --send    # also send a test email

# From Phase 7:
npm run db:generate         # SQL migration from schema changes — commit and READ it
npm run db:migrate          # apply migrations (never runs in next build — by design)
npm run db:seed             # idempotent, ON CONFLICT DO NOTHING
npm run db:studio           # browse the DB
```

---

## Deploy

Vercel deploys `main` automatically on push. No `vercel.json`, no CI in-repo (until Phase 12).

- **Phases 1-6, 11-12:** commit straight to `main`.
- **Phases 7-10:** push a branch, open the **Vercel Preview URL**, verify, then
  fast-forward `main`. Costs ~90 seconds and is the only thing between a Phase 10 mistake
  and a 404 on the only blog post.

### Rollback
`git revert <commit>` and push — `main` redeploys in ~90 seconds. For Phase 10 the Neon
rows are untouched by a revert, so a second attempt costs nothing. **Do not rewrite the
history that contains `blog/hello-world/page.mdx`** — the revert is the parachute.

### Verifying production
```bash
curl -sS -I -L https://ekeleogbadu.io | grep -iE '^(HTTP|server|x-vercel|location)'
curl -sS -o /dev/null -w '%{http_code}\n' https://www.ekeleogbadu.io/robots.txt
```
Note the apex 307-redirects to `www` — always follow redirects or request `www` directly.
