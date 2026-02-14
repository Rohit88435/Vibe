import React from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import OnlineUser from "../Components/OnlineUser";
import { setSelectedUser } from "../redux/messageSlice";
import dp from "../assets/dp.webp";

function Messages() {
  const navigate = useNavigate();
  const { userData } = useSelector((state) => state.user);
  const { onLineUsers } = useSelector((state) => state.socket);
  const { previousChatUsers, selectedUsers } = useSelector(
    (state) => state.message,
  );

  const dispatch = useDispatch();
  return (
    <div className="w-full min-h-screen flex flex-col bg-black gap-5 p-5">
      <div className="w-full h-20  flex  items-center gap-5 p-5 ">
        <MdKeyboardBackspace
          className="text-white w-6.25 h-6.25 lg:hidden cursor-pointer"
          onClick={() => {
            navigate(`/`);
          }}
        />
        <h1 className="text-[20px] text-white font-semibold">Messages</h1>
      </div>

      <div className="w-full h-20 flex gap-5 justify-start items-center overflow-x-auto p-5 border-b-2 border-b-gray-800">
        {userData.following
          ?.filter((user) => onLineUsers?.includes(user._id))
          ?.map((user) => (
            <OnlineUser key={user._id} user={user} />
          ))}
      </div>

      <div className="w-full h-full overflow-auto flex flex-col gap-5">
        {previousChatUsers?.map((user) => (
          <div
            key={user._id}
            className="text-white cursor-pointer w-full flex items-center gap-2.5 "
            onClick={() => {
              dispatch(setSelectedUser(user));
              navigate("/messagearea");
            }}
          >
            {onLineUsers?.includes(user._id) ? (
              <OnlineUser user={user} />
            ) : (
              <div className="w-12.5 h-12.5 border-2 border-black rounded-full cursor-pointer overflow-hidden">
                <img
                  src={user.profileImage || dp}
                  alt=""
                  className="w-full object-cover"
                />
              </div>
            )}
            <div className="flex flex-col ">
              <div className="text-white text-[18px] font-semibold">
                {user.userName}
              </div>
              {onLineUsers?.includes(user?._id) && (
                <div className="text-green-500 text-[15px]">Active Now</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Messages;
