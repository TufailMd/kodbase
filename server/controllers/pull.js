import fs from "fs/promises";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws-config.js";
import { getRemoteRepository } from "../utils/getRemoteRepository.js";

export async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".kod");

  try {
    const { repositoryId } = await getRemoteRepository();

    const data = await s3
      .listObjectsV2({
        Bucket: S3_BUCKET,
        Prefix: `${repositoryId}/commits/`,
      })
      .promise();

    const objects = data.Contents || [];

    for (const object of objects) {
      const key = object.Key;

      if (key.endsWith("/")) continue;

      const fileContent = await s3
        .getObject({
          Bucket: S3_BUCKET,
          Key: key,
        })
        .promise();

      // Remove repository id from S3 key
      const relativePath = key.replace(`${repositoryId}/`, "");

      const localFilePath = path.join(repoPath, relativePath);

      await fs.mkdir(path.dirname(localFilePath), {
        recursive: true,
      });

      await fs.writeFile(localFilePath, fileContent.Body);
    }

    console.log("All commits pulled successfully.");
  } catch (error) {
    console.error("Pull failed:");
    console.error(error.message);
  }
}
