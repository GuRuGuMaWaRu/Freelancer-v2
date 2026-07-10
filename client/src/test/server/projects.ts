import { config } from "../../shared/const";
import { buildProject } from "../generate";
import type { IProject } from "../../shared/types";

const projects: IProject[] = [];

// initialize
// load();

function persist() {
  window.localStorage.setItem(config.PROJECTS_KEY, JSON.stringify(projects));
}
function load() {
  Object.assign(
    projects,
    JSON.parse(window.localStorage.getItem(config.PROJECTS_KEY) || "[]")
  );
}

function bootstrapFakeProjects(
  num = Math.floor(Math.random() * 1000) + 1
): void {
  for (let i = 0; i < num; i++) {
    projects.push(buildProject());
  }
}

function getProjects(): IProject[] {
  return projects;
}

function getProjectsForChart(months: number): IProject[] {
  if (months <= 0) return projects;

  const fromDate = new Date();
  fromDate.setMonth(fromDate.getMonth() - (months - 1));
  fromDate.setDate(1);
  fromDate.setHours(0, 0, 0, 0);

  return projects.filter((p) => new Date(p.date) >= fromDate);
}

function addProject(project: IProject): void {
  projects.push(project);
  persist();
}

function updateProject(project: IProject): void {
  const index = projects.findIndex((p) => p._id === project._id);

  if (index !== -1) {
    projects[index] = project;
    persist();
  }
}

// bootstrap
bootstrapFakeProjects();

export type { IProject };
export {
  getProjects,
  getProjectsForChart,
  addProject,
  updateProject,
};
