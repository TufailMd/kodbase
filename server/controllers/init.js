import fs from "fs/promises";
import path from "path";
import { addRemote } from "./remote.js";

export async function initRepo() {
  const repoPath = path.resolve(process.cwd(), ".kod");
  const commitsPath = path.join(repoPath, "commits");

  try {
    await fs.mkdir(repoPath, { recursive: true });
    await fs.mkdir(commitsPath, { recursive: true });
    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify(
        {
          bucket: process.env.S3_Bucket,
          remotes: {},
          currentRemote: null,
        },
        null,
        2,
      ),
    );
    console.log("Repository initialized!");
  } catch (error) {
    console.log(`Error initializing repository`);
  }
}
