import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";
import { setLoopData } from "../redux/loopSlice";

function GetAllLoops() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchLoops = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/loop/getAll`, {
          withCredentials: true,
        });
        dispatch(setLoopData(result.data));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchLoops();
  }, [dispatch, userData]);
}

export default GetAllLoops;
