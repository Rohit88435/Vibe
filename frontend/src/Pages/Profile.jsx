import axios from "axios";
import React, { useState } from "react";
import dp from "../assets/dp.webp";
import { serverUrl } from "../App";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setProfileData, setUserData } from "../redux/UserSlice";
import { useEffect } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import Nav from "../components/Nav";
import FollowButton from "../components/FollowButton";
import Post from "../components/Post";
import { setSelectedUser } from "../redux/messageSlice";

function Profile() {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const { profileData, userData } = useSelector((state) => state.user);
  const { postData } = useSelector((state) => state.post);
  const navigate = useNavigate();

  const [postType, setPostType] = useState("Post");

  const getAuthorId = (post) =>
    Array.isArray(post.author) ? post.author[0]?._id : post.author?._id;

  // function for get profile ============================
  const handleProfile = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/getprofile/${userName}`,
        {
          withCredentials: true,
        },
      );
      dispatch(setProfileData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  // logout function =====================
  const handleLogout = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/auth/signout`, {
        withCredentials: true,
      });
      dispatch(setUserData(null));
    } catch (error) {
      console.log(error);
    }
  };

  //  useEffect ===========================
  useEffect(() => {
    handleProfile();
  }, [userName, dispatch]);
  //=======================================
  return (
    <div className="w-full min-h-screen bg-black">
      <div className=" w-full h-20 flex justify-between items-center px-7.25">
        <div
          onClick={() => {
            navigate("/");
          }}
        >
          <MdKeyboardBackspace className="text-white w-6.25 h-6.25 cursor-pointer" />
        </div>
        <div className="text-white font-semibold text-[20px]">
          {profileData?.userName}
        </div>
        <div
          className="text-blue-500 font-semibold cursor-pointer text-[20px]"
          onClick={handleLogout}
        >
          Log Out
        </div>
      </div>
      <div className="w-full h-37.5 flex items-start gap-5 lg:g-12.5 pt-5 px-2.5 justify-center">
        <div className="w-20 h-20 md:w-35 md:h-35 border-2 border-black rounded-full cursor-pointer overflow-hidden">
          <img
            src={profileData?.profileImage || dp}
            alt=""
            className="w-full object-cover"
          />
        </div>
        <div className="">
          <div className="font-semibold text-[22px] text-white ">
            {profileData?.name}
          </div>
          <div className="text-[17px] text-[#ffffffe8]">
            {profileData?.profession || "New User"}
          </div>
          <div className="text-[17px] text-[#ffffffe8]">{profileData?.bio}</div>
        </div>
      </div>

      <div className="w-full h-25 flex items-center justify-center gap-10 md:gap-15 px-[20%] pt-7.5 text-white">
        <div className="justify-center items-center flex flex-col">
          <div className="text-white text-[22px] ms:text-[30px] font-semibold">
            {profileData?.posts.length}
          </div>
          <div className="text-[18px] ms:text-[22px] text-[#ffffffc7]">
            Posts
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-5">
            <div className="flex relative ">
              {profileData?.followers?.slice(0, 3).map((user, index) => (
                <div
                  key={user._id}
                  className="w-10 h-10 md:w-10 md:h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden"
                  style={
                    index > 0
                      ? { position: "absolute", left: `${index * 9}px` }
                      : {}
                  }
                >
                  <img
                    src={user?.profileImage || dp}
                    alt=""
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-white text-[22px] ms:text-[30px] font-semibold">
              {profileData?.followers.length}
            </div>
          </div>
          <div className="text-[18px] ms:text-[22px] text-[#ffffffc7]">
            Followers
          </div>
        </div>
        <div>
          <div className="flex items-center justify-center gap-5">
            <div className="flex relative ">
              {profileData?.following?.slice(0, 3).map((user, index) => (
                <div
                  key={user._id}
                  className="w-10 h-10 md:w-10 md:h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden"
                  style={
                    index > 0
                      ? { position: "absolute", left: `${index * 10}px` }
                      : {}
                  }
                >
                  <img
                    src={user?.profileImage || dp}
                    alt=""
                    className="w-full object-cover"
                  />
                </div>
              ))}
            </div>
            <div className="text-white text-[22px] ms:text-[30px] font-semibold">
              {profileData?.following.length}
            </div>
          </div>
          <div className="text-[18px] ms:text-[22px] text-[#ffffffc7]">
            Following
          </div>
        </div>
      </div>

      <div className="w-full h-20 flex justify-center items-center gap-5 mt-2.5">
        {profileData?._id == userData?._id && (
          <button
            className="px-2.5 min-w-37.5 py-1.25 h-10 bg-white cursor-pointer rounded-2xl "
            onClick={() => {
              navigate("/editprofile");
            }}
          >
            Edit Profile
          </button>
        )}
        {profileData?._id != userData?._id && (
          <>
            <FollowButton
              tailwind={
                "px-2.5 min-w-37.5 py-1.25 h-10 bg-white cursor-pointer rounded-2xl "
              }
              targetUserId={profileData?._id}
              onFollowChange={handleProfile}
            />
            <button
              className="px-2.5 min-w-37.5 py-1.25 h-10 bg-white cursor-pointer rounded-2xl "
              onClick={() => {
                dispatch(setSelectedUser(profileData));
                navigate("/messagearea");
              }}
            >
              Message
            </button>
          </>
        )}
      </div>

      <div className="w-full  min-h-screen flex justify-center">
        <div className="w-full max-w-225 flex flex-col items-center rounded-t-7.5z bg-white relative gap-5 pt-7.5 rounded-t-2xl ">
          <div className="w-[70%] max-w-150 h-15 bg-white rounded-full flex justify-center items-center gap-2">
            <div
              className={` ${postType == "Post" ? "bg-black text-white shadow-black shadow-2xl" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black `}
              onClick={() => {
                setPostType("Post");
              }}
            >
              Posts
            </div>
            {profileData?._id == userData._id && (
              <div
                className={` ${postType == "Saved" ? "bg-black text-white shadow-black shadow-2xl" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black `}
                onClick={() => {
                  setPostType("Saved");
                }}
              >
                Saved
              </div>
            )}
          </div>
          <Nav />

          {profileData?._id == userData._id && (
            <>
              {postType == "Post" &&
                profileData &&
                postData.map(
                  (post) =>
                    String(getAuthorId(post)) === String(profileData?._id) && (
                      <Post key={post._id} post={post} />
                    ),
                )}

              {postType == "Saved" &&
                postData.map(
                  (post) =>
                    userData.saved.includes(post._id) && (
                      <Post key={post._id} post={post} />
                    ),
                )}
            </>
          )}
          {profileData?._id != userData._id &&
            postData.map(
              (post) =>
                String(getAuthorId(post)) === String(profileData?._id) && (
                  <Post key={post._id} post={post} />
                ),
            )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
