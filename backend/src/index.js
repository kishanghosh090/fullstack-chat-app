import { server } from "./server.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

/* ---------- START SERVER ---------- */
(async function startServer() {
  try {
    await connectDB();
    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start failed:", error);
    process.exit(1);
  }
})();
