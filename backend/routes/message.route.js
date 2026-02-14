import express from "express";
import isAuth from "../middlewares/isAuth.js";

import { upload } from "../middlewares/multer.js";
import {
  getAllMessages,
  getPreviousUserChat,
  sendMessage,
} from "../controllers/message.controller.js";

const messageRouter = express.Router();

messageRouter.post(
  "/send/:receiverId",
  isAuth,
  upload.single("media"),
  sendMessage,
);
messageRouter.get("/getall/:receiverId", isAuth, getAllMessages);
messageRouter.get("/previouschat", isAuth, getPreviousUserChat);

export default messageRouter;
