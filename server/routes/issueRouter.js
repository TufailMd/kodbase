import express from "express";
import issueController from "../controllers/issueController.js";

const issueRouter = express.Router();

issueRouter.get("/repositories/:id/issues", issueController.getAllIssues);
issueRouter.post("/repositories/:id/issues", issueController.createIssue);

issueRouter.get("/issues/:id", issueController.getIssueById);
issueRouter.put("/issues/:id", issueController.updateIssueById);
issueRouter.delete("/issues/:id", issueController.deleteIssueById);

export default issueRouter;
