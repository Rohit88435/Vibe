import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./UserSlice";
import loopSlice from "./loopSlice";
import postSlice from "./postSlice";
import messageSlice from "./messageSlice";
import storySlice from "./storySlice";
import socketSlice from "./socketSlice";

const store = configureStore({
  reducer: {
    user: userSlice,
    loop: loopSlice,
    post: postSlice,
    story: storySlice,
    message: messageSlice,
    socket: socketSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["socket.socket"],
        // Ignore the socket set action payload (socket object) which is non-serializable
        ignoredActions: ["socket/setSocket"],
      },
    }),
});

export default store;
