# Shared API Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete Revival Phase 1.3 from the focused branch implementation and add executable response contracts, structured validation errors, accurate wire types, and focused regression tests.

**Architecture:** Synchronize the existing uncommitted `revival/phase-1-3-shared-api-contract` implementation into this isolated task worktree, then refine the shared package into separate request and wire-response schemas. Express validates request bodies with shared schemas; the client derives endpoint types from the same package; API errors preserve flattened Zod details.

**Tech Stack:** TypeScript, Zod 3, Express 4, React 18, Vite/Vitest, Mocha/Supertest, npm file dependencies.

## Global Constraints

- Treat `revival/phase-1-3-shared-api-contract` as the source baseline.
- Do not import worktree 2564's Prettier upgrade or unrelated formatting churn.
- Do not add production dependencies without user confirmation.
- Do not create a branch, commit, push, or pull request.
- Run `npm test` after modifying JavaScript files; no JavaScript files are planned.
- Preserve compatibility aliases at the client shared-types boundary where practical.

---

### Task 1: Synchronize the focused branch baseline

**Files:**
- Synchronize tracked files reported by `git -C D:/__dev/_dev.real_projects/PET_Freelancer-v2 diff --name-only HEAD`.
- Create from source: `packages/shared/package.json`, `packages/shared/package-lock.json`, `packages/shared/tsconfig.json`, `packages/shared/src/index.ts`, `packages/shared/src/api/responses.ts`, `packages/shared/src/entities/client.ts`, `packages/shared/src/entities/currency.ts`, `packages/shared/src/entities/project.ts`, `packages/shared/src/entities/user.ts`, `server/middleware/validateBody.ts`.

**Interfaces:**
- Produces: the branch implementation exactly as the starting point for later tasks.

- [ ] **Step 1: Confirm source and destination share the same HEAD**

Run: `git rev-parse HEAD` in both worktrees.
Expected: `47c924e0876d9705ff55cefd143929b42c46bd54` in both.

- [ ] **Step 2: Import the tracked branch patch mechanically**

Run a no-commit patch transfer from the branch checkout to this worktree.
Expected: the same tracked file list as the branch checkout, without 2564-only formatting files.

- [ ] **Step 3: Copy only the branch's untracked source files**

Copy the ten listed shared-package files and `server/middleware/validateBody.ts`; exclude `node_modules`.
Expected: `rg --files packages/shared` lists only source, package, lock, and configuration files.

- [ ] **Step 4: Verify the synchronized baseline**

Run: `git diff --stat HEAD` and `git status --short`.
Expected: the focused Phase 1.3 changes plus the approved design and plan documents.

---

### Task 2: Define accurate executable response contracts

**Files:**
- Create: `client/src/shared/api/__tests__/contracts.test.ts`
- Modify: `packages/shared/src/api/responses.ts`
- Modify: `packages/shared/src/entities/client.ts`
- Modify: `packages/shared/src/entities/project.ts`
- Modify: `packages/shared/src/index.ts`
- Modify: `client/src/shared/types/index.ts`
- Modify: client project API/type consumers only where endpoint-specific types require it.

**Interfaces:**
- Produces: `successResponseSchema<TSchema extends ZodTypeAny>(dataSchema: TSchema)`.
- Produces: `ProjectListItem`, `ProjectChartItem`, `ProjectPaginatedData`, and `ClientWithProjectData` wire types with ISO-string dates.
- Consumes: existing request schemas and `ApiSuccessResponse<T>`.

- [ ] **Step 1: Write failing contract tests**

Tests must assert that a success-envelope schema parses `{ status: "success", data }`, project/client wire schemas accept ISO date strings, project list items require a populated client, and chart items accept a name-only client.

- [ ] **Step 2: Run the focused tests and verify RED**

Run: `npm run test --prefix client -- --run src/shared/api/__tests__/contracts.test.ts`.
Expected: failure because `successResponseSchema` and endpoint-specific wire schemas do not exist or current schemas return `Date` types.

- [ ] **Step 3: Implement the minimal response schemas**

Use `z.string().datetime()` for JSON date fields. Keep request-side `z.coerce.date()` in project request schemas. Define separate list and chart project schemas rather than a client union shared by every endpoint.

- [ ] **Step 4: Update exports and client aliases**

Re-export all new schemas/types from `packages/shared/src/index.ts`; keep legacy `IProject`, `IProjectPaginatedData`, and client aliases mapped to the correct endpoint types.

- [ ] **Step 5: Verify GREEN**

Run the focused test and `npm run check-types`.
Expected: contract tests pass and all three typechecks pass.

---

### Task 3: Preserve structured Zod validation errors

**Files:**
- Create: `server/test/validate-body.unit.test.ts`
- Modify: `server/middleware/validateBody.ts`
- Modify: `server/utils/appError.ts`
- Modify: `server/middleware/errorHandler.ts`
- Modify: `packages/shared/src/api/responses.ts`

**Interfaces:**
- Produces: `AppError.errors?: { formErrors: string[]; fieldErrors: Record<string, string[] | undefined> }`.
- Produces: validation middleware that forwards a 422 `AppError` containing `ZodError.flatten()`.
- Extends: `ApiErrorResponse` with optional structured `errors` while retaining required `code`, `status`, and `message`.

- [ ] **Step 1: Write a failing middleware unit test**

Call `validateBody(z.object({ currency: z.enum(["USD", "EUR"]) }))` with `{ currency: "GBP" }`. Assert that `next` receives an `AppError` with status 422 and `errors.fieldErrors.currency` containing a message.

- [ ] **Step 2: Run the isolated Mocha test and verify RED**

Run: `npx mocha --require tsx/cjs server/test/validate-body.unit.test.ts`.
Expected: failure because the baseline middleware discards Zod error details.

- [ ] **Step 3: Implement structured error propagation**

Add the typed optional `errors` property to `AppError`, pass `result.error.flatten()` from `validateBody`, and conditionally serialize it in `errorHandler`.

- [ ] **Step 4: Extend the shared API error schema**

Keep `code` required because the server always emits it; add optional flattened `errors` matching the server output.

- [ ] **Step 5: Verify GREEN**

Run the isolated unit test and `npm run check-types`.
Expected: test and typechecks pass.

---

### Task 4: Add project validation regressions and clean tooling

**Files:**
- Modify: `server/test/project-save.test.ts`
- Modify: `server/test/project-update.test.ts`
- Modify: `packages/shared/README.md`
- Modify: `package.json`
- Modify: `client/tsconfig.json`
- Modify: `server/tsconfig.json`
- Modify: `client/vite.config.ts`

**Interfaces:**
- Consumes: shared request schemas and structured error envelope from Tasks 2-3.
- Produces: regression coverage for invalid client/currency and zero payment.

- [ ] **Step 1: Add integration assertions before route changes**

Add create/update cases for non-string clients and unsupported `GBP` currency. Assert 422 and a currency/client field error where applicable. Add a create case with `payment: 0` and assert it is not rejected as a missing field.

- [ ] **Step 2: Run server tests when infrastructure is available**

Run: `npm run server:test` with `DB_TEST` and `ACCESS_TOKEN_SECRET` configured.
Expected: new validation cases pass against the branch routes. If MongoDB is unavailable, record the infrastructure blocker and retain the isolated middleware test as local evidence.

- [ ] **Step 3: Fix formatting command separation**

Set the root scripts to:

```json
"prettier": "prettier --ignore-path .gitignore \"**/*.+(js|json|ts|tsx)\"",
"format": "npm run prettier -- --write",
"check-format": "npm run prettier -- --list-different"
```

Do not upgrade Prettier.

- [ ] **Step 4: Remove unnecessary resolution overrides**

Rely on the installed `file:` package. Remove shared-package `paths` and Vite `optimizeDeps` entries if tests, typechecks, and builds pass without them; retain only configuration proven necessary.

- [ ] **Step 5: Add package documentation**

Document success/error envelopes, endpoint-specific project shapes, ISO wire dates, request coercion, and the procedure for adding a schema.

- [ ] **Step 6: Run full verification**

Run: `npm run check-types`, `npm run client:test`, `npm run build --prefix client`, `npm run lint`, and the isolated middleware unit test. Run `npm run server:test` if MongoDB and secrets are available.
Expected: typechecks, client tests, build, lint, and unit test pass; server result is reported accurately.

- [ ] **Step 7: Confirm focused scope**

Run: `git diff --stat`, `git diff --check`, and `git status --short`.
Expected: no unrelated client-wide formatting changes, no whitespace errors, and no generated build/coverage files tracked.
