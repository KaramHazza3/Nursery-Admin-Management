import { Request, Response, NextFunction } from "express";

export const adminApiKeyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];
  if (apiKey !== process.env.ADMIN_API_KEY) {
    res.status(403).json({ message: "Forbidden: Invalid API key" });
    return;
  }
  return next();
};