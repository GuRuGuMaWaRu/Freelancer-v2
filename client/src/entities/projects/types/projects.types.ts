import { Currency } from "shared/types";
import type { IProject, IProjectPaginatedData } from "shared/types";

interface IProjectForm {
  date: string;
  client: string;
  projectNr: string;
  currency: (typeof Currency)[keyof typeof Currency];
  payment: number;
  comments: string;
}

interface IEditProjectForm extends IProjectForm {
  projectId: string;
}

export type { IProjectForm, IEditProjectForm, IProject, IProjectPaginatedData };
