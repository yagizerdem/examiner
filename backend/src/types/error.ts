import { ErrorCode } from "../utils/helpers/codes";
import HttpStatusCode from "../utils/helpers/HttpStatusCode";

export class AppError extends Error {
  public status: number;
  public code: ErrorCode;
  public isOperational: boolean;

  constructor(
    message: string,
    code: ErrorCode,
    status = HttpStatusCode.BAD_REQUEST,
  ) {
    super(message);
    this.code = code;
    this.status = status;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(code = ErrorCode.NOT_FOUND) {
    super("Not Found", code, HttpStatusCode.NOT_FOUND);
  }
}

export class BadRequestError extends AppError {
  constructor(code = ErrorCode.BAD_REQUEST) {
    super("Bad Request", code, HttpStatusCode.BAD_REQUEST);
  }
}

export class HttpError extends AppError {
  constructor(message: string, code: ErrorCode, status: HttpStatusCode) {
    super(message, code, status);
  }
}
