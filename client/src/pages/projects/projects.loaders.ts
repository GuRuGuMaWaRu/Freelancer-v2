import type { QueryClient } from "@tanstack/react-query";
import { LoaderFunctionArgs } from "react-router";

import { getAllClientsQuery } from "entities/clients";
import { getProjectsPageQuery } from "entities/projects/";

const loader =
  (queryClient: QueryClient) =>
  async ({ request }: LoaderFunctionArgs) => {
    const projectsQuery = getProjectsPageQuery(1);
    const clientsQuery = getAllClientsQuery();

    await queryClient.ensureQueryData(projectsQuery);
    await queryClient.ensureQueryData(clientsQuery);

    return null;
  };

export { loader };
