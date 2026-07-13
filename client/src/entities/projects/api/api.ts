import { apiClient } from "shared/api";
import type { IProject, IProjectPaginatedData } from "shared/types";
import type { ProjectChartItem } from "@pet-freelancer/shared";
import { config } from "shared/const";

const getProjectsForChart = async (months: number) => {
  const query = months > 0 ? `?months=${months}` : "";
  return await apiClient.get<ProjectChartItem[]>(`projects/forChart${query}`);
};

const getPageOfProjects = async (
  pageParam: number,
  sortParam?: string,
  searchQuery?: string
) => {
  const sort = sortParam ? `&sort=${sortParam}` : "";
  const page = `page=${pageParam}&limit=${config.PAGE_LIMIT}`;
  const search = searchQuery ? `&q=${searchQuery}` : "";

  return await apiClient.get<IProjectPaginatedData>(
    `projects/?${page}${sort}${search}`
  );
};

const addProject = async (project: Partial<IProject>) => {
  return await apiClient.post<IProject>("projects", { data: project });
};

const deleteProject = async (projectId: string) => {
  return await apiClient.delete<null>(`projects/${projectId}`, {
    method: "DELETE",
  });
};

const editProject = async (projectId: string, project: Partial<IProject>) => {
  return await apiClient.patch<IProject>(`projects/${projectId}`, {
    data: project,
    method: "PATCH",
  });
};

export {
  getProjectsForChart,
  getPageOfProjects,
  addProject,
  deleteProject,
  editProject,
};
