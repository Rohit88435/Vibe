import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

function ReceiverMessage({ message }) {
  const { selectedUser } = useSelector((state) => state.message);
  const scroll = useRef();
  useEffect(() => {
    scroll.current.scrollIntoView({ behavior: "smooth" });
  }, [message.message, message.image]);
  return (
    <div
      ref={scroll}
      className="w-fit max-w-[60%] bg-[#1a1f1f] rounded-t-2xl rounded-br-2xl rounded-bl-0 py-2.5 px-2.5 relative mr-auto left-0 flex flex-col gap-2.5"
    >
      {message.image && (
        <img
          src={message.image}
          alt="img"
          className="h-50 object-cover rounded-2xl"
        />
      )}
      {message.message && (
        <div className="text-[18px] text-white wrap-break-word ">
          {message.message}
        </div>
      )}
      <div className="w-7.5 h-7.5 rounded-full cursor-pointer overflow-hidden absolute -left-6.25 -bottom-10 ">
        <img
          src={selectedUser.profileImage}
          alt="img"
          className="w-full object-cover"
        />
      </div>
    </div>
  );
}

export default ReceiverMessage;
