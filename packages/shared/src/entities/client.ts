import { z } from "zod";

export const clientSchema = z.object({
  _id: z.string(),
  name: z.string(),
});

export const clientWithProjectDataSchema = clientSchema.extend({
  totalProjects: z.number(),
  firstProjectDate: z.string().datetime(),
  lastProjectDate: z.string().datetime(),
  totalEarnings: z.number(),
  projectsLast30Days: z.number(),
  projectsLast90Days: z.number(),
  projectsLast365Days: z.number(),
  daysSinceLastProject: z.number(),
});

export const createClientBodySchema = z.object({
  name: z.string().trim().min(1),
});

export const updateClientBodySchema = createClientBodySchema.partial();

export type Client = z.infer<typeof clientSchema>;
export type ClientWithProjectData = z.infer<typeof clientWithProjectDataSchema>;
