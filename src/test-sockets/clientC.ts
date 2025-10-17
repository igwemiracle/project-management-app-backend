import { io } from "socket.io-client";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

socket.on("connect", () => {
  console.log("✅ Connected as OUTSIDER:", socket.id);
  // ❌ This client does NOT join any workspace
});

socket.on("workspaceCreated", (data) => console.log("🆕 workspaceCreated:", data));
socket.on("workspaceUpdated", (data) => console.log("✏️ workspaceUpdated:", data));
socket.on("workspaceDeleted", (data) => console.log("🗑️ workspaceDeleted:", data));
socket.on("memberAdded", (data) => console.log("👥 memberAdded:", data));
socket.on("memberRemoved", (data) => console.log("🚫 memberRemoved:", data));
socket.on("roleUpdated", (data) => console.log("🔑 roleUpdated:", data));

socket.on("disconnect", () => {
  console.log("❌ Disconnected from server");
});