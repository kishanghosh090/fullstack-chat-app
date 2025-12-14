import { Queue } from "bullmq";

export const messageQueue = new Queue("message-delivery", {
  connection: {
    host: "127.0.0.1",
    port: 6379,
  },
});
