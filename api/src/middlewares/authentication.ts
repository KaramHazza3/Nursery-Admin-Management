import { Request, Response, NextFunction } from "express";
import { auth, db } from "../config/firebaseAdmin";
import HTTP_STATUS from "@/utils/http-status-codes";

export interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
    role?: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Missing Authorization header" });
    return;
  }

  const idToken = authHeader.split("Bearer ")[1];
  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    if (!userDoc.exists) {
      res.status(HTTP_STATUS.FORBIDDEN).json({ message: "User not found in Firestore" });
      return;
    }

    const userData = userDoc.data()!;
    req.user = {
      uid: decodedToken.uid,
      email: userData.email,
      role: userData?.role,
    };

    return next();
  } catch (err) {
    res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Invalid token", error: err });
    return;
  }
};
