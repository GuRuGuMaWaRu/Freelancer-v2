import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import AppError from "../utils/appError";

interface JwtPayload {
  id: string;
}

const protect = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer || !bearer.startsWith("Bearer ")) {
    return next(new AppError(401, "No token provided, authorization denied"));
  }

  const token = bearer.split(" ")[1].trim();

  try {
    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string,
    ) as JwtPayload;

    req.userId = decoded.id;
    next();
  } catch {
    next(new AppError(401, "Token is not valid"));
  }
};

export { protect };
