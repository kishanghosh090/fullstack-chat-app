import express from "express";
import auth from "../middlewares/auth.middleware.js";
import {
  getConversations,
  getMessages,
  sendMessage,
} from "../controllers/chat.controller.js";

const router = express.Router();

router.get("/conversations", auth, getConversations);
router.get("/messages/:conversationId", auth, getMessages);
router.post("/send", auth, sendMessage);

export default router;
