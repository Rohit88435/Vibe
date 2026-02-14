import { createSlice } from "@reduxjs/toolkit";

const messageSlice = createSlice({
  name: "message",
  initialState: {
    selectedUser: null,
    messages: [],
    previousChatUsers: [],
  },
  reducers: {
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setPreviousChatUsers: (state, action) => {
      state.previousChatUsers = action.payload;
    },
  },
});

export const { setSelectedUser, setMessages, setPreviousChatUsers } =
  messageSlice.actions;
export default messageSlice.reducer;
