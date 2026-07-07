import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import User from "../models/userModel.js";
import Repository from "../models/repoModel.js";
import Issue from "../models/issueModel.js";
import PullRequest from "../models/pullModel.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/kodbase";

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const hashedPassword = await bcrypt.hash("Password123!", 10);

    // ---- Users ----
    const users = await User.insertMany([
      {
        username: "alice_dev",
        name: "Alice Sharma",
        email: "alice@example.com",
        password: hashedPassword,
        bio: "Full-stack developer",
      },
      {
        username: "bob_codes",
        name: "Bob Verma",
        email: "bob@example.com",
        password: hashedPassword,
        bio: "Backend engineer",
      },
      {
        username: "carol_ml",
        name: "Carol Mehta",
        email: "carol@example.com",
        password: hashedPassword,
        bio: "ML enthusiast",
      },
    ]);

    console.log(`Inserted ${users.length} users`);

    const [alice, bob, carol] = users;

    // Make alice follow bob, bob follow carol
    alice.following.push(bob._id);
    bob.followers.push(alice._id);
    bob.following.push(carol._id);
    carol.followers.push(bob._id);
    await Promise.all([alice.save(), bob.save(), carol.save()]);

    // ---- Repositories ----
    const repos = await Repository.insertMany([
      {
        name: "alice-portfolio",
        description: "My personal portfolio site",
        owner: alice._id,
        content: ["index.html", "style.css"],
        visibility: true,
      },
      {
        name: "bob-api-server",
        description: "REST API boilerplate",
        owner: bob._id,
        content: ["server.js", "routes.js"],
        visibility: true,
      },
      {
        name: "carol-ml-toolkit",
        description: "ML preprocessing utilities",
        owner: carol._id,
        content: ["preprocess.py"],
        visibility: false,
      },
    ]);

    console.log(`Inserted ${repos.length} repositories`);

    const [aliceRepo, bobRepo, carolRepo] = repos;

    await User.findByIdAndUpdate(alice._id, {
      $push: { repositories: aliceRepo._id },
    });
    await User.findByIdAndUpdate(bob._id, {
      $push: { repositories: bobRepo._id },
    });
    await User.findByIdAndUpdate(carol._id, {
      $push: { repositories: carolRepo._id },
    });

    // ---- Issues ----
    const issues = await Issue.insertMany([
      {
        title: "Fix broken navbar on mobile",
        description: "Navbar overlaps content on small screens",
        repository: aliceRepo._id,
        createdBy: bob._id,
        status: "open",
      },
      {
        title: "Add rate limiting",
        description: "API needs rate limiting middleware",
        repository: bobRepo._id,
        createdBy: alice._id,
        status: "open",
      },
      {
        title: "Update dependency versions",
        description: "Some packages are outdated",
        repository: carolRepo._id,
        createdBy: bob._id,
        status: "closed",
        assignedTo: carol._id,
      },
    ]);

    console.log(`Inserted ${issues.length} issues`);

    await Repository.findByIdAndUpdate(aliceRepo._id, {
      $push: { issues: issues[0]._id },
    });
    await Repository.findByIdAndUpdate(bobRepo._id, {
      $push: { issues: issues[1]._id },
    });
    await Repository.findByIdAndUpdate(carolRepo._id, {
      $push: { issues: issues[2]._id },
    });

    // ---- Pull Requests ----
    const pullRequests = await PullRequest.insertMany([
      {
        title: "Fix navbar responsiveness",
        description: "Resolves navbar overlap issue on mobile",
        repository: aliceRepo._id,
        branch: "fix/navbar-mobile",
        status: "open",
      },
      {
        title: "Add express-rate-limit middleware",
        description: "Adds basic rate limiting to all routes",
        repository: bobRepo._id,
        branch: "feature/rate-limit",
        status: "open",
      },
      {
        title: "Bump dependencies to latest",
        description: "Updates package.json versions",
        repository: carolRepo._id,
        branch: "chore/update-deps",
        status: "merged",
      },
    ]);

    console.log(`Inserted ${pullRequests.length} pull requests`);

    console.log("Seeding complete.");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

seed();