import fs from "fs/promises";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws-config.js";

export async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".kod");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPath);

    for (const commitId of commitDirs) {
      const commitDir = path.join(commitsPath, commitId);

      // Upload complete commit recursively
      await uploadDirectory(commitDir, `commits/${commitId}`);

      console.log(`Commit ${commitId} pushed to S3.`);
    }

    console.log("All commits pushed successfully.");
  } catch (error) {
    console.error("Error pushing to S3:\n", error);
  }
}

// Recursively upload files and folders
async function uploadDirectory(localDir, s3Prefix) {
  const entries = await fs.readdir(localDir, { withFileTypes: true });

  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name);
    const s3Key = `${s3Prefix}/${entry.name}`;

    if (entry.isDirectory()) {
      // Upload nested folder
      await uploadDirectory(localPath, s3Key);
    } else {
      const fileContents = await fs.readFile(localPath);

      await s3
        .upload({
          Bucket: S3_BUCKET,
          Key: s3Key,
          Body: fileContents,
        })
        .promise();
    }
  }
}
