import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import http from "http";
import { Server } from "socket.io";

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { initRepo } from "./controllers/init.js";
import { addRepo } from "./controllers/add.js";
import { commitRepo } from "./controllers/commit.js";
import { pullRepo } from "./controllers/pull.js";
import { pushRepo } from "./controllers/push.js";
import { revertRepo } from "./controllers/revert.js";
import mainRouter from "./routes/mainRouter.js";

yargs(hideBin(process.argv))
  .command("start", "Start the server", {}, startServer)
  .command("init", "initialize a new kod repository", {}, initRepo)
  .command(
    "remote add <name> <url>",
    "Add a remote repository",
    (yargs) => {
      yargs
        .positional("name", {
          describe: "Remote name",
          type: "string",
        })
        .positional("url", {
          describe: "Repository URL",
          type: "string",
        });
    },
    (argv) => {
      addRemote(argv.name, argv.url);
    },
  )
  .command(
    "add <file>",
    "Add a file to the repository",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to add to the staging area",
        type: "string",
      });
    },
    (argv) => {
      addRepo(argv.file);
    },
  )
  .command(
    "commit <message>",
    "Commit the staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => {
      commitRepo(argv.message);
    },
  )
  .command("push", "Push commits to S3", {}, pushRepo)
  .command("pull", "Pull Commits form S3", {}, pullRepo)
  .command(
    "revert <commitID>",
    "Revert to a specific commit",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID to revert to",
        type: "string",
      });
    },
    (argv) => {
      revertRepo(argv.commitID);
    },
  )
  .demandCommand(1, "You need at least one command")
  .help().argv;

function startServer() {
  dotenv.config();
  const app = express();
  const PORT = process.env.PORT || 3000;
  const mongoURI = process.env.MONGO_URI;

  app.use(cors({ origin: "*" }));
  app.use(bodyParser.json());
  app.use(express.json());

  app.use("/", mainRouter);

  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  let user = "test";
  io.on("connection", (socket) => {
    socket.join(user);
    socket.emit("message", `Welcome ${user}`);

    socket.on("joinRoom", (userId) => {
      user = userId;
      console.log("===========");
      console.log(user);
      console.log("===========");

      socket.join(user);
    });
  });

  mongoose
    .connect(mongoURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("Unable to connect to MongoDB", err));

  const db = mongoose.connection;

  db.once("open", () => {
    console.log("CRUD operations called");
  });
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
