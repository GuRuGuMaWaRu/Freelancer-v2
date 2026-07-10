import type { NextFunction, Request, Response } from "express";

type AsyncRequestHandler<T extends Request = Request> = (
  req: T,
  res: Response,
  next: NextFunction,
) => Promise<void | Response>;

export default function catchAsync<T extends Request = Request>(
  fn: AsyncRequestHandler<T>,
) {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req as T, res, next).catch(next);
  };
}
