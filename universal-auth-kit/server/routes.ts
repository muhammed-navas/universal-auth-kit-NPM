import express from "express";
import bcrypt from "bcryptjs";
import { createToken } from "./token";

const router = express.Router();

const mockUser = {
  username: "admin",
  passwordHash: bcrypt.hashSync("password123", 10),
};

router.post("/login", express.json(), (req, res) => {
  const { username, password } = req.body;
  if (
    username !== mockUser.username ||
    !bcrypt.compareSync(password, mockUser.passwordHash)
  ) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = createToken({ username });
  res.cookie("token", token, { httpOnly: true });
  res.json({ token });
});

export default router;
