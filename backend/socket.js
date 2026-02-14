import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app); // server

const io = new Server(server, {
  // server
  cors: {
<<<<<<< HEAD
    origin: [
      "http://localhost:5173", // local dev
      "https://vibe-rqrb.onrender.com", // production frontend
    ],
=======
    origin: "https://vibe-rqrb.onrender.com",
>>>>>>> 32250a58a36bf75930ed2aaa9755e24d6d4f8117
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const userSocketMap = {};

export const getSocketId = (receivedId) => {
  return userSocketMap[receivedId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId;
  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  // events for frontend
  io.emit("getonlineuser", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (userId) delete userSocketMap[userId];
    io.emit("getonlineuser", Object.keys(userSocketMap));
  });
});

export { app, io, server };
