import { Currency } from "shared/types";
import type { IProject } from "shared/types";
import type { IProjectForm } from "entities/projects/types/projects.types";

//** Constructs the form values based on the project */
export function formValsConstructor(
  project: IProject | undefined
): IProjectForm & { projectId: string } {
  return {
    date: project
      ? new Date(project.date).toISOString().split("T")[0] //** TODO: need some clearly named helper function for this so I don't have to break my head trying to figure out what this is */
      : new Date().toISOString().split("T")[0], //** TODO: same here */
    client: project?.client.name ?? "",
    projectNr: project?.projectNr ?? "",
    currency: project?.currency ?? Currency.USD,
    payment: project?.payment ?? 0,
    comments: project?.comments ?? "",
    projectId: project?._id ?? "",
  };
}
