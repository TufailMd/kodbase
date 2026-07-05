import express from "express";

import pullRequestController from "../controllers/pullRequestController.js";

const pullRequestRouter = express.Router();

pullRequestRouter.get(
  "/pull-request/all/:repositoryId",
  pullRequestController.getAllPullRequests,
);

pullRequestRouter.post(
  "/pull-request/create/:repositoryId",
  pullRequestController.createPullRequest,
);

pullRequestRouter.get(
  "/pull-request/:id",
  pullRequestController.getPullRequestById,
);

pullRequestRouter.put(
  "/pull-request/update/:id",
  pullRequestController.updatePullRequest,
);

pullRequestRouter.delete(
  "/pull-request/delete/:id",
  pullRequestController.deletePullRequest,
);

export default pullRequestRouter;
