import { ForbiddenException } from "@/exceptions/forbiddenException";
import { InvalidCredentials } from "@/exceptions/invalidCredentails";
import { NotFoundException } from "@/exceptions/notFound";
import { UserAlreadyExist } from "@/exceptions/userAlreadyExist";
import { UserNotFound } from "@/exceptions/userNotFound";
import HTTP_STATUS from "@/utils/http-status-codes";
import { Request, Response, NextFunction } from "express";

const errorHandler = (
  err: { message: string },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let errorMessage = "Internal Server Error";

  if (err instanceof InvalidCredentials) {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    errorMessage = err.message;
  } else if (err instanceof NotFoundException || err instanceof UserNotFound) {
    statusCode = HTTP_STATUS.NOT_FOUND;
    errorMessage = err.message;
  } else if (err instanceof UserAlreadyExist) {
    statusCode = HTTP_STATUS.CONFLICT;
    errorMessage = err.message;
  } else if (err instanceof ForbiddenException) {
    statusCode = HTTP_STATUS.FORBIDDEN;
    errorMessage = err.message;
  }

  res.status(statusCode).json({
    error: errorMessage,
  });
};

export default errorHandler;
