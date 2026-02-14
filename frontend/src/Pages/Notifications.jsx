import React, { useEffect } from "react";
import { MdKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotificationCard from "../components/NotificationCard";
import axios from "axios";
import { serverUrl } from "../App";
import { setNotificationData } from "../redux/UserSlice";

function Notifications() {
  const navigate = useNavigate();
  const { notificationData } = useSelector((state) => state.user);
  const ids = notificationData.map((n) => n._id);
  const dispatch = useDispatch();

  const markAsRead = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/user/markasread`,
        {
          notificationId: ids,
        },
        { withCredentials: true },
      );
      await fetchNotification();
    } catch (error) {
      console.log(error);
    }
  };

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

  useEffect(() => {
    markAsRead();
    fetchNotification();
  }, []);

  return (
    <div className="w-full h-screen bg-black overflow-auto">
      <div className="w-full h-20  flex  items-center gap-5 p-5 lg:hidden">
        <MdKeyboardBackspace
          className="text-white w-6.25 h-6.25 cursor-pointer"
          onClick={() => {
            navigate(`/`);
          }}
        />
        <h1 className="text-[20px] text-white font-semibold">Notifications</h1>
      </div>

      <div className="w-full flex flex-col gap-5 p-2.5 h-full">
        {notificationData.map((noti) => (
          <NotificationCard noti={noti} key={noti._id} />
        ))}
      </div>
    </div>
  );
}

export default Notifications;
