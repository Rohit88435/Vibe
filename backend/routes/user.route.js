import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
  editProfile,
  follow,
  followingList,
  getAllNotification,
  getCurrentUser,
  getProfile,
  markAsRead,
  search,
  suggestedUser,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.js";

const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.get("/getprofile/:userName", isAuth, getProfile);
userRouter.get("/follow/:targetUserId", isAuth, follow);
userRouter.get("/suggested", isAuth, suggestedUser);
userRouter.post("/markasread", isAuth, markAsRead);
userRouter.get("/getallnotification", isAuth, getAllNotification);
userRouter.get("/followinglist", isAuth, followingList);
userRouter.get("/search", isAuth, search);
userRouter.post(
  "/editprofile",
  isAuth,
  upload.single("profileImage"),
  editProfile,
);

export default userRouter;
