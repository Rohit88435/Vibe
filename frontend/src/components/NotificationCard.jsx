import React from "react";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
function NotificationCard({ noti }) {
  const navigate = useNavigate();

  return (
    <div className="w-full  bg-gray-800 rounded-full flex items-center justify-between p-1 min-h-12.5">
      <div className="flex gap-2 items-center">
        <div
          className="w-12.5 h-12.5 border-2 border-black rounded-full cursor-pointer overflow-hidden"
          onClick={() => {
            navigate(`/profile/${noti.sender?.userName}`);
          }}
        >
          <img
            src={noti.sender?.profileImage || dp}
            alt=""
            className="w-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-[16px] text-white font-semibold">
            {noti.sender?.name}
          </h1>
          <h1 className="text-[14px] text-gray-300">{noti.message}</h1>
        </div>
      </div>

      {(noti.loop || noti.post) && (
        <div className="w-10 h-10 rounded-full border-2  border-black overflow-hidden">
          {noti.loop ? (
            <video
              src={noti?.loop?.media}
              muted
              loop
              className="h-full object-cover"
            />
          ) : noti.post?.mediaType == "image" ? (
            <img src={noti?.post?.media} className="h-full object-cover" />
          ) : noti.post ? (
            <video
              src={noti?.post?.media}
              muted
              loop
              className="h-full object-cover"
            />
          ) : null}
        </div>
      )}
    </div>
  );
}

export default NotificationCard;
