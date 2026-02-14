import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setPostData } from "../redux/postSlice";

function GetAllPost() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const result = await axios.get(`${serverUrl}/api/post/getAll`, {
          withCredentials: true,
        });
        dispatch(setPostData(result.data));
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPost();
  }, [dispatch, userData]);
}

export default GetAllPost;
