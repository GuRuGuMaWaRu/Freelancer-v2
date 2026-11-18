import { apiClient } from "shared/api";
import type { IProject, IProjectPaginatedData } from "shared/types";
import type { ProjectChartItem } from "@pet-freelancer/shared";
import { config } from "shared/const";

export async function getProjectsForChart(months: number) {
  const query = months > 0 ? `?months=${months}` : "";
  return await apiClient.get<ProjectChartItem[]>(`projects/forChart${query}`);
}

export async function getPageOfProjects(
  pageParam: number,
  sortParam?: string,
  searchQuery?: string
) {
  const searchParams = new URLSearchParams();

  if (sortParam) searchParams.set("sort", sortParam);
  if (searchQuery) searchParams.set("q", searchQuery);

  searchParams.set("page", String(pageParam));
  searchParams.set("limit", String(config.PAGE_LIMIT));

  return await apiClient.get<IProjectPaginatedData>(
    `projects/?${searchParams.toString()}`
  );
}

export async function addProject(project: Partial<IProject>) {
  return await apiClient.post<IProject>("projects", { data: project });
}

export async function deleteProject(projectId: string) {
  return await apiClient.delete<null>(`projects/${projectId}`, {});
}

export async function editProject(
  projectId: string,
  project: Partial<IProject>
) {
  return await apiClient.patch<IProject>(`projects/${projectId}`, {
    data: project,
  });
}
