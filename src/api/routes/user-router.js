import express from "express";
import { body } from "express-validator";
import { authenticateToken } from "../../middlewares/authentication.js";
import { validationErrors } from "../../middlewares/error-handlers.js";
import {
  getUser,
  getUserById,
  postUser,
  putUser,
  deleteUser,
} from "../controllers/user-controller.js";

const userRouter = express.Router();

userRouter
  .route("/")
  .get(getUser)
  .post(
    body("name").trim().isLength({ min: 1, max: 100 }),
    body("email").trim().isEmail(),
    body("username").trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    body("password").trim().isLength({ min: 8 }),
    validationErrors,
    postUser,
  );

userRouter
  .route("/:id")
  .get(getUserById)
  .put(
    authenticateToken,
    body("name").trim().isLength({ min: 1, max: 100 }),
    body("email").trim().normalizeEmail().isEmail(),
    body("username").trim().isLength({ min: 3, max: 20 }).isAlphanumeric(),
    validationErrors,
    putUser,
  )
  .delete(authenticateToken, deleteUser);

export default userRouter;
