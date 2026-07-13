# @pet-freelancer/shared

Shared Zod contracts and inferred TypeScript types used by the client and
server.

## API response envelopes

Successful responses use:

```ts
{
  status: "success";
  data: T;
  message?: string;
  results?: number;
}
```

Build an executable success contract with
`successResponseSchema(dataSchema)`. Collection routes may include `results`;
mutation and single-resource routes normally omit it.

Errors use:

```ts
{
  code: number;
  status: "fail" | "error";
  message: string;
  errors?: {
    formErrors: string[];
    fieldErrors: Record<string, string[] | undefined>;
  };
}
```

Request-validation failures return status 422 and include the flattened Zod
error details in `errors`.

## Request and response schemas

Request schemas describe data accepted by Express route boundaries and may
coerce values before controllers receive them. Project request schemas, for
example, coerce numeric payments and dates.

Response schemas describe JSON on the wire. JSON dates are ISO strings, not
JavaScript `Date` instances. Project endpoints have distinct response types:

- `ProjectListItem` has a populated client with `_id` and `name`.
- `ProjectChartItem` has the chart endpoint's name-only client.
- `ProjectPaginatedData` contains list items and the unpaginated count.

## Adding a contract

1. Add the Zod schema in `packages/shared/src/api` or
   `packages/shared/src/entities`.
2. Export a `z.infer` type where consumers need a static type.
3. Re-export the schema and type from `packages/shared/src/index.ts`.
4. Apply request schemas with `validateBody` at server route boundaries.
5. Use the inferred endpoint type in client API functions.
6. Add a focused contract or route-validation test.
