import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ---------- MIDDLEWARES ----------
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//---------- HEALTH CHECK ----------
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "RelayChat backend running 🚀",
  });
});

export default app;
