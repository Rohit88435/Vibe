import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setFollowing, setSuggestedUsers } from "../redux/UserSlice";

function GetFollowingList() {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/user/followinglist`, {
          withCredentials: true,
        });
        dispatch(setFollowing(result.data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);
}

export default GetFollowingList;
