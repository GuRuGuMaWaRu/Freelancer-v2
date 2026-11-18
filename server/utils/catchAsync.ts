import type { NextFunction, Request, RequestHandler, Response } from "express";

export default function catchAsync<T extends Request = Request>(handler: (req: T, res: Response, next: NextFunction) => unknown): RequestHandler {
	return (req, res, next) => {
    Promise.resolve(handler(req as T, res, next)).catch(next);
	};
}