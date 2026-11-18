import React from "react";
import { useQueries } from "@tanstack/react-query";

import {
  groupEarningsByMonths,
  groupEarningsByClients,
} from "pages/dashboard/dashboard.helpers";
import type { ChartRange, IEarningsByMonth } from "shared/types";
import { chartRangeToMonths } from "shared/lib/helpers/chartRangeToMonths";
import { getProjectsForChartQuery } from "entities/projects";
import { getAllClientsQuery } from "entities/clients";

/** Keep showing previous range + data until the current range's fetch completes. Avoids a wrong intermediate total: we were briefly using the new range (e.g. 1y) with the previous query result (e.g. 3m projects), so the second total showed the old sum with the new range label until the new fetch finished. */
export const useDashboardData = (chartRange: ChartRange) => {
  const [{ data: projects = [] }, { data: clients = [] }] = useQueries({
    queries: [
      { ...getProjectsForChartQuery(chartRange) },
      { ...getAllClientsQuery() },
    ],
  });

  const monthsBack = chartRangeToMonths(chartRange);

  const earningsByMonth = React.useMemo(() => {
    return groupEarningsByMonths(projects, monthsBack);
  }, [projects, monthsBack]);

  const dataByClient = React.useMemo(() => {
    return groupEarningsByClients(projects);
  }, [projects]);

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
    chartRange,
  };
};
