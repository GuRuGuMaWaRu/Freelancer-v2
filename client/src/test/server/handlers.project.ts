import { rest } from "msw";

import { config } from "../../shared/const";
import {
  getProjects,
  getProjectsForChart,
  addProject,
  updateProject,
  IProject
} from "./projects";

export const projectHandlers = [
  rest.get(`${config.API_URL}/projects`, (req, res, ctx) => {
    const projects = getProjects();

    return res(
      ctx.status(200),
      ctx.json({
        status: "success",
        results: projects.length,
        data: projects
      })
    );
  }),

  rest.get(`${config.API_URL}/projects/forChart`, (req, res, ctx) => {
    const monthsParam = req.url.searchParams.get("months");
    const months = monthsParam ? parseInt(monthsParam, 10) : 0;
    const projects = getProjectsForChart(Number.isNaN(months) ? 0 : months);

    return res(
      ctx.status(200),
      ctx.json({
        status: "success",
        results: projects.length,
        data: projects
      })
    );
  }),

  rest.post(`${config.API_URL}/projects`, async (req, res, ctx) => {
    const project = (await req.json()) as IProject;
    addProject(project);

    return res(
      ctx.status(200),
      ctx.json({
        status: "success",
        data: null
      })
    );
  }),

  rest.patch(`${config.API_URL}/projects/:id`, async (req, res, ctx) => {
    const updatedProject = (await req.json()) as IProject;
    updateProject(updatedProject);

    return res(
      ctx.status(201),
      ctx.json({
        status: "success",
        data: null
      })
    );
  })
];
