import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { chatSocket } from "./sockets/chat.socket.js";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

chatSocket(io);

export { server, io };
