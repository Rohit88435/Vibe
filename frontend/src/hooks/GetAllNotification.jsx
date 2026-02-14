import axios from "axios";
import { useEffect } from "react";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setNotificationData } from "../redux/UserSlice";

function GetAllNotification() {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/getallnotification`,
          {
            withCredentials: true,
          },
        );
        console.log(result.data);

        dispatch(setNotificationData(result.data));
      } catch (error) {
        console.error("Error fetching notification:", error);
      }
    };
    fetchNotification();
  }, [dispatch, userData]);
}

export default GetAllNotification;
