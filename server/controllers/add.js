import fs from "fs/promises";
import path from "path";

export async function addRepo(filePath) {
  const repoPath = path.resolve(process.cwd(), ".kod");
  const stagingPath = path.join(repoPath, "staging");
  const fileName = path.basename(filePath);
  try {
    await fs.mkdir(stagingPath, { recursive: true });
    await fs.copyFile(filePath, path.join(stagingPath, fileName));
    console.log(`File ${fileName} is added to stage area!`);
  } catch (error) {
    console.log(`Error adding file: \n ${error}`);
  }
}
