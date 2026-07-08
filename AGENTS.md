# Agent instructions

Guidance for AI agents and contributors working on this repo.

## PR and commit titles

Format: `type(area): short imperative summary`

Examples:

- `chore(dev): add env templates and align dev ports`
- `fix(auth): include user id in getUser JWT payload`
- `fix(charts): repair earnings-by-clients dashboard chart`
- `docs(revival): update phase 0 progress`

**Types:** `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `ci`

**Areas:** `dev`, `auth`, `charts`, `projects`, `clients`, `server`, `client`, `revival`, `ci`

Use the same format for commits when possible. The PR title should match the branch's main change.

## Revival work

Follow phases in [docs/REVIVAL-PLAN.md](docs/REVIVAL-PLAN.md). Prefer one logical phase step per branch when practical.

## Local development

See [README.md](README.md#quick-start). Server env: copy `server/.env.example` to `.env.server` at the repo root.

Deferred features and historical TODOs: [docs/BACKLOG.md](docs/BACKLOG.md).
