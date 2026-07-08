import fs from "fs/promises";
import path from "path";
import { s3, S3_BUCKET } from "../config/aws-config.js";

export async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".kod");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const data = await s3
      .listObjectsV2({
        Bucket: S3_BUCKET,
        Prefix: "commits/",
      })
      .promise();

    const objects = data.Contents || [];

    for (const object of objects) {
      const key = object.Key;

      // Skip folder placeholders if any
      if (key.endsWith("/")) continue;

      const params = {
        Bucket: S3_BUCKET,
        Key: key,
      };

      const fileContent = await s3.getObject(params).promise();

      // Local path where file will be saved
      const localFilePath = path.join(repoPath, key);

      // Create complete directory structure
      await fs.mkdir(path.dirname(localFilePath), {
        recursive: true,
      });

      // Write file
      await fs.writeFile(localFilePath, fileContent.Body);
    }

    console.log("All commits pulled from S3.");
  } catch (error) {
    console.error("Unable to pull from S3:\n", error);
  }
}
