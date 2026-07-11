import mongoose from "mongoose";

import Repository from "../models/repoModel.js";
import User from "../models/userModel.js";
import Issue from "../models/issueModel.js";
import { s3, S3_BUCKET } from "../config/aws-config.js";

// GET all commits + files for a repo from S3
const getRepoContentsFromS3 = async (req, res) => {
  const { repoName } = req.params;

  try {
    // Find repository
    const repository = await Repository.findOne({ name: repoName });

    if (!repository) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    const repositoryId = repository._id.toString();

    // List only this repository's files
    const data = await s3
      .listObjectsV2({
        Bucket: S3_BUCKET,
        Prefix: `${repositoryId}/commits/`,
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

    for (const obj of data.Contents) {
      const key = obj.Key;

      // Skip folder placeholders
      if (key.endsWith("/")) continue;

      const parts = key.split("/");

      // Structure:
      // repositoryId/commits/commitId/path/to/file

      if (parts.length < 4) continue;

      const commitId = parts[2];

      const relativePath = parts.slice(3).join("/");

      if (!commitMap[commitId]) {
        commitMap[commitId] = [];
      }

      // Skip commit metadata
      if (relativePath !== "commit.json") {
        commitMap[commitId].push(relativePath);
      }
    }

    const latestCommitId = data.Contents.filter(
      (obj) =>
        obj.Key.endsWith("commit.json") &&
        obj.Key.startsWith(`${repositoryId}/commits/`),
    )
      .sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified))[0]
      ?.Key.split("/")[2];

    const files = commitMap[latestCommitId] || [];

    const commitData = await s3
      .getObject({
        Bucket: S3_BUCKET,
        Key: `${repositoryId}/commits/${latestCommitId}/commit.json`,
      })
      .promise();

    const commitInfo = JSON.parse(commitData.Body.toString());

    res.json({
      isEmpty: false,
      commits: commitMap,
      latestCommit: latestCommitId,
      commitMessage: commitInfo.message,
      commitDate: commitInfo.date,
      totalCommits: Object.keys(commitMap).length,
      files,
    });
  } catch (err) {
    console.error("Error fetching from S3:", err);

    res.status(500).json({
      message: "Server error",
    });
  }
};

const getFileContentFromS3 = async (req, res) => {
  let { repoName, commitId, filePath } = req.params;

  try {
    const repository = await Repository.findOne({ name: repoName });

    if (!repository) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    // Express 5 wildcard support
    if (Array.isArray(filePath)) {
      filePath = filePath.join("/");
    }

    const repositoryId = repository._id.toString();

    const key = `${repositoryId}/commits/${commitId}/${filePath}`;

    console.log("S3 Key:", key);

    const fileData = await s3
      .getObject({
        Bucket: S3_BUCKET,
        Key: key,
      })
      .promise();

    res.json({
      fileName: filePath,
      content: fileData.Body.toString("utf8"),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Unable to fetch file",
      error: err.message,
    });
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

const updateRepository = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

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

    // Update repository name
    if (name !== undefined) {
      const trimmedName = name.trim();

      if (!trimmedName) {
        return res.status(400).json({
          message: "Repository name cannot be empty",
        });
      }

      const existingRepository = await Repository.findOne({
        name: trimmedName,
        _id: { $ne: repository._id },
      });

      if (existingRepository) {
        return res.status(400).json({
          message: "Repository name already exists",
        });
      }

      repository.name = trimmedName;
    }

    // Update description
    if (description !== undefined) {
      repository.description = description.trim();
    }

    await repository.save();

    res.status(200).json({
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
  updateRepository,
  deleteRepositoryById,
  toggleVisibilityById,
  getRepoContentsFromS3,
  getFileContentFromS3,
};
