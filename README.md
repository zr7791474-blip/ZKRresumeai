# ZKR Resume AI

An AI-powered resume/CV platform built with Next.js 15 (App Router), Prisma, PostgreSQL, and Tailwind CSS. Users can register, build multiple resumes from templates, edit them section by section, use AI tools (summary generation, ATS optimization, rewriting, grammar fixing, scoring, cover letters, skill suggestions), export to PDF/DOCX/JSON, and manage a Free or Pro subscription via Stripe.

## Tech stack

- **Framework:** Next.js 15 (App Router, Route Handlers)
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Custom JWT (access + refresh token) auth with httpOnly cookies
- **UI:** Tailwind CSS + Radix UI primitives (shadcn/ui style)
- **State/data:** Zustand (client auth state) + TanStack Query (server state)
- **Validation:** Zod
- **AI:** OpenAI (optional) with an offline heuristic fallback engine
- **Email:** Resend (optional) with a console-log dev fallback
- **Payments:** Stripe (optional) — subscriptions, checkout, billing portal, webhooks
- **Exports:** `pdf-lib` (PDF) and `docx` (Word) — real binary generation, not placeholders

---

## 1. Prerequisites

- Node.js 20+ and npm
- A PostgreSQL 14+ database (local or hosted — e.g. Supabase, Neon, Railway, RDS)
- (Optional) A [Resend](https://resend.com) API key, for real email delivery
- (Optional) An [OpenAI](https://platform.openai.com) API key, for LLM-backed AI tools
- (Optional) A [Stripe](https://stripe.com) account, for paid subscriptions

None of the optional integrations are required to run the app — see [Optional integrations](#5-optional-integrations) below for exactly what happens when each is left unconfigured.

---

## 2. Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template and fill in real values
cp .env.example .env

# 3. Generate the Prisma client
npx prisma generate

# 4. Push the schema to your database (creates tables/enums/indexes)
npx prisma db push
# — or, if you prefer tracked migrations instead of db push:
# npx prisma migrate dev --name init

# 5. Start the dev server
npm run dev
```

The app will be running at `http://localhost:3000`.

> **Note on `prisma generate`:** this command downloads Prisma's query-engine binary from `binaries.prisma.sh` the first time it runs. It needs normal outbound internet access — it will fail in network-sandboxed CI environments that block that domain. This is a Prisma platform requirement, not specific to this project.

---

## 3. Environment variables

All variables live in `.env` (see `.env.example` for the full template with placeholder values).

### Required

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://user:pass@host:5432/dbname` |
| `JWT_SECRET` | Random 32+ character string used to sign access tokens |
| `JWT_REFRESH_SECRET` | A **different** random 32+ character string used to sign refresh tokens |
| `NEXT_PUBLIC_APP_URL` | The public URL of the deployed app (used in emails, OG tags, sitemap, Stripe redirect URLs) |
| `NEXT_PUBLIC_APP_NAME` | Display name shown throughout the UI |

Generate strong secrets with:
```bash
openssl rand -base64 32
```

In development, `JWT_SECRET`/`JWT_REFRESH_SECRET` fall back to a fixed insecure dev value if unset, purely so `next dev` doesn't crash before you've configured `.env`. In production (`NODE_ENV=production`), missing secrets throw immediately instead — the app will not silently run with a weak key.

### Optional — AI

| Variable | Description |
|---|---|
| `OPENAI_API_KEY` | If set, the AI writing tools (summary, rewrite, grammar fix, cover letter) call OpenAI's Chat Completions API |
| `OPENAI_MODEL` | Model name, defaults to `gpt-4o-mini` |

If unset, or if any OpenAI call fails for any reason (network error, rate limit, timeout, bad response), the same tools transparently fall back to a deterministic, offline heuristic engine — the product is fully functional with zero external AI dependency and zero cost. ATS keyword-matching and resume scoring are always heuristic (they're structured/algorithmic tasks, not generative ones).

### Optional — Email

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | If set, verification and password-reset emails are sent via [Resend](https://resend.com) |
| `EMAIL_FROM` | The `From` address/name used for outgoing email |

If unset, emails are printed to the server console instead of sent — verification/reset links are still fully usable locally, just via the terminal instead of an inbox.

### Optional — Billing (Stripe)

| Variable | Description |
|---|---|
| `STRIPE_SECRET_KEY` | Your Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for the `/api/webhooks/stripe` endpoint (from the Stripe CLI or Dashboard) |
| `STRIPE_PRO_PRICE_ID` | The Price ID for the Pro plan subscription product |

If `STRIPE_SECRET_KEY` (and `STRIPE_PRO_PRICE_ID`) aren't set, every billing route responds with a clear `501 Not Configured` instead of crashing, and the UI degrades gracefully: the Pricing page's Pro button just routes to signup, and the Settings page hides the "Manage Billing" flow behind the same graceful error.

---

## 4. Database

### Schema

The full schema lives in `prisma/schema.prisma`. Key models: `User`, `Session`, `RefreshToken`, `PasswordReset`, `EmailVerification`, `Resume`, `ResumeSection`, `AIRequest`, `Download`, `Notification`, `UserSettings`, `ContactSubmission`.

Notable design points:
- Soft deletes on `User` and `Resume` (`deletedAt`), so account/resume deletion is recoverable at the DB level and never cascades destructively by accident.
- `onDelete: Cascade` on all child relations (sessions, tokens, resumes, sections, downloads, AI requests, settings) — deleting a user cleans up everything that belongs to them.
- `@@unique([resumeId, order])` on `ResumeSection` prevents two sections in the same resume from claiming the same display position.
- `User.stripeCustomerId` / `stripeSubscriptionId` are both `@unique`, so two accounts can never be linked to the same Stripe customer or subscription.

### Commands

```bash
npx prisma generate     # regenerate the Prisma client after schema changes
npx prisma db push      # sync schema to the database without migration history (fast, good for dev)
npx prisma migrate dev  # create a tracked migration (recommended once you have a team/production DB)
npx prisma studio       # visual DB browser
```

### Verification performed in this environment

A full sandbox network restriction prevented running `prisma generate` directly here (see [Known limitations](#7-known-limitations)). As a substitute, the schema was hand-translated to raw SQL DDL and applied to a real local PostgreSQL 16 instance, then exercised with a script mirroring the exact query patterns used by every repository and service in this codebase — 24 checks covering registration, login/remember-me token lifetimes, refresh rotation, resume CRUD and ownership scoping, section ordering constraints, cascade deletes, AI credit deduction, settings upserts, full account-deletion cascades, and Stripe plan/webhook state transitions. All 24 passed. This is not a substitute for running the real Prisma Client against your database before shipping, but it does verify the schema and query logic are sound.

---

## 5. Optional integrations

Every third-party integration in this project is additive: the app is fully usable with none of them configured.

| Integration | Unconfigured behavior |
|---|---|
| OpenAI | AI tools use the offline heuristic engine instead |
| Resend | Emails are logged to the server console instead of sent |
| Stripe | Billing routes return `501`; UI links to signup instead of checkout |

---

## 6. Development

```bash
npm run dev          # start the dev server
npm run type-check   # tsc --noEmit
npm run lint         # next lint (ESLint)
```

### Testing Stripe webhooks locally

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
# copy the printed whsec_... into STRIPE_WEBHOOK_SECRET
```

### Project structure

```
src/
  app/                  # Next.js App Router pages + API routes
    (auth)/              # public auth pages: login, register, forgot/reset password, verify email
    (dashboard)/          # protected app: dashboard, resumes, editor, templates, profile, settings, admin
    api/                  # route handlers (auth, resumes, ai, billing, webhooks, admin, contact, settings)
  components/            # ui/ (design system primitives), layout/, shared/, resume/
  core/                  # interfaces (repository contracts) + AppError
  infra/                 # Prisma client + repository implementations
  services/               # business logic (auth, resume, ai, billing, admin, settings)
  lib/                    # cross-cutting utilities: jwt, cookies, rate-limit, email, ai provider, stripe
  validators/             # Zod schemas per domain
  hooks/, stores/          # React Query hooks + Zustand stores
```

Architecture flow: **UI → hooks/stores → API routes → services → repositories → Prisma → PostgreSQL.**

---

## 7. Known limitations

- **`prisma generate` requires normal internet access** to `binaries.prisma.sh` to download the query engine. It cannot be run in network-restricted sandboxes (this includes the environment this project was built and verified in) — this is a Prisma platform constraint, not a project defect. Run it once in a normal dev/CI environment before your first build.
- **Rate limiting is process-local** (in-memory, not shared across instances). It works correctly for a single long-running server process but won't coordinate limits across multiple instances or serverless invocations. For a horizontally scaled deployment, swap `src/lib/rate-limit.ts`'s in-memory store for a shared one (e.g. Upstash Redis) behind the same function signature.
- **"Log out" revokes all sessions**, not just the current device — there's no per-device session list UI yet. `changePassword` is the one exception: it revokes every *other* session while keeping the one you're using.
- AI-generated content (summaries, rewrites, cover letters) should always be reviewed by the user before use, same as any LLM-backed writing tool.

---

## 8. Build & deployment

```bash
npm run build   # runs `prisma generate && next build`
npm run start   # start the production server
```

### Deployment checklist

1. Provision a PostgreSQL database and set `DATABASE_URL`.
2. Set strong, unique `JWT_SECRET` / `JWT_REFRESH_SECRET` values (production will refuse to start without them).
3. Run `npx prisma migrate deploy` (or `db push` for simple setups) against the production database.
4. Set `NEXT_PUBLIC_APP_URL` to your real domain (used in emails, sitemap, and Stripe redirects).
5. Configure `RESEND_API_KEY` / `EMAIL_FROM` if you want real email delivery.
6. Configure `OPENAI_API_KEY` if you want LLM-backed AI tools instead of the heuristic fallback.
7. Configure Stripe (`STRIPE_SECRET_KEY`, `STRIPE_PRO_PRICE_ID`) and register a webhook endpoint at `/api/webhooks/stripe` pointing at your deployed domain, then set `STRIPE_WEBHOOK_SECRET` to the value Stripe gives you for that endpoint.
8. Run `npm run build` and deploy the output (Vercel, a Node server, or a Docker container all work — there's nothing Vercel-specific in this codebase).

---

## License

Proprietary — all rights reserved.
