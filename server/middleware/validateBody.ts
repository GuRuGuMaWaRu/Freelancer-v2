import type { NextFunction, Request, Response } from "express";
import type { ZodTypeAny } from "zod";

import AppError from "../utils/appError";

const validateBody =
  <T extends ZodTypeAny>(schema: T) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          422,
          "Validation error",
          true,
          "",
          result.error.flatten(),
        ),
      );
    }

    req.body = result.data;
    next();
  };

export default validateBody;
