# Hono + Vite Turbo starter

Monorepo template with a Hono API, Vite web app, and shared packages wired for auth, billing, emails, and auditing. Uses Bun and Turborepo for fast installs and task orchestration.

## Structure
- apps/api: Hono server with Better Auth (email/password, social providers, passkeys, 2FA, API keys), Stripe subscriptions/webhooks, Resend email sending, and audit logging on Drizzle ORM + Postgres/Neon.
- apps/web: React 19 + Vite + Tailwind CSS v4, React Router, TanStack Query, Better Auth client hooks, Stripe integration, and UI primitives.
- packages/core: Drizzle schema, pricing tables, permissions, and shared DB helpers.
- packages/types: shared types for audit entries, subscriptions, roles, and usage metrics.
- packages/utils: date/format helpers used across the stack.
- packages/emails: React email templates for verification, OTP, password reset, and email change flows.
- packages/audit: helpers for request/auth/Stripe auditing.
- packages/eslint-config & packages/typescript-config: repo-wide linting and TS configs.
- migrations/: Drizzle migrations generated from packages/core/db/schemas.
- scripts/: migration runner used by the root migrate scripts.

## Prerequisites
- Bun 1.2+ installed
- A Postgres database URL (Neon by default in .env)

## Getting started
1) Create a project with the CLI: `npx create-hon-vite-boilerplate <project-name>` or clone and work in place.
2) Install deps: `bun install`.
3) Env files:
   - Copy `.env.example` to `.env` and set `DATABASE_URL` plus the API vars below.
   - Copy `apps/web/.env.example` to `apps/web/.env` and fill the frontend values.
4) Apply database migrations: `bun run migrate:dev` (uses Drizzle + Neon/Postgres).
5) Start dev servers: `bun run dev` (Turborepo runs api + web). Use `bun --filter api dev` or `bun --filter web dev` to run individually.

## Environment
API (`apps/api/src/config/index.ts` expects):
BETTER_AUTH_URL, FRONTEND_BASE_URL, BETTER_AUTH_SECRET, RESEND_DOMAIN_ADDRESS, RESEND_API_KEY, DATABASE_URL,
GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID/GITHUB_CLIENT_SECRET,
DISCORD_CLIENT_ID/DISCORD_CLIENT_SECRET, MICROSOFT_CLIENT_ID/MICROSOFT_CLIENT_SECRET,
STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_HOBBY_MONTHLY_ID, STRIPE_HOBBY_ANNUAL_ID,
STRIPE_DEVELOPER_MONTHLY_ID, STRIPE_DEVELOPER_ANNUAL_ID, STRIPE_TEAM_MONTHLY_ID, STRIPE_TEAM_ANNUAL_ID.

Web (`apps/web/.env.example`):
VITE_API_URL, VITE_BASE_URL, VITE_STRIPE_PUBLISHABLE_KEY, DEBUG, NODE_ENV.

## Root scripts
- `bun run dev` - run all dev servers via Turborepo.
- `bun run build` - build every workspace.
- `bun run lint` - lint all workspaces.
- `bun run format` - format ts/tsx/md files with Prettier.
- `bun run migrate:gen` - generate Drizzle migrations from schema.
- `bun run migrate:dev` - apply migrations with `.env`.
- `bun run migrate:prod` - apply migrations with `.env.prod`.
- `bun run migrate:auth` - regenerate Better Auth configuration.

Drizzle config lives in `drizzle.config.ts`; migrations are stored in `migrations/`. Turbo task outputs live in `dist/` per package.