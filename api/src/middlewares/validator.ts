import { ZodSchema, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";
import HTTP_STATUS from "@/utils/http-status-codes";

export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const friendlyErrors = formatZodErrors(result.error);

      res.status(HTTP_STATUS.BAD_REQUEST).json({
        message: "Validation error",
        errors: friendlyErrors,
      });
      return;
    }

    req.body = result.data;
    next();
  };

export const validateQuery =
  (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({
        message: "Validation Error",
        errors: result.error.format(),
      });
      return;
    }
    next();
  };

function formatZodErrors(error: ZodError): Record<string, string[]> {
  const formatted: Record<string, string[]> = {};

  for (const issue of error.issues) {
    const path = issue.path.join(".");
    const msg = makeFriendlyMessage(issue.message);
    if (!formatted[path]) {
      formatted[path] = [];
    }
    formatted[path].push(msg);
  }

  return formatted;
}

function makeFriendlyMessage(original: string): string {
  switch (original) {
    case "Required":
      return "This field is required.";
    case 'Invalid literal value, expected "nanny"':
      return 'Invalid role. Only "nanny" is allowed.';
    case "Expected array, received string":
      return "Expected a list (array), but got a single value.";
    default:
      return original.charAt(0).toUpperCase() + original.slice(1);
  }
}
