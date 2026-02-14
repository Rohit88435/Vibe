import express from "express";
import isAuth from "../middlewares/isAuth.js";

import { upload } from "../middlewares/multer.js";
import {
  getAllStories,
  getStoryByUsername,
  storyUpload,
  viewStory,
} from "../controllers/story.controller.js";

const storyRouter = express.Router();

storyRouter.post("/upload", isAuth, upload.single("media"), storyUpload);
storyRouter.get("/getbyusername/:userName", isAuth, getStoryByUsername);
storyRouter.get("/view/:storyId", isAuth, viewStory);
storyRouter.get("/getallstories", isAuth, getAllStories);

export default storyRouter;
