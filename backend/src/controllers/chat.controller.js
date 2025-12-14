import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { messageQueue } from "../queues/message.queue.js";

/* ---------- GET CONVERSATIONS ---------- */
export const getConversations = async (req, res) => {
  const userId = req.user.id;

  const conversations = await Conversation.find({
    members: userId,
  })
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

  res.json(conversations);
};

/* ---------- GET MESSAGES ---------- */
export const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  const messages = await Message.find({ conversationId }).sort({
    createdAt: 1,
  });

  res.json(messages);
};

/* ---------- SEND MESSAGE (REST FALLBACK) ---------- */
export const sendMessage = async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, text } = req.body;

  let conversation = await Conversation.findOne({
    members: { $all: [senderId, receiverId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      members: [senderId, receiverId],
    });
  }

  const message = await Message.create({
    conversationId: conversation._id,
    senderId,
    receiverId,
    text,
  });

  conversation.lastMessage = message._id;
  await conversation.save();

  await messageQueue.add("deliver-message", {
    messageId: message._id,
    receiverId,
  });

  res.status(201).json(message);
};
