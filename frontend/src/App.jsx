import React, { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./Pages/Signup";
import Signin from "./Pages/Signin";
import ForgotPassword from "./Pages/ForgotPassword";
import Home from "./Pages/Home";
import { useDispatch, useSelector } from "react-redux";
import GetCurrentUser from "./hooks/GetCurrentUser";
import GetSuggestedUser from "./hooks/GetSuggestedUser";
import Profile from "./Pages/Profile";
import EditProfile from "./Pages/EditProfile";
import Upload from "./Pages/Upload";
import GetAllPost from "./hooks/GetAllPost";
import Loops from "./Pages/Loops";
import GetAllLoops from "./hooks/GetAllLoops";
import Story from "./Pages/Story";
import GetAllStories from "./hooks/GetAllStories";
import Messages from "./Pages/Messages";
import MessageArea from "./Pages/MessageArea";
import { io } from "socket.io-client";
import { setOnLineUsers, setSocket } from "./redux/socketSlice";
import GetFollowingList from "./hooks/GetFollowingList";
import GetPreviousChatUsers from "./hooks/GetPreviousChatUsers";
import Search from "./Pages/Search";
import GetAllNotification from "./hooks/GetAllNotification";
import Notifications from "./Pages/Notifications";
import { useRef } from "react";
import { setNotificationData, addNotification } from "./redux/UserSlice";
import { setSelectedUser, setMessages } from "./redux/messageSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast, Bounce } from "react-toastify";

export const serverUrl = "https://vibe-backend-iu7n.onrender.com";
function App() {
  GetCurrentUser();
  GetSuggestedUser();
  GetAllPost();
  GetAllLoops();
  GetFollowingList();
  GetPreviousChatUsers();
  GetAllNotification();
  GetAllStories();
  const { userData, notificationData } = useSelector((state) => state.user);
  const { socket } = useSelector((state) => state.socket);
  const { selectedUser, messages, previousChatUsers } = useSelector(
    (state) => state.message,
  );

  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize socket only once per authenticated user id to avoid reconnects
    if (!userData?._id) return;
    if (socketRef.current) return;

    socketRef.current = io(serverUrl, {
      query: {
        userId: userData._id,
      },
    });

    const s = socketRef.current;
    // save socket to redux so other components can use it
    dispatch(setSocket(s));

    // Listen for online users
    s.on("getonlineuser", (users) => {
      dispatch(setOnLineUsers(users));
      console.log("Online users:", users);
    });

    // Listen for notifications
    s.on("newNotification", (notification) => {
      console.log("New notification received:", notification);
      dispatch(addNotification(notification));
      const senderName = notification?.sender?.userName || "Someone";
      const msg = notification?.message || "sent a notification";
      toast.info(`${senderName} ${msg}`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    });

    // Listen for incoming messages and show toast/navigation when appropriate
    s.on("newMessage", (mess) => {
      const senderId = mess.sender?.toString();

      // if user is on message area and selected user is the sender, append message silently
      if (
        location.pathname === "/messagearea" &&
        selectedUser?._id === senderId
      ) {
        dispatch(setMessages([...(messages || []), mess]));
        return;
      }

      // try to resolve sender info from previous chats or following
      const senderFromPrev = (previousChatUsers || []).find(
        (u) => String(u._id) === String(senderId),
      );
      const senderFromFollowing = (userData?.following || []).find(
        (u) => String(u._id) === String(senderId),
      );
      const sender = senderFromPrev || senderFromFollowing || { _id: senderId };

      // show toast with click handler to open message area and select user
      const toastId = toast.info(
        `${sender.userName || "Someone"} sent you a message`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          onClick: () => {
            dispatch(setSelectedUser(sender));
            navigate("/messagearea");
            toast.dismiss(toastId);
          },
        },
      );
    });

    // Cleanup when user logs out or component unmounts
    return () => {
      s.off("getonlineuser");
      s.off("newNotification");
      dispatch(setSocket(null));
      s.disconnect();
      socketRef.current = null;
    };
  }, [userData?._id, dispatch]);

  return (
    <>
      <Routes>
        <Route
          path="/signup"
          element={!userData ? <Signup /> : <Navigate to={"/"} />}
        />
        <Route
          path="/signin"
          element={!userData ? <Signin /> : <Navigate to={"/"} />}
        />
        <Route
          path="/forgot-password"
          element={!userData ? <ForgotPassword /> : <Navigate to={"/"} />}
        />
        <Route
          path="/"
          element={userData ? <Home /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/profile/:userName"
          element={userData ? <Profile /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/story/:userName"
          element={userData ? <Story /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/editprofile"
          element={userData ? <EditProfile /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/upload"
          element={userData ? <Upload /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/loops"
          element={userData ? <Loops /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/messages"
          element={userData ? <Messages /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/messagearea"
          element={userData ? <MessageArea /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/search"
          element={userData ? <Search /> : <Navigate to={"/signin"} />}
        />
        <Route
          path="/notifications"
          element={userData ? <Notifications /> : <Navigate to={"/signin"} />}
        />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
