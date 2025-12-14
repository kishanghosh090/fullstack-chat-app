import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

const onlineUsers = new Map(); // userId -> socketId

export const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    /* ---------- USER ONLINE ---------- */
    socket.on("user:online", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.join(userId); // personal room
      console.log("✅ User online:", userId);
    });

    /* ---------- SEND MESSAGE ---------- */
    socket.on("message:send", async (data) => {
      try {
        const { senderId, receiverId, text } = data;

        // 1️⃣ Find or create conversation
        let conversation = await Conversation.findOne({
          members: { $all: [senderId, receiverId] },
        });

        if (!conversation) {
          conversation = await Conversation.create({
            members: [senderId, receiverId],
          });
        }

        // 2️⃣ Save message
        const message = await Message.create({
          conversationId: conversation._id,
          senderId,
          receiverId,
          text,
        });

        // 3️⃣ Update last message
        conversation.lastMessage = message._id;
        await conversation.save();

        // 4️⃣ Emit to receiver (if online)
        io.to(receiverId).emit("message:receive", message);

        // 5️⃣ Emit back to sender
        socket.emit("message:sent", message);
      } catch (error) {
        console.error("❌ Message send failed:", error);
        socket.emit("error", { message: "Message send failed" });
      }
    });

    /* ---------- DISCONNECT ---------- */
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });
};
