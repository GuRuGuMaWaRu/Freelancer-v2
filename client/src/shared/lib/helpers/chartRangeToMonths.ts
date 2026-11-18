import { ChartRange } from "shared/types";

export const chartRangeToMonths = (range: ChartRange): number => {
  const map: Record<ChartRange, number> = {
    "3m": 3,
    "6m": 6,
    "1y": 12,
    "2y": 24,
    all: 0,
  };
  return map[range];
};
