import React from "react";
import { useRef } from "react";
import { useState } from "react";
import { LuSquarePlus } from "react-icons/lu";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { setCurrentUserStory, setStoryData } from "../redux/storySlice";
import { setLoopData } from "../redux/loopSlice";
import { setUserData } from "../redux/UserSlice";
import VideoPlayer from "../Components/VideoPlayer";

function Upload() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { postData } = useSelector((state) => state.post);
  const { loopData } = useSelector((state) => state.loop);
  const { storyData } = useSelector((state) => state.story);
  const [uploadType, setUploadType] = useState("post");
  const [frontendMedia, setFrontendMedia] = useState(null);
  const [backendMedia, setBackendMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [caption, setCaption] = useState("");
  const mediaInput = useRef();
  const [loading, setLoading] = useState(false);

  const handleMedia = (e) => {
    const file = e.target.files[0];
    console.log(file.type);
    if (file.type.includes("image")) {
      setMediaType("image");
    } else {
      setMediaType("video");
    }
    setBackendMedia(file);
    setFrontendMedia(URL.createObjectURL(file));
  };

  const uploadPost = async () => {
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("caption", caption);
      formdata.append("mediaType", mediaType);
      formdata.append("media", backendMedia);

      const result = await axios.post(
        `${serverUrl}/api/post/upload`,
        formdata,
        { withCredentials: true },
      );
      dispatch(setPostData([result.data, ...postData]));
      navigate("/");
    } catch (error) {
      console.log("uploadPost");
    } finally {
      setLoading(false);
    }
  };
  const uploadStory = async () => {
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("mediaType", mediaType);
      formdata.append("media", backendMedia);

      const result = await axios.post(
        `${serverUrl}/api/story/upload`,
        formdata,
        {
          withCredentials: true,
        },
      );
      dispatch(setCurrentUserStory(result.data));
      navigate("/");
    } catch (error) {
      console.log("uploadStory");
    } finally {
      setLoading(false);
    }
  };

  const uploadLoop = async () => {
    setLoading(true);
    try {
      const formdata = new FormData();
      formdata.append("caption", caption);
      formdata.append("media", backendMedia);

      const result = await axios.post(
        `${serverUrl}/api/loop/upload`,
        formdata,
        {
          withCredentials: true,
        },
      );
      dispatch(setLoopData([...loopData, result.data]));
      navigate("/");
    } catch (error) {
      console.log(`uploadLoop ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = () => {
    if (uploadType == "post") {
      uploadPost();
    } else if (uploadType == "story") {
      uploadStory();
    } else {
      uploadLoop();
    }
  };

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center transition-all">
      <div className="w-full h-20  flex  items-center gap-5 p-5 ">
        <MdKeyboardBackspace
          className="text-white w-6.25 h-6.25 cursor-pointer"
          onClick={() => {
            navigate(`/`);
          }}
        />
        <h1 className="text-[20px] text-white font-semibold">Upload Media</h1>
      </div>
      <div className="w-[90%] max-w-150 h-20 bg-white rounded-full flex justify-around items-center gap-2.5">
        <div
          className={` ${uploadType == "post" ? "bg-black text-white shadow-black shadow-2xl" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black `}
          onClick={() => {
            setUploadType("post");
          }}
        >
          Post
        </div>
        <div
          className={` ${uploadType == "story" ? "bg-black text-white shadow-black shadow-2xl" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black `}
          onClick={() => {
            setUploadType("story");
          }}
        >
          Story
        </div>
        <div
          className={` ${uploadType == "loop" ? "bg-black text-white shadow-black shadow-2xl" : ""} w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold hover:bg-black rounded-full hover:text-white cursor-pointer hover:shadow-2xl hover:shadow-black `}
          onClick={() => {
            setUploadType("loop");
          }}
        >
          Loop
        </div>
      </div>

      {!frontendMedia && (
        <div
          className="w-[80%] max-w-125 h-62.5 bg-[#0e1316] border-gray-800 border-2 flex flex-col items-center justify-center gap-2 mt-[15vh] rounded-2xl cursor-pointer hover:bg-[#353a3d]
      "
          onClick={() => {
            mediaInput.current.click();
          }}
        >
          <LuSquarePlus className="text-white cursor-pointer w-7 h-7" />
          <div className="text-white text-[19px] font-semibold">
            Upload {uploadType}
          </div>
          <input
            type="file"
            accept={uploadType == "loop" ? "video/*" : ""}
            className="hidden "
            ref={mediaInput}
            onChange={handleMedia}
          />
        </div>
      )}

      {frontendMedia && (
        <div className="w-[80%] max-w-125 h-62.5 flex flex-col items-center justify-center mt-[15vh]">
          {mediaType == "image" && (
            <div className="w-[80%] max-w-125 h-62.5 flex flex-col items-center justify-center mt-[15vh]">
              <img
                src={frontendMedia}
                alt=""
                className="object-cover h-[60%] rounded-2xl"
              />
              {uploadType != "story" && (
                <input
                  type="text"
                  className="w-full border-b-gray-400 border-b-2 outline-none px-2.5 py-2.5 text-white mt-5 rounded-2xl "
                  placeholder="Write caption"
                  onChange={(e) => {
                    setCaption(e.target.value);
                  }}
                  value={caption}
                />
              )}
            </div>
          )}
          {mediaType == "video" && (
            <div className="w-[80%] max-w-125 h-62.5 flex flex-col items-center justify-center mt-[15vh]">
              <img
                src={frontendMedia}
                alt=""
                className="object-cover h-[60%] rounded-2xl"
              />

              <div className="w-[80%] max-w-125 h-62.5 flex flex-col items-center justify-center mt-[15vh]">
                <VideoPlayer media={frontendMedia} />
                {uploadType != "story" && (
                  <input
                    type="text"
                    className="w-full border-b-gray-400 border-b-2 outline-none px-2.5 py-2.5 text-white mt-5 rounded-2xl "
                    placeholder="Write caption"
                    onChange={(e) => {
                      setCaption(e.target.value);
                    }}
                    value={caption}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {frontendMedia && (
        <button
          className="px-2.5 w-[60%] max-w-100 py-1.25 h-12.5 bg-white absolute lg:bottom-[4.5%] md:bottom-[10%] bottom-[5%]   cursor-pointer rounded-2xl"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? (
            <ClipLoader size={30} color="black" />
          ) : (
            `Upload ${uploadType} `
          )}
        </button>
      )}
    </div>
  );
}

export default Upload;
