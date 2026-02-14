import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { setStoryList, setCurrentUserStory } from "../redux/storySlice";

function GetAllStories() {
  const { userData } = useSelector((state) => state.user);
  const { storyData } = useSelector((state) => state.story);
  const { storyList } = useSelector((state) => state.story);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/story/getAllstories`, {
          withCredentials: true,
        });
        dispatch(setStoryList(result.data));

        // Fetch current user's story
        if (userData?.userName) {
          const userStory = await axios.get(
            `${serverUrl}/api/story/getbyusername/${userData.userName}`,
            { withCredentials: true },
          );
          dispatch(setCurrentUserStory(userStory.data));
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };
    fetchStories();
  }, [dispatch, userData, storyData, storyList]);
}

export default GetAllStories;
