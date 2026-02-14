import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";
import { setFollowing } from "../redux/UserSlice";

function FollowButton({ targetUserId, tailwind, onFollowChange }) {
  const { following } = useSelector((state) => state.user);
  const isFollowing = following?.some((u) =>
    typeof u === "string" ? u === targetUserId : u?._id === targetUserId,
  );
  const dispatch = useDispatch();

  const handleFollow = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/user/follow/${targetUserId}`,
        { withCredentials: true },
      );
      console.log("follow response:", result.data);
      // Sync latest following list from server
      const list = await axios.get(`${serverUrl}/api/user/followinglist`, {
        withCredentials: true,
      });
      dispatch(setFollowing(list.data));

      if (onFollowChange) onFollowChange();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button
      className={tailwind}
      onClick={() => {
        handleFollow();
      }}
    >
      {isFollowing ? "Following" : "Follow"}
    </button>
  );
}

export default FollowButton;
