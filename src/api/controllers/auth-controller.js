import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { findUserByUsername } from "../models/user-model.js";
import "dotenv/config";

const login = async (req, res, next) => {
  const { username, password } = req.body;
  const user = await findUserByUsername(username);

  if (!user) {
    const error = new Error("Invalid username or password");
    error.status = 401;
    next(error);
    return;
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    const error = new Error("Invalid username or password");
    error.status = 401;
    next(error);
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

const getMe = async (req, res, next) => {
  console.log("getMe", res.locals.user);

  if (res.locals.user) {
    res.json({
      message: "Token ok",
      user: res.locals.user,
    });
  } else {
    const error = new Error("Authentication required");
    error.status = 401;
    next(error);
  }
};

export { login, getMe };
