import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { authStorageKey, projectsPageQuery } from "../shared/api/endpoints";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  validateSearch: (search) => ({
    page: Number(search.page ?? 1),
    q: typeof search.q === "string" ? search.q : "",
    sort: typeof search.sort === "string" ? search.sort : "-date",
  }),
});

function ProjectsPage() {
  const { page, q, sort } = Route.useSearch();
  const hasToken =
    typeof window !== "undefined" &&
    Boolean(window.localStorage.getItem(authStorageKey));
  const { data = { allDocs: 0, docs: [] } } = useQuery({
    ...projectsPageQuery(page, sort, q),
    enabled: hasToken,
  });

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Projects</h1>
        <span className="muted">{data.allDocs} total</span>
      </header>
      <section className="panel">
        {hasToken ? (
          <table className="table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Client</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data.docs.map((project) => (
                <tr key={project._id}>
                  <td>{project.projectNr}</td>
                  <td>{project.client.name}</td>
                  <td>{new Date(project.date).toLocaleDateString()}</td>
                  <td>
                    {project.currency} {project.payment}
                  </td>
                  <td>{project.paid ? "Paid" : "Unpaid"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">Sign in to load your projects.</p>
        )}
      </section>
    </>
  );
}
