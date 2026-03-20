# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   ├── api-server/         # Express API server
│   └── bihar-diwas/        # Jio Bihar Diwas promotional website (React + Vite)
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## Jio Bihar Diwas Website

Bilingual (Hindi + English) promotional website for Bihar Diwas.

### Features
- Festive landing page with Bihar-themed colors (saffron, green, Jio blue)
- WhatsApp share button with pre-filled message + referral link (?ref=NUMBER)
- Frontend share counter (localStorage) — tracks 3 unique shares
- After 3 shares: mobile number claim form → saved in-memory (no DB needed)
- Referral flow: visitors arriving via ?ref= link see same sharing prompt
- Admin page at /admin — password-protected via ADMIN_PASSWORD env var
- Admin table with all submitted numbers, timestamps, referrer info
- "Copy All Numbers" button for easy export

### API Endpoints
- `POST /api/recharge-requests` — Submit mobile number for recharge
- `POST /api/admin/verify` — Verify admin password
- `GET /api/admin/recharge-requests?password=xxx` — List all submissions (admin only)

### Data Storage
- In-memory store (`artifacts/api-server/src/store.ts`) — no database required
- Data resets on server restart (by design — no external DB dependency)

### Secrets / Env Vars
- `ADMIN_PASSWORD` — password for the /admin page

### Render Deployment
- `render.yaml` at repo root configures the Render service
- Build command: `pnpm install && BASE_PATH=/ pnpm --filter @workspace/bihar-diwas run build && pnpm --filter @workspace/api-server run build`
- Start command: `node artifacts/api-server/dist/index.cjs`
- The Express server serves both the API (`/api/*`) and the built React frontend (SPA fallback)
- Set `ADMIN_PASSWORD` as an environment variable in Render dashboard

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/bihar-diwas` (`@workspace/bihar-diwas`)

React + Vite frontend for the Jio Bihar Diwas promotional website. Mobile-first, bilingual.

- Uses: React Query, Wouter, Framer Motion, canvas-confetti, Tailwind CSS
- Routes: `/` (home/offer page), `/admin` (admin panel)

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers
- Depends on: `@workspace/db`, `@workspace/api-zod`

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL.

- `recharge_requests` table — stores mobile numbers submitted for the Bihar Diwas offer
- Run migrations: `pnpm --filter @workspace/db run push`

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config. Run codegen: `pnpm --filter @workspace/api-spec run codegen`
