import fs from "fs/promises";
import path from "path";

export const addRepo = async (filePath) => {
  const repoPath = path.resolve(process.cwd(), ".kod");
  const stagingPath = path.join(repoPath, "staging");

  try {
    // Check karo — file hai ya folder?
    const stat = await fs.stat(filePath);

    if (stat.isDirectory()) {
      // ✅ FOLDER hai → recursively copy karo
      await copyDirectory(
        filePath,
        path.join(stagingPath, path.basename(filePath)),
      );
      console.log(`Folder '${filePath}' added to staging area.`);
    } else {
      // ✅ FILE hai → pehle jaisi copy karo
      await fs.mkdir(stagingPath, { recursive: true });
      const fileName = path.basename(filePath);
      await fs.copyFile(filePath, path.join(stagingPath, fileName));
      console.log(`File '${fileName}' added to staging area.`);
    }
  } catch (error) {
    console.error("Error adding file: \n", error);
  }
};

// 🔧 Helper function — folder recursively copy karta hai
const copyDirectory = async (src, dest) => {
  // Destination folder create karo
  await fs.mkdir(dest, { recursive: true });

  // Source folder ke andar sab kuch read karo
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Nested folder → recursively call karo
      await copyDirectory(srcPath, destPath);
    } else {
      // File → direct copy
      await fs.copyFile(srcPath, destPath);
    }
  }
};
