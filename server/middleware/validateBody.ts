import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

import AppError from "../utils/appError";

const validateBody =
  (schema: ZodTypeAny) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(422, "Validation error", {
          errors: result.error.flatten(),
        }),
      );
    }

    req.body = result.data;
    next();
  };

export default validateBody;
