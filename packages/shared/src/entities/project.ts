import { z } from "zod";

import { clientSchema } from "./client";
import { currencySchema } from "./currency";

function normalizeOptionalBoolean(value: unknown): unknown {
  if (value === undefined || value === null || value === "") {
    return undefined;
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (value === 0) {
      return false;
    }

    if (value === 1) {
      return true;
    }

    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true" || normalized === "1") {
      return true;
    }

    if (normalized === "false" || normalized === "0") {
      return false;
    }

    return value;
  }

  return value;
}

const optionalBooleanLikeSchema = z.preprocess(
  normalizeOptionalBoolean,
  z.boolean().optional(),
);

function rejectNullDate(value: unknown): unknown {
  if (value === null) {
    return undefined;
  }

  return value;
}

const coercedDateSchema = z.preprocess(rejectNullDate, z.coerce.date());

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
  date: coercedDateSchema,
  paid: optionalBooleanLikeSchema,
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
  client: z.object({ name: z.string() }).nullable(),
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
