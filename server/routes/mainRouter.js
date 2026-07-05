import express from "express";
import userRouter from "./userRouter.js";
import repoRouter from "./repoRouter.js";
import issueRouter from "./issueRouter.js";
import pullRouter from "./pullRouter.js";

const mainRouter = express.Router();

mainRouter.use(userRouter);
mainRouter.use(repoRouter);
mainRouter.use(issueRouter);
mainRouter.use(pullRouter);

mainRouter.get("/", (req, res) => {
  res.send("Welcome");
});

export default mainRouter;
