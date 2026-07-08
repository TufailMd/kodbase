import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function commitRepo(message) {
  const commitId = uuidv4();

  const repoPath = path.resolve(process.cwd(), ".kod");
  const stagingPath = path.join(repoPath, "staging");
  const commitsPath = path.join(repoPath, "commits");
  const commitDir = path.join(commitsPath, commitId);

  try {
    // Create commit directory
    await fs.mkdir(commitDir, { recursive: true });

    // Copy everything from staging to commit
    await copyDirectory(stagingPath, commitDir);

    // Save commit metadata
    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify(
        {
          message,
          date: new Date().toISOString(),
        },
        null,
        2,
      ),
    );

    console.log(`Commit ${commitId} created successfully.`);
  } catch (error) {
    console.error("Error committing files:\n", error);
  }
}

// Recursively copy files and folders
async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });

  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}
