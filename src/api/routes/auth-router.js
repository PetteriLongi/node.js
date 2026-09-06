import express from "express";
import { body } from "express-validator";
import { login, getMe } from "../controllers/auth-controller.js";
import { authenticateToken } from "../../middlewares/authentication.js";
import { validationErrors } from "../../middlewares/error-handlers.js";

const authRouter = express.Router();

authRouter.post(
  "/login",
  body("username").trim().notEmpty(),
  body("password").notEmpty(),
  validationErrors,
  login,
);
authRouter.get("/me", authenticateToken, getMe);

export default authRouter;
