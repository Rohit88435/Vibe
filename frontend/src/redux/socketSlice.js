import { createSlice } from "@reduxjs/toolkit";

const socketSlice = createSlice({
  name: "socket",
  initialState: {
    socket: null,
    onLineUsers: null,
  },
  reducers: {
    setSocket: (state, action) => {
      state.socket = action.payload;
    },
    setOnLineUsers: (state, action) => {
      state.onLineUsers = action.payload;
    },
  },
});

export const { setSocket, setOnLineUsers } = socketSlice.actions;
export default socketSlice.reducer;
