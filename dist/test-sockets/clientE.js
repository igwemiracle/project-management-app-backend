"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const socket = (0, socket_io_client_1.io)("http://localhost:5000", { transports: ["websocket"] });
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
// Handle all board events
socket.on("boardCreated", (data) => console.log("🆕 Board created:", data));
socket.on("boardUpdated", (data) => console.log("✏️ Board updated:", data));
socket.on("boardDeleted", (data) => console.log("🗑️ Board deleted:", data));
// Handle all list events
socket.on("listCreated", (data) => console.log("🆕 listCreated:", data));
socket.on("listUpdated", (data) => console.log("✏️ listUpdated:", data));
socket.on("listDeleted", (data) => console.log("🗑️ listDeleted:", data));
// Handle all card events
socket.on("cardCreated", (data) => console.log("🆕 cardCreated:", data));
socket.on("cardUpdated", (data) => console.log("✏️ cardUpdated:", data));
socket.on("cardDeleted", (data) => console.log("🗑️ cardDeleted:", data));
// Handle all comment events
socket.on("commentCreated", (data) => console.log("🆕 commentCreated:", data));
socket.on("commentUpdated", (data) => console.log("✏️ commentUpdated:", data));
socket.on("commentDeleted", (data) => console.log("🗑️ commentDeleted:", data));
socket.on("disconnect", () => {
    console.log("❌ Disconnected from server");
});
//# sourceMappingURL=clientE.js.map