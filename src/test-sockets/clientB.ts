import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("✅ Connected:", socket.id);

  // 👇 Automatically join a workspace room (simulate a user viewing workspace)
  const workspaceId = "68f26ab228ff769f4977257f"; // replace with an actual _id from DB
  socket.emit("joinWorkspace", workspaceId);
  console.log(`🧩 Joined workspace room: ${workspaceId}`);
});

// Handle all workspace events
socket.on("workspaceCreated", (data) => console.log("🆕 workspaceCreated:", data));
socket.on("workspaceUpdated", (data) => console.log("✏️ workspaceUpdated:", data));
socket.on("workspaceDeleted", (data) => console.log("🗑️ workspaceDeleted:", data));
socket.on("memberAdded", (data) => console.log("👥 memberAdded:", data));
socket.on("memberRemoved", (data) => console.log("🚫 memberRemoved:", data));
socket.on("roleUpdated", (data) => console.log("🔑 roleUpdated:", data));

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});
