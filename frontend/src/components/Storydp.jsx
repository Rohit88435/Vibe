import React, { useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import { LuCircleFadingPlus } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";

function Storydp({ profileImage, userName, story }) {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { storyData, storyList } = useSelector((state) => state.story);
  const [viewed, setViewed] = useState(false);

  const hasStory = Array.isArray(story)
    ? story.length > 0
    : !!story && Object.keys(story).length > 0;

  // const handleViewers = async () => {
  //   try {
  //     const result = await axios.get(
  //       `${serverUrl}/api/story/view/${story._id}`,
  //       { withCredentials: true },
  //     );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const handleClick = () => {
    if (userName === "Your Story") {
      if (hasStory) {
        navigate(`/story/${userData?.userName}`);
      } else {
        navigate("/upload");
      }
    } else {
      if (hasStory) {
        navigate(`/story/${userName}`);
      } else {
        // No story available for this user. Optionally navigate to their profile or do nothing.
        // Example: navigate(`/profile/${userName}`);
      }
    }
  };

  useEffect(() => {
    // normalize viewers array whether `story` is an array (search results) or a single object
    const viewers = Array.isArray(story) ? story[0]?.viewers : story?.viewers;
    const hasViewed =
      !!viewers &&
      viewers.some(
        (viewer) => viewer?._id?.toString() === userData?._id?.toString(),
      );
    setViewed(!!hasViewed);
  }, [story, userData, storyData, storyList]);

  // ringClass chooses the gradient based on whether there's a story and if it was viewed
  const ringClass = !hasStory
    ? ""
    : viewed
      ? "bg-linear-to-r from-gray-400 to-black-950"
      : "bg-linear-to-b from-blue-400 to-blue-950";

  return (
    <div
      className="flex flex-col w-20 "
      onClick={() => {
        handleClick();
      }}
    >
      <div
        className={`w-20 h-20 ${ringClass} rounded-full flex justify-center items-center relative`}
      >
        <div className="w-17.5 h-17.5 border-2 border-black rounded-full cursor-pointer overflow-hidden">
          <img
            src={profileImage || dp}
            alt=""
            className="w-full object-cover"
          />
        </div>
        {!hasStory && userName === "Your Story" && (
          <div className="absolute bottom-1 right-1 bg-blue-500 rounded-full p-1 flex items-center justify-center cursor-pointer hover:bg-blue-600 z-10">
            <LuCircleFadingPlus className="text-white w-5 h-5" />
          </div>
        )}
      </div>
      <div className="text-[14px] text-center truncate text-white w-full">
        {userName}
      </div>
    </div>
  );
}

export default Storydp;
