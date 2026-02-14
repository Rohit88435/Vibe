import uploadOnCloudinary from "../config/cloudinay.js";
import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { getSocketId, io } from "../socket.js";

export const uploadPost = async (req, res) => {
  try {
    const { caption, mediaType } = req.body;

    let media;
    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "Post is required" });
    }
    const post = await Post.create({
      caption,
      media,
      mediaType,
      author: req.userId,
    });

    const user = await User.findById(req.userId);
    user.posts.push(post._id);
    await user.save();
    const populatedPost = await Post.findById(post._id).populate(
      "author",
      "name userName profileImage",
    );
    return res.status(200).json(populatedPost);
  } catch (error) {
    console.log(error);
    return res.status(200).json({ message: `upload Post error ${error}` });
  }
};

export const getAllPost = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", "name userName profileImage")
      .populate("comments.author", "name userName profileImage")
      .sort({ createdAt: -1 });
    return res.status(200).json(posts);
  } catch (error) {
    return res.status(500).json({ message: `getAll Post Error ${error}` });
  }
};

export const like = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId).populate("author");
    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }
    if (!req.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    // use toString() for reliable ObjectId comparison
    const userIdString = req.userId.toString();
    const alreadyLiked = post.likes.some(
      (id) => id && id.toString() === userIdString,
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => id && id.toString() !== userIdString,
      );
    } else {
      post.likes.push(req.userId);
      if (post.author._id && post.author._id.toString() !== userIdString) {
        const notification = await Notification.create({
          sender: req.userId,
          receiver: post.author._id,
          type: "like",
          post: post._id,
          message: "Liked your post",
        });
        const populatedNotification = await Notification.findById(
          notification._id,
        ).populate("sender receiver post");

        const receiverSocketId = getSocketId(post.author._id.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit(
            "newNotification",
            populatedNotification,
          );
        }
      }
    }

    await post.save();

    await post.populate("author", "name userName profileImage");
    io.emit("likePost", {
      postId: post._id,
      likes: post.likes,
    });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: `like error ${error}` });
  }
};

export const comment = async (req, res) => {
  try {
    const { message } = req.body;
    const postId = req.params.postId;
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(400).json({ message: "post not found" });
    }
    if (!req.userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    post.comments.push({
      author: req.userId,
      message,
    });

    // notification ===================================================
    const userIdString = req.userId.toString();
    if (post.author._id && post.author._id.toString() !== userIdString) {
      const notification = await Notification.create({
        sender: req.userId,
        receiver: post.author._id,
        type: "comment",
        post: post._id,
        message: "Commented your post",
      });
      const populatedNotification = await Notification.findById(
        notification._id,
      ).populate("sender receiver post");

      const receiverSocketId = getSocketId(post.author._id.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newNotification", populatedNotification);
      }
    }

    await post.save();

    await post.populate("author", "name userName profileImage");
    await post.populate("comments.author", "name userName profileImage");
    io.emit("commentPost", {
      postId: post._id,
      comments: post.comments,
    });

    return res.status(200).json(post);
  } catch (error) {
    return res.status(500).json({ message: `comments error ${error}` });
  }
};

export const savedPost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ message: "user not found" });
    }
    const alreadySaved = user.saved.some(
      (id) => id.toString() == postId.toString(),
    );

    if (alreadySaved) {
      user.saved = user.saved.filter(
        (id) => id.toString() != postId.toString(),
      );
    } else {
      user.saved.push(postId);
    }

    await user.save();

    user.populate("saved");

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: `like error ${error}` });
  }
};
