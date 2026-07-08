import { render } from "@testing-library/react";
import { MemoDashboardTotals } from "../DashboardTotals";

describe("DashboardTotals", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2020-03-15T12:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("should render", () => {
    const earnings = [
      {
        id: "2020-03",
        date: new Date("2020-03-15T12:00:00.000Z"),
        payment: 100000,
        projects: 10,
      },
      {
        id: "2020-02",
        date: new Date("2020-02-15T12:00:00.000Z"),
        payment: 200000,
        projects: 20,
      },
      {
        id: "2020-01",
        date: new Date("2020-01-15T12:00:00.000Z"),
        payment: 300000,
        projects: 30,
      },
    ];

    const { container } = render(
      <MemoDashboardTotals data={earnings} chartRange="1y" />
    );
    expect(container).toMatchSnapshot();
  });
});
