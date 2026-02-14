import React, { useEffect, useState } from "react";
import dp from "../assets/dp.webp";
import { useSelector } from "react-redux";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { FaEye } from "react-icons/fa";

function Storycard({ story }) {
  const navigate = useNavigate();
  const { storyData } = useSelector((state) => state.story);
  const { userData } = useSelector((state) => state.user);
  const [showViewers, setShowViewers] = useState(false);

  // determine if the current signed-in user is the owner of the story
  const isOwner =
    !!storyData?.author?.[0]?._id &&
    !!userData?._id &&
    storyData.author[0]._id.toString() === userData._id.toString();

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          navigate("/");
          return 100;
        }
        return prev + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="w-full max-w-125  h-screen border-x-2 border-gray-800 pt-2.5 relative flex flex-col justify-center">
      <div className="flex items-center gap-2 md:gap-2.5 absolute top-5 px-2.5 z-300">
        <MdKeyboardBackspace
          className="text-white w-6.25 h-6.25 cursor-pointer"
          onClick={() => {
            navigate(`/`);
          }}
        />
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden cursor-pointer border border-black shrink-0">
          <img
            src={story?.author?.[0]?.profileImage || dp}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
        <div className="font-semibold truncate text-white text-sm">
          {storyData?.author?.[0]?.userName}
        </div>
      </div>
      <div className="absolute top-0  w-full h-1 bg-gray-900">
        <div
          className=" h-full bg-white transition-all duration-200 ease-linear"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {!showViewers && (
        <>
          <div
            className="w-full h-[90vh]  flex flex-col items-center justify-center "
            onClick={() => {
              setShowViewers(false);
            }}
          >
            {storyData?.mediaType == "image" && ( // image ===========================================
              <div className="w-[90%] flex items-center justify-center ">
                <img
                  src={storyData?.media}
                  alt=""
                  className="object-cover h-full rounded-2xl max-w-full"
                />
              </div>
            )}
            {storyData?.mediaType == "video" && ( // video ===========================================
              <div className="w-[80%]   flex flex-col items-center justify-center ">
                <VideoPlayer media={storyData?.media} />
              </div>
            )}
          </div>
          {isOwner && (
            <div
              className="w-full h-17.5 flex items-center gap-1 text-white p-2 left-0 absolute bottom-0"
              onClick={() => {
                setShowViewers(true);
              }}
            >
              <div className="text-white flex items-center gap-1.5">
                <FaEye /> {storyData?.viewers?.length || 0}
              </div>

              <div className="flex relative">
                {storyData?.viewers && storyData.viewers.length > 0 ? (
                  storyData.viewers.slice(0, 3).map((viewer, index) => (
                    <div
                      key={viewer?._id ?? index}
                      className="w-7.5 h-7.5 md:w-7.5 md:h-7.5 border-2 border-black rounded-full cursor-pointer overflow-hidden"
                      style={
                        index > 0
                          ? {
                              position: "absolute",
                              left: `${index * 9}px`,
                              zIndex: 10 - index,
                            }
                          : { zIndex: 10 }
                      }
                    >
                      <img
                        src={viewer?.profileImage || dp}
                        alt={viewer?.userName || "viewer"}
                        className="w-full object-cover"
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-sm text-gray-400 ml-2">
                    No viewers yet
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {showViewers && (
        <>
          <div className="w-full h-[30%]  flex flex-col items-center justify-center mt-22 overflow-hidden py-7.5 ">
            {storyData?.mediaType == "image" && ( // image ===========================================
              <div className="h-full flex items-center justify-center ">
                <img
                  src={storyData?.media}
                  alt=""
                  className="object-cover h-[80%] rounded-2xl "
                />
              </div>
            )}
            {storyData?.mediaType == "video" && ( // video ==================================
              <div className="h-full flex flex-col items-center justify-center ">
                <VideoPlayer media={storyData?.media} />
              </div>
            )}
          </div>

          <div className="w-full h-[70%] border-t-2 border-t-gray-800 p-5">
            <div className="text-white flex items-center gap-2.5">
              <FaEye />
              <span>{storyData?.viewers?.length || 0}</span>
              <span>Viewers</span>
            </div>
            <div className="w-full max-h-full flex flex-col gap-2.5 overflow-auto pt-5">
              {storyData?.viewers?.map((viewer, index) => (
                <div className="w-full flex items-center gap-5">
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden cursor-pointer border border-black shrink-0">
                    <img
                      src={viewer?.profileImage || dp}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="font-semibold truncate text-white text-sm">
                    {viewer?.userName}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div></div>
    </div>
  );
}

export default Storycard;
