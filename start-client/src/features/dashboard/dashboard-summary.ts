import type { ProjectDto } from "../../shared/api/types";

export interface DashboardSummary {
  projectCount: number;
  paidTotal: number;
  unpaidTotal: number;
  total: number;
}

export function summarizeDashboardProjects(
  projects: ProjectDto[],
): DashboardSummary {
  return projects.reduce<DashboardSummary>(
    (summary, project) => {
      const nextSummary = {
        ...summary,
        projectCount: summary.projectCount + 1,
        total: summary.total + project.payment,
      };

      if (project.paid) {
        return {
          ...nextSummary,
          paidTotal: nextSummary.paidTotal + project.payment,
        };
      }

      return {
        ...nextSummary,
        unpaidTotal: nextSummary.unpaidTotal + project.payment,
      };
    },
    {
      projectCount: 0,
      paidTotal: 0,
      unpaidTotal: 0,
      total: 0,
    },
  );
}
