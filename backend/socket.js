import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app); // server

const io = new Server(server, {
  // server
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {};
const socketIdToUser = {};

export const getSocketId = (receivedId) => {
  return userSocketMap[receivedId];
};

io.on("connection", (socket) => {
  // support both legacy query and modern auth
  const userId =
    socket.handshake.auth?.userId || socket.handshake.query?.userId;
  console.log(`Socket connected (raw): socketId=${socket.id} userId=${userId}`);
  if (userId) {
    userSocketMap[userId] = socket.id;
    socketIdToUser[socket.id] = userId;
  }

  // broadcast online users
  console.log("Online users emit:", Object.keys(userSocketMap));
  io.emit("getonlineuser", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    const sid = socket.id;
    const uid =
      socketIdToUser[sid] ||
      socket.handshake.auth?.userId ||
      socket.handshake.query?.userId;
    if (uid) {
      delete userSocketMap[uid];
    }
    delete socketIdToUser[sid];
    console.log(`Socket disconnected: socketId=${sid} userId=${uid}`);
    console.log(
      "Online users emit after disconnect:",
      Object.keys(userSocketMap),
    );
    io.emit("getonlineuser", Object.keys(userSocketMap));
  });
});

export { app, io, server };
