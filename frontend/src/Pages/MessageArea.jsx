import React, { useEffect, useRef, useState } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dp from "../assets/dp.webp";
import { CiImageOn } from "react-icons/ci";
import { IoSend } from "react-icons/io5";
import SenderMessage from "../components/SenderMessage";
import axios from "axios";
import { serverUrl } from "../App";
import { setMessages } from "../redux/messageSlice";
import ReceiverMessage from "../components/ReceiverMessage";

function MessageArea() {
  const { selectedUser, messages } = useSelector((state) => state.message);
  const { socket } = useSelector((state) => state.socket);
  const { userData } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [frontendImg, setFrontendImg] = useState(null);
  const [backendImg, setBackendImg] = useState(null);
  const imageInput = useRef();
  const dispatch = useDispatch();
  const { onLineUsers } = useSelector((state) => state.socket);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImg(file);
    setFrontendImg(URL.createObjectURL(file));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    // Validate: Don't send if both text and image are empty
    if (!input.trim() && !backendImg) {
      console.log("Cannot send empty message");
      return;
    }

    const formData = new FormData();

    if (input.trim().length > 0) {
      formData.append("message", input.trim());
    }
    if (backendImg) {
      formData.append("media", backendImg);
    }

    try {
      const result = await axios.post(
        `${serverUrl}/api/message/send/${selectedUser._id}`,
        formData,
        { withCredentials: true },
      );
      dispatch(setMessages([...messages, result.data]));
      setInput("");
      setFrontendImg(null);
      setBackendImg(null);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllmessages = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/message/getall/${selectedUser._id}`,
        { withCredentials: true },
      );
      dispatch(setMessages(result.data));
    } catch (error) {
      console.log("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    if (selectedUser?._id) {
      getAllmessages();
    }
  }, [selectedUser._id]);

  useEffect(() => {
    // newMessage is handled globally in App.jsx now
    return () => {};
  }, [messages, setMessages]);

  return (
    <div className="w-full h-screen bg-black relative">
      <div className="flex items-center gap-3.25 px-5 pt-2 fixed top-0 z-100 border-b-2 border-b-gray-800 bg-black w-full">
        <div className="w-full h-20  flex  items-center gap-5 p-5 ">
          <MdKeyboardBackspace
            className="text-white w-6.25 h-6.25  cursor-pointer"
            onClick={() => {
              navigate(`/`);
            }}
          />
          <div
            className="w-12.5 h-12.5 border-2 border-black rounded-full cursor-pointer overflow-hidden"
            onClick={() => {
              navigate(`/profile/${selectedUser?.userName}`);
            }}
          >
            <img
              src={selectedUser.profileImage || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div className="">
            <div className="text-[18px] text-white font-semibold">
              {selectedUser.userName}
            </div>
            <div className="text-[14px] text-gray-400 font-semibold">
              {selectedUser.name}
            </div>
            {onLineUsers?.includes(selectedUser?._id) && (
              <div className="text-green-500 text-[15px]">Online</div>
            )}
            {!onLineUsers?.includes(selectedUser?._id) && (
              <div className="text-[15px] text-gray-100">Offline</div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-[90%] pt-25 pb-20 px-10 flex flex-col gap-12.5 overflow-auto bg-black">
        {messages &&
          messages.map((mess, index) =>
            mess.sender === userData._id ? (
              <SenderMessage key={mess._id || index} message={mess} />
            ) : (
              <ReceiverMessage key={mess._id || index} message={mess} />
            ),
          )}
      </div>

      <div className="w-full h-20 fixed bottom-0 flex justify-center items-center bg-black z-100">
        <form
          className="w-[90%] max-w-200 h-[80%] rounded-full bg-[#131616] flex items-center gap-2.5 px-5 relative"
          onSubmit={handleSendMessage}
        >
          {frontendImg && (
            <div className="w-25 rounded-2xl h-25 absolute -top-30 right-2.5 overflow-hidden">
              <img src={frontendImg} alt="Img" />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            ref={imageInput}
            hidden
            onChange={handleImage}
          />
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
            }}
            placeholder="Message..."
            className="w-full h-full text-[18px] text-white outline-0 placeholder:text-gray-400"
          />
          <div
            onClick={() => {
              imageInput.current.click();
            }}
          >
            <CiImageOn className="w-7 h-7 text-white cursor-pointer" />
          </div>
          {(input || frontendImg) && (
            <button className="w-15 h-10 rounded-full bg-linear-to-br from-[#9500ff] to-[#ff0095] flex items-center justify-center">
              <IoSend className="w-7 h-7 text-white cursor-pointer" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}

export default MessageArea;
