import express from "express";

import repoController from "../controllers/repoController.js";

const repoRouter = express.Router();

repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get(
  "/repo/user/:userId",
  repoController.fetchRepositoriesForCurrentUser,
);
repoRouter.put("/repo/update/:id", repoController.updateRepository);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);
// S3 file routes
repoRouter.get(
  "/repo/file/:repoName/:commitId/*filePath",
  repoController.getFileContentFromS3,
);
// repoRouter.get(
//   "/repo/s3/file/:commitId/:fileName",
//   repoController.getFileContentFromS3,
// );

repoRouter.get("/repo/s3/:repoName", repoController.getRepoContentsFromS3);

// repoRouter.get(
//   "/repo/s3/file/:commitId/:fileName",
//   repoController.getFileContentFromS3,
// );

export default repoRouter;
