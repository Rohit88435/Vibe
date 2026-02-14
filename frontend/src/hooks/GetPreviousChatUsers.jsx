import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setPreviousChatUsers } from "../redux/messageSlice";

function GetPreviousChatUsers() {
  const dispatch = useDispatch();
  const { messages } = useSelector((state) => state.message);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/message/previouschat`,
          {
            withCredentials: true,
          },
        );
        dispatch(setPreviousChatUsers(result.data));
        console.log(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [messages]);
}

export default GetPreviousChatUsers;
