# PET Freelancer Revival Roadmap

## Current Revival Baseline

- Branch: `revival/tanstack-start-migration`.
- Legacy app remains intact: CRA client in `client/`, Express/Mongoose API in `server/`.
- New migration target lives in `start-client/`.
- The new app uses TanStack Start, TanStack Router, TanStack Query, Vite, TypeScript, and Vitest.
- The new client keeps `/api/v1/*` as the contract and proxies `/api` to the existing Express server in development.

## Implemented Foundation

- Added root scripts:
  - `npm run start-client`
  - `npm run start-client:test`
  - `npm run start-client:build`
- Added a typed API client for the existing Express payload shape.
- Added shared DTOs for users, clients, client stats, projects, and project pages.
- Added first TanStack Start routes:
  - `/` dashboard summary
  - `/projects` paginated project table shell
  - `/clients` client statistics table shell
  - `/login` token-based login shell
- Added tests for:
  - authenticated JSON API requests
  - failed API response handling
  - dashboard paid/unpaid/total summary calculation

## Known Legacy Baseline Issues

- Root `npm test` is not available yet because the root package has no `test` script.
- `npm run client:test -- --watchAll=false` reports no tests found even though test files exist under `client/src`.
- `npm run server:test` requires `DB_TEST` or `DB_MAIN`; without one, Mocha fails during the global setup hook.
- Existing dependency installs report many vulnerabilities in the legacy root/client/server packages; these were not auto-fixed because audit fixes may change behavior.

## Next Migration Slices

1. Fix legacy client test discovery so existing CRA tests can serve as characterization coverage.
2. Add a test database setup path for server integration tests, preferably `DB_TEST` documented in `.env.server.example`.
3. Port auth fully:
   - login
   - signup
   - logout
   - token restoration
   - protected-route redirect behavior
4. Port projects:
   - search
   - sort
   - pagination
   - add/edit/delete forms
   - empty and loading states
5. Port dashboard:
   - chart range selector
   - monthly/client charts
   - add-project workflow
6. Port clients:
   - client list
   - client earnings stats
   - create/update/delete behavior if retained for MVP
7. MVP hardening:
   - import/export backup
   - project status and deadline fields
   - tags
   - mobile dashboard improvements
   - safer token/session strategy
   - deployment documentation
