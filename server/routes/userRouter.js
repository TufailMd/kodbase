import express from "express";
import userController from "../controllers/userController.js";
import upload from "../middlewares/upload.js";

const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.post("/logIn", userController.logIn);
userRouter.post("/signUp", userController.signUp);
userRouter.put(
  "/updateUserProfileDetails/:id",
  upload.single("avatar"),
  userController.updateUserProfileDetails,
);
userRouter.delete("/deleteUserProfile/:id", userController.deleteUserProfile);

export default userRouter;
