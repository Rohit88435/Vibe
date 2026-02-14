import React, { useState } from "react";
import logo from "../assets/logo2.png";
import { FaRegHeart } from "react-icons/fa6";
import dp from "../assets/dp.webp";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/UserSlice";
import OtherUser from "./OtherUser";
import Notifications from "../Pages/Notifications";
function LeftHome() {
  const { userData, suggestedUsers } = useSelector((state) => state.user);
  const { notificationData } = useSelector((state) => state.user);
  const [showNotification, setShowNotification] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
  return (
    <div
      className={`w-[25%] hidden  lg:block h-screen bg-black border-r-2 border-gray-900  ${showNotification ? "overflow-hidden" : "overflow-auto"} `}
    >
      <div className="w-full h-25 flex items-center justify-between p-5">
        <img src={logo} alt="" className="w-20 " />
        <div
          className="relative"
          onClick={() => {
            setShowNotification((prev) => !prev);
          }}
        >
          <div>
            <FaRegHeart className="text-white w-6.25 h-6.25 cursor-pointer" />
            {notificationData?.length > 0 &&
              notificationData.some((noti) => noti.isRead === false) && (
                <div className="w-2.5 h-2.5 bg-red-600 rounded-full absolute top-0 -right-1.25"></div>
              )}
          </div>
        </div>
      </div>
      {!showNotification && (
        <>
          <div className="flex items-center gap-2.5 w-full justify-between p-2.5 border-2 border-b-gray-900 py-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-17 h-17 border-2 border-black rounded-full cursor-pointer overflow-hidden">
                <img
                  src={userData.profileImage || dp}
                  alt=""
                  className="w-full object-cover"
                />
              </div>
              <div className="">
                <div className="text-[18px] text-white font-semibold">
                  {userData.userName}
                </div>
                <div className="text-[15px] text-gray-400 font-semibold">
                  {userData.name}
                </div>
              </div>
            </div>
            <div
              className="text-blue-500 font-semibold cursor-pointer"
              onClick={handleLogout}
            >
              Logout
            </div>
          </div>
          <div className="w-full flex flex-col gap-5 p-5">
            <h1 className="text-white font-semibold text-[19px]">
              Suggested Users
            </h1>
            {suggestedUsers &&
              suggestedUsers
                .slice(0, 3)
                .map((user, index) => <OtherUser key={index} user={user} />)}
          </div>
        </>
      )}

      {showNotification && <Notifications />}
    </div>
  );
}

export default LeftHome;
