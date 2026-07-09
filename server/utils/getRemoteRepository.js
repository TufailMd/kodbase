import fs from "fs/promises";
import path from "path";

export async function getRemoteRepository() {
  const repoPath = path.resolve(process.cwd(), ".kod");
  const configPath = path.join(repoPath, "config.json");

  // Read config
  const config = JSON.parse(await fs.readFile(configPath, "utf-8"));

  if (!config.currentRemote) {
    throw new Error("No remote configured. Run: kod remote add origin <url>");
  }

  const remoteUrl = config.remotes[config.currentRemote];

  const url = new URL(remoteUrl);

  const repoName = url.pathname.replace("/", "").replace(".git", "");

  const response = await fetch(`${url.origin}/repo/name/${repoName}`);

  if (!response.ok) {
    throw new Error("Repository not found on remote.");
  }

  const repository = await response.json();

  return {
    repository,
    repositoryId: repository._id,
    remoteUrl,
    origin: url.origin,
  };
}
