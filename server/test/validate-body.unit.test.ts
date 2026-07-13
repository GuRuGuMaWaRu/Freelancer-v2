import assert from "assert";
import type { NextFunction, Request, Response } from "express";
import { z } from "zod";

import validateBody from "../middleware/validateBody";
import AppError from "../utils/appError";

type ValidationDetails = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

describe("validateBody", () => {
  it("forwards flattened field errors for an invalid request body", () => {
    const middleware = validateBody(
      z.object({ currency: z.enum(["USD", "EUR"]) }),
    );
    const req = { body: { currency: "GBP" } } as Request;
    let forwardedError: unknown;
    const next = ((error?: unknown) => {
      forwardedError = error;
    }) as NextFunction;

    middleware(req, {} as Response, next);

    assert(forwardedError instanceof AppError);
    assert.strictEqual(forwardedError.statusCode, 422);
    const details = (
      forwardedError as AppError & { errors?: ValidationDetails }
    ).errors;
    assert(details);
    assert.deepStrictEqual(details.formErrors, []);
    assert.strictEqual(details.fieldErrors.currency?.length, 1);
  });
});
