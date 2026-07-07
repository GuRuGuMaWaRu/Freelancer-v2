# PET Freelancer — Revival Plan

> Living document for reviving this project. Check off items as they are completed.
> Last updated: 2026-07-06

---

## Purpose

This app tracks freelance earnings per month, per year, and per client. Revival means making it trustworthy to run locally, safe to extend, and pleasant to use — without committing to a full rewrite upfront.

**Recommended sequence:** Quick wins → Vite modernization → feature completion → optional full-stack migration (only if needed).

---

## Current State (baseline)

| Area | Status |
|------|--------|
| Frontend | React 18 + CRA (`react-scripts`), strict TypeScript, FSD-ish layout |
| Backend | Express 4, Mongoose 6, JWT auth, ~15 API routes (plain JavaScript) |
| Data | MongoDB — Users, Clients, Projects (soft delete) |
| Tests | ~20 client tests, 7 server integration tests |
| CI | CodeQL only — no test/lint pipeline |
| Deploy | Heroku-style monolith (Express serves CRA build in production) |

### What already works

- [x] Auth flow (login / signup / logout + JWT)
- [x] Dashboard with monthly earnings chart and totals
- [x] Projects page: search, sort, pagination, add / edit / delete via modals
- [x] Clients page: aggregated stats, sort, expand / collapse
- [x] Entity-level API layer (`entities/*/api`) on shared `apiClient`
- [x] React Query + React Router loaders / actions

### Known issues to address (see Phase 0)

- [x] "Earnings by Clients" chart on dashboard (listed broken in README)
- [x] `getUser` may sign JWT with excluded `_id`
- [x] `/clients/withProjectData` missing `userId` filter (data leak risk)
- [x] Project PATCH may create client with `req.body.user` instead of `req.userId`
- [x] API path casing: frontend `withprojectdata` vs server `withProjectData`
- [x] `upsert: true` on PATCH updates (can create docs unintentionally)
- [ ] Root `npm run check-types` has no root `tsconfig.json`
- [ ] React Query `staleTime: Infinity` hides stale data

---

## Revival Approaches

Four viable paths. **Only one primary path should be active at a time** after Phase 1; the others stay as documented alternatives.

### A. Stabilize in place *(recommended primary path)*

Keep Express + React, modernize incrementally.

| Pros | Cons |
|------|------|
| Smallest scope; FSD architecture preserved | Still a split client/server repo layout |
| Fastest path to a working, trustworthy app | CRA must be replaced (Phase 1) |
| Shared types can bridge FE/BE without full rewrite | Two deploy units unless monolith kept |

**Phases:** 0 Quick wins → 1 Vite + server TS → 2 Feature completion

---

### B. Full Next.js (App Router)

Single deploy; API routes or Server Actions replace Express.

| Pros | Cons |
|------|------|
| One modern full-stack framework | React Router loaders/actions must be rewritten |
| Vercel deploy is straightforward | FSD `app/` layer naming conflict (rename to `application/`) |
| Built-in routing, SSR available | MongoDB connection model changes for serverless |

**When to choose:** After Phase 1, if you want SSR, Vercel hosting, or a single codebase boundary.

- [ ] Decision recorded (date / rationale)
- [ ] Spike: map current routes → Next.js App Router
- [ ] Spike: MongoDB connection strategy (pooled vs per-request)
- [ ] Migration plan drafted

---

### C. TanStack Start

File-based routing + SSR; natural fit with existing TanStack Query usage.

| Pros | Cons |
|------|------|
| Aligns with current React Query patterns | Smaller ecosystem than Next.js |
| Type-safe loaders close to current mental model | Near-full routing rewrite |
| Modern stack without Next opinions | Express remains separate unless folded in |

**When to choose:** After Phase 1, if you prefer the TanStack ecosystem over Next.js.

- [ ] Decision recorded (date / rationale)
- [ ] Spike: TanStack Start + current FSD folder layout
- [ ] Spike: API boundary (keep Express vs Start server routes)
- [ ] Migration plan drafted

---

### D. Express → NestJS

TypeScript-native backend with modules, guards, validation pipes.

| Pros | Cons |
|------|------|
| DI, Swagger, class-validator map cleanly to JWT auth | Overkill for ~33 server files today |
| Scales if invoicing, webhooks, multi-tenant added | Full backend rewrite |
| Does not solve CRA deprecation alone | Learning curve |

**When to choose:** If backend complexity will grow significantly (payments, webhooks, multi-tenant SaaS).

- [ ] Decision recorded (date / rationale)
- [ ] Spike: NestJS module map from current `server/resources/*`
- [ ] Spike: shared Zod/DTO package with frontend
- [ ] Migration plan drafted

---

## Roadmap Overview

```mermaid
flowchart TD
    P0["Phase 0: Quick wins"]
    P1["Phase 1: Vite + toolchain"]
    P2["Phase 2: Feature completion"]
    P3["Phase 3: Optional migration"]

    P0 --> P1 --> P2 --> P3

    P3 --> B[Next.js]
    P3 --> C[TanStack Start]
    P3 --> D[NestJS]
    P3 --> A2[Continue stabilize path]
```

| Phase | Goal | Status |
|-------|------|--------|
| **0** | Make it run, fix critical bugs, quick wins | In progress |
| **1** | CRA → Vite, server TS, shared types, CI | Not started |
| **2** | Complete core product features from README | Not started |
| **3** | Optional: Next.js / TanStack Start / NestJS | Deferred |

---

## Phase 0 — Quick Wins *(first implementable step)*

**Goal:** Trustworthy local dev, critical bugs fixed, dead weight removed, tests and types tooling unblocked.

**Exit criteria:** App runs locally; `validate` and tests pass in CI; known security/data bugs fixed; clients chart verified.

### 0.1 Environment & local run

- [x] Add `server/.env.example` (DB URI, `ACCESS_TOKEN_SECRET`, `JWT_EXPIRES_IN`, `PORT`)
- [x] Add `client/.env.example` if needed (proxy / API base URL)
- [x] Document local setup in README (MongoDB, `npm run dev`, test DB)
- [ ] Verify `npm run dev` starts client + server without errors

### 0.2 Critical bug fixes

- [x] **Auth `getUser`:** stop excluding `_id` from select, or use `req.userId` for JWT payload
- [x] **`/clients/withProjectData`:** add `user: req.userId` to `$match` stage
- [x] **Project PATCH:** use `req.userId` when creating a new client (not `req.body.user`)
- [x] **API path casing:** align frontend `clients/withprojectdata` ↔ server `/withProjectData`
- [x] **Remove `upsert: true`** from project PATCH and generic CRUD `updateOne` (or scope explicitly)
- [x] **Clients chart:** debug and fix dashboard "Earnings by Clients" (min chart height when empty, populated `client.name`)
- [x] Add unit test for `getEarningsByClients` in `dashboard.helpers.ts`

### 0.3 Dependency & tooling cleanup

- [ ] Remove unused `chart.js` and `react-chartjs-2` from `client/package.json`
- [ ] Audit `react-spring` usage — remove if only used in one place with a simpler alternative
- [ ] Add root `tsconfig.json` (project references to `client/`) so `npm run check-types` works
- [ ] Fix ESLint TS `parserOptions.project` to point at correct tsconfig
- [ ] Change React Query default `staleTime` from `Infinity` to a reasonable value (e.g. 5 min); keep explicit invalidation on mutations

### 0.4 Test & CI quick wins

- [x] Add server test: `GET /api/v1/users/getUser` returns valid refreshed token
- [x] Add server test: `GET /api/v1/clients/withProjectData` returns only current user's data
- [ ] Add server test: `GET /api/v1/projects/forChart` with `months` filter
- [ ] Add GitHub Actions workflow: `lint` + `check-types` + `server:test` + `client:test`
- [ ] All existing tests pass locally after bug fixes

### 0.5 Phase 0 sign-off

- [ ] Manual smoke test: login → dashboard (both charts) → add project → projects list → clients page
- [ ] README "CURRENT" section updated to reflect fixed items
- [ ] Phase 0 PR merged / tagged

**Phase 0 status:** `In progress`

**Notes:**

```
Phase 0.1 (branch revival/phase-0-1-local-dev-setup): env templates, dotenv path fix,
CRA proxy aligned to server PORT 6000, README local setup section.
Server startup on PORT=6000 verified locally; full `npm run dev` smoke test still pending.

Phase 0.2 (branch revival/phase-0-2-critical-bug-fixes): auth getUser JWT fix,
withProjectData user scoping, project PATCH user/upsert fixes, API path casing,
clients chart empty-state height, getEarningsByClients unit test, server tests for
getUser and withProjectData.
```

---

## Phase 1 — Vite & toolchain modernization

**Goal:** Replace CRA with Vite; begin server TypeScript migration; establish shared API contracts; reliable CI.

**Prerequisite:** Phase 0 complete.

**Exit criteria:** `npm run dev` uses Vite; production build works; server compiles with TS (or hybrid); shared types in use; CI green.

### 1.1 CRA → Vite migration

- [ ] Scaffold Vite config (`vite.config.ts`) with path aliases matching `client/tsconfig` `baseUrl`
- [ ] Move `public/` and `index.html` to Vite conventions
- [ ] Replace `react-scripts` scripts with `vite`, `vite build`, `vitest`
- [ ] Configure dev proxy to Express (`localhost:5000` / `6000`)
- [ ] Port Jest tests to Vitest (or keep Jest temporarily behind adapter)
- [ ] Port MSW setup for Vitest
- [ ] Verify HMR, production build, and static asset paths
- [ ] Update root `package.json` scripts (`client`, `dev`, `client:test`)
- [ ] Remove `react-scripts` and CRA-specific deps

### 1.2 Server TypeScript (incremental)

- [ ] Add `server/tsconfig.json` (allowJs, gradual strictness)
- [ ] Add build step or `tsx`/`ts-node` for dev (`node --watch` → `tsx watch`)
- [ ] Convert `server/app.js` → `app.ts`
- [ ] Convert `server/utils/*` and `server/middleware/*`
- [ ] Convert `server/resources/*` (models, routers, controllers)
- [ ] Convert `server/test/*` to TypeScript or keep JS with typed helpers
- [ ] Typed `req.userId` via Express augmentation or middleware types

### 1.3 Shared API contract

- [ ] Create `packages/shared/` (or `shared/`) with Zod schemas: `Project`, `Client`, `User`, API responses
- [ ] Frontend imports types from shared package
- [ ] Server validates request bodies with same Zod schemas at route boundaries
- [ ] Document API response shape (`{ status, data, message? }`)

### 1.4 Dependency upgrades (Phase 1 scope)

- [ ] Mongoose 6 → 8 (with migration notes for breaking changes)
- [ ] Plan `@reach/*` → Radix UI migration (can be Phase 2 UI pass)
- [ ] Align Node engine versions across root, client, server

### 1.5 CI & quality gates

- [ ] CI runs Vite build on PR
- [ ] CI runs server TS compile
- [ ] Coverage reporting optional (thresholds TBD)
- [ ] `npm run validate` passes on clean checkout

### 1.6 Phase 1 sign-off

- [ ] Deploy preview or local prod build smoke test (Express serves Vite `dist`)
- [ ] Heroku / hosting config updated for Vite output path if applicable
- [ ] Phase 1 PR merged / tagged

**Phase 1 status:** `Not started` | `In progress` | `Complete`

**Notes:**

```
(add progress notes, blockers, decisions here)
```

---

## Phase 2 — Feature completion

**Goal:** Finish user-visible items from README and inline TODOs; improve mobile UX; expand test coverage.

**Prerequisite:** Phase 1 complete.

### 2.1 Notifications & API messages

- [ ] Backend: consistent `message` field on successful mutations (users, projects, clients)
- [ ] Frontend: show API messages via notification provider
- [ ] Error messages: structured errors from API → user-friendly toasts

### 2.2 Dashboard & charts

- [ ] Fix / polish animated BG on route change (wire `useGetColorFromPath` in Modal)
- [ ] Per-route BG colors: projects (green), clients (light-red) per README
- [ ] Dashboard mobile pass: fonts, nav, chart controls
- [ ] Font clamping on dashboard totals
- [ ] Loading state on projects fetch (non–full-page spinner option)

### 2.3 Projects page

- [ ] Refactor sort state (single state vs `sortColumn` + `sortDir`)
- [ ] Truncated notes with tooltip on hover
- [ ] Extract modal + form patterns into reusable components
- [ ] Optional: "Load more" pagination vs page numbers
- [ ] Project fields: status (current/finished), start/deadline dates, paid filter in UI

### 2.4 Clients

- [ ] Client edit / delete UI (backend already supports CRUD)
- [ ] Verify `withProjectData` stats after Phase 0 user filter fix

### 2.5 Architecture cleanup (frontend)

- [ ] Expand `features/` for auth, clients, projects (move logic out of `pages/`)
- [ ] Nested routes: shell routes for `/projects` and `/clients` with child add/edit/delete
- [ ] Fix FSD leak: `shared/ui/Modal` should not import from `widgets`
- [ ] Consolidate API layer: consistent `api.createProject(...)` pattern everywhere
- [ ] REM-based sizing (`root` font-size 62.5%) — incremental pass

### 2.6 Auth UX

- [ ] "Keep me logged in" checkbox (localStorage vs sessionStorage strategy)
- [ ] Resolve token source: auth state vs localStorage in loaders

### 2.7 Test coverage expansion

- [ ] Dashboard integration test (chart range switch, both chart types)
- [ ] Projects page test (search, empty state)
- [ ] Clients page test
- [ ] Auth flow tests (login, register)
- [ ] E2E smoke test (Playwright): login → add project → dashboard update
- [ ] Target: critical paths covered (~70% of user journeys)

### 2.8 Phase 2 sign-off

- [ ] README TODO list reviewed; completed items checked off
- [ ] Mobile tested on at least one real device or emulator
- [ ] Phase 2 PR merged / tagged

**Phase 2 status:** `Not started` | `In progress` | `Complete`

**Notes:**

```
(add progress notes, blockers, decisions here)
```

---

## Phase 3 — Optional full-stack migration

**Only start after Phase 2** unless a hard requirement (e.g. Vercel-only deploy) forces earlier decision.

Choose **one** path and record the decision at the top of this section.

**Chosen path:** `None yet` | `Next.js` | `TanStack Start` | `NestJS only` | `Stay on stabilize path`

**Decision date / rationale:**

```
(fill in when decided)
```

### 3A. If Next.js

- [ ] Create Next.js app with App Router
- [ ] Map FSD layers (`application/` instead of `app/` for FSD)
- [ ] Port routes and loaders to Next.js data fetching
- [ ] Port API routes from Express (`/api/v1/*`)
- [ ] MongoDB adapter for serverless or Node runtime
- [ ] Auth strategy (JWT cookies vs headers)
- [ ] E2E parity with Phase 2 tests
- [ ] Decommission standalone Express server

### 3B. If TanStack Start

- [ ] Scaffold TanStack Start project
- [ ] Port FSD structure and routes
- [ ] Integrate existing React Query queries
- [ ] Decide API boundary (Start server vs keep Express during transition)
- [ ] E2E parity
- [ ] Decommission CRA/Vite client + optional Express

### 3C. If NestJS (backend only)

- [ ] NestJS project scaffold with modules: `Auth`, `Users`, `Clients`, `Projects`
- [ ] Port Mongoose schemas to NestJS providers
- [ ] JWT guard equivalent to `protect` middleware
- [ ] Port aggregation pipelines (projects list, client stats, forChart)
- [ ] OpenAPI / Swagger document
- [ ] Frontend unchanged; swap API base URL
- [ ] Decommission Express server

### 3D. If staying on stabilize path

- [ ] Production deploy documented and automated
- [ ] Optional: Turborepo or npm workspaces for `client` + `server` + `packages/shared`
- [ ] Optional: Storybook for shared UI components
- [ ] Optional: offline Google fonts
- [ ] Product backlog: export CSV, invoicing, multi-currency, password reset

**Phase 3 status:** `Deferred` | `In progress` | `Complete`

---

## Product backlog (post-revival)

Features not in scope for Phases 0–2 but worth tracking:

- [ ] Export (CSV / PDF)
- [ ] Invoicing integration (e.g. Stripe)
- [ ] Multi-currency conversion (EUR exists in schema; UI assumes USD)
- [ ] Tax / annual summaries
- [ ] User profile and password reset
- [ ] Email verification
- [ ] Time tracking per project
- [ ] Recurring projects
- [ ] Dark mode
- [ ] Offline / PWA support

---

## Progress log

| Date | Phase | What was done |
|------|-------|---------------|
| 2026-07-07 | 0.2 | Critical bug fixes: auth, data scoping, upsert removal, clients chart, tests |
| 2026-07-06 | 0.1 | Env templates, local setup docs, proxy/port alignment |
| 2026-07-06 | — | Revival plan document created |

---

## References

- Original analysis: Cursor chat (2026-07-06)
- README TODOs: [`README.md`](../README.md)
- Server entry: [`server/app.js`](../server/app.js)
- Client entry: [`client/src/app/app.tsx`](../client/src/app/app.tsx)
