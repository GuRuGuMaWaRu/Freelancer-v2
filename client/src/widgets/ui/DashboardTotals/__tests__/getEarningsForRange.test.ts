import { getEarningsForRange } from "../DashboardTotals.helpers";

// TODO: test values are hardcoded, consider using faker

describe("getEarningsForRange", () => {
  it("should return sum of all earnings in data", () => {
    const earnings = [
      { id: "2024-01", date: new Date(), payment: 100000, projects: 10 },
      { id: "2024-02", date: new Date(), payment: 200000, projects: 20 },
      { id: "2024-03", date: new Date(), payment: 300000, projects: 30 }
    ];
    expect(getEarningsForRange(earnings)).toEqual("600");
  });

  it("should return 0 if data is empty", () => {
    expect(getEarningsForRange([])).toEqual("0");
  });

  it("should handle sums with cents correctly", () => {
    const earnings = [
      { id: "2024-01", date: new Date(), payment: 200120, projects: 10 },
      { id: "2024-02", date: new Date(), payment: 200230, projects: 20 }
    ];
    expect(getEarningsForRange(earnings)).toEqual("400.35");
  });
});
