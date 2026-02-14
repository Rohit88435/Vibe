import axios from "axios";
import React from "react";
import { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setSearchData } from "../redux/UserSlice";
import { useEffect } from "react";
import dp from "../assets/dp.webp";

function Search() {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const { searchData } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) {
      dispatch(setSearchData([]));
      return;
    }
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/search?keyword=${input}`,
        { withCredentials: true },
      );
      console.log("Search result:", result.data);
      dispatch(setSearchData(result.data));
    } catch (error) {
      console.error("Search error:", error);
      dispatch(setSearchData([]));
    }
  };

  useEffect(() => {
    handleSearch();
  }, [input]);
  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-start flex-col gap-5 p-5 pt-5">
      <div className="w-full h-20  flex  items-center  gap-5 p-5  absolute top-2 pointer-events-none">
        <MdKeyboardBackspace
          className="text-white w-6.25 h-6.25 cursor-pointer pointer-events-auto"
          onClick={() => {
            navigate(`/`);
          }}
        />
      </div>
      <div className="w-full h-20 flex items-center justify-center ">
        <form
          action=""
          className="w-[80%] max-w-200 h-[80%] rounded-full bg-gray-900 flex items-center px-5"
          onSubmit={handleSearch}
        >
          <IoSearch className="w-5 h-5 text-white " />
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder="Search..."
            className="w-full h-full outline-0 rounded-full px-5 text-white text-[18px] placeholder:text-gray-500"
          />
        </form>
      </div>

      {searchData && searchData.length > 0
        ? searchData.map((user) => (
            <div
              key={user._id}
              className="w-[90vw] max-w-175 h-20 rounded-full bg-white flex items-center gap-5 cursor-pointer hover:bg-gray-200 p-2"
              onClick={() => {
                navigate(`/profile/${user.userName}`);
              }}
            >
              <div className="w-10 h-10 border-2 border-black rounded-full  overflow-hidden">
                <img
                  src={user.profileImage || dp}
                  alt=""
                  className="w-full object-cover"
                />
              </div>

              <div className="text-black text-[18px] font-semibold ">
                <div>{user.userName}</div>
                <div className="text-[14px] text-gray-400">{user.name}</div>
              </div>
            </div>
          ))
        : null}

      {!input && (
        <div className="text-[30px] text-gray-700 font-bold">
          Search Here ...
        </div>
      )}
    </div>
  );
}

export default Search;
