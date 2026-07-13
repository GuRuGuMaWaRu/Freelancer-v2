export type AppErrorDetails = {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
};

class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  status: string;
  errors?: AppErrorDetails;

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = "",
    errors?: AppErrorDetails,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
