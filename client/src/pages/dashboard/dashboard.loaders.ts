import { QueryClient } from "@tanstack/react-query";

import type { IProjectChartItem, IClient } from "shared/types";
import { config } from "shared/const";
import { getProjectsForChartQuery } from "entities/projects";
import { getAllClientsQuery } from "entities/clients";

const loader =
  (queryClient: QueryClient) =>
  async (): Promise<{
    projectsQuery: IProjectChartItem[];
    clientsQuery: IClient[];
  }> => {
    const projectsQuery = getProjectsForChartQuery(config.DEFAULT_CHART_RANGE);
    const clientsQuery = getAllClientsQuery();

    return {
      projectsQuery:
        queryClient.getQueryData(projectsQuery.queryKey) ??
        (await queryClient.fetchQuery(projectsQuery)),
      clientsQuery:
        queryClient.getQueryData(clientsQuery.queryKey) ??
        (await queryClient.fetchQuery(clientsQuery)),
    };
  };

export { loader };
