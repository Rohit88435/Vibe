import React from "react";
import { IoMdHome } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import { BiSolidVideos } from "react-icons/bi";
import { LuSquarePlus } from "react-icons/lu";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function Nav() {
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  return (
    <div className="w-[93%] lg:w-[40%] h-15 bg-black flex justify-around items-center fixed bottom-5 rounded-full shadow-2xl shadow-[#000000] z-100 ">
      <div
        className="cursor-pointer "
        onClick={() => {
          navigate("/");
        }}
      >
        <IoMdHome className="text-white w-7 h-7 hover:scale-[103%]" />
      </div>
      <div
        className="cursor-pointer "
        onClick={() => {
          navigate("/search");
        }}
      >
        <IoSearch className="text-white w-7 h-7 hover:scale-[103%]" />
      </div>
      <div
        className="cursor-pointer "
        onClick={() => {
          navigate("/upload");
        }}
      >
        <LuSquarePlus className="text-white w-8 h-8 hover:scale-[103%]" />
      </div>
      <div
        className="cursor-pointer "
        onClick={() => {
          navigate("/loops");
        }}
      >
        <BiSolidVideos className="text-white w-7 h-7 hover:scale-[103%]" />
      </div>
      <div
        className="w-10 h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden hover:scale-[103%]"
        onClick={() => {
          navigate(`/profile/${userData.userName}`);
        }}
      >
        <img
          src={userData.profileImage || dp}
          alt=""
          className="w-full object-cover"
        />
      </div>
    </div>
  );
}

export default Nav;
