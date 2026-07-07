import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "../models/userModel.js";
import Repository from "../models/repoModel.js";
import Issue from "../models/issueModel.js";
import PullRequest from "../models/pullModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/kodbase";

const clear = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const userResult = await User.deleteMany({});
    const repoResult = await Repository.deleteMany({});
    const issueResult = await Issue.deleteMany({});
    const pullRequestResult = await PullRequest.deleteMany({});

    console.log(`Deleted ${userResult.deletedCount} users`);
    console.log(`Deleted ${repoResult.deletedCount} repositories`);
    console.log(`Deleted ${issueResult.deletedCount} issues`);
    console.log(`Deleted ${pullRequestResult.deletedCount} pull requests`);

    console.log("Database cleared.");
  } catch (err) {
    console.error("Error clearing database:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

clear();
