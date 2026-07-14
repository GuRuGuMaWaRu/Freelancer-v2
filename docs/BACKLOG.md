# Product Backlog

Historical TODO items migrated from the README during Phase 0 sign-off, plus future work tracked in the [Revival Plan](./REVIVAL-PLAN.md).

Use this document for ideas and deferred improvements. Active revival work follows the phased roadmap in `REVIVAL-PLAN.md`.

---

## Completed (pre-revival or Phase 0)

| Item | Notes |
|------|-------|
| Responsive root layout (grids, media queries) | Done |
| Less prominent Logout button | Done |
| Proper error display on the frontend | Done |
| Add Project from Dashboard | Done via modal |
| Projects page search | Done |
| Projects empty state | Centered message; pagination controls repositioned |
| Earnings by Clients chart | Fixed in Phase 0.2 (user scoping, empty-state height, client names) |
| Test coverage baseline | ~20 client tests, 15+ server integration tests, CI workflow |
| Entity-level API layer | `entities/*/api` on shared `apiClient` |
| React Query + React Router loaders/actions | In use across pages |

---

## Frontend — UX & UI

- [ ] Animate background color on route change (wire `useGetColorFromPath` in Modal)
- [ ] Per-route background colors: projects (green), clients (light-red)
- [ ] Offline Google fonts
- [ ] Dashboard mobile pass: fonts, nav, chart controls
- [ ] Font clamping on dashboard totals
- [ ] REM-based sizing (`root` font-size 62.5%) — incremental pass
- [ ] Storybook for shared UI components (optional)
- [ ] Dark mode
- [ ] Offline / PWA support

## Frontend — Projects

- [ ] Refactor sort state (single state vs `sortColumn` + `sortDir`)
- [ ] Truncated notes with tooltip on hover
- [ ] Extract modal + form patterns into reusable components
- [ ] Optional "Load more" pagination vs page numbers
- [ ] Project fields in UI: status (current/finished), start/deadline dates, paid filter
- [ ] Loading state on projects fetch (non–full-page spinner option)
- [ ] Revisit whether Submit button belongs inside modal form components

## Frontend — Clients

- [ ] Client edit / delete UI (backend CRUD already exists)

## Frontend — Auth

- [ ] "Keep me logged in" checkbox (localStorage vs sessionStorage strategy)
- [ ] Resolve token source: auth state vs localStorage in loaders

## Frontend — Architecture

- [ ] Expand `features/` for auth, clients, projects (move logic out of `pages/`)
- [ ] Nested routes: shell routes for `/projects` and `/clients` with child add/edit/delete
- [ ] Fix FSD leak: `shared/ui/Modal` should not import from `widgets`
- [ ] Consolidate API layer: consistent `api.createProject(...)` pattern everywhere
- [ ] Move page-specific helpers out of shared `lib.tsx`
- [ ] Organize styles per CSS architecture guidelines
- [ ] Move Pagination into a standalone reusable component

## Backend

- [ ] Consistent `message` field on successful mutations (users, projects, clients)
- [ ] Structured error messages surfaced as user-friendly toasts on the frontend
- [ ] Input validation audit at route boundaries
- [ ] Move applicable logic from utils into middleware
- [ ] Data sanitization before DB writes
- [ ] Use `.lean()` where appropriate for read-only queries
- [ ] Granular MongoDB-related error messages

## Testing

- [ ] Dashboard integration test (chart range switch, both chart types)
- [ ] Projects page test (search, empty state)
- [ ] Clients page test
- [ ] Auth flow tests (login, register)
- [ ] E2E smoke test (Playwright): login → add project → dashboard update
- [ ] Target: critical paths covered (~70% of user journeys)

## Toolchain & platform (Phase 1+)

See [REVIVAL-PLAN.md](./REVIVAL-PLAN.md) for phased work:

- Phase 1.0 — Pino structured logging
- Phase 1.1 — CRA → Vite migration
- Phase 1.2 — Server TypeScript (incremental)
- Phase 1.3 — Shared API contract (Zod schemas)
- Phase 1.4 — Dependency & package layout (root vs server deps/scripts, Mongoose 8, Radix UI migration plan)
- Phase 3 — Optional full-stack migration (Next.js, TanStack Start, NestJS)

## Product ideas (post-revival)

- [ ] Export (CSV / PDF)
- [ ] Invoicing integration (e.g. Stripe)
- [ ] Multi-currency conversion (EUR exists in schema; UI assumes USD)
- [ ] Tax / annual summaries
- [ ] User profile and password reset
- [ ] Email verification
- [ ] Time tracking per project
- [ ] Recurring projects
