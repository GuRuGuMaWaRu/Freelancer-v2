import "@testing-library/jest-dom";
import { afterAll, afterEach, beforeAll, vi } from "vitest";

import { server } from "./test/server/test-server";

const TEST_ORIGIN = "http://localhost";

// Avoid loading ESM-only deps (e.g. copy-anything) pulled in by React Query Devtools.
vi.mock("@tanstack/react-query-devtools", () => ({
  ReactQueryDevtools: () => null
}));

// NotificationProvider portals into this element; ensure it exists in tests.
beforeAll(() => {
  window.history.replaceState({}, "", `${TEST_ORIGIN}/`);

  const root = document.createElement("div");
  root.setAttribute("id", "notification-root");
  document.body.appendChild(root);
});

// Establish API mocking before all tests.
beforeAll(() => {
  server.listen();

  // Vitest uses Node's native fetch; api-client calls window.fetch with relative URLs.
  const interceptedFetch = globalThis.fetch.bind(globalThis);

  const resolveRelativeFetch = ((
    input: RequestInfo | URL,
    init?: RequestInit
  ) => {
    if (typeof input === "string" && input.startsWith("/")) {
      return interceptedFetch(`${TEST_ORIGIN}${input}`, init);
    }

    return interceptedFetch(input, init);
  }) as typeof fetch;

  globalThis.fetch = resolveRelativeFetch;
  window.fetch = resolveRelativeFetch;
});

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());
// Clean up after the tests are finished.
afterAll(() => server.close());
