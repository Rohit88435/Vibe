import { log } from "console";
import uploadOnCloudinary from "../config/cloudinay.js";
import mongoose from "mongoose";
import Story from "../models/story.model.js";
import User from "../models/user.model.js";

export const storyUpload = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.story) {
      await Story.findByIdAndDelete(user.story);
      user.story = null;
    }

    const { mediaType } = req.body;
    let media;

    if (req.file) {
      media = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "media is required" });
    }

    const story = await Story.create({
      author: req.userId,
      mediaType,
      media,
    });

    user.story = story._id;

    await user.save();

    const populateStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");

    return res.status(200).json(populateStory);
  } catch (error) {
    return res.status(500).json({ message: `Story Upload Error ${error} ` });
  }
};

export const viewStory = async (req, res) => {
  try {
    const storyId = req.params.storyId;

    // Validate storyId to avoid CastError and return a clear 400
    if (!storyId || !mongoose.Types.ObjectId.isValid(storyId)) {
      return res.status(400).json({ message: "Invalid story id" });
    }

    const story = await Story.findById(storyId);

    if (!story) {
      return res.status(400).json({ message: "Story not found" });
    }

    const viewersIds = story.viewers.map((id) => id.toString());
    if (!viewersIds.includes(req.userId.toString())) {
      story.viewers.push(req.userId);
      await story.save();
    }

    const populateStory = await Story.findById(story._id)
      .populate("author", "name userName profileImage")
      .populate("viewers", "name userName profileImage");

    return res.status(200).json(populateStory);
  } catch (error) {
    return res.status(500).json({ message: `Viewers Error ${error} ` });
  }
};

export const getStoryByUsername = async (req, res) => {
  try {
    const userName = req.params.userName;

    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: `user not found` });
    }

    const story = await Story.find({
      author: user._id,
    }).populate("viewers author");

    return res.status(200).json(story);
  } catch (error) {
    return res
      .status(500)
      .json({ message: `getStoryByUsername Error ${error} ` });
  }
};

export const getAllStories = async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);

    const followingIds = currentUser.following;

    const stories = await Story.find({
      author: { $in: followingIds },
    })
      .populate("viewers author")
      .sort({ createdAt: -1 });

    return res.status(200).json(stories);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "getAll stories error" });
  }
};
