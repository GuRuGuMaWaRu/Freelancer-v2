import { describe, expect, it } from "vitest";

import { summarizeDashboardProjects } from "./dashboard-summary";

describe("summarizeDashboardProjects", () => {
  it("calculates all-time paid and unpaid totals from project API data", () => {
    const summary = summarizeDashboardProjects([
      {
        _id: "project-1",
        projectNr: "INV-001",
        payment: 1200,
        currency: "USD",
        date: "2026-05-10T00:00:00.000Z",
        paid: true,
        client: { name: "Acme" },
      },
      {
        _id: "project-2",
        projectNr: "INV-002",
        payment: 800,
        currency: "USD",
        date: "2026-05-12T00:00:00.000Z",
        paid: false,
        client: { name: "Globex" },
      },
    ]);

    expect(summary).toEqual({
      projectCount: 2,
      paidTotal: 1200,
      unpaidTotal: 800,
      total: 2000,
    });
  });
});
