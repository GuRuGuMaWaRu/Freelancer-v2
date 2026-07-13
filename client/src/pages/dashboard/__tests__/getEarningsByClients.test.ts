import { Currency } from "shared/types";
import type { IProjectChartItem } from "shared/types";

import { getEarningsByClients } from "../dashboard.helpers";

const makeProject = (
  clientName: string,
  payment: number,
  id = "project-id"
): IProjectChartItem => ({
  _id: id,
  client: { name: clientName },
  projectNr: "P-001",
  payment,
  currency: Currency.USD,
  date: "2024-06-01T00:00:00.000Z",
  paid: true,
});

describe("getEarningsByClients", () => {
  it("should aggregate earnings and project counts per client", () => {
    const projects = [
      makeProject("Acme", 100, "p1"),
      makeProject("Acme", 50, "p2"),
      makeProject("Globex", 200, "p3"),
    ];

    expect(getEarningsByClients(projects)).toEqual([
      { client: "Acme", payment: 150, projects: 2 },
      { client: "Globex", payment: 200, projects: 1 },
    ]);
  });

  it("should return an empty array when there are no projects", () => {
    expect(getEarningsByClients([])).toEqual([]);
  });

  it("should skip projects without a client name", () => {
    const projects = [
      makeProject("Acme", 100, "p1"),
      {
        ...makeProject("", 50, "p2"),
        client: { name: "" },
      },
      {
        ...makeProject("", 75, "p3"),
        client: {} as IProjectChartItem["client"],
      },
      {
        ...makeProject("", 80, "p4"),
        client: null,
      },
    ];

    expect(getEarningsByClients(projects)).toEqual([
      { client: "Acme", payment: 100, projects: 1 },
    ]);
  });
});
