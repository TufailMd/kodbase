import mongoose from "mongoose";

import Repository from "../models/repoModel.js";
import User from "../models/userModel.js";
import Issue from "../models/issueModel.js";
import { s3, S3_BUCKET } from "../config/aws-config.js";

// GET all commits + files for a repo from S3
const getRepoContentsFromS3 = async (req, res) => {
  const { repoName } = req.params;

  try {
    const data = await s3
      .listObjectsV2({
        Bucket: S3_BUCKET,
        Prefix: `commits/`,
      })
      .promise();

    if (!data.Contents || data.Contents.length === 0) {
      return res.json({
        isEmpty: true,
        commits: {},
        latestCommit: null,
        files: [],
      });
    }

    const commitMap = {};

    data.Contents.forEach((obj) => {
      const key = obj.Key;

      const parts = key.split("/");

      if (parts.length < 3) return;

      const commitId = parts[1];

      const relativePath = parts.slice(2).join("/");

      if (!commitMap[commitId]) {
        commitMap[commitId] = [];
      }

      if (relativePath !== "commit.json") {
        commitMap[commitId].push(relativePath);
      }
    });

    const commitIds = Object.keys(commitMap);
    const latestCommitId = commitIds[commitIds.length - 1];
    const files = commitMap[latestCommitId];

    res.json({
      isEmpty: false,
      commits: commitMap,
      latestCommit: latestCommitId,
      files,
    });
  } catch (err) {
    console.error("Error fetching from S3:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getFileContentFromS3 = async (req, res) => {
  const { commitId, fileName } = req.params;

  try {
    const fileData = await s3
      .getObject({
        Bucket: S3_BUCKET,
        Key: `commits/${commitId}/${fileName}`,
      })
      .promise();

    const content = fileData.Body.toString("utf-8");

    res.json({ content, fileName });
  } catch (err) {
    console.error("Error fetching file:", err);
    res.status(500).json({ message: "File not found" });
  }
};

const createRepository = async (req, res) => {
  try {
    const { name, owner, description, content, visibility } = req.body;

    if (!name || !owner) {
      return res.status(400).json({
        message: "Repository name and owner are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({
        message: "Invalid owner id",
      });
    }

    const existingRepository = await Repository.findOne({ name });

    if (existingRepository) {
      return res.status(400).json({
        message: "Repository name already exists",
      });
    }

    const user = await User.findById(owner);

    if (!user) {
      return res.status(404).json({
        message: "Owner not found",
      });
    }

    const repository = await Repository.create({
      name,
      description,
      content,
      visibility,
      owner,
    });

    user.repositories.push(repository._id);
    await user.save();

    res.status(201).json({
      message: "Repository created successfully",
      repository: {
        _id: repository._id,
        name: repository.name,
      },
    });
  } catch (err) {
    console.error("Repository creation error:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllRepositories = async (req, res) => {
  try {
    const repositories = await Repository.find()
      .populate("owner", "username avatar")
      .populate("issues", "title status createdAt");

    res.json(repositories);
  } catch (err) {
    console.error("Error fetching repositories:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const fetchRepositoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid repository id",
      });
    }

    const repository = await Repository.findById(id)
      .populate("owner", "username avatar")
      .populate("issues", "title status createdAt");

    if (!repository) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    res.json(repository);
  } catch (err) {
    console.error("Error fetching repository:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const fetchRepositoryByName = async (req, res) => {
  try {
    const { name } = req.params;

    const repository = await Repository.findOne({ name })
      .populate("owner", "username avatar")
      .populate("issues");

    if (!repository) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    res.json(repository);
  } catch (err) {
    console.error("Error fetching repository:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const fetchRepositoriesForCurrentUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid user id",
      });
    }

    const repositories = await Repository.find({
      owner: userId,
    })
      .populate("owner", "username avatar")
      .populate("issues", "title status createdAt");

    res.json(repositories);
  } catch (err) {
    console.error("Error fetching user repositories:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateRepositoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { description, content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid repository id",
      });
    }

    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    if (description !== undefined) {
      repository.description = description;
    }

    if (content !== undefined) {
      if (Array.isArray(content)) {
        repository.content.push(...content);
      } else {
        repository.content.push(content);
      }
    }

    await repository.save();

    res.json({
      message: "Repository updated successfully",
      repository,
    });
  } catch (err) {
    console.error("Error updating repository:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteRepositoryById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid repository id",
      });
    }

    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    await User.findByIdAndUpdate(repository.owner, {
      $pull: {
        repositories: repository._id,
      },
    });

    await Issue.deleteMany({
      repository: repository._id,
    });

    await repository.deleteOne();

    res.json({
      message: "Repository deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting repository:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const toggleVisibilityById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid repository id",
      });
    }

    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    repository.visibility = !repository.visibility;

    await repository.save();

    res.json({
      message: "Repository visibility updated successfully",
      repository,
    });
  } catch (err) {
    console.error("Error toggling visibility:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export default {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  deleteRepositoryById,
  toggleVisibilityById,
  getRepoContentsFromS3,
  getFileContentFromS3,
};
