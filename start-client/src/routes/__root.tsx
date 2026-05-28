import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  component: RootComponent,
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        title: "PET Freelancer",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <div className="app-shell">
            <aside className="sidebar">
              <div className="brand">PET Freelancer</div>
              <nav className="nav-list" aria-label="Primary">
                <Link
                  activeOptions={{ exact: true }}
                  activeProps={{ className: "nav-link active" }}
                  className="nav-link"
                  to="/"
                >
                  Dashboard
                </Link>
                <Link
                  activeProps={{ className: "nav-link active" }}
                  className="nav-link"
                  search={{ page: 1, q: "", sort: "-date" }}
                  to="/projects"
                >
                  Projects
                </Link>
                <Link
                  activeProps={{ className: "nav-link active" }}
                  className="nav-link"
                  to="/clients"
                >
                  Clients
                </Link>
                <Link
                  activeProps={{ className: "nav-link active" }}
                  className="nav-link"
                  to="/login"
                >
                  Login
                </Link>
              </nav>
            </aside>
            <main className="main">
              <Outlet />
            </main>
          </div>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
