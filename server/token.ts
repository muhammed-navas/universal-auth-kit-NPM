import jwt from "jsonwebtoken";

const secret = process.env.AUTH_SECRET || "default_secret";

export const createToken = (user: any, expiresIn = "1h") =>
  jwt.sign(user, secret, { expiresIn });

export const verifyToken = (token: string) => jwt.verify(token, secret);
