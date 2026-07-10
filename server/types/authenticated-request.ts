import type { Request } from "express";

interface AuthenticatedRequest extends Request {
  userId: string;
}

export default AuthenticatedRequest;
