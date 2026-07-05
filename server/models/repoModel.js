import mongoose, { Schema } from "mongoose";

const RepositorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
      maxlength: 500,
    },

    visibility: {
      type: Boolean,
      default: true, // true = public, false = private
    },

    content: [
      {
        type: String,
      },
    ],

    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    issues: [
      {
        type: Schema.Types.ObjectId,
        ref: "Issue",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const Repository = mongoose.model("Repository", RepositorySchema);

export default Repository;
