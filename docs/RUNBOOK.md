# Runbook

Setup, environment, deploy procedures, and the action items only a human can do.

---

## Human action items

`H6` is the one that can take the live site down if skipped.

| # | Action | Needed before | Status |
|---|---|---|---|
| H1 | **Rotate the IONOS SMTP password** for `contact@ekeleogbadu.io`; update `SMTP_PASS` in Vercel **and** `.env.local` | Anytime | ⬜ |
| H2 | Vercel → **Storage → Neon (Marketplace)** → create DB. Enable branch-per-preview | Phase 7 | ⬜ |
| H3 | `npm i -g vercel && vercel link && vercel env pull .env.local` | Phase 7 | ⬜ |
| H4 | Create **two** GitHub OAuth Apps (one callback URL each) | Phase 8 | ⬜ |
| H5 | Add auth env vars to Vercel (all environments) | Phase 8 | ⬜ |
| H6 | **Run migrate + seed against production, and verify the row exists** | Before deploying Phase 10 | ⬜ |
| H7 | Vercel → Analytics tab → enable Web Analytics **and** Speed Insights | Phase 11 | ⬜ |
| H8 | Compress the 5 large PNGs — **keep `resumetailor_1/_2.png`** | Phase 4 | ⬜ |
| H9 | Supply real project URLs + Google Scholar ID (or confirm removal) | Phase 4 | ⬜ |
| H10 | Confirm nothing uses the IONOS MariaDB, then drop the WordPress tables | Any time — *not part of this project* | ⬜ |
| H11 | Add `www.ekeleogbadu.io` to Google Search Console, submit `/sitemap.xml` | After Phase 3 | ⬜ |

### H1 — Rotate SMTP password
Hygiene, **not incident response**: `git log --all -S 'SMTP_PASS='` found nothing and no
`.env*` file appears anywhere in git history. Nothing leaked. But the secret has sat in a
plaintext file on disk for months, and the endpoint was unthrottled — cheap insurance.

### H3 — Pulling env vars
`vercel env pull` **overwrites** `.env.local`. That file already holds the SMTP vars, so
back it up first and merge, don't clobber:
```bash
cp .env.local .env.local.bak && vercel env pull .env.local.new
```

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
