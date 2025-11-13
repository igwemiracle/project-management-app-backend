import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./app";
import registerSocketHandlers from "./sockets";

const PORT = process.env.PORT || 5000;

// ✅ Check if environment variables are loaded
console.log("SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY ? "✅ Loaded" : "❌ Missing");

// 1️⃣ Create a raw HTTP server using your Express app
const server = http.createServer(app);

// 2️⃣ Initialize Socket.IO server and attach to HTTP server
const io = new Server(server, {
  cors: {
    origin: "*", // For development; later, restrict to your frontend domain
    methods: ["GET", "POST"],
  },
});

// Export io so controllers can use it
export { io };

// 3️⃣ Register all socket event handlers (User, Workspace, etc.)
registerSocketHandlers(io);

app.set("io", io);

// 4️⃣ Start listening with the HTTP + WebSocket server
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
