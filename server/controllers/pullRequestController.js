import mongoose from "mongoose";

import PullRequest from "../models/pullModel.js";
import Repository from "../models/repoModel.js";

const createPullRequest = async (req, res) => {
  try {
    const { repositoryId } = req.params;
    const { title, description, branch } = req.body;

    if (!mongoose.Types.ObjectId.isValid(repositoryId)) {
      return res.status(400).json({
        message: "Invalid repository id",
      });
    }

    const repository = await Repository.findById(repositoryId);

    if (!repository) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    const pullRequest = await PullRequest.create({
      title,
      description,
      repository: repositoryId,
      branch,
    });

    res.status(201).json({
      message: "Pull request created successfully",
      pullRequest,
    });
  } catch (err) {
    console.error("Error creating pull request:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllPullRequests = async (req, res) => {
  try {
    const { repositoryId } = req.params;

    const pullRequests = await PullRequest.find({
      repository: repositoryId,
    }).populate("repository", "name");

    res.json(pullRequests);
  } catch (err) {
    console.error("Error fetching pull requests:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getPullRequestById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid pull request id",
      });
    }

    const pullRequest = await PullRequest.findById(id).populate(
      "repository",
      "name",
    );

    if (!pullRequest) {
      return res.status(404).json({
        message: "Pull request not found",
      });
    }

    res.json(pullRequest);
  } catch (err) {
    console.error("Error fetching pull request:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const updatePullRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, branch, status } = req.body;

    const pullRequest = await PullRequest.findById(id);

    if (!pullRequest) {
      return res.status(404).json({
        message: "Pull request not found",
      });
    }

    if (title !== undefined) pullRequest.title = title;
    if (description !== undefined) pullRequest.description = description;
    if (branch !== undefined) pullRequest.branch = branch;
    if (status !== undefined) pullRequest.status = status;

    await pullRequest.save();

    res.json({
      message: "Pull request updated successfully",
      pullRequest,
    });
  } catch (err) {
    console.error("Error updating pull request:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const deletePullRequest = async (req, res) => {
  try {
    const { id } = req.params;

    const pullRequest = await PullRequest.findByIdAndDelete(id);

    if (!pullRequest) {
      return res.status(404).json({
        message: "Pull request not found",
      });
    }

    res.json({
      message: "Pull request deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting pull request:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export default {
  createPullRequest,
  getAllPullRequests,
  getPullRequestById,
  updatePullRequest,
  deletePullRequest,
};
