import { AuthRequest } from "@/middlewares/authentication";
import HTTP_STATUS from "@/utils/http-status-codes";
import { Response, NextFunction } from "express";

export const isAdmin = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (req.user?.role !== "admin") {
    res.status(HTTP_STATUS.FORBIDDEN).json({ message: "Forbidden: Admins only." });
    return;
  }
  return next();
}
