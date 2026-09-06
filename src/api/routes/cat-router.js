import express from "express";
import { createThumbnail } from "../../middlewares/upload.js";
import multer from "multer";
import { authenticateToken } from "../../middlewares/authentication.js";
import {
  getCat,
  getCatById,
  getCatsByUserId,
  postCat,
  putCat,
  deleteCat,
} from "../controllers/cat-controller.js";

const catRouter = express.Router();
const upload = multer({ dest: "uploads/" });

catRouter
  .route("/")
  .get(getCat)
  .post(authenticateToken, upload.single("cat"), createThumbnail, postCat);

catRouter.route("/user/:userId").get(getCatsByUserId);
catRouter
  .route("/:id")
  .get(getCatById)
  .put(authenticateToken, putCat)
  .delete(authenticateToken, deleteCat);

export default catRouter;
