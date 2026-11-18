import type { ChartRange } from "shared/types";
import { chartRangeToMonths } from "shared/lib/helpers/chartRangeToMonths";
import {
  getProjectsForChart,
  getPageOfProjects,
} from "entities/projects/api/api";

export const getProjectsForChartQuery = (chartRange: ChartRange) => ({
  queryKey: ["projects", "forChart", chartRange] as const,
  queryFn: async () => {
    const months = chartRangeToMonths(chartRange);
    const res = await getProjectsForChart(months);
    return res.data;
  },
  keepPreviousData: true,
});

export const getProjectsPageQuery = (
  page: number,
  sortColumn?: string,
  searchQuery?: string
) => ({
  queryKey: ["projects", { page, sortColumn, searchQuery }],
  queryFn: async () => {
    const res = await getPageOfProjects(page, sortColumn, searchQuery);

    return res.data;
  },
  keepPreviousData: true,
});
