# PET Freelancer

Track freelance earnings by month, year, and client. A full-stack monolith with a React dashboard, Express API, and MongoDB persistence.

**Live demo:** [tranquil-woodland-50991.herokuapp.com](https://tranquil-woodland-50991.herokuapp.com/)

---

## Features

| Area | Capabilities |
|------|--------------|
| **Auth** | Sign up, log in, log out; JWT stored client-side; token refresh via `getUser` |
| **Dashboard** | Monthly earnings chart, earnings-by-client chart, period totals, add project modal |
| **Projects** | Search, sort, pagination, add / edit / delete via modals |
| **Clients** | Aggregated stats per client, sort, expand / collapse rows |

---

## Tech stack

| Layer | Stack |
|-------|-------|
| **Frontend** | React 18, TypeScript (strict), Vite, React Router 6, TanStack Query, Recharts, React Hook Form + Yup |
| **Backend** | Express 4, Mongoose 6, JWT auth, express-validator |
| **Data** | MongoDB — Users, Clients, Projects (soft delete) |
| **Quality** | ESLint, Prettier, Husky, GitHub Actions CI, CodeQL |

Frontend layout follows a Feature-Sliced Design–inspired structure (`app`, `pages`, `widgets`, `features`, `entities`, `shared`).

---

## Prerequisites

- **Node.js** 18+ required for the client (Vite 6 / Vitest 3 / jsdom 26); CI uses 22. Server `engines` may pin a deploy target separately — see `client/package.json` and `server/package.json`.
- **npm** 8.16+
- **MongoDB** running locally (default: `mongodb://127.0.0.1:27017`)

---

## Quick start

### 1. Install dependencies

```bash
npm install
npm install --prefix client
npm install --prefix server
```

Or use the convenience scripts: `npm run client:install` and `npm run server:install`.

### 2. Configure environment

```bash
cp server/.env.example .env.server
```

Edit `.env.server` if your MongoDB host or credentials differ. Default API port is **4000**, which matches `VITE_API_PORT` in `client/.env.development` and the Vite proxy.

For an alternative with automatic port fallback (Windows Hyper-V), see branch `example/dev-port-fallback`.

### 3. Start development servers

```bash
npm run dev
```

| Service | URL |
|---------|-----|
| Frontend | [http://localhost:3000](http://localhost:3000) |
| API | [http://localhost:4000/api/v1](http://localhost:4000/api/v1) |

### Optional client env

See `client/.env.example`. For most setups the tracked `client/.env.development` is sufficient. Copy to `.env.development.local` only if you need overrides.

---

## Environment variables

Server configuration lives in `.env.server` at the repo root (see `server/.env.example`).

| Variable | Required | Description |
|----------|----------|-------------|
| `DB_MAIN` | Yes | Production / default MongoDB URI |
| `DB_DEVELOPMENT` | Dev | Development database URI |
| `DB_TEST` | Tests | Test database URI (used by Mocha) |
| `ACCESS_TOKEN_SECRET` | Yes | JWT signing secret — use a long random string |
| `JWT_EXPIRES_IN` | No | Token lifetime (default `7d`) |
| `PORT` | No | Express listen port (default `4000`) |

---

## Scripts

Run from the repository root:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server and Express with watch mode (`NODE_ENV=development`) |
| `npm run prod` | Dev convenience: Vite dev server + Express with watch (`USE_PROD_DB=true` → `DB_MAIN`; dev app behavior) |
| `npm start` | Run Express in production mode (requires `NODE_ENV=production` from deploy config; serves `client/dist`; build the client first) |
| `npm run client` | Start frontend only (Vite dev server) |
| `npm run server:dev` | Start backend only (development, with watch) |
| `npm run server:prod` | Start backend only with watch (`NODE_ENV=development`, `USE_PROD_DB=true` → `DB_MAIN`) |
| `npm run server:test` | Server integration tests (requires MongoDB) |
| `npm run client:test` | Client unit tests with coverage |
| `npm run validate` | Typecheck, format check, and lint in parallel |
| `npm run lint` | ESLint across `.js`, `.ts`, `.tsx` |
| `npm run check-types` | TypeScript check (client + root tsconfig) |
| `npm run format` | Prettier write |

Build the client for production:

```bash
npm run build --prefix client
```

In production, Express serves the Vite build from `client/dist`.

---

## Testing

**Server** — integration tests against MongoDB (uses `DB_TEST` from `.env.server` or CI env):

```bash
npm run server:test
```

**Client** — Vitest + React Testing Library (+ MSW for API mocking):

```bash
npm run client:test
```

**Full quality gate** (no tests):

```bash
npm run validate
```

CI runs lint, typecheck, server tests (with a MongoDB service container), and client tests on pushes and PRs to `main` and `development`. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

---

## Project structure

```text
├── client/                 # React SPA (TypeScript)
│   └── src/
│       ├── app/            # App shell, providers, routing entry
│       ├── pages/          # Route-level pages and loaders
│       ├── widgets/        # Composite UI (NavBar, ChartSection, …)
│       ├── features/       # Feature modules (e.g. charts)
│       ├── entities/       # Domain entities (auth, clients, projects)
│       └── shared/         # API client, UI kit, hooks, types
├── server/                 # Express API (JavaScript)
│   ├── resources/          # Routers, controllers, models per domain
│   ├── middleware/         # Auth, logging, error handling
│   ├── utils/              # Shared helpers
│   └── test/               # Mocha integration tests
├── docs/
│   ├── REVIVAL-PLAN.md     # Phased modernization roadmap
│   └── BACKLOG.md          # Deferred features and ideas
└── .env.server             # Local server config (not committed)
```

---

## API overview

Base path: `/api/v1`

| Resource | Endpoints (summary) |
|----------|---------------------|
| **Users** | `POST /users/signup`, `POST /users/login`, `GET /users/getUser` |
| **Projects** | CRUD + `GET /projects/forChart` (dashboard aggregation) |
| **Clients** | CRUD + `GET /clients/withProjectData` (stats aggregation) |

Protected routes require a `Bearer` token in the `Authorization` header.

---

## Deployment

The app is designed as a **Heroku-style monolith**: Express serves the built React app in production.

1. Set `NODE_ENV=production`
2. Provide MongoDB URI, `ACCESS_TOKEN_SECRET`, and `PORT`
3. Build the client: `npm run build --prefix client`
4. Install server production dependencies and start: `npm ci --prefix server --omit=dev && npm start --prefix server` (or `npm start` from the repo root after the same server install)

Root `npm start` delegates to the server package, which runs TypeScript via `tsx` listed in **server** `dependencies` so production installs that omit devDependencies still boot.

The production static path is `client/dist` (see `server/app.ts`). Do **not** use `npm run prod` for deployment or production smoke tests — it starts the Vite dev server and does not set `NODE_ENV=production`.

---

## Roadmap

Active revival work is tracked in [docs/REVIVAL-PLAN.md](docs/REVIVAL-PLAN.md). Phase 0 and Phase 1.0–1.2 are complete; Phase 1.3 (shared API contract) is complete; Phase 1.4+ is next.

Deferred features and historical TODOs live in [docs/BACKLOG.md](docs/BACKLOG.md).

---

## Contributing

- Follow commit/PR title format: `type(area): short imperative summary` (see [AGENTS.md](AGENTS.md))
- Run `npm run validate` and relevant tests before opening a PR
- Prefer one logical revival phase step per branch when practical

---

## License

GPL-3.0-only — see [client/package.json](client/package.json).
