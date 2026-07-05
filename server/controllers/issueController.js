import mongoose from "mongoose";

import Repository from "../models/repoModel.js";
import Issue from "../models/issueModel.js";

const createIssue = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, createdBy } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid repository id",
      });
    }

    if (!createdBy || !mongoose.Types.ObjectId.isValid(createdBy)) {
      return res.status(400).json({
        message: "Valid creator id is required",
      });
    }

    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        message: "Repository not found",
      });
    }

    const issue = await Issue.create({
      title,
      description,
      repository: id,
      createdBy,
    });

    await Repository.findByIdAndUpdate(id, {
      $push: { issues: issue._id },
    });

    res.status(201).json(issue);
  } catch (err) {
    console.error("Error creating issue:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getAllIssues = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid repository id",
      });
    }

    const issues = await Issue.find({ repository: id })
      .populate("createdBy", "username avatar")
      .populate("assignedTo", "username avatar");

    res.json(issues);
  } catch (err) {
    console.error("Error fetching issues:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const getIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid issue id",
      });
    }

    const issue = await Issue.findById(id)
      .populate("createdBy", "username avatar")
      .populate("assignedTo", "username avatar")
      .populate("repository", "name");

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    res.json(issue);
  } catch (err) {
    console.error("Error fetching issue:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const updateIssueById = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, assignedTo } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid issue id",
      });
    }

    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    if (title !== undefined) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (status !== undefined) issue.status = status;
    if (assignedTo !== undefined) issue.assignedTo = assignedTo;

    await issue.save();

    res.json({
      message: "Issue updated successfully",
      issue,
    });
  } catch (err) {
    console.error("Error updating issue:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

const deleteIssueById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid issue id",
      });
    }

    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({
        message: "Issue not found",
      });
    }

    res.json({
      message: "Issue deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting issue:", err);
    res.status(500).json({
      message: "Server error",
    });
  }
};

export default {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueById,
  deleteIssueById,
};
