import { z, type ZodTypeAny } from "zod";

export const successResponseSchema = <TData extends ZodTypeAny>(
  dataSchema: TData,
) =>
  z.object({
    status: z.literal("success"),
    data: dataSchema,
    message: z.string().optional(),
    results: z.number().optional(),
  });

/**
 * Standard API success envelope.
 *
 * All successful responses use:
 * `{ status: "success", data: T }`
 *
 * List endpoints may also include `results` (item count).
 * Auth mutations may include `message` (human-readable confirmation).
 *
 * @example
 * { status: "success", data: { name: "Jane", email: "j@example.com", token: "..." }, message: "Jane logged in successfully" }
 * { status: "success", results: 12, data: [{ _id: "...", name: "Acme" }] }
 */
export type ApiSuccessResponse<T> = {
  status: "success";
  data: T;
  message?: string;
  results?: number;
};

/**
 * Standard API error envelope (from `errorHandler` middleware).
 *
 * @example
 * { code: 422, status: "fail", message: "Validation error" }
 */
export const apiErrorResponseSchema = z.object({
  code: z.number(),
  status: z.enum(["fail", "error"]),
  message: z.string(),
  errors: z
    .object({
      formErrors: z.array(z.string()),
      fieldErrors: z.record(z.array(z.string()).optional()),
    })
    .optional(),
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;
