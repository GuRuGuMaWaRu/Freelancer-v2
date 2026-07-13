import React from "react";
import { useQueries } from "@tanstack/react-query";

import type { IProjectChartItem } from "shared/types";
import { getEarningsByMonths, getEarningsByClients } from "./dashboard.helpers";
import type { ChartRange, IEarningsByMonth } from "shared/types";
import { getProjectsForChartQuery, chartRangeToMonths } from "entities/projects";
import { getAllClientsQuery } from "entities/clients";

/** Keep showing previous range + data until the current range's fetch completes. Avoids a wrong intermediate total: we were briefly using the new range (e.g. 1y) with the previous query result (e.g. 3m projects), so the second total showed the old sum with the new range label until the new fetch finished. */
const useDashboardData = (chartRange: ChartRange) => {
  const [projectsResult, { data: clients = [] }] = useQueries({
    queries: [
      { ...getProjectsForChartQuery(chartRange) },
      { ...getAllClientsQuery() },
    ],
  });

  const { data: projects = [], isFetching: isProjectsFetching } =
    projectsResult;

  const lastStableRef = React.useRef<{
    range: ChartRange;
    projects: IProjectChartItem[];
  } | null>(null);

  if (!isProjectsFetching) {
    lastStableRef.current = { range: chartRange, projects };
  }

  const isHoldingPreviousData =
    isProjectsFetching &&
    lastStableRef.current &&
    lastStableRef.current.range !== chartRange;

  const displayProjects = isHoldingPreviousData
    ? lastStableRef.current!.projects
    : projects;

  const displayRange = isHoldingPreviousData
    ? lastStableRef.current!.range
    : chartRange;

  const monthsBack = chartRangeToMonths(displayRange);

  const earningsByMonth = React.useMemo(() => {
    return getEarningsByMonths(displayProjects, monthsBack);
  }, [displayProjects, monthsBack]);

  const dataByClient = React.useMemo(() => {
    return getEarningsByClients(displayProjects);
  }, [displayProjects]);

  const dataByMonth = React.useMemo((): IEarningsByMonth[] => {
    return earningsByMonth
      .map((item) => ({
        date: item.date.getTime(),
        payment: item.payment / 1000,
        projects: item.projects,
      }))
      .sort((a, b) => a.date - b.date);
  }, [earningsByMonth]);

  return {
    earningsByMonth,
    dataByClient,
    dataByMonth,
    clients,
    displayRange,
  };
};

export { useDashboardData };
