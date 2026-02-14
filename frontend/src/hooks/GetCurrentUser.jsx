import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setFollowing, setUserData } from "../redux/UserSlice";
import { setCurrentUserStory } from "../redux/storySlice";

function GetCurrentUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
        dispatch(setFollowing(result.data.following));
        dispatch(setCurrentUserStory(result.data.story));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);
}

export default GetCurrentUser;
