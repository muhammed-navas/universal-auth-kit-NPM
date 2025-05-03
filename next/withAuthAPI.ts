import { NextApiHandler } from "next";
import { verifyToken } from "../server/token";

export const withAuthAPI = (handler: NextApiHandler): NextApiHandler => {
  return async (req, res) => {
    try {
      const token =
        req.cookies.token || req.headers.authorization?.split(" ")[1];
      if (!token) return res.status(401).json({ message: "Unauthorized" });

      const user = verifyToken(token);
      (req as any).user = user;

      return handler(req, res);
    } catch {
      return res.status(403).json({ message: "Invalid token" });
    }
  };
};
