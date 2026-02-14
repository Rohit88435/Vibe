import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedUser } from "../redux/messageSlice";
import dp from "../assets/dp.webp";

function OnlineUser({ user }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <div className="w-12.5 h-12.5 flex gap-5 justify-start items-center relative ">
      <div
        className="w-12.5 h-12.5 border-2 border-black rounded-full cursor-pointer overflow-hidden"
        onClick={() => {
          dispatch(setSelectedUser(user));
          navigate("/messagearea");
        }}
      >
        <img
          src={user.profileImage || dp}
          alt=""
          className="w-full object-cover"
        />
      </div>
      <div className="w-2.5 h-2.5 bg-[#67f567] rounded-full absolute top-2 right-0"></div>
    </div>
  );
}

export default OnlineUser;
