import http from "http";
import { Server } from "socket.io";
import app from "./app.js";

const server = http.createServer(app);

/* ---------- SOCKET.IO ---------- */
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

/* ---------- SOCKET EVENTS ---------- */
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

/* ---------- EXPORT ---------- */
export { server, io };
