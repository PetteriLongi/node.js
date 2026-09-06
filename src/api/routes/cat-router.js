import express from "express";
import { body } from "express-validator";
import { createThumbnail, upload } from "../../middlewares/upload.js";
import { authenticateToken } from "../../middlewares/authentication.js";
import { validationErrors } from "../../middlewares/error-handlers.js";
import {
  getCat,
  getCatById,
  getCatsByUserId,
  postCat,
  putCat,
  deleteCat,
} from "../controllers/cat-controller.js";

const catRouter = express.Router();

catRouter
  .route("/")
  .get(getCat)
  .post(
    authenticateToken,
    upload.single("cat"),
    createThumbnail,
    body("cat_name").trim().isLength({ min: 3, max: 50 }),
    body("weight").isFloat({ min: 0 }).toFloat(),
    body("birthdate").isDate(),
    validationErrors,
    postCat,
  );

catRouter.route("/user/:userId").get(getCatsByUserId);
catRouter
  .route("/:id")
  .get(getCatById)
  .put(
    authenticateToken,
    body("cat_name").trim().isLength({ min: 3, max: 50 }),
    body("weight").isFloat({ min: 0 }).toFloat(),
    body("birthdate").isDate(),
    validationErrors,
    putCat,
  )
  .delete(authenticateToken, deleteCat);

export default catRouter;
