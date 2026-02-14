import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import loopRouter from "./routes/loop.route.js";
import storyRouter from "./routes/story.route.js";
import messageRouter from "./routes/message.route.js";
import { app, server } from "./socket.js";
dotenv.config();

// middlewares
app.use(
  cors({
    origin: "https://vibe-rqrb.onrender.com",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

//apis =========================
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/loop", loopRouter);
app.use("/api/story", storyRouter);
app.use("/api/message", messageRouter);

// port ====================
const port = process.env.PORT || 5000;

// Server listen ====================
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
  connectDb();
});
