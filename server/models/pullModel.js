import mongoose, { Schema } from "mongoose";

const PullRequestSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    repository: {
      type: Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },

    branch: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["open", "merged", "closed"],
      default: "open",
    },
  },
  {
    timestamps: true,
  },
);

const PullRequest = mongoose.model("PullRequest", PullRequestSchema);

export default PullRequest;
