import { Request, Response, NextFunction } from "express";
import { verifyToken } from "./token";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token" });

  try {
    const user = verifyToken(token);
    (req as any).user = user;
    next();
  } catch (e) {
    res.status(403).json({ message: "Invalid token" });
  }
}
