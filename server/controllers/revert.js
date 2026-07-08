import fs from "fs/promises";
import path from "path";

export async function revertRepo(commitID) {
  const repoPath = path.resolve(process.cwd(), ".kod");
  const commitsPath = path.join(repoPath, "commits");
  const commitDir = path.join(commitsPath, commitID);
  const workingDir = path.resolve(repoPath, "..");

  try {
    // Restore complete commit recursively
    await copyDirectory(commitDir, workingDir);

    console.log(`Commit ${commitID} reverted successfully.`);
  } catch (error) {
    console.error("Unable to revert:\n", error);
  }
}

// Recursively copy files and folders
async function copyDirectory(src, dest) {
  await fs.mkdir(dest, { recursive: true });

  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    // Don't restore commit metadata
    if (entry.name === "commit.json") continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}
