import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserByUsername } from "../models/user-model.js";
import "dotenv/config";

const login = async (req, res) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);

  if (!user) {
    res.sendStatus(401);
    return;
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.sendStatus(401);
    return;
  }
  const userWithNoPassword = {
    user_id: user.user_id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(userWithNoPassword, process.env.JWT_SECRET, {
    expiresIn: "24h", // token expiration time, e.g. 24 hours, can be configured in .env too
  });
  res.json({ user: userWithNoPassword, token });
};

const getMe = async (req, res) => {
  console.log("getMe", res.locals.user);

  if (res.locals.user) {
    res.json({
      message: "Token ok",
      user: res.locals.user,
    });
  } else {
    res.sendStatus(401);
  }
};

export { login, getMe };
