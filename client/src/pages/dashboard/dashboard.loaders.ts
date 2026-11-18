import { QueryClient } from "@tanstack/react-query";

import { config } from "shared/const";
import { getProjectsForChartQuery } from "entities/projects";
import { getAllClientsQuery } from "entities/clients";

export const loader = (queryClient: QueryClient) => async () => {
  const projectsQuery = getProjectsForChartQuery(config.DEFAULT_CHART_RANGE);
  const clientsQuery = getAllClientsQuery();

  await queryClient.ensureQueryData(projectsQuery);
  await queryClient.ensureQueryData(clientsQuery);

  return null;
};
