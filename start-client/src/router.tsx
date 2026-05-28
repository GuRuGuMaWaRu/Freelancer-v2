import { createRouter } from "@tanstack/react-router";

import { createQueryClient } from "./query-client";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = createQueryClient();

  return createRouter({
    context: {
      queryClient,
    },
    routeTree,
    scrollRestoration: true,
  });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
