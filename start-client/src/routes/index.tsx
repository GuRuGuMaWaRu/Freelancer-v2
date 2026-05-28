import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { summarizeDashboardProjects } from "../features/dashboard/dashboard-summary";
import { authStorageKey, projectsForChartQuery } from "../shared/api/endpoints";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  const hasToken =
    typeof window !== "undefined" &&
    Boolean(window.localStorage.getItem(authStorageKey));
  const { data: projects = [] } = useQuery({
    ...projectsForChartQuery(12),
    enabled: hasToken,
  });
  const summary = summarizeDashboardProjects(projects);

  return (
    <>
      <header className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <span className="muted">Last 12 months</span>
      </header>
      <section className="grid metrics">
        <Metric label="Projects" value={summary.projectCount.toString()} />
        <Metric label="Total" value={formatMoney(summary.total)} />
        <Metric label="Paid" value={formatMoney(summary.paidTotal)} />
        <Metric label="Unpaid" value={formatMoney(summary.unpaidTotal)} />
      </section>
      {!hasToken ? (
        <section className="panel" style={{ marginTop: 16 }}>
          <p className="muted">Sign in to load your dashboard data.</p>
        </section>
      ) : null}
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <article className="panel">
      <p className="metric-label">{label}</p>
      <p className="metric-value">{value}</p>
    </article>
  );
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  }).format(value);
}
