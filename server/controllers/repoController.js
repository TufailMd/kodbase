import mongoose from "mongoose";

import Repository from "../models/repoModel.js";
import User from "../models/userModel.js";
import Issue from "../models/issueModel.js";

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
      repositoryId: repository._id,
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
};
