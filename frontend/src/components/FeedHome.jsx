import React from "react";
import logo from "../assets/logo2.png";
import { FaRegHeart } from "react-icons/fa6";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import Post from "./Post";
import { LuMessageSquareText } from "react-icons/lu";
import Storydp from "./Storydp";
import { useNavigate } from "react-router-dom";
function FeedHome() {
  const { postData } = useSelector((state) => state.post);
  const { userData, notificationData } = useSelector((state) => state.user);
  const { storyList, currentUserStory } = useSelector((state) => state.story);
  const navigate = useNavigate();

  return (
    <div className="lg:w-[50%] transition-all w-full bg-black min-h-screen lg:h-screen relative lg:overflow-y-auto ">
      <div className="w-full h-25 flex items-center justify-between p-5 lg:hidden">
        <img src={logo} alt="" className="w-20 " />
        <div className="flex gap-2.5 items-center">
          <div className="relative">
            <div
              onClick={() => {
                navigate("/notifications");
              }}
            >
              <FaRegHeart className="text-white w-6.25 h-6.25" />
              {notificationData?.length > 0 &&
                notificationData.some((noti) => noti.isRead === false) && (
                  <div className="w-2.5 h-2.5 bg-red-600 rounded-full absolute top-0 -right-1.25"></div>
                )}
            </div>
          </div>
          <LuMessageSquareText
            className="text-white w-6.25 h-6.25"
            onClick={() => {
              naviagte("/messages");
            }}
          />
        </div>
      </div>
      <div className="flex w-full overflow-auto gap-5 items-center p-5 px-7.5 ">
        <Storydp
          userName={"Your Story"}
          profileImage={userData?.profileImage}
          story={currentUserStory}
        />
        {storyList?.map((story) => (
          <Storydp
            userName={story?.author[0]?.userName}
            profileImage={story?.author[0]?.profileImage}
            story={story}
            key={story._id}
          />
        ))}
      </div>
      <div className="w-full min-h-screen flex flex-col items-center gap-5 p-2.5 pt-10 bg-white rounded-t-[60px] relative pb-30">
        <Nav />
        {postData?.map((post, index) => (
          <Post post={post} key={index} />
        ))}
      </div>
    </div>
  );
}

export default FeedHome;
