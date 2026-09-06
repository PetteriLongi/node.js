import express from "express";
import api from "./api/index.js";
import authRouter from "./api/routes/auth-router.js";
import { notFoundHandler, errorHandler } from "./middlewares/error-handlers.js";

const app = express();

app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", api);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
