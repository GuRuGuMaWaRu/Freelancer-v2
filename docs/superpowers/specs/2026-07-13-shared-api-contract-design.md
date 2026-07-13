# Shared API Contract Design

## Goal

Complete Revival Phase 1.3 with one shared Zod contract package used by the
client and server, while keeping the focused implementation from
`revival/phase-1-3-shared-api-contract` and selectively incorporating the
stronger validation, response-schema, testing, and documentation work from
worktree 2564.

## Source of truth and scope

The uncommitted implementation in `revival/phase-1-3-shared-api-contract` is
the baseline. The implementation will not import worktree 2564's repository-
wide Prettier upgrade or unrelated client formatting changes.

The completed change will include:

- `packages/shared` with request and response schemas for users, clients,
  projects, currencies, and API envelopes.
- Client types derived from the shared contracts.
- Server request validation at user, client, and project route boundaries.
- Structured Zod validation details in API error responses.
- Direct typechecking of the shared package in local validation and CI.
- Focused tests for invalid project bodies and API error handling.
- Shared-package documentation describing response envelopes and extension
  conventions.

## Contract architecture

Request-body and wire-response schemas have different responsibilities and
will remain separate.

- Request schemas may transform external input where useful. For example,
  project payment may use numeric coercion and project dates may use date
  coercion before the controller passes data to Mongoose.
- Response schemas describe JSON on the wire. Date fields are ISO strings,
  not JavaScript `Date` instances, because `fetch().json()` does not revive
  dates.
- Project responses use endpoint-specific schemas instead of a broad union:
  a list item with a populated client, a chart item with a name-only client,
  and paginated list data.
- API success envelopes use a generic `successResponseSchema(dataSchema)` and
  an inferred/generic `ApiSuccessResponse<T>` type.
- API error envelopes always contain `code`, `status`, and `message`, and may
  contain flattened Zod `errors` with form and field errors.

The package remains a private source package consumed through
`file:../packages/shared`. Client and server builds continue to transpile its
TypeScript source; the shared package also receives its own explicit
typecheck.

## Server validation and errors

`validateBody` calls `safeParse`, replaces `req.body` with parsed data on
success, and forwards a 422 `AppError` on failure. Validation failures carry
`ZodError.flatten()` output. `AppError` and the centralized error handler
preserve this optional data in the JSON error envelope.

Controllers will trust validated request bodies. Redundant presence checks
after Zod validation will not be retained, avoiding contradictory behavior
such as treating numeric zero as a missing payment.

Project update behavior remains unchanged: `client` is required because the
controller resolves the client name on every update, while other project
fields are optional.

## Client integration

The API client types parsed JSON as either `ApiSuccessResponse<T>` or
`ApiErrorResponse`. Successful requests resolve with the success envelope;
failed requests reject with the error envelope.

Existing compatibility aliases such as `IProject` and `IClient` may remain at
the client shared-types boundary to keep this phase focused, but their source
types come from `@pet-freelancer/shared`. Endpoint-specific APIs use the
corresponding endpoint-specific shared types.

Runtime parsing of every successful server response is outside this phase.
The Zod response schemas establish executable contracts and can support that
future hardening without adding parsing overhead or a broad client rewrite
now.

## Tooling and formatting

The root `check-types` script includes client, server, and shared package
checks. CI installs the shared package and includes its lockfile in the npm
cache key.

The base `prettier` script remains read-only. `format` supplies `--write`, and
`check-format` supplies `--list-different`. A Prettier version upgrade and
repository-wide reformat are explicitly excluded and should be handled as a
separate change.

Package resolution should rely on the declared file dependency. Extra path
aliases or Vite dependency-optimization configuration will only be retained
if verification demonstrates they are required for typechecking, tests, or
production builds.

## Testing and acceptance criteria

Focused tests will demonstrate that:

- Non-string project clients are rejected with 422 on create and update.
- Unsupported currencies are rejected with 422 on create and update.
- Validation responses include structured field errors.
- A nonnegative payment of zero is not rejected as a missing field.
- The API client rejects failed responses with an `ApiErrorResponse` shape.

Completion requires:

- Shared, client, and server typechecks passing.
- Client tests passing.
- Server tests passing when the configured MongoDB test service and required
  secrets are available.
- Client production build passing.
- Lint producing no new errors.
- No unrelated formatting churn.

## Explicit non-goals

- Publishing the shared package to a registry.
- Runtime parsing of all successful API responses.
- Migrating every legacy client interface name.
- Upgrading Prettier or reformatting unrelated source files.
- Changing database models or response payloads beyond exposing structured
  validation details.
