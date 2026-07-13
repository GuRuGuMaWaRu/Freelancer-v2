import { z } from "zod";

import { clientSchema } from "./client";
import { currencySchema } from "./currency";

/** List: populated client; forChart: `{ name }` only. */
const projectClientSchema = z.union([
  clientSchema.passthrough(),
  z.object({ name: z.string() }),
]);

const projectBodySchema = z.object({
  client: z.string().trim().min(1),
  projectNr: z.string().trim().min(1),
  payment: z.coerce.number().finite().nonnegative(),
  currency: currencySchema,
  date: z.coerce.date(),
  paid: z.coerce.boolean().optional(),
  comments: z.string().optional(),
});

export const projectSchema = z.object({
  _id: z.string(),
  projectNr: z.string(),
  payment: z.number(),
  currency: currencySchema,
  date: z.coerce.date(),
  paid: z.boolean(),
  comments: z.string().optional(),
  client: projectClientSchema,
});

export const projectPaginatedDataSchema = z.object({
  docs: z.array(projectSchema),
  allDocs: z.number(),
});

export const createProjectBodySchema = projectBodySchema;

export const updateProjectBodySchema = projectBodySchema.partial().extend({
  client: z.string().trim().min(1),
});

export type Project = z.infer<typeof projectSchema>;
export type ProjectListItem = Project;
export type ProjectPaginatedData = z.infer<typeof projectPaginatedDataSchema>;
