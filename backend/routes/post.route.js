import express from "express";
import isAuth from "../middlewares/isAuth.js";

import { upload } from "../middlewares/multer.js";
import {
  comment,
  getAllPost,
  like,
  savedPost,
  uploadPost,
} from "../controllers/post.controller.js";

const postRouter = express.Router();

postRouter.post("/upload", isAuth, upload.single("media"), uploadPost);
postRouter.get("/getAll", isAuth, getAllPost);
postRouter.get("/like/:postId", isAuth, like);
postRouter.post("/comment/:postId", isAuth, comment);
postRouter.get("/saved/:postId", isAuth, savedPost);

export default postRouter;
