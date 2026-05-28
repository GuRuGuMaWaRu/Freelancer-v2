import { queryOptions } from "@tanstack/react-query";

import { apiClient } from "./api-client";
import type {
  ClientDto,
  ClientStatsDto,
  ProjectsPageDto,
  ProjectDto,
  UserDto,
} from "./types";

export const authStorageKey = "freelancer-token";

export function projectsPageQuery(page: number, sort?: string, search?: string) {
  const params = new URLSearchParams({
    page: String(page),
    limit: "10",
  });

  if (sort) {
    params.set("sort", sort);
  }

  if (search) {
    params.set("q", search);
  }

  return queryOptions({
    queryKey: ["projects", "page", page, sort ?? "", search ?? ""],
    queryFn: async () => {
      const response = await apiClient.get<ProjectsPageDto>(
        `projects?${params.toString()}`,
      );

      return response.data;
    },
  });
}

export function projectsForChartQuery(months = 12) {
  return queryOptions({
    queryKey: ["projects", "forChart", months],
    queryFn: async () => {
      const response = await apiClient.get<ProjectDto[]>(
        `projects/forChart?months=${months}`,
      );

      return response.data;
    },
  });
}

export function clientsQuery() {
  return queryOptions({
    queryKey: ["clients"],
    queryFn: async () => {
      const response = await apiClient.get<ClientDto[]>("clients");

      return response.data;
    },
  });
}

export function clientStatsQuery() {
  return queryOptions({
    queryKey: ["clients", "withProjectData"],
    queryFn: async () => {
      const response = await apiClient.get<ClientStatsDto[]>(
        "clients/withProjectData",
      );

      return response.data;
    },
  });
}

export async function login(credentials: { email: string; password: string }) {
  const response = await apiClient.post<UserDto>("users/login", {
    data: credentials,
    useToken: false,
  });

  return response.data;
}
