import fs from "fs/promises";
import path from "path";

export async function addRemote(name, url) {
  const repoPath = path.resolve(process.cwd(), ".kod");
  const configPath = path.join(repoPath, "config.json");

  try {
    const config = JSON.parse(await fs.readFile(configPath, "utf-8"));

    if (!config.remotes) {
      config.remotes = {};
    }

    config.remotes[name] = url;

    if (!config.currentRemote) {
      config.currentRemote = name;
    }

    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    console.log(`Remote '${name}' added successfully.`);
    console.log(`${name} -> ${url}`);
  } catch (err) {
    console.error("Unable to add remote:", err);
  }
}
