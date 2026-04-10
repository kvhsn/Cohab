# Full-Stack CI/CD Pipeline for Cohab

**Date:** 2026-04-09
**Status:** Draft
**Stack:** Neon (DB) + Vercel (API) + EAS Update (Mobile)

## Context

Cohab has no CI/CD pipeline. The API runs locally via docker-compose, and there's no production deployment. This spec defines a fully automated pipeline triggered on push to `main`, deploying the API to Vercel, running Prisma migrations on Neon, and pushing OTA updates to mobile via EAS Update. All services use free tiers.

## Architecture Overview

```
push to main
    |
    v
GitHub Actions (.github/workflows/deploy.yml)
    |
    +---> 1. pnpm install + prisma generate
    +---> 2. lint + test
    +---> 3. prisma migrate deploy (Neon)
    +---> 4. vercel deploy --prod (API)
    +---> 5. eas update --branch main (Mobile OTA)
```

## 1. API Dual Entry Point

**Strategy:** Extract the Hono app into `src/app.ts`. Two entry points import it.

### `packages/api/src/app.ts` (NEW)

Extracts lines 11-32 from current `src/index.ts`: Hono app creation, middleware (CORS, requestId, error handler), route registration (auth, household, me, health).

### `packages/api/src/index.ts` (MODIFIED)

Imports `app` from `./app`, calls `serve()` and `showRoutes()`. Local dev only.

### `packages/api/api/index.ts` (NEW — Vercel entry point)

```typescript
import { handle } from 'hono/vercel';
import app from '../src/app';
export default handle(app);
```

### `packages/api/vercel.json` (NEW)

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/api" }]
}
```

Vercel auto-detects `api/index.ts` as a serverless function. The rewrite sends all traffic to it.

## 2. Database Driver (Conditional)

**Strategy:** Keep `pg` for local dev, use `@neondatabase/serverless` for Vercel. Branch on `process.env.VERCEL`.

### `packages/api/src/libs/prisma.ts` (MODIFIED)

```typescript
import { PrismaClient } from '../generated/prisma/client.js';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) throw new Error('DATABASE_URL is not set');

let prismaInstance: PrismaClient;

if (process.env.VERCEL === '1') {
  const { Pool } = require('@neondatabase/serverless');
  const { PrismaNeon } = require('@prisma/adapter-neon');
  const pool = new Pool({ connectionString: databaseUrl });
  prismaInstance = new PrismaClient({ adapter: new PrismaNeon(pool) });
} else {
  const { PrismaPg } = require('@prisma/adapter-pg');
  prismaInstance = new PrismaClient({
    adapter: new PrismaPg({ connectionString: databaseUrl }),
  });
}

export const prisma = prismaInstance;
```

The `withPrisma` middleware and `ExtendedPrismaClient` type export remain unchanged.

### New dependencies (`packages/api/package.json`)

- `@neondatabase/serverless`
- `@prisma/adapter-neon`
- `@hono/vercel` (dev: already have hono)

Keep existing: `pg`, `@prisma/adapter-pg`, `@hono/node-server`.

## 3. Better Auth Production Config

No code changes needed:

- `BETTER_AUTH_URL` already reads from `process.env.BETTER_AUTH_URL` — set in Vercel env vars.
- `trustedOrigins` already includes `cohab://` unconditionally (mobile app scheme).
- Dev-only origins are behind `NODE_ENV === 'development'` check.
- CORS is currently unconfigured (allows all) — acceptable for MVP, tighten later.

## 4. EAS Update (Mobile OTA)

### `packages/ui/app.json` (MODIFIED)

Add to the `expo` object:

```json
{
  "runtimeVersion": { "policy": "appVersion" },
  "updates": {
    "url": "https://u.expo.dev/<PROJECT_ID>",
    "enabled": true,
    "fallbackToCacheTimeout": 0
  },
  "extra": {
    "eas": { "projectId": "<PROJECT_ID>" }
  }
}
```

### `packages/ui/eas.json` (NEW)

```json
{
  "cli": { "version": ">= 15.0.0", "appVersionSource": "remote" },
  "build": {
    "development": { "developmentClient": true, "distribution": "internal" },
    "preview": { "distribution": "internal" },
    "production": { "autoIncrement": true }
  },
  "submit": { "production": {} }
}
```

### New dependency

- `expo-updates` (install via `npx expo install expo-updates`)

## 5. GitHub Actions Workflow

### `.github/workflows/deploy.yml` (NEW)

Single sequential job on `push` to `main`:

```yaml
name: Deploy
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
        with: { version: '9' }
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'pnpm' }
      - run: pnpm install --frozen-lockfile

      # Generate Prisma client
      - run: pnpm --filter @cohab/api prisma generate

      # Lint & test
      - run: pnpm lint
      - run: pnpm test

      # Migrate database
      - run: pnpm --filter @cohab/api prisma migrate deploy
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}

      # Deploy API to Vercel
      - run: npx vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: packages/api
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
      - run: npx vercel build --prod --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: packages/api
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
      - run: npx vercel deploy --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
        working-directory: packages/api
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

      # Push OTA update
      - run: npx eas update --branch main --message "Deploy $(git rev-parse --short HEAD)" --non-interactive
        working-directory: packages/ui
        env:
          EXPO_TOKEN: ${{ secrets.EXPO_TOKEN }}
```

## 6. Required GitHub Secrets

| Secret                 | Source                                                                |
| ---------------------- | --------------------------------------------------------------------- |
| `DATABASE_URL`         | Neon dashboard (connection string with pooling)                       |
| `VERCEL_TOKEN`         | Vercel Settings > Tokens                                              |
| `VERCEL_ORG_ID`        | `vercel pull` output or Vercel dashboard                              |
| `VERCEL_PROJECT_ID`    | `vercel pull` output or Vercel dashboard                              |
| `EXPO_TOKEN`           | expo.dev > Access Tokens                                              |
| `BETTER_AUTH_SECRET`   | Generate with `openssl rand -base64 32`                               |
| `BETTER_AUTH_URL`      | Vercel deployment URL (e.g., `https://cohab-api.vercel.app/api/auth`) |
| `GOOGLE_CLIENT_ID`     | Google Cloud Console                                                  |
| `GOOGLE_CLIENT_SECRET` | Google Cloud Console                                                  |

Note: `BETTER_AUTH_*` and `GOOGLE_*` are set as Vercel environment variables, not just GitHub secrets.

## 7. Manual One-Time Setup Steps

1. **Neon**: Create free-tier project, get `DATABASE_URL`
2. **Vercel**: Create project, set root directory to `packages/api`, add env vars
3. **Expo**: Run `cd packages/ui && npx eas init` to create project and get `projectId`
4. **GitHub**: Add all secrets listed above
5. **Prisma**: Generate initial migration from current schema if needed (`prisma migrate dev --name init`)

## Files Summary

| File                              | Action | Purpose                                                          |
| --------------------------------- | ------ | ---------------------------------------------------------------- |
| `packages/api/src/app.ts`         | CREATE | Hono app definition (extracted)                                  |
| `packages/api/src/index.ts`       | MODIFY | Keep only serve() + showRoutes()                                 |
| `packages/api/api/index.ts`       | CREATE | Vercel serverless entry point                                    |
| `packages/api/vercel.json`        | CREATE | Vercel routing config                                            |
| `packages/api/src/libs/prisma.ts` | MODIFY | Conditional Neon/pg adapter                                      |
| `packages/api/package.json`       | MODIFY | Add @hono/vercel, @neondatabase/serverless, @prisma/adapter-neon |
| `packages/ui/app.json`            | MODIFY | Add EAS Update + projectId config                                |
| `packages/ui/eas.json`            | CREATE | EAS Build/Update profiles                                        |
| `.github/workflows/deploy.yml`    | CREATE | CI/CD workflow                                                   |
