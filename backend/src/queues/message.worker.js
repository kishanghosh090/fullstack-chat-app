import { Worker } from "bullmq";
import Message from "../models/message.model.js";
import { io } from "../server.js";

const worker = new Worker(
  "message-delivery",
  async (job) => {
    const { messageId, receiverId } = job.data;

    const message = await Message.findById(messageId);
    if (!message) return;

    // Emit message to receiver room
    io.to(receiverId).emit("message:receive", message);

    // Update status
    message.status = "delivered";
    await message.save();
  },
  {
    connection: {
      host: "127.0.0.1",
      port: 6379,
    },
  }
);

worker.on("completed", (job) => {
  console.log("✅ Message delivered:", job.id);
});

worker.on("failed", (job, err) => {
  console.error("❌ Delivery failed:", err.message);
});
