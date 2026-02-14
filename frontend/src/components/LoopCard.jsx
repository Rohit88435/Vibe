import React, { useEffect, useRef, useState } from "react";
import { CiVolumeMute } from "react-icons/ci";
import { IoSend, IoVolumeHighOutline } from "react-icons/io5";
import FollowButton from "./FollowButton";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdOutlineComment } from "react-icons/md";
import { setLoopData } from "../redux/loopSlice";
import axios from "axios";
import dp from "../assets/dp.webp";
import { serverUrl } from "../App";

function LoopCard({ loop }) {
  const videoRef = useRef();
  const commentRef = useRef();
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);
  const { loopData } = useSelector((state) => state.loop);
  const { socket } = useSelector((state) => state.socket);
  const [isPlaying, setIsPlaying] = useState(true);
  const [mute, setMute] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [message, setMessage] = useState("");
  const [showComment, setShowComment] = useState(false);
  const navigate = useNavigate();

  if (!loop || !userData) return null;

  const handleTimeUpdate = () => {
    const video = videoRef.current;

    if (video) {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(percent);
    }
  };

  const handleLikeOnDoubleClick = () => {
    setShowHeart(true);

    setTimeout(() => {
      setShowHeart(false);
    }, 6000);

    if (!loop.likes?.includes(userData._id)) {
      handleLike();
    }
  };

  const handleLike = async () => {
    try {
      console.log("Liking loop:", loop._id);
      const result = await axios.get(`${serverUrl}/api/loop/like/${loop._id}`, {
        withCredentials: true,
      });
      console.log("Like response:", result.data);
      const updatedLoop = result.data;

      const updatedLoops = loopData.map((p) =>
        p._id == loop._id ? updatedLoop : p,
      );
      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.error("Like error:", error.response?.data || error.message);
    }
  };
  const handleComment = async () => {
    try {
      console.log("Posting comment on loop:", loop._id, "Message:", message);
      const result = await axios.post(
        `${serverUrl}/api/loop/comment/${loop._id}`,
        { message },
        {
          withCredentials: true,
        },
      );
      console.log("Comment response:", result.data);
      const updatedLoop = result.data;
      setMessage("");
      const updatedLoops = loopData.map((p) =>
        p._id == loop._id ? updatedLoop : p,
      );
      dispatch(setLoopData(updatedLoops));
    } catch (error) {
      console.error("Comment error:", error.response?.data || error.message);
      setMessage("");
    }
  };
  // const handleSaved = async () => {
  //   try {
  //     const result = await axios.get(
  //       `${serverUrl}/api/post/saved/${post._id}`,
  //       {
  //         withCredentials: true,
  //       },
  //     );

  //     dispatch(setUserData(result.data));
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (commentRef.current && !commentRef.current.contains(event.target)) {
        setShowComment(false);
      }
    };

    if (showComment) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showComment]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = videoRef.current;
          if (entry.isIntersecting) {
            video?.play().catch((err) => {
              if (err.name !== "AbortError") {
                console.error("Play error:", err);
              }
            });
            setIsPlaying(true);
          } else {
            video?.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.6 },
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  const handleClick = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Play error:", err);
        }
      });
      setIsPlaying(true);
    }
  };

  /// socket ======================================================
  useEffect(() => {
    socket?.on("likeLoop", (updatedData) => {
      const updatedLoops = loopData.map((p) =>
        p._id == updatedData.loopId ? { ...p, likes: updatedData.likes } : p,
      );

      dispatch(setLoopData(updatedLoops));
    });
    socket?.on("commentLoop", (updatedData) => {
      const updatedLoops = loopData.map((p) =>
        p._id == updatedData.loopId
          ? { ...p, comments: updatedData.comments }
          : p,
      );

      dispatch(setLoopData(updatedLoops));
    });
    return () => {
      (socket?.off("likeLoop"), socket?.off("commentLoop"));
    };
  }, [socket, loopData, dispatch]);

  return (
    <div className="w-full lg:w-120 h-screen flex items-center justify-center border-l-2 border-r-2 border-gray-800 relative overflow-hidden ">
      {showHeart && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation z-50">
          <GoHeartFill className="w-25 drop-shadow-2xl h-25 text-red-600" />
        </div>
      )}

      {showComment && (
        <div
          ref={commentRef}
          className={`absolute z-200 bottom-0 w-full h-120 p-2.5 rounded-t-4xl shadow-2xl shadow-black transition-all duration-4000 ease-in-out bg-[#0e1718] left-0 will-change-transform ${showComment ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}`}
        >
          <h1 className="text-white text-center text-[20px] mb-2">Comments</h1>

          <div className="w-full h-84.5 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-gray-800">
            {loop.comments?.map((com, index) => (
              <div
                key={index}
                className="w-full pb-2 mt-2 flex flex-col  border-b border-gray-700"
              >
                <div className="flex items-center gap-2 md:gap-2.5">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden cursor-pointer border border-black shrink-0">
                    <img
                      src={com.author?.profileImage || dp}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-semibold truncate text-white text-sm">
                    {com.author?.userName}
                  </div>
                </div>
                <div className="text-white ml-10 md:ml-12">{com.message}</div>
              </div>
            ))}

            {loop.comments?.length === 0 && (
              <div className="flex flex-col items-center justify-center text-white text-[20px] font-semibold mt-12">
                No Comments Yet
              </div>
            )}
          </div>

          <div className="flex w-full fixed bottom-0 h-20   items-center justify-between px-5 py-5 ">
            <div className="w-10 h-10 md:w-10 md:h-10 border-2 border-black rounded-full cursor-pointer overflow-hidden">
              <img
                src={userData?.profileImage || dp}
                alt={userData?.userName || loop?.author?.[0]?.userName || ""}
                className="w-full object-cover"
              />
            </div>
            <input
              type="text"
              className="px-2.5 pr-10 border-b-2 border-b-gray-500 w-[90%] outline-none h-10 placeholder:text-white text-white"
              placeholder="write comment.."
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
            />
            <button
              className="absolute right-5 outline-none"
              onClick={handleComment}
            >
              <IoSend className="w-6.25 h-6.25 cursor-pointer text-white" />
            </button>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        src={loop?.media}
        className="w-full max-h-screen"
        autoPlay
        loop
        muted={mute}
        onClick={handleClick}
        onTimeUpdate={handleTimeUpdate}
        onDoubleClick={handleLikeOnDoubleClick}
      />
      <div
        className="absolute top-3.5 right-2.5 p-2 rounded-full flex items-center justify-center z-999 cursor-pointer"
        onClick={() => {
          setMute((prev) => !prev);
        }}
      >
        {!mute ? (
          <IoVolumeHighOutline className="w-7.5 h-7.5 text-white cursor-pointer" />
        ) : (
          <CiVolumeMute className="w-7.5 h-7.5 text-white cursor-pointer" />
        )}
      </div>

      <div className="absolute bottom-0  w-full h-1 bg-gray-900">
        <div
          className=" h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      <div className="w-full absolute h-25 bottom-2.5 p-2.5 gap-2.5 flex flex-col">
        <div className="flex  items-center gap-2 md:gap-2">
          <div
            className="w-10 h-10 md:w-10 md:h-10 border border-white rounded-full cursor-pointer overflow-hidden z-150"
            onClick={() => {
              navigate(`/profile/${loop.author[0].userName}`);
            }}
          >
            <img
              src={loop.author[0].profileImage || dp}
              alt=""
              className="w-full object-cover"
            />
          </div>
          <div className=" truncate w-26 font-semibold text-white">
            {loop.author[0]?.userName}
          </div>
          {userData._id != loop.author[0]._id && (
            <FollowButton
              targetUserId={loop.author[0]._id}
              tailwind={`px-2.5 py-1 text-white border-2 border-white rounded-2xl cursor-pointer`}
            />
          )}
        </div>
        <div className="text-white px-2.5">{loop.caption}</div>
        <div className="absolute right-1.5 flex flex-col gap-5 text-white bottom-50 justify-center px-2.5 ">
          <div className="flex flex-col items-center cursor-pointer">
            <div>
              {!loop.likes?.includes(userData._id) && (
                <GoHeart
                  className="w-6.25 cursor-pointer h-6.25"
                  onClick={handleLike}
                />
              )}
              {loop.likes?.includes(userData._id) && (
                <GoHeartFill
                  className="w-6.25 cursor-pointer h-6.25 text-red-600"
                  onClick={handleLike}
                />
              )}
            </div>
            <div>
              <span className="text-[17px]">
                {loop.likes?.length > 0 ? loop.likes.length : "Like"}
              </span>
            </div>
          </div>
          <div
            className="flex flex-col  items-center cursor-pointer"
            onClick={() => {
              setShowComment(true);
            }}
          >
            <div>
              <MdOutlineComment className="w-6.25 cursor-pointer h-6.25" />
            </div>
            <div>
              <span className="text-[18px]">{loop.comments?.length || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoopCard;
