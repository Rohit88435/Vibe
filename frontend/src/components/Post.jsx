import React, { useEffect } from "react";
import dp from "../assets/dp.webp";
import { GoBookmarkFill, GoHeart, GoHeartFill } from "react-icons/go";
import VideoPlayer from "./VideoPlayer";
import { useDispatch, useSelector } from "react-redux";
import { MdOutlineBookmarkBorder, MdOutlineComment } from "react-icons/md";
import { useState } from "react";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import { serverUrl } from "../App";
import { setPostData } from "../redux/postSlice";
import { setUserData } from "../redux/UserSlice";
import Follow from "./FollowButton";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";

function Post({ post }) {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const { socket } = useSelector((state) => state.socket);
  const [showComment, setShowComment] = useState(false);
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  if (!post) return null;

  const author = Array.isArray(post.author)
    ? post.author[0] || {}
    : post.author || {};

  const handleLike = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/like/${post._id}`, {
        withCredentials: true,
      });
      const updatedPost = result.data;

      const updatedPosts = postData.map((p) =>
        p._id == post._id ? updatedPost : p,
      );
      dispatch(setPostData(updatedPosts));
    } catch (error) {
      console.error("Like error:", error.response?.data || error.message);
    }
  };
  const handleComment = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/post/comment/${post._id}`,
        { message },
        {
          withCredentials: true,
        },
      );
      const updatedPost = result.data;

      const updatedPosts = postData.map((p) =>
        p._id == post._id ? updatedPost : p,
      );
      dispatch(setPostData(updatedPosts));
      setMessage("");
    } catch (error) {
      console.error("Comment error:", error.response?.data || error.message);
      setMessage("");
    }
  };
  const handleSaved = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/post/saved/${post._id}`,
        {
          withCredentials: true,
        },
      );

      // Merge server response into existing userData to preserve fields
      // (server may return a partial user object)
      const merged = { ...(userData || {}), ...result.data };
      dispatch(setUserData(merged));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!socket) return;

    socket?.on("likePost", (updatedData) => {
      const updatedPosts = postData.map((p) =>
        p._id === updatedData.postId ? { ...p, likes: updatedData.likes } : p,
      );
      dispatch(setPostData(updatedPosts));
    });

    socket?.on("commentPost", (updatedData) => {
      const updatedPosts = postData.map((p) =>
        p._id === updatedData.postId
          ? { ...p, comments: updatedData.comments }
          : p,
      );
      dispatch(setPostData(updatedPosts));
    });

    return () => {
      socket?.off("likePost");
      socket?.off("commentPost");
    };
  }, [postData, dispatch]);

  return (
    <div className="w-[90%] min-h-112.5 flex flex-col gap-2.5 bg-white items-center shadow-2xl shadow-[#00000058] rounded-2xl pb-5">
      <div className="w-full h-20 flex justify-between items-center px-2.5 ">
        <div
          className="flex justify-center items-center gap-2.5 md:gap-5"
          onClick={() => {
            navigate(`/profile/${author.userName}`);
          }}
        >
          <div className="w-10 h-10 md:w-15 md:h-15 border-2 border-black rounded-full cursor-pointer overflow-hidden">
            <img
              src={(author && author.profileImage) || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div className=" truncate w-25 font-semibold">{author?.userName}</div>
        </div>
        {userData._id !== author._id && (
          <FollowButton
            tailwind={`px-2.5 w-20 md:w-22 py-1.25 h-8 md:h-10 text-white bg-black rounded-2xl text-[14px] md:text-[16px] cursor-pointer`}
            targetUserId={author._id}
          />
        )}
      </div>
      <div className="w-[90%]  flex flex-col items-center justify-center ">
        {post.mediaType == "image" && ( // image ===========================================
          <div className="w-[90%] flex items-center justify-center ">
            <img
              src={post?.media}
              alt=""
              className="object-cover h-full rounded-2xl max-w-full"
            />
          </div>
        )}
        {post.mediaType == "video" && ( // video ==================================
          <div className="w-[80%]   flex flex-col items-center justify-center ">
            <VideoPlayer media={post?.media} />
          </div>
        )}
      </div>
      <div className="w-full h-15 flex justify-between items-center px-5 mt-2.5">
        <div className="flex justify-center items-center gap-2.5">
          <div
            className="flex justify-center items-center gap-1.25"
            onClick={handleLike}
          >
            {!post.likes?.includes(userData._id) && (
              <GoHeart className="w-6.25 cursor-pointer h-6.25" />
            )}
            {post.likes?.includes(userData._id) && (
              <GoHeartFill className="w-6.25 cursor-pointer h-6.25 text-red-600" />
            )}
            <span className="text-[18px]">{post.likes?.length || 0}</span>
          </div>
          <div
            className="flex justify-center items-center gap-1.25"
            onClick={() => {
              setShowComment((prev) => !prev);
            }}
          >
            <MdOutlineComment className="w-6.25 cursor-pointer h-6.25" />
            <span className="text-[18px]">{post.comments?.length || 0}</span>
          </div>
        </div>
        <div onClick={handleSaved}>
          {!userData.saved.includes(post?._id) && (
            <MdOutlineBookmarkBorder className="w-6.25 cursor-pointer h-6.25" />
          )}
          {userData.saved.includes(post?._id) && (
            <GoBookmarkFill className="w-6.25 cursor-pointer h-6.25" />
          )}
        </div>
      </div>
      {post.caption && (
        <div className="w-full px-5 gap-2.5 flex justify-start items-center">
          <h1>{author?.userName}</h1>
          <div className="truncate">{post.caption}</div>
        </div>
      )}

      {showComment && (
        <div className="w-full flex flex-col gap-7.5 pb-5 ">
          <div className="flex w-full h-20  items-center justify-between px-5 relative">
            <div className="w-10 h-10 md:w-15 md:h-15 border-2 border-black rounded-full cursor-pointer overflow-hidden">
              <img
                src={author?.profileImage || dp}
                alt=""
                className="w-full object-cover"
              />
            </div>
            <input
              type="text"
              className="px-2.5 pr-10 border-b-2 border-b-gray-500 w-[85%] outline-none h-10"
              placeholder="write comment.."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button
              className="absolute right-5 outline-none"
              onClick={handleComment}
            >
              <IoSend className="w-6.25 h-6.25 cursor-pointer" />
            </button>
          </div>
          <div className="w-full max-h-75 overflow-auto">
            {post.comments?.map((com, index) => (
              <div
                key={index}
                className="w-full px-5 py-3 flex items-center gap-5 border-b-2 border-b-gray-200"
              >
                <div className="w-10 h-10 md:w-15 md:h-15 border-2 border-black rounded-full cursor-pointer overflow-hidden">
                  <img
                    src={com.author?.profileImage || dp}
                    alt=""
                    className="w-full object-cover"
                  />
                </div>
                <div>{com.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
