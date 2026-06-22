import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function commitRepo(message) {
  const commitId = uuidv4();
  const repoPath = path.resolve(process.cwd(), ".kod");
  const stagingPath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");
  const commitDir = path.join(commitPath, commitId);

  try {
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagingPath);
    for (const file of files) {
      await fs.copyFile(
        path.join(stagingPath, file),
        path.join(commitDir, file),
      );
    }

    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ message, date: new Date().toISOString() }),
    );

    console.log(`Commit ${commitId} created with message: ${message}`);
  } catch (error) {
    console.log(`Error committing files: \n ${error}`);
  }
}
