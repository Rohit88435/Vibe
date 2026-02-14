import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setStoryData } from "../redux/storySlice";
import Storycard from "../components/StoryCard";

function Story() {
  const { userName } = useParams();
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { storyData } = useSelector((state) => state.story);
  const { userData } = useSelector((state) => state.user);

  const handleStory = async () => {
    if (!userName) return;
    setLoading(true);
    setError(null);
    dispatch(setStoryData(null));

    try {
      const result = await axios.get(
        `${serverUrl}/api/story/getbyusername/${userName}`,
        { withCredentials: true },
      );
      const storyData = result.data[0];
      setData(storyData);
      dispatch(setStoryData(storyData));

      // If the current user is not the owner, call the view endpoint to record the view
      if (
        storyData?._id &&
        userData?.userName &&
        userData.userName !== userName
      ) {
        try {
          const viewRes = await axios.get(
            `${serverUrl}/api/story/view/${storyData._id}`,
            { withCredentials: true },
          );
          // Update local and redux state with the populated story (includes updated viewers)
          setData(viewRes.data);
          dispatch(setStoryData(viewRes.data));
        } catch (err) {
          console.error("Error recording story view:", err);
        }
      }
    } catch (error) {
      console.error("Error fetching story:", error);
      setError(error.response?.data?.message || "Failed to load story");
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleStory();
  }, [userName]);

  if (loading) {
    return (
      <div className="w-full h-screen bg-black flex justify-center items-center">
        <div className="text-white text-[20px]">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen bg-black flex justify-center items-center">
        <div className="text-red-500 text-[20px]">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-black flex justify-center items-center">
      <Storycard story={data} />
    </div>
  );
}

export default Story;
