import uploadOnCloudinary from "../config/cloudinay.js";
import Loop from "../models/loop.model.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";

export const uploadLoop = async (req, res) => {
  try {
    const { caption } = req.body;

    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "Loop is required" });
    }
    const loop = await Loop.create({
      caption,
      media,
      author: req.userId,
    });

    const user = await User.findById(req.userId);
    user.loops.push(loop._id);
    await user.save();
    const populatedLoop = await Loop.findById(loop._id).populate(
      "author",
      "name userName profileImage",
    );
    return res.status(200).json(populatedLoop);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `upload Loop error ${error}` });
  }
};

export const like = async (req, res) => {
  try {
    const loopId = req.params.loopId;
    const loop = await Loop.findById(loopId).populate("author");
    if (!loop) {
      return res.status(400).json({ message: "loop not found" });
    }
    if (!req.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userIdString = req.userId.toString();
    const alreadyLiked = loop.likes.some(
      (id) => id && id.toString() === userIdString,
    );

    if (alreadyLiked) {
      loop.likes = loop.likes.filter(
        (id) => id && id.toString() !== userIdString,
      );
    } else {
      loop.likes.push(req.userId);
      if (
        loop.author[0]._id &&
        loop.author[0]._id.toString() !== userIdString
      ) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: loop.author[0]._id,
          type: "like",
          loop: loop._id,
          message: "Liked your Loop",
        });
        const populatedNotification = await Notification.findById(
          notification._id,
        ).populate("sender receiver loop");

        const authorId = loop.author[0]._id.toString();
        const receiverSocketId = getSocketId(authorId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "newNotification",
            populatedNotification,
          );
        }
      }
    }

    await loop.save();

    await loop.populate("author", "name userName profileImage");

    io.emit("likeLoop", {
      loopId: loop._id,
      likes: loop.likes,
    });

    return res.status(200).json(loop);
  } catch (error) {
    console.log(error);

    return res.status(500).json({ message: `like loop error ${error}` });
  }
};

export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const loopId = req.params.loopId;
    const loop = await Loop.findById(loopId);

    if (!loop) {
      return res.status(400).json({ message: "loop not found" });
    }
    if (!req.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    loop.comments.push({
      author: req.userId,
      message,
    });

    // notification ===================================================
    const userIdString = req.userId.toString();
    if (loop.author[0]._id && loop.author[0]._id.toString() !== userIdString) {
      const notification = await Notification.create({
        sender: req.userId,
        receiver: loop.author[0]._id,
        type: "comment",
        loop: loop._id,
        message: "Commented your Loop",
      });
      const populatedNotification = await Notification.findById(
        notification._id,
      ).populate("sender receiver loop");

      const authorId = loop.author[0]._id.toString();
      const receiverSocketId = getSocketId(authorId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }
    }

    await loop.save();

    await loop.populate("author", "name userName profileImage");
    await loop.populate("comments.author", "name userName profileImage");

    io.emit("commentLoop", {
      loopId: loop._id,
      comments: loop.comments,
    });

    return res.status(200).json(loop);
  } catch (error) {
    return res.status(500).json({ message: `comments  loop error ${error}` });
  }
};

export const getAllLoop = async (req, res) => {
  try {
    const loops = await Loop.find({})
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage");
    return res.status(200).json(loops);
  } catch (error) {
    return res.status(500).json({ message: `getAll loops Error ${error}` });
  }
};
