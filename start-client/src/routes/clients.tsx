import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { authStorageKey, clientStatsQuery } from "../shared/api/endpoints";

export const Route = createFileRoute("/clients")({
  component: ClientsPage,
});

function ClientsPage() {
  const hasToken =
    typeof window !== "undefined" &&
    Boolean(window.localStorage.getItem(authStorageKey));
  const { data: clients = [] } = useQuery({
    ...clientStatsQuery(),
    enabled: hasToken,
  });

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Clients</h1>
        <span className="muted">{clients.length} active</span>
      </header>
      <section className="panel">
        {hasToken ? (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Projects</th>
                <th>Total earnings</th>
                <th>Last project</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td>{client.name}</td>
                  <td>{client.totalProjects}</td>
                  <td>USD {client.totalEarnings}</td>
                  <td>{new Date(client.lastProjectDate).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="muted">Sign in to load your clients.</p>
        )}
      </section>
    </>
  );
}
