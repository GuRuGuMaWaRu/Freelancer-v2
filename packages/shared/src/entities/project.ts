import { z } from "zod";

import { clientSchema } from "./client";
import { currencySchema } from "./currency";

const projectBodySchema = z.object({
  client: z
    .string()
    .trim()
    .min(1),
  projectNr: z
    .string()
    .trim()
    .min(1),
  payment: z.coerce
    .number()
    .finite()
    .nonnegative(),
  currency: currencySchema,
  date: z.coerce.date(),
  paid: z.coerce.boolean().optional(),
  comments: z.string().optional(),
});

const projectResponseBaseSchema = z.object({
  _id: z.string(),
  projectNr: z.string(),
  payment: z.number(),
  currency: currencySchema,
  date: z.string().datetime(),
  paid: z.boolean(),
  comments: z.string().optional(),
});

export const projectListItemSchema = projectResponseBaseSchema.extend({
  client: clientSchema.passthrough(),
});

export const projectChartItemSchema = projectResponseBaseSchema.extend({
  client: z.object({ name: z.string() }),
});

export const projectPaginatedDataSchema = z.object({
  docs: z.array(projectListItemSchema),
  allDocs: z.number(),
});

export const createProjectBodySchema = projectBodySchema;

export const updateProjectBodySchema = projectBodySchema.partial().extend({
  client: z
    .string()
    .trim()
    .min(1),
});

export type ProjectListItem = z.infer<typeof projectListItemSchema>;
export type ProjectChartItem = z.infer<typeof projectChartItemSchema>;
export type Project = ProjectListItem;
export type ProjectPaginatedData = z.infer<typeof projectPaginatedDataSchema>;
