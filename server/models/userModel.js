import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/9919?s=200&v=4",
    },

    bio: {
      type: String,
      maxlength: 200,
    },

    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    following: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    repositories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Repository",
      },
    ],

    starredRepositories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Repository",
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", UserSchema);

export default User;
